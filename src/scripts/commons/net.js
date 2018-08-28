import axios from 'axios';
import Base64 from "Base64";
import Localizable from 'react-native-localizable';
import { AsyncStorage } from 'react-native';
import moment from 'moment';

// 빌드모드가 Debug/Release인지에 따라 각 프로젝트 strings변수를 가져와서 HOST를 사용. 없을경우 기본값 사용
let host = 'https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com/dev';
// TODO: iOS에서 Localizable 이 undefined인 상황이 발견되었음. 원인 미상. 확인 필요.
if( Localizable ) {
	if (__DEV__)
		host = Localizable.host_debug || host;
	else
		host = Localizable.host_release || host;
}

const HOST = host;
const TYPE = 'api';
const VERSION = 'v1.0';
const API_PREFIX = `${HOST}/${TYPE}/${VERSION}/`;

const clientId = 'wyk27OuFanxIcxzGRO68F13n';
const clientSecret = 'IcQUptRiZBe3mqLbx8BIB7dqfySP52J4He6TmMXnnzupUNIj';
const authBasicCode = Base64.btoa(`${clientId}:${clientSecret}`);

// 데이터 캐시 기본 유효시간 (초)
const DEFAULT_EXPIRED = 300;

function encodeParams( obj ){
	let params = [];
	for( let p in obj ){
		params.push( p + '=' + encodeURIComponent(obj[p]));
	}

	return params.join('&');
}


/**
 * `axios`의 `get`요청으로 받은 `json`데이터를 캐싱한다. 다른 형태의 데이터는 아직 지원하지 않는다.
 * 두번째 expired 파라미터로 유효시간을 설정할 수 있다. 0초로 설정하면 무조건 다시 읽어온다.
 *
 * @param 	uri		요청할 주소
 * @param 	expired	만료시간 (초)
 * @returns {Promise<any>}
 */
function cacheOrLoad( uri, expired = 0 ) {
	return new Promise( async (resolve, reject) => {
		try {
			const dataset = await AsyncStorage.multiGet( [ 'timestamp::' + uri, uri ] );
			const timestamp = dataset[ 0 ][ 1 ];
			let data = dataset[ 1 ][ 1 ];
			data = JSON.parse( data );
			if( data && timestamp ) {
				const diff = moment().diff( Number( timestamp ), 'seconds' );
				if( diff <= expired ) {
					resolve( data );
					return;
				}
			}
		}
		catch( error ) {
			console.log( 'AsyncStorage Error: ', error );
		}

		axios.get( uri )
			.then( response => {
				response.data.__cache_timestamp = Number( moment().format( 'x' ) );
				AsyncStorage.multiSet( [
					[ 'timestamp::' + uri, moment().format( 'x' ) ],
					[ uri, JSON.stringify( response.data ) ],
				] );
				resolve( response.data );
			} )
			.catch( error => {
				console.log( 'Error in ' + uri );
				console.log( error );
				reject(error);
			} );
	} );
}

export default {
	getLectureCategory( isRefresh = false ) {
		let expired = DEFAULT_EXPIRED;
		if( isRefresh ) {
			expired = 1;
		}
		return cacheOrLoad( API_PREFIX + 'contents/video-courses/categories', expired )
			.then( data => {
				data.forEach(element => {
					element.key = element.id.toString();
				});
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getAudioBookCategory() {
		return cacheOrLoad( API_PREFIX + 'contents/audiobooks/categories', DEFAULT_EXPIRED )
			.then( data => {
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getClassList( ccode = null, page = 1 ) {
		let url = API_PREFIX + 'contents/video-courses';
		const params = {};
		if( ccode ) {
			params.ccode = ccode;
		}
		if( page ) {
			params.page = page;
		}
		url += '?' + encodeParams( params );
		return cacheOrLoad( url, DEFAULT_EXPIRED )
			.then( data => {
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getLectureListByCategories() {
		return cacheOrLoad( API_PREFIX + 'contents/video-courses/promotion-with-categories', DEFAULT_EXPIRED )
			.then( data => {
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getAudioBookList( ccode = null, page = 1 ) {
		let url = API_PREFIX + 'contents/audiobooks';
		const params = {};
		if( ccode ) {
			params.ccode = ccode;
		}
		if( page ) {
			params.page = page;
		}
		url += '?' + encodeParams( params );
		return cacheOrLoad( url, DEFAULT_EXPIRED )
			.then( data => {
				data.items.forEach(element => {
					element.key = element.id.toString();
				});
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getAudioBookByCategories() {
		return cacheOrLoad( API_PREFIX + 'contents/audiobooks/group-by/categories', DEFAULT_EXPIRED )
			.then( data => {
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getLectureItem(id) {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/video-courses/' + id)
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getLectureClipList(id) {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/video-courses/' + id + '/video-clips')
				.then((response) => {
					let itemNumber = 1;
					response.data.forEach(element => {
						element.key = element.id.toString();
						element.itemNumber = itemNumber++;
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getBookChapterList(id) {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/audiobooks/' + id + '/chapters')
				.then((response) => {
					let itemNumber = 1;
					response.data.forEach(element => {
						element.key = element.id.toString();
						element.itemNumber = itemNumber++;
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getAuthToken(email, password) {

		let params = encodeParams({ username:email, password:password, scope:'profile', 'grant_type':'password' });
		console.log('getAuthToken:', HOST + '/oauth/token', email, password );
		console.log('encodedParams:', params );

		return new Promise((resolve, reject) => {
			axios.post(HOST + '/oauth/token',
				params,
				{
					headers: {
						'Authorization': 'Basic ' + authBasicCode,
						'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
				.then(response => {
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getMainPopup(){
		return cacheOrLoad( API_PREFIX + 'cms/main/popup', DEFAULT_EXPIRED )
			.then( data => {
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getHomeContents( isRefresh = false ) {
		let expired = DEFAULT_EXPIRED;
		if( isRefresh ) {
			expired = 1;
		}
		return cacheOrLoad( API_PREFIX + 'cms/main/video', expired )
			.then( data => {
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},

	getHomeClipRank( isRefresh = false ) {
		let expired = DEFAULT_EXPIRED;
		if( isRefresh ) {
			expired = 1;
		}
		return cacheOrLoad( API_PREFIX + 'contents/video-clips/realtime-chart', expired )
			.then( data => {
				data.forEach(element => {
					element.key = element.id.toString();
				});
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},
	getHomeSeries() {
		return cacheOrLoad( API_PREFIX + 'cms/main/series', DEFAULT_EXPIRED )
			.then( data => {
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},
	getBookItem(id) {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/audiobooks/' + id)
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},
	getMainBanner( isRefresh = false ) {
		let expired = DEFAULT_EXPIRED;
		if( isRefresh ) {
			expired = 1;
		}
		return cacheOrLoad( API_PREFIX + 'cms/main/banner', expired )
			.then( data => {
				data.forEach(element => {
					element.key = element.id.toString();
				});
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},
	getHomeAudioRealTimeChartContents( isRefresh = false ) {
		let expired = DEFAULT_EXPIRED;
		let itemNumber = 1;
		if( isRefresh ) {
			expired = 1;
		}
		return cacheOrLoad( API_PREFIX + 'contents/audiobooks/realtime-chart', expired )
			.then( data => {
				data.forEach(element => {
					element.itemNumber = itemNumber++;
				});
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},
	getPlayRecentAudioBook(isRefresh = false) {
		let expired = DEFAULT_EXPIRED;
		if( isRefresh ) {
			expired = 1;
		}
		return cacheOrLoad( API_PREFIX + 'contents/audiobooks/realtime-chart', expired )
			.then( data => {
				data.forEach(element => {
					element.key = element.id.toString();
				});
				return data;
			} )
			.catch( error => {
				console.log( error );
			} );
	},
}