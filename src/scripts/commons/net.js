import axios from 'axios';
import Base64 from 'Base64';
import Localizable from 'react-native-localizable';
import moment from 'moment';
import { AsyncStorage, Platform } from 'react-native';
import VersionNumber from 'react-native-version-number';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';

// 빌드모드가 Debug/Release인지에 따라 각 프로젝트 strings변수를 가져와서 HOST를 사용. 없을경우 기본값 사용
let host = 'https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com/dev';
// TODO: iOS에서 Localizable 이 undefined인 상황이 발견되었음. 원인 미상. 확인 필요.
if (Localizable) {
  if (__DEV__) host = Localizable.host_debug || host;
  else host = Localizable.host_release || host;
}

const HOST = host;
const TYPE = 'api';
const API_PREFIX = `${HOST}/${TYPE}/`;
const API_PREFIX_FOR_AUTH_TOKEN = host;

const clientId = 'wyk27OuFanxIcxzGRO68F13n';
const clientSecret = 'IcQUptRiZBe3mqLbx8BIB7dqfySP52J4He6TmMXnnzupUNIj';
const authBasicCode = Base64.btoa(`${clientId}:${clientSecret}`);

// 데이터 캐시 기본 유효시간 (초)
const DEFAULT_EXPIRED = 300;

function encodeParams(obj) {
  let params = [];
  for (let p in obj) {
    params.push(p + '=' + encodeURIComponent(obj[p]));
  }
  return params.join('&');
}

/**
 * `axios`의 `get`요청으로 받은 `json`데이터를 캐싱한다. 다른 형태의 데이터는 아직 지원하지 않는다.
 * 두번째 expired 파라미터로 유효시간을 설정할 수 있다. 0초로 설정하면 무조건 다시 읽어온다.
 *
 * @param    uri        요청할 주소
 * @param    expired    만료시간 (초)
 * @returns {Promise<any>}
 */
function cacheOrLoad(uri, expired = 0) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataset = await AsyncStorage.multiGet(['timestamp::' + uri, uri]);
      const timestamp = dataset[0][1];
      let data = dataset[1][1];
      data = JSON.parse(data);
      if (data && timestamp) {
        const diff = moment().diff(Number(timestamp), 'seconds');
        if (diff <= expired) {
          resolve(data);
          return;
        }
      }
    } catch (error) {
      console.log('AsyncStorage Error: ', error);
    }

    axios
      .get(uri)
      .then(response => {
        response.data.__cache_timestamp = Number(moment().format('x'));
        AsyncStorage.multiSet([
          ['timestamp::' + uri, moment().format('x')],
          [uri, JSON.stringify(response.data)]
        ]);
        resolve(response.data);
      })
      .catch(error => {
        console.log('Error in ' + uri);
        console.log(error);
        reject(error);
      });
  });
}

export default {
  getProfile() {
    const expired = 1;
    return cacheOrLoad(API_PREFIX + 'v1.0/users/profile', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  },

  getLectureCategory(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(
      API_PREFIX + 'v1.0/contents/video-courses/categories',
      expired
    )
      .then(data => {
        data.forEach(element => {
          element.key = element.id.toString();
        });
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getAudioBookCategory(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(
      API_PREFIX + 'v1.0/contents/audiobooks/categories',
      expired
    )
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getInquiryData() {
    return axios.get(API_PREFIX + 'v1.0/platform/inquiries').then(resp => {
      return resp.data;
    });
  },

  postInqueryItem(title, content) {
    return axios
      .post(API_PREFIX + 'v1.0/platform/inquiries', { title, content })
      .then(resp => {
        return resp.status === 200;
      });
  },

  getInquiryDetail(id) {
    return axios
      .get(API_PREFIX + `v1.0/platform/inquiries/${id}`)
      .then(resp => {
        return resp.data;
      });
  },

  getClassList(ccode = null, page = 1) {
    let url = API_PREFIX + 'v1.1/contents/video-courses';
    const params = {};
    if (ccode) {
      params.ccode = ccode;
    }
    if (page) {
      params.page = page;
    }
    url += '?' + encodeParams(params);

    // return cacheOrLoad(url, DEFAULT_EXPIRED)
    // 	.then(data => {
    // 		return data;
    // 	})
    // 	.catch(error => {
    // 		console.log(error);
    // 	});

    return axios
      .get(url)
      .then(response => {
        const headers = response.headers;
        const data = response.data;
        const pagination = {};
        Object.keys(headers).forEach(key => {
          if (key.indexOf('pagination-') === 0) {
            try {
              pagination[key.replace('pagination-', '')] = eval(
                headers[key].toLowerCase()
              );
            } catch (e) {}
          }
        });
        return {
          items: data.map(element => ({
            ...element,
            key: element.id.toString()
          })),
          pagination
        };
      })
      .catch(error => {
        console.log(error);
      });
  },

  getLectureListByCategories() {
    return cacheOrLoad(
      API_PREFIX + 'v1.0/contents/video-courses/promotion-with-categories',
      DEFAULT_EXPIRED
    )
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getAudioBookList(ccode = null, page = 1) {
    let url = API_PREFIX + 'v1.1/contents/audiobooks';
    const params = {};
    if (ccode) {
      params.ccode = ccode;
    }
    if (page) {
      params.page = page;
    }
    url += '?' + encodeParams(params);

    return axios
      .get(url)
      .then(response => {
        const headers = response.headers;
        const data = response.data;
        const pagination = {};
        Object.keys(response.headers).forEach(key => {
          if (key.indexOf('pagination-') === 0) {
            try {
              pagination[key.replace('pagination-', '')] = eval(
                response.headers[key].toLowerCase()
              );
            } catch (e) {}
          }
        });
        return {
          items: data.map(element => ({
            ...element,
            key: element.id.toString()
          })),
          pagination
        };
      })
      .catch(error => {
        console.log(error);
      });
  },

  getAudioBookByCategories() {
    return cacheOrLoad(
      API_PREFIX + 'v1.0/contents/audiobooks/group-by/categories',
      DEFAULT_EXPIRED
    )
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getLectureItem(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_PREFIX + 'v1.0/contents/video-courses/' + id)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  getLectureClipList(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_PREFIX + 'v1.0/contents/video-courses/' + id + '/video-clips')
        .then(response => {
          let itemNumber = 1;
          response.data.forEach(element => {
            element.key = element.id.toString();
            element.itemNumber = itemNumber++;
          });
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  getBookChapterList(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_PREFIX + 'v1.0/contents/audiobooks/' + id + '/chapters')
        .then(response => {
          let itemNumber = 1;
          response.data.forEach(element => {
            element.key = element.id.toString();
            element.itemNumber = itemNumber++;
          });
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  getAuthToken(email, password) {
    let params = encodeParams({
      username: email,
      password: password,
      scope: 'profile',
      grant_type: 'password'
    });
    // console.log('getAuthToken:', HOS + 'oauth/token', email, password);
    // console.log('encodedParams:', params);

    return new Promise((resolve, reject) => {
      axios
        .post(API_PREFIX_FOR_AUTH_TOKEN + '/oauth/token', params, {
          headers: {
            Authorization: 'Basic ' + authBasicCode,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  // 2018. 9. 10 김중온
  // f_token 갱신
  issueAuthToken(f_token) {
    let params = encodeParams({
      username: 'f_token',
      password: f_token,
      scope: 'profile',
      grant_type: 'password'
    });
    console.log('encodedParams:', params);

    return new Promise((resolve, reject) => {
      axios
        .post(API_PREFIX_FOR_AUTH_TOKEN + '/oauth/token', params, {
          headers: {
            Authorization: 'Basic ' + authBasicCode,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getMainPopup() {
    return cacheOrLoad(API_PREFIX + 'v1.0/cms/main/popup', DEFAULT_EXPIRED)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getHomeContents(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(API_PREFIX + 'v1.0/cms/main/video', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getHomeClipRank(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(
      API_PREFIX + 'v1.0/contents/video-clips/realtime-chart',
      expired
    )
      .then(data => {
        data.forEach(element => {
          element.key = element.id.toString();
        });
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  getHomeSeries() {
    return cacheOrLoad(API_PREFIX + 'v1.0/cms/main/series', DEFAULT_EXPIRED)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  getBookItem(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_PREFIX + 'v1.0/contents/audiobooks/' + id)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },
  getMainBanner(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(API_PREFIX + 'v1.0/cms/main/banner', expired)
      .then(data => {
        data.forEach(element => {
          element.key = element.id.toString();
        });
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  getHomeAudioBookMonth(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(API_PREFIX + 'v1.0/contents/audiobooks/botm', expired)
      .then(data => {
        return data.reverse();
      })
      .catch(error => {
        console.log(error);
      });
  },
  getPlayRecentAudioBook(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(API_PREFIX + 'v1.0/play/recent/audiobooks', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getPlayRecentVideoCourses() {
    const expired = 1;
    return cacheOrLoad(API_PREFIX + 'v1.0/play/recent/video-courses', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getPurchasedVideoCourses() {
    const expired = 1;
    return cacheOrLoad(
      API_PREFIX + 'v1.0/play/purchased/video-courses',
      expired
    )
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getPurchasedAudioBooks() {
    const expired = 1;
    return cacheOrLoad(API_PREFIX + 'v1.0/play/purchased/audiobooks', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getMembershipVouchers() {
    const expired = 1;
    return cacheOrLoad(API_PREFIX + 'v1.0/membership/vouchers', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getMembershipCurrent() {
    const expired = 0;
    return cacheOrLoad(API_PREFIX + 'v1.0/membership/current', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getVouchersStatus() {
    return axios
      .get(API_PREFIX + 'v1.0/membership/vouchers/status')
      .then(resp => {
        return resp.data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  async voucherExchange(audiobook_id) {
    let params = { audiobook_id };
    return axios.post(API_PREFIX + 'v1.0/membership/vouchers/exchange', params);
  },

  getBookReviewList(cid) {
    return new Promise((resolve, reject) => {
      axios
        .get(API_PREFIX + 'v1.0/action/comments/' + cid)
        .then(response => {
          response.data.forEach(element => {
            element.key = element.id.toString();
          });
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  },

  getHomeAudioBookContents(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(API_PREFIX + 'v1.0/cms/main/audiobook', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  registerMembership(data) {
    return axios
      .post(
        API_PREFIX + 'v1.0/payment/import/subscriptions/issue-billing',
        data
      )
      .then(resp => resp.data);
  },
  // fcm token 등록
  async registeFcmToken(bool) {
    const fcmToken = await firebase.messaging().getToken();

    if (fcmToken) {
      let params = {
        app_name: 'welaaa',
        app_os: Platform.OS === 'ios' ? 0 : 1,
        app_os_version: Platform.Version,
        app_version: VersionNumber.appVersion,
        device_id: DeviceInfo.getUniqueID(),
        device_model: DeviceInfo.getModel(),
        fcm_token: fcmToken,
        push_receive: bool
      };

      console.log('registerFcmToken params', params);

      return new Promise((resolve, reject) => {
        axios
          .post(API_PREFIX + 'v1.0/message/fcm-tokens', params)
          .then(response => {
            resolve(response.data);
          })
          .catch((error, a, b) => {
            reject(error);
          });
      });
    } else {
      reject('no token');
    }
  },

  getSeriesContents() {
    return axios.get(API_PREFIX + 'v1.0/contents/video-series').then(resp => {
      return resp.data;
    });
  },

  getDailyBookList(isRefresh = false) {
    let expired = DEFAULT_EXPIRED;
    if (isRefresh) {
      expired = 1;
    }
    return cacheOrLoad(API_PREFIX + 'v1.0/cms/main/a-book-a-day', expired)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  //회원가입
  signUp(email, password) {
    let params = {
      username: email,
      password: password,
      grant_type: 'password'
    };
    params = encodeParams(params);

    return axios
      .post(API_PREFIX + 'v1.0/signup', params, {
        headers: {
          Authorization: 'Basic ' + authBasicCode,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getContentPermission(type, id) {
    return axios
      .get(`${API_PREFIX}v1.0/membership/permissions/${type}/${id}`)
      .then(resp => resp.data);
  }
};
