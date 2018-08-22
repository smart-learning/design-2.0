import axios from 'axios';
import store from "./store";
import Base64 from "Base64";
import Localizable from 'react-native-localizable';
import URLSearchParams from 'url-search-params';


// 빌드모드가 Debug/Release인지에 따라 각 프로젝트 strings변수를 가져와서 HOST를 사용. 없을경우 기본값 사용
let host = 'https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com/dev';
if (__DEV__)
	host = Localizable.host_debug || host;
else
	host = Localizable.host_release || host;

const HOST = host;
const TYPE = 'api';
const VERSION = 'v1.0';
const API_PREFIX = `${HOST}/${TYPE}/${VERSION}/`;

const clientId = 'wyk27OuFanxIcxzGRO68F13n';
const clientSecret = 'IcQUptRiZBe3mqLbx8BIB7dqfySP52J4He6TmMXnnzupUNIj';
const authBasicCode = Base64.btoa(`${clientId}:${clientSecret}`);

export default {
	getLectureCategory() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/video-courses/categories')
				.then((response) => {
					response.data.items.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getAudioBookCategory() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/audiobooks/categories')
				.then((response) => {
					// console.log( response.data );
					response.data.items.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getLectureList() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/video-courses')
				.then((response) => {
					response.data.items.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getAudioBookList() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/audiobooks')
				.then((response) => {
					// console.log( response.data );
					response.data.items.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
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
					response.data.items.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
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
	// 				console.log( error );
	// 				reject( error );
	// 			} );
	// 	} );
	// },

	getAuthToken(email, password) {
		const params = new URLSearchParams();
		params.set('username', email);
		params.set('password', password);
		params.set('scope', 'profile');
		params.set('grant_type', 'password');

		return new Promise((resolve, reject) => {
			axios.post(HOST + '/oauth/token', params, {
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

	getHomeClassHot() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'cms/main/video')
				.then((response) => {
					response.data.hot.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data.hot);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getHomeClassNew() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'cms/main/video')
				.then((response) => {
					response.data.new.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data.new);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},

	getHomeClassRecommend() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'cms/main/video')
				.then((response) => {
					response.data.recommend.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data.recommend);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},
	getHomeClipRank() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'contents/video-clips/realtime-chart')
				.then((response) => {
					response.data.items.forEach(element => {
						element.key = element.id.toString();
					});
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
	},
	getHomeSeries() {
		return new Promise((resolve, reject) => {
			axios.get(API_PREFIX + 'cms/main/series')
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					console.log(error);
					reject(error);
				});
		});
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
}