


export default {

	getVideoCourseList(){
		return new Promise( (resolve, reject)=>{
			resolve([
				{
					key: '0',
					title: '쓸데 없는 것을 비워 삶의 가치를 배로 만드는 직장인 미니멀라이프 10가지 실천방법',
					subTitle: '심플라이프, 단순한 학교 탁진현 칼럼니스트',
					thumbnail: '',
					courseCount: '00',
					viewCount: '000',
					starCount: '0.0',
					reviewCount: '0',
				},
				{
					key: '1',
					title: '실무에서 바로 적용 가능한 엑셀 프로그램 핵심 정리!',
					subTitle: '혜윰 케이비 김철 대표',
					thumbnail: '',
					courseCount: '00',
					viewCount: '000',
					starCount: '0.0',
					reviewCount: '0',
				},
			]);
		});
	},

	getVideoClipList(){
		return new Promise( (resolve, reject)=>{
			resolve([
				{
					key: '0',
					title: '4차 산업혁명! 변화의 시작, 포노 사피엔스',
					subTitle: '[강좌] 4차 산업혁명, 변화의 방향과 대응전략',
					authorInfo: '강연 만족도 만점의 대표스피커, 성균관대 최재붕 교수',
					paragraph: '강의 클립 설명',
					viewCount: '000',
					starCount: '0.0',
				},
				{
					key: '1',
					title: '생각은 어떻게 탄생하는가?',
					subTitle: '[강좌] 데니스홍의 불가능을 가능으로 만드는 힘',
					authorInfo: '로멜라연구소장, UCLA 기계공학학과 데니스홍 교수',
					paragraph: '강의 클립 설명',
					viewCount: '000',
					starCount: '0.0',
				},
			]);
		});
	},

	getBookList(){
		return new Promise( (resolve, reject)=>{
			resolve([
				{
					key: '0',
					title: '명견만리_인구, 경제, 북한, 의료 편',
					authorInfo: 'KBS 명견만리 제작팀',
					Time: '06시간 12분',
					paragraph: '책 설명',
					viewCount: '000',
					heartCount: '00',
					commentCount: '00',
				},
				{
					key: '1',
					title: '미움받을 용기',
					authorInfo: '기시미 이치로',
					Time: '06시간 32분',
					paragraph: '책 설명',
					viewCount: '000',
					heartCount: '00',
					commentCount: '00',
				},
			]);
		});
	},
}