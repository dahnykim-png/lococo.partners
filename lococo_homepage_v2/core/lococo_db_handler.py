import sqlite3
import os
from datetime import datetime

def get_default_db_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_db = os.path.join(base_dir, "data", "lococo_database.db")
    return data_db if os.path.exists(data_db) else os.path.join(base_dir, "lococo_database.db")

class LococoDBHandler:
    def __init__(self, db_path=None):
        if db_path is None or db_path == "lococo_database.db":
            self.db_path = get_default_db_path()
        else:
            self.db_path = db_path
        self.conn = None
        self.cursor = None
        self.connect()
        self.create_tables()

    def connect(self):
        """SQLite 데이터베이스에 연결합니다."""
        try:
            self.conn = sqlite3.connect(self.db_path, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row
            self.cursor = self.conn.cursor()
        except sqlite3.Error as e:
            print(f"데이터베이스 연결 실패: {e}")

    def close(self):
        """데이터베이스 연결을 안전하게 종료합니다."""
        if self.conn:
            self.conn.commit()
            self.conn.close()

    def create_tables(self):
        """지정된 스키마에 따라 테이블들을 자동 생성합니다."""
        
        # 1. Sellers 테이블 (셀러 기본 프로필)
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS Sellers (
            seller_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            instagram_handle TEXT UNIQUE NOT NULL,
            category TEXT,
            data_source TEXT DEFAULT 'manual', -- 'oauth' | 'manual' | 'synthetic'
            is_test INTEGER DEFAULT 1,         -- 1: 테스트용 데이터 (실제 추천/발송에서 자동 제외)
            personal_shop_url TEXT,
            other_channel_url TEXT,
            community_members_k TEXT,
            recent_group_buy_product TEXT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        # 스키마 자동 마이그레이션 (Sellers)
        self.cursor.execute("PRAGMA table_info(Sellers)")
        existing_seller_cols = [row['name'] for row in self.cursor.fetchall()]
        for col_name, col_type in [
            ('name', 'TEXT'),
            ('is_test', 'INTEGER DEFAULT 1'),
            ('personal_shop_url', 'TEXT'),
            ('other_channel_url', 'TEXT'),
            ('community_members_k', 'TEXT'),
            ('recent_group_buy_product', 'TEXT'),
            ('notes', 'TEXT')
        ]:
            if col_name not in existing_seller_cols:
                try:
                    self.cursor.execute(f"ALTER TABLE Sellers ADD COLUMN {col_name} {col_type}")
                except sqlite3.Error:
                    pass


        # 2. Seller_Insights 테이블 (성과 지표)
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS Seller_Insights (
            insight_id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id INTEGER NOT NULL,
            followers_count INTEGER DEFAULT 0,
            reach INTEGER DEFAULT 0,
            engagement_rate REAL DEFAULT 0.0,
            click_rate REAL, -- NULL 허용 (미존재 시)
            raw_avg_reels_view_k REAL DEFAULT 0.0,
            engagement_rate_is_estimated INTEGER DEFAULT 0,
            recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES Sellers (seller_id) ON DELETE CASCADE
        );
        """)

        # 스키마 자동 마이그레이션 (Seller_Insights)
        self.cursor.execute("PRAGMA table_info(Seller_Insights)")
        existing_insight_cols = [row['name'] for row in self.cursor.fetchall()]
        if 'raw_avg_reels_view_k' not in existing_insight_cols:
            self.cursor.execute("ALTER TABLE Seller_Insights ADD COLUMN raw_avg_reels_view_k REAL DEFAULT 0.0")
        if 'engagement_rate_is_estimated' not in existing_insight_cols:
            self.cursor.execute("ALTER TABLE Seller_Insights ADD COLUMN engagement_rate_is_estimated INTEGER DEFAULT 0")

        # 3. Seller_Posts 테이블 (개별 게시물 및 댓글 원본)
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS Seller_Posts (
            post_id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id INTEGER NOT NULL,
            caption TEXT,
            comment_text TEXT,
            likes_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES Sellers (seller_id) ON DELETE CASCADE
        );
        """)

        # 4. NLP_Comment_Analysis 테이블 (AI 감성/구매의도 분석 결과)
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS NLP_Comment_Analysis (
            analysis_id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            nlp_conversion_score REAL DEFAULT 0.0,
            sentiment_label TEXT,
            analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES Seller_Posts (post_id) ON DELETE CASCADE
        );
        """)

        # 5. Brand_Products 테이블 (소싱 브랜드/상품 스펙)
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS Brand_Products (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand_name TEXT NOT NULL,
            product_name TEXT NOT NULL,
            category TEXT,
            target_persona TEXT,
            price_range TEXT
        );
        """)

        # 스키마 자동 마이그레이션 (Brand_Products)
        self.cursor.execute("PRAGMA table_info(Brand_Products)")
        existing_bp_cols = [row['name'] for row in self.cursor.fetchall()]
        for col_name, col_type in [
            ('target_persona', 'TEXT'),
            ('price_range', 'TEXT'),
            ('price', 'REAL'),
            ('commission_rate', 'REAL')
        ]:
            if col_name not in existing_bp_cols:
                try:
                    self.cursor.execute(f"ALTER TABLE Brand_Products ADD COLUMN {col_name} {col_type}")
                except sqlite3.Error:
                    pass

        # 기본 브랜드 상품(product_id=1) 자동 보장
        self.cursor.execute("SELECT COUNT(*) FROM Brand_Products")
        if self.cursor.fetchone()[0] == 0:
            self.cursor.execute("""
            INSERT INTO Brand_Products (brand_name, product_name, category, target_persona, price_range)
            VALUES ('로코코 파트너스', '기본 공동구매 상품 템플릿', '전체', '공동구매 크리에이터', '미정')
            """)


        # 6. Matching_Recommendations 테이블 (매칭 시뮬레이션 로깅)
        self.cursor.execute("""
        CREATE TABLE IF NOT EXISTS Matching_Recommendations (
            match_id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            match_score REAL DEFAULT 0.0,
            grade TEXT, -- 'S' | 'A' | 'B' | 'C'
            confidence_level REAL DEFAULT 0.0,
            is_test INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES Sellers (seller_id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES Brand_Products (product_id) ON DELETE CASCADE
        );
        """)

        # 스키마 자동 마이그레이션 (Matching_Recommendations)
        self.cursor.execute("PRAGMA table_info(Matching_Recommendations)")
        existing_match_cols = [row['name'] for row in self.cursor.fetchall()]
        if 'is_test' not in existing_match_cols:
            self.cursor.execute("ALTER TABLE Matching_Recommendations ADD COLUMN is_test INTEGER DEFAULT 1")

        self.conn.commit()

    # --- CRUD 메서드 (Sellers) ---
    def insert_seller(self, name, instagram_handle, category, data_source='manual', is_test=True, personal_shop_url=None, other_channel_url=None, community_members_k=None, recent_group_buy_product=None, notes=None):
        sql = """
        INSERT INTO Sellers (name, instagram_handle, category, data_source, is_test, personal_shop_url, other_channel_url, community_members_k, recent_group_buy_product, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(instagram_handle) DO UPDATE SET
            name = excluded.name,
            category = excluded.category,
            data_source = excluded.data_source,
            is_test = excluded.is_test,
            personal_shop_url = excluded.personal_shop_url,
            other_channel_url = excluded.other_channel_url,
            community_members_k = excluded.community_members_k,
            recent_group_buy_product = excluded.recent_group_buy_product,
            notes = excluded.notes
        """
        is_test_val = 1 if is_test else 0
        self.cursor.execute(sql, (name, instagram_handle, category, data_source, is_test_val, personal_shop_url, other_channel_url, community_members_k, recent_group_buy_product, notes))
        self.conn.commit()
        return self.get_seller_by_handle(instagram_handle)['seller_id']

    def get_seller_by_handle(self, instagram_handle):
        self.cursor.execute("SELECT * FROM Sellers WHERE instagram_handle = ?", (instagram_handle,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    def get_all_sellers(self, include_test=True):
        if include_test:
            self.cursor.execute("SELECT * FROM Sellers ORDER BY seller_id DESC")
        else:
            self.cursor.execute("SELECT * FROM Sellers WHERE is_test = 0 ORDER BY seller_id DESC")
        return [dict(row) for row in self.cursor.fetchall()]

    # --- CRUD 메서드 (Seller_Insights) ---
    def insert_seller_insight(self, seller_id, followers_count, reach, engagement_rate, click_rate=None, raw_avg_reels_view_k=0.0, engagement_rate_is_estimated=False):
        sql = """
        INSERT INTO Seller_Insights (seller_id, followers_count, reach, engagement_rate, click_rate, raw_avg_reels_view_k, engagement_rate_is_estimated)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        est_val = 1 if engagement_rate_is_estimated else 0
        self.cursor.execute(sql, (seller_id, followers_count, reach, engagement_rate, click_rate, raw_avg_reels_view_k, est_val))
        self.conn.commit()
        return self.cursor.lastrowid

    def get_latest_insight(self, seller_id):
        self.cursor.execute("SELECT * FROM Seller_Insights WHERE seller_id = ? ORDER BY insight_id DESC LIMIT 1", (seller_id,))
        row = self.cursor.fetchone()
        return dict(row) if row else None

    # --- CRUD 메서드 (Seller_Posts) ---
    def insert_post(self, seller_id, caption, comment_text, likes_count):
        sql = """
        INSERT INTO Seller_Posts (seller_id, caption, comment_text, likes_count)
        VALUES (?, ?, ?, ?)
        """
        self.cursor.execute(sql, (seller_id, caption, comment_text, likes_count))
        self.conn.commit()
        return self.cursor.lastrowid

    def get_posts_by_seller(self, seller_id):
        self.cursor.execute("SELECT * FROM Seller_Posts WHERE seller_id = ? ORDER BY post_id DESC", (seller_id,))
        return [dict(row) for row in self.cursor.fetchall()]

    # --- CRUD 메서드 (NLP_Comment_Analysis) ---
    def insert_nlp_analysis(self, post_id, nlp_conversion_score, sentiment_label):
        sql = """
        INSERT INTO NLP_Comment_Analysis (post_id, nlp_conversion_score, sentiment_label)
        VALUES (?, ?, ?)
        """
        self.cursor.execute(sql, (post_id, nlp_conversion_score, sentiment_label))
        self.conn.commit()
        return self.cursor.lastrowid

    # --- CRUD 메서드 (Brand_Products) ---
    def insert_brand_product(self, brand_name, product_name, category, target_persona, price_range):
        sql = """
        INSERT INTO Brand_Products (brand_name, product_name, category, target_persona, price_range)
        VALUES (?, ?, ?, ?, ?)
        """
        self.cursor.execute(sql, (brand_name, product_name, category, target_persona, price_range))
        self.conn.commit()
        return self.cursor.lastrowid

    def get_all_products(self):
        self.cursor.execute("SELECT * FROM Brand_Products")
        return [dict(row) for row in self.cursor.fetchall()]

    # --- CRUD 메서드 (Matching_Recommendations) ---
    def insert_matching_recommendation(self, seller_id, product_id, match_score, grade, confidence_level, is_test=True):
        sql = """
        INSERT INTO Matching_Recommendations (seller_id, product_id, match_score, grade, confidence_level, is_test)
        VALUES (?, ?, ?, ?, ?, ?)
        """
        is_test_val = 1 if is_test else 0
        self.cursor.execute(sql, (seller_id, product_id, match_score, grade, confidence_level, is_test_val))
        self.conn.commit()
        return self.cursor.lastrowid

if __name__ == "__main__":
    db = LococoDBHandler("lococo_database.db")
    print(f"[DB Setup] 로컬 SQLite DB 정상 구동 및 테이블 생성 완료: {os.path.abspath(db.db_path)}")
    db.close()
