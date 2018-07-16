import axios from 'axios';
import store from "./store";
import Base64 from "Base64";

const HOST = 'https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com/dev';
const TYPE = 'api';
const VERSION = 'v1.0';
const API_PREFIX = `${HOST}/${TYPE}/${VERSION}/`;

const clientId = 'wyk27OuFanxIcxzGRO68F13n';
const clientSecret = 'IcQUptRiZBe3mqLbx8BIB7dqfySP52J4He6TmMXnnzupUNIj';
const authBasicCode = Base64.btoa( `${clientId}:${clientSecret}` );

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
			axios.get( API_PREFIX + 'audiobooks' )
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

	getLectureClipList( id ) {
		return new Promise( ( resolve, reject ) => {
			axios.get( API_PREFIX + id + 'video-clips' )
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
					alert( '로그인 실패' );
					console.error( error );
					reject( error );
				} );
		} );
	}
}