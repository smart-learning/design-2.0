import axios from 'axios';
import store from "./store";

const HOST = 'https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com/dev';
const TYPE = 'api';
const VERSION = 'v1.0';
const API_PREFIX = `${HOST}/${TYPE}/${VERSION}/`;

const clientId = 'wyk27OuFanxIcxzGRO68F13n';
const clientSecret = 'IcQUptRiZBe3mqLbx8BIB7dqfySP52J4He6TmMXnnzupUNIj';
const authBasicCode = btoa( `${clientId}:${clientSecret}` );

export default {
	getLectureCategory() {
		return new Promise( ( resolve, reject ) => {
			axios.get( API_PREFIX + 'contents/video-courses/categories' )
				.then( ( response ) => {
					response.data.items.forEach( element => {
						element.key = element.id.toString();
					} );
					resolve( response.data );
				} )
				.catch( ( error ) => {
					console.error( error );
					reject( error );
				} );
		} );
	},

	getAudioBookCategory() {
		return new Promise( ( resolve, reject ) => {
			fetch( API_PREFIX + 'audiobooks/categories' )
				.then( ( response ) => response.json() )
				.then( ( responseJson ) => {
					responseJson.items.forEach( element => {
						element.key = element.id.toString();
					} );
					resolve( responseJson );
				} )
				.catch( ( error ) => {
					console.error( error );
					reject( error );
				} );
		} );
	},

	getLectureList() {
		return new Promise( ( resolve, reject ) => {
			axios.get( API_PREFIX + 'contents/video-courses' )
				.then( ( response ) => {
					response.data.items.forEach( element => {
						element.key = element.id.toString();
					} );
					resolve( response.data );
				} )
				.catch( ( error ) => {
					console.error( error );
					reject( error );
				} );
		} );
	},

	getAudioBookList() {
		return new Promise( ( resolve, reject ) => {
			fetch( API_PREFIX + 'audiobooks' )
				.then( ( response ) => response.json() )
				.then( ( responseJson ) => {
					responseJson.items.forEach( element => {
						element.key = element.id.toString();
					} );
					resolve( responseJson );
				} )
				.catch( ( error ) => {
					console.error( error );
					reject( error );
				} );
		} );
	},

	getLectureClipList( id ) {
		return new Promise( ( resolve, reject ) => {
			axios.get( API_PREFIX + id + '/video-clips' )
				.then( ( response ) => {
					response.data.items.forEach( element => {
						element.key = element.id.toString();
					} );
					resolve( response.data );
				} )
				.catch( ( error ) => {
					console.error( error );
					reject( error );
				} );
		} );
	},

	// getVideoList( id ) {
	// 	return new Promise( ( resolve, reject ) => {
	// 		fetch( API_PREFIX + 'video-list?id=' + id )
	// 			.then( ( response ) => response.json() )
	// 			.then( ( responseJson ) => {
	// 				responseJson.items.forEach( element => {
	// 					element.key = element.id.toString();
	// 				} );
	// 				resolve( responseJson );
	// 			} )
	// 			.catch( ( error ) => {
	// 				console.error( error );
	// 				reject( error );
	// 			} );
	// 	} );
	// },

	getVideoClipList() {
		return new Promise( ( resolve, reject ) => {
			resolve( [
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
			] );
		} );
	},

	getBookList() {
		return new Promise( ( resolve, reject ) => {
			resolve( [
				{
					key: '0',
					title: '명견만리_인구, 경제, 북한, 의료 편',
					authorInfo: 'KBS 명견만리 제작팀',
					Time: '06시간 12분',
					paragraph: '책 설명',
					viewCount: '000',
					heartCount: '00',
					commentCount: '00',
					itemColor: '#E1DFDF',
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
					itemColor: '#F4E69F',
				},
			] );
		} );
	},

	getAuthToken( email, password ) {
		const params = new URLSearchParams();
		params.set( 'username', email );
		params.set( 'password', password );
		params.set( 'scope', 'profile' );
		params.set( 'grant_type', 'password' );

		return new Promise( ( resolve, reject ) => {
			axios.post( HOST + '/oauth/token', params, {
				headers: {
					'Authorization': 'Basic ' + authBasicCode,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			} )

				.then( response => {
					console.log( response.data );
					resolve( response.data );
				} )
				.catch( ( error ) => {
					alert( '로그인 실패' )
					console.error( error );
					reject( error );
				} );
		} );
	}
}