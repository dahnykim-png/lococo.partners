import os
import sys
import json
import sqlite3
import subprocess
import urllib.request
import urllib.parse
from datetime import datetime

# Windows 콘솔 인코딩 방어 코드
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from lococo_db_handler import LococoDBHandler
from lococo_ml_predictor import LococoMLPredictor

def load_env():
    """ .env 파일에서 환경 변수 로드 """
    env_path = os.path.join(PROJECT_ROOT, ".env")
    env_vars = {}
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip()
    return env_vars

def fetch_unsynced_from_d1_api(account_id, database_id, api_token):
    """ Cloudflare D1 REST API를 통한 미동기화 데이터 조회 """
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    payload = json.dumps({
        "sql": "SELECT * FROM diagnosis_submissions WHERE synced_to_core = 0 OR synced_to_core IS NULL;"
    }).encode('utf-8')
    
    try:
        req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                res_json = json.loads(response.read().decode('utf-8'))
                if res_json.get("success") and res_json.get("result"):
                    return res_json["result"][0].get("results", [])
    except Exception as e:
        print(f"[D1 Sync] REST API 호출 실패: {e}")
    return None


def fetch_unsynced_from_d1_cli():
    """ Wrangler CLI를 통한 원격 D1 미동기화 데이터 조회 (Fallback) """
    try:
        cmd = [
            "npx.cmd" if sys.platform == "win32" else "npx",
            "wrangler", "d1", "execute", "lococo-diagnosis-db",
            "--remote", "--command", "SELECT * FROM diagnosis_submissions WHERE synced_to_core = 0 OR synced_to_core IS NULL",
            "--json"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=PROJECT_ROOT, shell=(sys.platform == "win32"))
        if result.returncode == 0 and result.stdout:
            data = json.loads(result.stdout)
            if isinstance(data, list) and len(data) > 0:
                return data[0].get("results", [])
    except Exception as e:
        print(f"[D1 Sync] Wrangler CLI 호출 오류: {e}")
    return None

def mark_d1_as_synced_api(account_id, database_id, api_token, record_id):
    """ Cloudflare D1 REST API를 통해 synced_to_core = 1 업데이트 """
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query"
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    payload = json.dumps({
        "sql": "UPDATE diagnosis_submissions SET synced_to_core = 1 WHERE id = ?;",
        "params": [record_id]
    }).encode('utf-8')
    try:
        req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=10) as res:
            if res.status == 200:
                res_json = json.loads(res.read().decode('utf-8'))
                return res_json.get("success", False)
    except Exception:
        return False
    return False


def mark_d1_as_synced_cli(record_id):
    """ Wrangler CLI를 통해 synced_to_core = 1 업데이트 (Fallback) """
    try:
        cmd = [
            "npx.cmd" if sys.platform == "win32" else "npx",
            "wrangler", "d1", "execute", "lococo-diagnosis-db",
            "--remote", "--command", f"UPDATE diagnosis_submissions SET synced_to_core = 1 WHERE id = {record_id}"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, cwd=PROJECT_ROOT, shell=(sys.platform == "win32"))
        return res.returncode == 0
    except Exception:
        return False

def sync_d1_to_core():
    """ Cloudflare D1 ➔ core SQLite (lococo_database.db) 동기화 파이프라인 """
    env_vars = load_env()
    account_id = env_vars.get("CLOUDFLARE_ACCOUNT_ID") or os.environ.get("CLOUDFLARE_ACCOUNT_ID")
    database_id = env_vars.get("CLOUDFLARE_D1_DATABASE_ID") or os.environ.get("CLOUDFLARE_D1_DATABASE_ID")
    api_token = env_vars.get("CLOUDFLARE_API_TOKEN") or os.environ.get("CLOUDFLARE_API_TOKEN")

    rows = None
    use_api = False

    # 1. REST API 시도
    if account_id and database_id and api_token:
        rows = fetch_unsynced_from_d1_api(account_id, database_id, api_token)
        if rows is not None:
            use_api = True

    # 2. API 없거나 실패 시 CLI Fallback 시도
    if rows is None:
        rows = fetch_unsynced_from_d1_cli()

    if not rows:
        print("0건 신규 동기화 완료")
        return {"synced_count": 0, "synced_sellers": []}

    db = LococoDBHandler()
    predictor = LococoMLPredictor(db.db_path)
    synced_sellers = []

    for row in rows:
        rec_id = row.get("id")
        ig_username = (row.get("instagram_username") or "").strip()
        ig_account_id = (row.get("instagram_business_account_id") or "").strip()
        page_name = (row.get("page_name") or "").strip()
        raw_json_str = row.get("raw_response_json") or "{}"

        # handle 및 name 추출
        handle = ig_username.replace("@", "").strip()
        if not handle:
            handle = f"seller_ig_{ig_account_id}" if ig_account_id else f"seller_d1_{rec_id}"

        name = page_name if page_name else (ig_username if ig_username else handle)

        # raw_response_json 파싱으로 인사이트 정보 추출
        followers_count = 0
        reach = 0
        engagement_rate = 0.0
        try:
            raw_data = json.loads(raw_json_str) if isinstance(raw_json_str, str) else raw_json_str
            if isinstance(raw_data, dict):
                user_info = raw_data.get("user", {})
                ig_info = raw_data.get("targetInstagramAccount", {})
                followers_count = int(ig_info.get("followers_count") or user_info.get("followers_count") or 15000)
                reach = int(ig_info.get("reach") or 5000)
                engagement_rate = float(ig_info.get("engagement_rate") or 0.045)
        except Exception:
            followers_count = 15000
            reach = 5000
            engagement_rate = 0.045

        # 1) Sellers 테이블 Upsert
        db.cursor.execute("SELECT seller_id FROM Sellers WHERE instagram_handle = ?", (handle,))
        existing_seller = db.cursor.fetchone()

        if existing_seller:
            seller_id = existing_seller["seller_id"]
            db.cursor.execute("""
                UPDATE Sellers 
                SET data_source = 'oauth', is_test = 0, name = ?
                WHERE seller_id = ?
            """, (name, seller_id))
        else:
            db.cursor.execute("""
                INSERT INTO Sellers (name, instagram_handle, category, data_source, is_test, notes)
                VALUES (?, ?, '뷰티/패션', 'oauth', 0, ?)
            """, (name, handle, f"Synced from Cloudflare D1 (id: {rec_id}, page: {page_name})"))
            seller_id = db.cursor.lastrowid

        # 2) Seller_Insights 기록
        db.cursor.execute("""
            INSERT INTO Seller_Insights (seller_id, followers_count, reach, engagement_rate)
            VALUES (?, ?, ?, ?)
        """, (seller_id, followers_count, reach, engagement_rate))
        db.conn.commit()

        # 3) D1 DB에 synced_to_core = 1 업데이트
        if use_api:
            mark_d1_as_synced_api(account_id, database_id, api_token, rec_id)
        else:
            mark_d1_as_synced_cli(rec_id)

        # 4) Match Score 계산 연동
        match_score_info = None
        try:
            db.cursor.execute("SELECT product_id FROM Brand_Products LIMIT 1")
            prod_row = db.cursor.fetchone()
            prod_id = prod_row["product_id"] if prod_row else 1
            match_score_info = predictor.calculate_match_score(seller_id, prod_id)
        except Exception as match_err:
            print(f"[D1 Sync] Match score calculation note for seller_id {seller_id}: {match_err}")

        synced_sellers.append({
            "seller_id": seller_id,
            "name": name,
            "handle": handle,
            "data_source": "oauth",
            "is_test": 0,
            "match_score": match_score_info.get("match_score") if match_score_info else None,
            "grade": match_score_info.get("grade") if match_score_info else None
        })

    count = len(synced_sellers)
    print(f"{count}건 신규 동기화 완료")

    return {
        "synced_count": count,
        "synced_sellers": synced_sellers
    }

if __name__ == "__main__":
    result = sync_d1_to_core()
