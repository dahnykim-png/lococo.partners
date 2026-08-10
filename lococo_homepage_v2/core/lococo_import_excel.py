import csv
import os
import sys
from lococo_db_handler import LococoDBHandler

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def parse_float(val):
    """문자열 숫자를 안전하게 float 변환 (비어있거나 유효하지 않은 문자열 처리)"""
    if not val:
        return 0.0
    cleaned = str(val).strip().replace(',', '')
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

def import_creator_data(csv_path="d:/개발-학습자료/LOCOCO/크리에이터_데이터.csv", db_path="lococo_database.db"):
    db = LococoDBHandler(db_path)

    # 파이프라인 상대경로 / absolute 경로 대체 지원
    if not os.path.exists(csv_path):
        alt_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "크리에이터_데이터.csv")
        if os.path.exists(alt_path):
            csv_path = alt_path

    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"크리에이터 CSV 파일 {csv_path}를 찾을 수 없습니다.")

    total_rows = 0
    imported_count = 0
    skipped_count = 0

    with open(csv_path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total_rows += 1

            name = (row.get('인플루언서 이름') or '').strip()
            raw_handle = (row.get('프로필 URL') or '').strip()
            raw_followers = (row.get('팔로워(K)') or '').strip()

            # 행 스킵 규칙: 이름, 프로필 URL, 팔로워(K)가 모두 비어있는 행
            if not name and not raw_handle and not raw_followers:
                skipped_count += 1
                continue

            # 프로필 URL/핸들 정제
            handle = raw_handle.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '').replace('@', '').strip()
            if not handle:
                handle = f"creator_{imported_count + 1}"

            followers_k = parse_float(raw_followers)
            followers_count = int(followers_k * 1000)

            # 평균릴스조회수/K ➔ raw_avg_reels_view_k 및 근사치 engagement_rate 계산
            raw_reels_k_str = (row.get('평균릴스조회수/K') or '').strip()
            raw_reels_k = parse_float(raw_reels_k_str)
            
            reels_view_count = raw_reels_k * 1000
            if followers_count > 0 and reels_view_count > 0:
                engagement_rate = round(reels_view_count / followers_count, 6)
                engagement_is_estimated = True
            else:
                engagement_rate = 0.0
                engagement_is_estimated = True

            category = (row.get('카테고리') or '').strip()
            personal_shop = (row.get('개인쇼핑몰') or '').strip()
            other_channel = (row.get('다른유입채널URL') or '').strip()
            community_k = (row.get('멤버스/K') or '').strip()
            recent_product = (row.get('최근 공동구매 상품') or '').strip()
            notes = (row.get('기타') or '').strip()

            # 1. Sellers 테이블 upsert (is_test = True, data_source = 'manual')
            seller_id = db.insert_seller(
                name=name if name else handle,
                instagram_handle=handle,
                category=category,
                data_source='manual',
                is_test=True,
                personal_shop_url=personal_shop,
                other_channel_url=other_channel,
                community_members_k=community_k,
                recent_group_buy_product=recent_product,
                notes=notes
            )

            # 2. Seller_Insights 테이블 upsert (click_rate = NULL)
            db.insert_seller_insight(
                seller_id=seller_id,
                followers_count=followers_count,
                reach=int(followers_count * 0.3), # 기본 추정 reach
                engagement_rate=engagement_rate,
                click_rate=None, # 원본 데이터에 없음
                raw_avg_reels_view_k=raw_reels_k,
                engagement_rate_is_estimated=engagement_is_estimated
            )

            imported_count += 1

    db.close()
    print(f"총 {total_rows}행 중 {imported_count}명 성공적으로 임포트, {skipped_count}행 스킵")
    return total_rows, imported_count, skipped_count

if __name__ == "__main__":
    import_creator_data()
