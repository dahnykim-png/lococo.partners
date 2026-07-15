import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  ko: {
    // Header
    nav_about: '소개',
    nav_service: '서비스',
    nav_portfolio: '포트폴리오',
    nav_contact: '문의하기',

    // Section 1: About US / Hero
    hero_badge: 'PREMIUM CO-BUYING PARTNER',
    hero_headline_1: '브랜드 x 크리에이터를',
    hero_headline_2: '아름답게 잇는',
    hero_headline_2_highlight: ' 밴더',
    hero_subheadline: '"Connect Brands, Inspire Creators."',
    hero_description: '로코코 변주곡 뒤의 조력자 피츠하겐처럼,\n브랜드의 셀렉션이 크리에이터와 함께 빛나도록 돕는 페이스메이커.\n계약을 넘어 진정성 있는 만남을 지향합니다.',
    vision_title: 'LOCOCO VISION',
    vision_description: '브랜드에게는 확실한 매출 우상향을,\n크리에이터에게는 신뢰할 수 있는 셀렉션을 매칭해\n건강하고 투명한 공동구매 생태계를 선도합니다.',

    // Section 2: Systematic Process
    process_badge: 'SYSTEMATIC PROCESS',
    process_title: '유통 파이프라인',
    process_subtitle: '셀렉션 발굴 → 크리에이터 매칭 → 성과 분석, 하나의 흐름으로 이어지는 체계적인 유통 프로세스',
    process_step_prefix: 'PIPELINE STEP',

    // Section 3: Portfolio & Partners
    portfolio_badge: 'PORTFOLIO & PARTNERS',
    portfolio_title: '성공 사례 & 히스토리',
    portfolio_subtitle: '브랜드의 규모와 니즈에 맞춘 파트너십으로, 검증된 성과를 함께 만들어왔습니다.',
    portfolio_tab_featured: '대표 파트너십',
    portfolio_tab_partners: '파트너 브랜드 전체',
    portfolio_source_success: '소싱 성공 사례',

    // Section 4: Contact
    contact_badge: 'GET IN TOUCH',
    contact_title: '비즈니스의 시작',
    contact_subtitle: 'LOCOCO Partners와 확실한 매출 우상향을 시작하세요. 대표님의 제안이 실질적인 비즈니스 결과로 연결됩니다.',
    contact_btn_kakao: '카카오톡 오픈채팅 상담하기',
    contact_btn_phone: '전화 바로 연결하기 (모바일 전용)',
    contact_btn_email: '이메일 협업 제안서 보내기',

    // Footer
    footer_tagline: 'Connect Brands, Inspire Creators.',
    footer_company: '상호: 로코코 ㅣ 대표: KIM DAHN l 사업자등록번호: 335-30-01862',
    footer_contact: '이메일: lococo.partners@gmail.com l 연락처: 010-4468-8999',
    footer_copyright: 'Copyright © 로코코파트너스 (LOCOCO Partners). All Rights Reserved.',

    // Toast
    toast_title: '클립보드 복사 완료',
    toast_desc: 'lococo.partners@gmail.com 주소가 복사되었습니다.',

    // Business Card
    card_toggle_front: '명함 앞면 (Front)',
    card_toggle_back: '명함 뒷면 (Back)',
    card_ceo: '대표 / 브랜드 디렉터',
    card_name_top: '김단',
    card_name_bottom: 'KIM DAHN',
    card_tip: '💡 명함 카드를 클릭하면 앞뒷면을 뒤집어 볼 수 있습니다',
    card_back_title: 'LOCOCO PARTNERS',
    card_back_subtitle: '브랜드와 크리에이터를 잇는 공동구매 파트너',
    card_back_description: '좋은 셀렉션이 좋은 크리에이터를 만나는 방식, 로코코 파트너스가 함께 만듭니다.',
  },
  en: {
    // Header
    nav_about: 'About',
    nav_service: 'Service',
    nav_portfolio: 'History',
    nav_contact: 'Contact',

    // Section 1: About US / Hero
    hero_badge: 'PREMIUM JOINT PURCHASE PARTNER',
    hero_headline_1: 'Brand x Creator,',
    hero_headline_2: 'Beautifully Connected',
    hero_headline_2_highlight: '',
    hero_subheadline: '"Connect Brands, Inspire Creators."',
    hero_description: "Like Fitzenhagen, the quiet collaborator behind the Rococo\nVariations, we are the pacemaker who helps every brand's selection shine\nalongside its creator reaching beyond contracts, toward genuine connection.",
    vision_title: 'LOCOCO VISION',
    vision_description: "We match brands with unmistakable revenue growth,\nand creators with selections they can trust, leading the way toward a healthy,\ntransparent group-buying ecosystem.",

    // Section 2: Systematic Process
    process_badge: 'SYSTEMATIC PROCESS',
    process_title: 'Distribution Pipeline',
    process_subtitle: 'Selection → Creator Matching → Performance Analysis — one seamless, systematic distribution process.',
    process_step_prefix: 'PIPELINE STEP',

    // Section 3: Portfolio & Partners
    portfolio_badge: 'PORTFOLIO & PARTNERS',
    portfolio_title: 'Success Stories & History',
    portfolio_subtitle: "Through partnerships tailored to each brand's scale and needs,\nwe have built a track record of proven results.",
    portfolio_tab_featured: 'Featured Partnerships',
    portfolio_tab_partners: 'All Partners',
    portfolio_source_success: 'Sourcing Success Case',

    // Section 4: Contact
    contact_badge: 'GET IN TOUCH',
    contact_title: 'Where Business Begins',
    contact_subtitle: 'Begin your growth with LOCOCO Partners — your proposal, turned into real business results.',
    contact_btn_kakao: 'Consult via KakaoTalk Open Chat',
    contact_btn_phone: 'Call Directly (Mobile Only)',
    contact_btn_email: 'Send Collaboration Proposal',

    // Footer
    footer_tagline: 'Connect Brands, Inspire Creators.',
    footer_company: 'Company: LOCOCO | CEO: KIM DAHN | Business Registration No: 335-30-01862',
    footer_contact: 'Email: lococo.partners@gmail.com | Contact: +82-10-4468-8999',
    footer_copyright: 'Copyright © LOCOCO Partners. All Rights Reserved.',

    // Toast
    toast_title: 'Copied to Clipboard',
    toast_desc: 'The email address lococo.partners@gmail.com has been copied.',

    // Business Card
    card_toggle_front: 'Front',
    card_toggle_back: 'Back',
    card_ceo: 'CEO / BRAND DIRECTOR',
    card_name_top: 'KIM DAHN',
    card_name_bottom: 'CEO / BRAND DIRECTOR',
    card_tip: '💡 Click the card to flip it over',
    card_back_title: 'LOCOCO PARTNERS',
    card_back_subtitle: 'A Group-Buying Partner\nConnecting Brands and Creators',
    card_back_description: 'The way great selections meet great creators —\nmade together by LOCOCO Partners.',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ko');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ko' ? 'en' : 'ko'));
  };

  const t = (key) => {
    return translations[language][key] !== undefined ? translations[language][key] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
