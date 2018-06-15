


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
	}
}