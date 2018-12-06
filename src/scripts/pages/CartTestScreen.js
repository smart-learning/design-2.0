import React from 'react';
import { Alert, View } from 'react-native';
import { CartItem } from '../components/cart/CartItem';

const data = {
  items: [
    {
      created_at: '2018-11-25T20:17:00+00:00',
      data: {
        ccode: '009',
        cid: 'v200050',
        clip_count: 10,
        file_size: 1500,
        headline: '세계 경제의 신흥 거대시장 아시아 제대로 알기',
        hit_count: 727,
        id: 168,
        image_url: 'https://static.welaaa.co.kr/contentsUpImage/',
        images: {
          big:
            'https://static.welaaa.co.kr/static/courses/v200050/v200050_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v200050/v200050_list.jpg',
          wide:
            'https://static.welaaa.co.kr/static/courses/v200050/v200050_wide.jpg'
        },
        img_set: {
          detail:
            'https://static.welaaa.co.kr/static/courses/v200050/v200050_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v200050/v200050_list.jpg',
          main:
            'https://static.welaaa.co.kr/static/courses/v200050/v200050_wide.jpg'
        },
        info_img_set: [
          'https://static.welaaa.co.kr/static/courses/v200050/v200050_detail01.jpg'
        ],
        is_exclusive: false,
        is_exculsive: false,
        is_featured: false,
        is_free: false,
        is_new: false,
        like_count: 0,
        memo: '',
        memo_top:
          '아시아 신흥 국가들은 세계 경제에서 차지하는 중요성이 점차 증대되고 있습니다. 세계 육지의 3분의 1에 해당하는 거대한 대륙인 아시아는 비슷한 듯 보이지만 각기 다른 국가적인 특성과 문화를 갖고 있습니다. 따라서 앞으로 이들 시장으로 진출하거나 우리의 시장을 확대해나가기 위해서는 아시아 각 국가들이 우리나라와는 달리 어떠한 관습과 문화적인 특성 등이 있는지 이해하는 것이 중요합니다. 아시아 각국의 상징물을 중심으로 독특한 관습과 사람들의 기질, 주의해야 할 몸짓 등 문화상식에 대해 알아봅니다.',
        meta: {
          cid: 'v200050',
          comment_count: 6,
          id: 112,
          like_count: 0,
          play_count: 15,
          star_average: 3.3333,
          view_count: 720
        },
        orig_price: 20000,
        pay_key_ios: '0',
        pay_money_ios: null,
        play_time: '01:32:12',
        progress: {},
        review_count: 6,
        reviewer_id: null,
        star_avg: 3.3333,
        star_set: {
          '1': 1,
          '2': 1,
          '3': 1,
          '4': 1,
          '5': 2,
          all: 6
        },
        teacher: {
          headline: '테마역사문화연구원',
          id: 112,
          images: {
            default: 'https://static.welaaa.co.kr/static/teacher/t000150.jpg',
            profile:
              'https://static.welaaa.co.kr/static/teacher/t000150_profile.jpg'
          },
          memo:
            '테마역사문화연구원 원장저서 <지도 없이 떠나는 101일간의 예술의 세계사> (2013)<지도 없이 떠나는 101일간의 세계문화유산> (2011) <어린이를 위한 한일 외교사 수업>(2012) <어린이를 위한 한국사 장면 77> (2012) <비즈니스를 위한 세계문화상식> (2011)<어린이를 위한 한국의 풍속> (2009)',
          name: '박영수 원장'
        },
        title: '세계 경제의 신흥 거대시장 아시아 제대로 알기',
        type: 'video-course',
        url: 'http://welaaa.co.kr/video-serise-info.php?groupkey=168'
      },
      id: 3830,
      orig_price: 20000,
      rent_period: 70,
      type: 'video-course',
      user_price: 20000
    },
    {
      created_at: '2018-11-26T14:56:08+00:00',
      data: {
        ccode: '009001',
        cid: 'v100022',
        clip_count: 2,
        file_size: 747,
        headline:
          '옥스퍼드대 명강을 오직 윌라에서만! 세계적인 수학자 김민형 교수의 확률 이야기! ',
        hit_count: 344,
        id: 1055,
        image_url: 'https://static.welaaa.co.kr/contentsUpImage/',
        images: {
          big:
            'https://static.welaaa.co.kr/static/courses/v100022/v100022_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v100022/v100022_list.jpg',
          wide:
            'https://static.welaaa.co.kr/static/courses/v100022/v100022_wide.jpg'
        },
        img_set: {
          detail:
            'https://static.welaaa.co.kr/static/courses/v100022/v100022_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v100022/v100022_list.jpg',
          main:
            'https://static.welaaa.co.kr/static/courses/v100022/v100022_wide.jpg'
        },
        info_img_set: [
          'https://static.welaaa.co.kr/static/courses/v100022/v100022_detail01.jpg',
          'https://static.welaaa.co.kr/static/courses/v100022/v100022_detail02.jpg',
          'https://static.welaaa.co.kr/static/courses/v100022/v100022_detail03.jpg',
          'https://static.welaaa.co.kr/static/courses/v100022/v100022_detail04.jpg',
          'https://static.welaaa.co.kr/static/courses/v100022/v100022_detail05.jpg'
        ],
        is_exclusive: true,
        is_exculsive: true,
        is_featured: false,
        is_free: false,
        is_new: false,
        like_count: 5,
        memo:
          "비가 올 확률, 로또 당첨 확률, 투자 성공 확률 등…\n우리 사회에 가장 익숙하고 밀접한 수학적 개념, 확률! 21세기는 확률을 통해 알 수 없는 미래의 가능성을 점치는 것에 매우 익숙한 시대임이 분명하다. 하지만 200년 전만 해도, 확률을 따져 미래를 점치는 개념은 존재하지 않았다. 수학계에서도 비교적 최근 이론으로 불리는 확률론의 역사를 통해, 확률이 우리 사회의 사상과 인류의 사고관에 미친 영향을 찬찬히 훑어본다!\n\n확률의 개념은 르네상스 시기, 수학자 파치올리가 던진 아주 작은 질문에서 시작된다. 이후, 페르마와 파스칼이 주고받은 편지를 통해 경우의 수와 기댓값의 개념이 탄생하고, 근대에 이르러 결정론, 공리주의 등의 사상에도 큰 영향을 미치게 되는데... 알 수 없는 미래를 확률로 점치고 무언가를 결정한다는 것은 과연 옳은 일일까, 그른 일일까?\n\n21세기, 우리 삶에 자연스럽게 녹아있는 '확률적 사고'에 대해 배워보자.\n\n[이런 분들께 추천합니다]\n- 옥스퍼드 대학 교수의 명강의를 접해보고 싶은 사람들\n- 수학을 잘 알지는 못하거나, 수포자로 불리지만 수학적으로 사고하는 능력을 키우고 싶은 사람들\n- 숫자와 계산으로만 이뤄진 수학이 아닌, 철학적 관점에서 수학을 이해하고 싶은 사람들\n- 평소 수학에 대해 관심이 많았지만 살면서 수학적으로 사고하는 방법을 잊은 사람들\n- 확률적으로 사고한다는 것에 대해 깊이있게 알고 싶은 사람들",
        memo_top:
          "옥스퍼드대 명강을 윌라에서 만나다! 세계적인 수학자 김민형 교수의 확률 이야기!\n문과생도 끝까지 읽을 수 있는 그의 저서 '수학이 필요한 순간'을 바탕으로 진행 된 현장 강연을 오직 윌라에서만!\n\n한국 최초 영국 옥스퍼드 대학교 머튼칼리지 수학과 교수.\n세기의 난제로 불리는 페르마의 마지막 정리를 풀어낸 세계적 수학자.\n한국 수학 교육의 패러다임을 바꾸는 멘토이자, 일반인들을 수학의 세계로 안내하는 친절한 인도자인 김민형 교수! \n\n세계가 주목하는 수학자인 김민형 교수가 당신에게 수학이 필요한 순간을 말합니다.\n21세기, 우리 사회 곳곳에 녹아있는 수학 개념인 '확률'.\n인문학적으로 확률의 이야기를 풀어주는 김민형 교수의 강의를 통해 수학의 아름다움에 빠져 보세요!",
        meta: {
          cid: 'v100022',
          comment_count: 0,
          id: 982,
          like_count: 5,
          play_count: 536,
          star_average: 4.3,
          view_count: 208
        },
        orig_price: 4000,
        pay_key_ios: '0',
        pay_money_ios: null,
        play_time: '01:31:34',
        progress: {},
        review_count: 0,
        reviewer_id: null,
        star_avg: 4.3,
        star_set: {
          '1': 0,
          '2': 1,
          '3': 1,
          '4': 3,
          '5': 5,
          all: 10
        },
        teacher: {
          headline: '영국 옥스퍼드 대학교 수학과',
          id: 535,
          images: {
            default: 'https://static.welaaa.co.kr/static/teacher/t000259.jpg',
            profile:
              'https://static.welaaa.co.kr/static/teacher/t000259_profile.jpg'
          },
          memo:
            "옥스퍼드 대학교 머튼 칼리지 수학과 정교수\n서울고등과학원 석학교수\n낭만주의 영시를 외우고, 쇼팽의 악보에서 수학적 아름다움을 말하는 수학자\n\n서울대학교 수학과를 졸업하고 예일대학교에서 박사 학위를 받았다. 매사추세츠공과대학 연구원과 퍼듀 대학교, 유니버시티칼리지 런던 교수를 거쳐 포스텍의 석좌교수, 서울대학교와 이화여자대학교 초빙 석좌교수를 역임했다. 2011년 한국인 수학자로는 최초로 옥스퍼드대 수학과 정교수로 임용되었으며 2012년 호암과학상을 수상했다. 김민형 교수는 '페르마의 마지막 정리'에서 유래된 산술 대수 기하학의 고전 난제를 혁신적인 방식으로 해결하여 세계적 수학자의 반열에 올랐으며 한국과 영국을 오가며 수학에 대한 연구 외에도 일반인들을 수학의 세계로 안내하는 작업을 활발하게 하고 있다. 수학의 대중화를 위한 '수학콘서트 K.A.O.S' 의 메인 마스터로 활동하고 있으며 웅진재단과 네이버 커넥트대잔 등에서 수학영재를 위한 강의 및 멘토링도 진행하고 있다. \n\n저서로는 『수학이 필요한 순간』, 『수학의 수학』, 『소수 공상』, 『아빠의 수학여행』 등이 있다.",
          name: '김민형 교수'
        },
        title: '수학이 필요한 순간, 확률의 선과 악',
        type: 'video-course',
        url: 'http://welaaa.co.kr/video-serise-info.php?groupkey=1055'
      },
      id: 3837,
      orig_price: 4000,
      rent_period: 14,
      type: 'video-course',
      user_price: 4000
    },
    {
      created_at: '2018-11-26T11:13:09+00:00',
      data: {
        audiobook_sale: 0,
        audiobook_type: null,
        banner_color: '#e7edc9',
        ccode: '013001',
        cid: 'b200010',
        file_size: 492,
        hit_count: 3057,
        id: 1057,
        images: {
          background: 'https://static.welaaa.co.kr/contentsUpImage/',
          book:
            'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_cover_3d.png',
          botm_banner: 'https://via.placeholder.com/650x320',
          cd:
            'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_cover_3d.png',
          cover:
            'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_cover.jpg',
          list:
            'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_cover.jpg'
        },
        img_set: {
          detail:
            'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_cover_3d.jpg',
          list:
            'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_cover_3d.png',
          main:
            'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_cover.jpg'
        },
        info_img_set: [
          'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_detail01.jpg',
          'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_detail02.jpg',
          'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_detail03.jpg',
          'https://static.welaaa.co.kr/static/audiobooks/b200010/b200010_detail04.jpg'
        ],
        is_bookreview: false,
        is_botm: true,
        is_exclusive: true,
        is_exculsive: true,
        is_free: false,
        is_new: false,
        like_count: 7,
        memo:
          "마시멜로 신드롬'을 불러일으켰던 호아킴 데 포사다는 우리 인생에서 가장 소중한 것들을 깨우쳐 삶을 긍정적인 방향으로 이끌어 주는 작가이다. 호아킴 데 포사다가 전작 『마시멜로 이야기』와 『마시멜로 두 번째 이야기』를 통해 ‘특별한 오늘’을 만끽할 수 있는 지혜를 제시했다면, 『바보빅터』를 통해서는 오늘의 ‘절망’을 내일의 ‘희망’으로 바꾸는 삶의 진실에 대해 이야기 한다. 이 책은 국제멘사협회(Mensa International) 회장을 지낸 천재 ‘빅터 세리브리아코프(Victor Serebriakoff)’가 17년 동안 바보로 살았던 실제 사건을 중심으로, 이 시대 모든 이들이 살면서 겪게 되는 아픔과 고통을 이겨내고 희망찬 미래를 열어갈 수 있는 용기와 자신감을 전한다. 개성 있는 캐릭터들이 펼치는 흥미진진한 내용과 속도감 있는 이야기 전개는 한편의 영화를 보는 듯한 느낌이다.\n\n살다 보면 수많은 변화와 위기에 부딪히게 된다. 쓰디쓴 좌절을 겪기도 하고 뼈아픈 패배감을 맛보기도 한다. 대개는 자신의 의지로 극복할 수 있지만 때로는 세상의 움직임 앞에서 한없이 무력해질 때도 있다. 이럴 때 이 책, 《바보 빅터》를 들어보자. 삶 속에서 맞닥뜨리게 되는 모든 일은 우리의 의지와 상관없이 일어나는 일은 없다는 것과, 그 어떤 일이 있더라도 결코 잃어서는 안 되는 게 무엇인지 알게 될 것이다. \n\n호아킴 데 포사다 지음 l 한국경제신문 출판 l 2011년 3월 8일 출간 l 낭독 진양욱, 이영기, 이현영, 이윤선 성우",
        memo_top:
          '300만 한국 독자들의 삶을 변화시킨 베스트셀러, 『마시멜로 이야기』의 작가 호아킴 데 포사다의 작품! 자신의 진가를 모르고 자신감 없이 살아야 했던 IQ173의 천재 빅터와 아름다운 여성 로라의 감동적인 이야기!',
        meta: {
          cid: 'b200010',
          comment_count: 0,
          id: 984,
          like_count: 7,
          play_count: 1001,
          star_average: 4.3,
          view_count: 2740
        },
        orig_price: 11700,
        pay_key_ios: 'audiobook_b200010',
        pay_money: 11700,
        pay_money_ios: '17000',
        play_time: '04:06:40',
        progress: {},
        review_count: 0,
        reviewer_badge: null,
        sale_price: 11700,
        star_avg: 4.3,
        star_set: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0,
          all: 0
        },
        subtitle: '17년 동안 바보로 살았던 멘사 회장의 이야기',
        teacher: {
          headline: null,
          id: 310,
          images: {
            default: 'https://static.welaaa.co.kr/static/teacher/w180088.jpg',
            profile:
              'https://static.welaaa.co.kr/static/teacher/w180088_profile.jpg'
          },
          memo:
            '1947년 브라질에서 태어나 자기계발, 동기부여 분야에서 세계적인 대중 연설가이자 저자로 활약하다 2015년 6월 11일 미국 마이애미 대학 병원에서 지병이던 암으로 사망했다. \n\n세계적인 대중연설가이자 자기계발 전문가인 그는 대표작인 『마시멜로 이야기』를 통해 전세계 수많은 기업과 독자들의 삶을 바꿨다. 그는 푸에르토 리코에서 경영학과 심리학을 전공하고 제록스 사에서 판매 훈련 프로그램을 개발하는 심리업무 등 10년을 근무하였다. 이후 Learning International and Achieve Global사의 컨설턴트로 이직하여 8년간 활동하였다. 이후 자기 계발을 훈련할 수 있는 회사를 차렸으며, 1988년부터 마이애미대학 외래교수로 리더십과 협상론 등을 강의하였다. 씨티은행, 오라클, 펩시 등 다국적 기업체의 컨설턴트로 활동하였고, 기업과 직원의 동기부여를 위한 강의를 하였다. 또한 미 농구 밀워키 팀의 스포츠 심리학 컨설턴트로 선수들에게 참여 동기를 부여하여 더 나은 성적을 얻을 수 있도록 하였다. 그는 학문적인 내용을 실제에 적용할 수 있는 새로운 차원의 동기부여를 하는 것으로 유명하다.',
          name: '호아킴 데 포사다'
        },
        title: '바보 빅터',
        type: 'audiobook',
        url: 'http://welaaa.co.kr/audiobook-detail.php?groupkey=1057'
      },
      id: 3834,
      orig_price: 11700,
      rent_period: 0,
      type: 'audiobook',
      user_price: 11700
    },
    {
      created_at: '2018-11-26T11:14:51+00:00',
      data: {
        ccode: '009001',
        cid: 'v100032',
        clip_count: 1,
        file_size: 571,
        headline: "IoT, 자율주행 자동차, AI가 주도할 '초연결사회'를 준비하라!",
        hit_count: 11,
        id: 1090,
        image_url: 'https://static.welaaa.co.kr/contentsUpImage/',
        images: {
          big:
            'https://static.welaaa.co.kr/static/courses/v100032/v100032_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v100032/v100032_list.jpg',
          wide:
            'https://static.welaaa.co.kr/static/courses/v100032/v100032_wide.jpg'
        },
        img_set: {
          detail:
            'https://static.welaaa.co.kr/static/courses/v100032/v100032_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v100032/v100032_list.jpg',
          main:
            'https://static.welaaa.co.kr/static/courses/v100032/v100032_wide.jpg'
        },
        info_img_set: [
          'https://static.welaaa.co.kr/static/courses/v100032/v100032_detail01.jpg',
          'https://static.welaaa.co.kr/static/courses/v100032/v100032_detail02.jpg',
          'https://static.welaaa.co.kr/static/courses/v100032/v100032_detail03.jpg'
        ],
        is_exclusive: true,
        is_exculsive: true,
        is_featured: false,
        is_free: false,
        is_new: false,
        like_count: 0,
        memo:
          '흔히들 인터넷시대를 사람과 사람이 연결된 시대로 부릅니다. 스마트폰의 등장으로 인해 사람과 사물이 연결되는 시대를 넘어 우리는 사물과 사물까지 연결되는 초연결사회에 살아갈 것이 전망되고 있는데요. 초연결사회에서 살게 되는 신인류들은 어떤 일상을 살며, 어떤 제품과 서비스를 소비하게 될까요? 이런 시대에 살아남기 위해서 우리가 가져야할 태도와 역량은 무엇인지, 나아가 우리의 자녀들을 키우는 방법은 무엇인지도 함께 확인할 수 있습니다. \n\n[이런 분들께 추천합니다!]\n- 4차산업혁명에 대한 개념적 이해보다, 내게 와닿는 실질적 사례들이 궁금한 분들\n- 주목받고 있는 미래 기술에 대해 관심이 많은 사람들\n- 사회적으로 다가올 큰 변화를 미리 대비하고 싶은 사람들\n- 초연결사회로의 발전 과정 속, 새로운 기회를 발견하고 싶은 사람들',
        memo_top:
          '사람과 사물, 사물과 사물까지 연결되는 초연결사회! 다가오는 미래, 우리의 일상은 어떻게 변하게 될까?  삼성사장단 강의에서 뜨거운 호평을 받은 최고의 강사이자 가장 쉽게 새로운 미래 사회를 설명하는 성균관대학교 최재붕 교수의 명강!',
        meta: {
          cid: 'v100032',
          comment_count: 0,
          id: 132098,
          like_count: 0,
          play_count: 181,
          star_average: 4.3,
          view_count: 11
        },
        orig_price: 2000,
        pay_key_ios: '0',
        pay_money_ios: null,
        play_time: '01:02:50',
        progress: {},
        review_count: 0,
        reviewer_id: null,
        star_avg: 4.3,
        star_set: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0,
          all: 0
        },
        teacher: {
          headline: "강연 만족도 만점의  '4차 산업혁명' 대표 스피커, 성균관대",
          id: 33,
          images: {
            default:
              'https://static.welaaa.co.kr/contentsUpImage/teacher/20171102121154.jpg',
            profile:
              'https://static.welaaa.co.kr/static/teacher/t000246_profile.jpg'
          },
          memo:
            "- 성균관대 기계공학부 교수\n- 인간과 미래융합기술의 통섭적 연구 최고 권위자\n - 4차 산업혁명 강연, 방송 패널 섭외 1순위 지식 셀럽\n- 한국 혁신 기업 인재들을 열광시킨 '4차 산업혁명' 대표 스피커\n\n최재붕 교수는 성균관대 기계공학부와 대학원을 졸업하고 캐나다 워털루대학에서 박사학위를 받았다. \n기계공학과 제품디자인의 융합, 기계공학과 동물행동학의 융합 등 학문 간의 벽을 허무는 통합적이고 미래 지향적인 통섭적 제품 디자인 연구에 관심을 두고 있다. \n\n다년간 삼성전자, 삼성물산 등의 기술자문위원으로 활동하고 있으며, 삼성전자와 미래 제품 기획 과제를 공동으로 수행하기도 했다. 국회 제 4차산업혁명포럼 ICT신기술 위원회 위원장, 미래창조과학부 과학기술ICT국제화사업추진위원회 위원, 산업통상자원부 IoT분야 전문위원으로 활동하는 등 4차산업혁명과 미래기술관련 최고 전문가로 손꼽힌다.",
          name: '최재붕 교수'
        },
        title: '포노사피엔스 신인류의 미래 준비법 ',
        type: 'video-course',
        url: 'http://welaaa.co.kr/video-serise-info.php?groupkey=1090'
      },
      id: 3836,
      orig_price: 2000,
      rent_period: 7,
      type: 'video-course',
      user_price: 2000
    },
    {
      created_at: '2018-11-25T19:53:51+00:00',
      data: {
        ccode: '009001',
        cid: 'v200252',
        clip_count: 6,
        file_size: 1483,
        headline:
          '술 한 잔에 띄우는 풍부한 이야깃거리, 술자리의 클라스가 달라집니다',
        hit_count: 22,
        id: 1096,
        image_url: 'https://static.welaaa.co.kr/contentsUpImage/',
        images: {
          big:
            'https://static.welaaa.co.kr/static/courses/v200252/v200252_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v200252/v200252_list.jpg',
          wide:
            'https://static.welaaa.co.kr/static/courses/v200252/v200252_wide.jpg'
        },
        img_set: {
          detail:
            'https://static.welaaa.co.kr/static/courses/v200252/v200252_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v200252/v200252_list.jpg',
          main:
            'https://static.welaaa.co.kr/static/courses/v200252/v200252_wide.jpg'
        },
        info_img_set: [
          'https://static.welaaa.co.kr/static/courses/v200252/v200252_detail01.jpg'
        ],
        is_exclusive: false,
        is_exculsive: false,
        is_featured: false,
        is_free: false,
        is_new: false,
        like_count: 0,
        memo:
          "'어떤 이야기를 해야 하지...' 어색한 술자리에서 이런 생각 한 번쯤 하지 않으셨나요? 업무 이야기는 무겁고, 사적인 이야기는 무례하고. 쉬운말로, 아이스브레이킹을 할 수 있는 재미있는 이야깃거리를 찾고 있는 당신! 술자리에서 쉽고 간편하게 나눌 수 있는 술 인문학을 알려드려요. 세계 각국의 음주 문화는 물론, 그 나라의 올바른 주도까지! 다른 나라의 술문화와 음주 에티켓을 나누는 것만으로 모임의 분위기를 바꾸는 것이 충분히 가능하죠. 전 세계의 술에 관한 다양한 상식은 물론, 술과 음식, 여행 등 인문학 이야기를 들어보고 네트워크 모임에서 활용해보세요. 문학과 그림 속에 녹아있는 술 이야기를 통해 자연스럽고 즐거운 대화 분위기를 이어가는데 큰 도움을 받을 수 있을거예요. \n\n[이런 분들께 추천합니다!]\n- 네트워킹에 필요한 자연스럽고 다양한 대화 소재가 필요한 분\n- 알아두면 쓸데 있는 새로운 관점의 독특한 인문학 강좌를 원하시는 분\n- 술, 음식, 여행 등 관련된 다양한 지식과 문화적 식견을 넓히고자 하시는 분",
        memo_top:
          '독일 하면, 맥주! 와인과 코냑하면 프랑스! 위스키의 종주국 스코틀랜드까지. 다양한 문학과 그림, 역사 속에 나타난 술 이야기를 알아보세요. 딱딱하고 어색했던 술자리가 술술 풀릴거예요.',
        meta: {
          cid: 'v200252',
          comment_count: 0,
          id: 132104,
          like_count: 0,
          play_count: 106,
          star_average: 4.3,
          view_count: 22
        },
        orig_price: 12000,
        pay_key_ios: '0',
        pay_money_ios: '15000',
        play_time: '02:07:23',
        progress: {},
        review_count: 0,
        reviewer_id: null,
        star_avg: 4.3,
        star_set: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 0,
          all: 0
        },
        teacher: {
          headline: '휴비즈코퍼레이션 대표',
          id: 544,
          images: {
            default: 'https://static.welaaa.co.kr/static/teacher/t000266.jpg',
            profile:
              'https://static.welaaa.co.kr/static/teacher/t000266_profile.jpg'
          },
          memo:
            '그가 활동하는 직업세계에서는 경영학 박사로 불린다. 하지만 정작 본인은 그렇게 불리는 것을 좋아하지 않는다. 자신이 하나의 정체성으로 규정되는 것을 싫어하기 때문이다. 그는 동일성보다는 차이와 다양성을 지향한다. 이러한 성향은 그의 경력에서도 잘 드러난다. 학부에서는 공학을, 대학원에서는 경영학을, 기업에서는 교육(HRD)을 전공했다. 지금은 인문학과 철학에 심취해 있으며 일반인이 쉽게 이해할 수 있는 인문 컨텐츠 개발에 힘쓰고 있다. 직장인에서 컨설턴트와 강사로 변신한 그는 지금 교육컨설팅 회사인 휴비즈코퍼레이션(주)을 경영하면서 작가와 칼럼니스트로 활동 중이다. 또한 실생활에 인문학을 접목하기 위한 노력으로 KBS1라디오 〈생방송 토요일 아침입니다〉에서 매주 ‘생활 속의 인문학’이라는 코너를 진행하고 있으며, 한국 HRD 교육방송에서 〈흔들리는 직장인을 위한 생생인문학〉을 진행하고 있다. 지은 책으로는 『30일 인문학』, 『니체 씨의 발칙한 출근길』, 『리더를 위한 인문학』, 『바쁠수록 생각하라』, 『밥 먹여주는 인문학』 등 다수가 있다.',
          name: '이호건'
        },
        title: '알아두면 쓸 데 있는 인문학, 술 이야기',
        type: 'video-course',
        url: 'http://welaaa.co.kr/video-serise-info.php?groupkey=1096'
      },
      id: 3827,
      orig_price: 12000,
      rent_period: 42,
      type: 'video-course',
      user_price: 12000
    },
    {
      created_at: '2018-11-26T11:14:33+00:00',
      data: {
        ccode: '003001',
        cid: 'v100026',
        clip_count: 8,
        file_size: 449,
        headline:
          '당신만 모르는 윗동네 이야기! 새로운 기회를 찾아 지금 당장 북마크!',
        hit_count: 63,
        id: 1130,
        image_url: 'https://static.welaaa.co.kr/contentsUpImage/',
        images: {
          big:
            'https://static.welaaa.co.kr/static/courses/v100026/v100026_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v100026/v100026_list.jpg',
          wide:
            'https://static.welaaa.co.kr/static/courses/v100026/v100026_wide.jpg'
        },
        img_set: {
          detail:
            'https://static.welaaa.co.kr/static/courses/v100026/v100026_big.jpg',
          list:
            'https://static.welaaa.co.kr/static/courses/v100026/v100026_list.jpg',
          main:
            'https://static.welaaa.co.kr/static/courses/v100026/v100026_wide.jpg'
        },
        info_img_set: [
          'https://static.welaaa.co.kr/static/courses/v100026/v100026_detail01.jpg',
          'https://static.welaaa.co.kr/static/courses/v100026/v100026_detail02.jpg',
          'https://static.welaaa.co.kr/static/courses/v100026/v100026_detail03.jpg',
          'https://static.welaaa.co.kr/static/courses/v100026/v100026_detail04.jpg',
          'https://static.welaaa.co.kr/static/courses/v100026/v100026_detail05.jpg',
          'https://static.welaaa.co.kr/static/courses/v100026/v100026_detail06.jpg',
          'https://static.welaaa.co.kr/static/courses/v100026/v100026_detail07.jpg'
        ],
        is_exclusive: true,
        is_exculsive: true,
        is_featured: false,
        is_free: false,
        is_new: true,
        like_count: 1,
        memo:
          "남한에 자리잡은 탈북민들, 오랜 시간 북한을 연구해온 전문가들이 모두 입을 모아 하는 말이 있습니다. '남한 사람들은 북한에 대해 몰라도 너무 모른다!' 남북정상회담, 북미정상회담의 성공적 개최로 남북 평화 무드가 조성되고 있는 지금! 그 어느 때 보다 북한에 대한 관심이 높아지고 있는 지금! 그동안 무관심과 편견으로만 대해 왔던 북한을 제대로 된 시각으로 바라봐야 하지 않을까요? 여러분은 북한에 대해 어떻게, 아니 얼마나 알고 있나요?\n\n북한은 정말 침체된 한국 경제의 구원 투수가 되어 줄 수 있을까?\n북한에도 스마트폰을 쓰는 사람들이 있다는데 사실일까?\n국내에서 일어났던 여러가지 해킹 범죄가 북한 소행이라는 소문은 사실일까?\n김정은 정말 무엇이든 할 수 있는 절대 권력자일까?\n\n낯설기만 한 북한에 대한 궁금증을 한 방에 해결해 드리기 위해 윌라가 준비했습니다. \n\n현재진행중인 북한의 변화를 밀착 마크해 온 국내 최고의 북한 전문가들이 북한의 정치, 사회, 문화 등 전 분야에 걸쳐 그들을 이해하기 위해 반드시 알아야 할 사실만을 있는 그대로 전합니다!\n\n“By failing to prepare, you are preparing to fail (준비에 실패하는 것은 실패를 준비하는 것이다).”\n- 벤저민 프랭클린\n한반도에 불어오는 변화의 바람! 그 속에 숨겨진 기회를 찾기 위해서는 누구보다 빠르게 준비하고 있어야 합니다.\n\n균형잡힌 시각으로 북한을 제대로 이해할 때, 그들이 가져올 새로운 기회가 보이지 않을까요?\n\n[ 이런 분들께 추천합니다! ]\n- 함께 새로운 시대를 열어갈 지금의 북한에 대한 이해가 필요한 모든 대한민국 국민\n- '적대국' 북한이 아닌 '파트너' 북한으로서 북한의 진짜 모습을 알고 싶은 분\n- 미래의 블루오션으로 점쳐지는 북한의 포텐이 궁금한 분\n- 북한이라는 무대에서 새로운 비즈니스를 꿈꾸는 분",
        memo_top:
          '이것은 언젠가 일어날지도 모르는 남북관계에 대한 예언이 아닙니다. 이것은 지금 일어나고 있는 북한의 변화에 대한 짧지만 정확한 보고서입니다.',
        meta: {
          cid: 'v100026',
          comment_count: 0,
          id: 133183,
          like_count: 0,
          play_count: 197,
          star_average: 5,
          view_count: 29
        },
        orig_price: 16000,
        pay_key_ios: '0',
        pay_money_ios: '20000',
        play_time: '00:44:04',
        progress: {},
        review_count: 0,
        reviewer_id: null,
        star_avg: 5,
        star_set: {
          '1': 0,
          '2': 0,
          '3': 0,
          '4': 0,
          '5': 2,
          all: 2
        },
        teacher: {
          headline:
            '대통령 휴가 도서 <평양의 시간은 서울의 시간과 함께 흐른다> 저자 진천규 외 ',
          id: 587,
          images: {
            default: 'https://static.welaaa.co.kr/static/teacher/t000307.jpg',
            profile:
              'https://static.welaaa.co.kr/static/teacher/t000307_profile.jpg'
          },
          memo:
            '한국인 최초 평양 순회 특파원 진천규 기자\n[평양의 시간은 서울의 시간과 함께 흐른다]저자\n1988년 [한겨레신문] 창간 기자로 합류해 판문점 출입 기자로 활동하며 북한 취재와 인연을 맺었다. 지금까지 여섯 차례의 방북 취재 과정에서 남북관계의 결정적인 장면들을 카메라에 담아냈다. 2000년 평양 정상회담 당시 6?15 공동선언 현장에서 단독으로 찍은 김대중 대통령과 김정일 국방위원장이 환하게 웃으며 서로 손을 잡고 들어 올리는 사진이 잘 알려져 있다. 이로부터 17년 뒤인 2017년 10월, 한국 언론인의 출입이 불가한 상황에서 유일하게 방북 취재에 성공했고, 2018년 7월 현재 총 네 차례에 걸쳐 평양, 원산, 마식령스키장, 묘향산, 남포 등 북한의 다양한 변화상을 취재했다.\n\n오기현 SBS PD\nSBS에서 다큐멘터리 <히딩크 사단의 비밀>, <화류 속의 한류>, 등을 제작했으며, <그것이 알고 싶다> 팀장을 역임했다. 1998년 이래 30여 차례 이상 평양, 신의주, 개성, 금강산 등을 방문하며 북한 관련 프로그램을 제작했다. 특히 1999년에는 남북한 당국 최초의 공식 승인을 받아 <조경철 박사의 52년만의 귀향> 프로그램으로 큰 반향을 불러일으켰고, 2000년 <평양뉴스2000>, 2005년 <조용필 평양공연>을 기획하고, 조용필의 평양공연 전 과정을 다큐멘터리로 엮은 <조용필, 평양에서 부르는 꿈의 아리랑>을 제작했다. 2005년 제11회 통일언론상 특별상을 수상했다. 현재 한국방송프로듀서연합회 통일특위 위원장을 맡고 있으며, 북한과 늘 새로운 교류를 모색하고 있다.\n\n세종연구소 정성장 연구기획본부장\n경희대학교 정치외교학과를 졸업하고 파리10대학교 정치학 석·박사를 졸업했다. 세종연구소 남북한관계연구실장을 역임했으며 현재 세종연구소 수석연구위원으로 활동 중이다. 주요한 저서와 논문으로는 "현대 북한의 정치·역사·이념·권력체계", "김정일 시대 북한 국방위원회의 위상·역할·엘리트"(2010)외 다수가 있다.\n\n통일부 김경산 주무관\n탈북자 정착교육기관 하나원 소속, 탈북자를 돕는 탈북자\n\n민경태 북한학 박사\n[서울-평양 스마트시티]저자, 재단법인 여시재 한반도미래팀장\n북한대학원대학교에서 경제·IT 전공으로 북한학 박사학위를 받았으며, 대통령직속 북방경제협력위원회 국제관계 전문위원, 경남대학교 극동문제연구소 초빙연구위원이다. 현재 재단법인 여시재에서 한반도의 미래에 대해서 연구하고 있다.\n\n세종연구소 최은주 연구위원\n세종연구소 동아시아협력센터 연구위원',
          name: '북한 전문가 5인 '
        },
        title: '어서와 북한은 처음이지?',
        type: 'video-course',
        url: 'http://welaaa.co.kr/video-serise-info.php?groupkey=1130'
      },
      id: 3835,
      orig_price: 16000,
      rent_period: 56,
      type: 'video-course',
      user_price: 16000
    }
  ],
  total_price: 65700
};

export default class CartTestScreen extends React.Component {
  render() {
    return (
      <View>
        {data.items.map((item, idx) => {
          const {
            id: cartItemId,
            orig_price: origPrice,
            user_price: userPrice,
            data: {
              title,
              type,
              images: { list: thumbnail },
              clip_count: clipCount,
              teacher: { name: teacherName }
            },
            rent_period: rentPeriod
          } = item;

          const params = {
            clipCount,
            origPrice,
            rentPeriod,
            teacherName,
            thumbnail,
            type,
            title,
            userPrice,
            cartItemId
          };
          return (
            <CartItem
              key={idx}
              {...params}
              removeFromCart={() => {
                Alert.alert('장바구니에서 삭제하는 버튼');
              }}
              {...item}
            />
          );
        })}
      </View>
    );
  }
}
