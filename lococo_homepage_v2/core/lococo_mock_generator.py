import random
import os
import sys
from lococo_db_handler import LococoDBHandler

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def generate_mock_data(db_path="lococo_database.db", seller_count=10):
    db = LococoDBHandler(db_path)
    
    categories = ["뷰티", "건기식", "리빙"]
    
    # 한국어 자연스러운 댓글 데이터풀 (구매문의 / 친목소통 / 스팸광고)
    purchase_comments = [
        "가격이 얼마인가요? 공구 일정 알려주세요!",
        "이거 피부 예민한 사람도 사용 가능한가요?",
        "배송비 무료인가요? 2개 이상 사면 할인되나요?",
        "오픈 알림 설정해뒀어요! 구매 링크 어디서 받나요?",
        "지난번에 사서 써보고 너무 좋아서 재구매 대기중입니다",
        "섭취 방법이나 유통기한 궁금합니다!",
        "아이 있는 집에서도 쓸 수 있는지 문의드려요"
    ]
    
    casual_comments = [
        "오늘도 코디 너무 이쁘세요~!",
        "항상 응원합니다! 주말 잘 보내세요 ㅎㅎ",
        "사진 분위기 진짜 대박이네요",
        "정보 공유 감사합니다 꿀팁이네요",
        "날씨 추운데 감기 조심하세요!"
    ]
    
    spam_comments = [
        "인기 게시물 상단 노출 문의는 DM 주세용",
        "제 프로필에도 놀러오세요~ 맞팔해요!",
        "팔로워 늘리기 이벤트 진행중! 프로필 링크 클릭",
        "부업으로 월 300만원 버는 방법 디엠주세요"
    ]
    
    sample_sellers_info = [
        ("김민지", "beauty_minji", "뷰티"),
        ("이수현", "glow_suhyeon", "뷰티"),
        ("박서준", "daily_seojun", "리빙"),
        ("최유진", "health_yujin", "건기식"),
        ("정아름", "arum_lifestyle", "리빙"),
        ("한지민", "pure_jimin", "뷰티"),
        ("강태오", "fit_taeoh", "건기식"),
        ("윤소희", "sohee_home", "리빙"),
        ("임도현", "dohyun_wellbeing", "건기식"),
        ("송하은", "haeun_makeup", "뷰티")
    ]

    total_posts = 0
    total_comments = 0

    print(f"\n[Mock Data Generator] Synthetic 가상 셀러 {seller_count}명 생성 시작...")

    for i in range(min(seller_count, len(sample_sellers_info))):
        name, handle, cat = sample_sellers_info[i]
        
        # 팔로워 수: 10,000명 ~ 400,000명
        followers = random.randint(10000, 400000)
        reach = int(followers * random.uniform(0.18, 0.42))
        engagement_rate = round(random.uniform(0.025, 0.085), 4)
        click_rate = round(random.uniform(0.008, 0.035), 4)
        
        # 1. Sellers 테이블 등록 (data_source = 'synthetic')
        seller_id = db.insert_seller(
            name=name,
            instagram_handle=handle,
            category=cat,
            data_source='synthetic'
        )
        
        # 2. Seller_Insights 등록
        db.insert_seller_insight(
            seller_id=seller_id,
            followers_count=followers,
            reach=reach,
            engagement_rate=engagement_rate,
            click_rate=click_rate
        )
        
        # 3. 각 셀러당 게시물 3~5개 생성
        post_cnt = random.randint(3, 5)
        for p_idx in range(1, post_cnt + 1):
            caption = f"[{cat}] {name}의 데일리 추천 아이템 {p_idx}탄! #공구예정 #{cat} #로코코"
            likes = int(followers * random.uniform(0.015, 0.055))
            
            # 댓글 구성 (구매문의 50%, 친목소통 35%, 스팸광고 15%)
            selected_comments = (
                random.sample(purchase_comments, k=random.randint(2, 4)) +
                random.sample(casual_comments, k=random.randint(1, 3)) +
                random.sample(spam_comments, k=random.randint(0, 2))
            )
            random.shuffle(selected_comments)
            comment_block = "\n".join(selected_comments)
            
            db.insert_post(
                seller_id=seller_id,
                caption=caption,
                comment_text=comment_block,
                likes_count=likes
            )
            
            total_posts += 1
            total_comments += len(selected_comments)

    db.close()
    
    # 요구사항에 명시된 출력 양식 출력
    print(f"생성 완료: 셀러 {seller_count}명, 게시물 {total_posts}개")
    return seller_count, total_posts, total_comments

if __name__ == "__main__":
    generate_mock_data("lococo_database.db", 10)
