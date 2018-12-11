import axios from 'axios';
import Base64 from 'Base64';
import moment from 'moment';
import { AsyncStorage, Platform, Alert } from 'react-native';
import firebase from 'react-native-firebase';
import Native from './native';

let host = 'https://api-prod.welaaa.com';

const HOST = host;
const TYPE = 'api';
const API_PREFIX = `${HOST}/${TYPE}/`;
const API_PREFIX_FOR_AUTH_TOKEN = host;

const clientId = 'wyk27OuFanxIcxzGRO68F13n';
const clientSecret = 'IcQUptRiZBe3mqLbx8BIB7dqfySP52J4He6TmMXnnzupUNIj';
const authBasicCode = Base64.btoa(`${clientId}:${clientSecret}`);

// 데이터 캐시 기본 유효시간 (초)
const DEFAULT_EXPIRED = 0;

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
    // try {
    //   const dataset = await AsyncStorage.multiGet(['timestamp::' + uri, uri]);
    //   const timestamp = dataset[0][1];
    //   let data = dataset[1][1];
    //   data = JSON.parse(data);
    //   if (data && timestamp) {
    //     const diff = moment().diff(Number(timestamp), 'seconds');
    //     if (diff <= expired) {
    //       resolve(data);
    //       return;
    //     }
    //   }
    // } catch (error) {
    //   console.log('AsyncStorage Error: ', error);
    // }

    axios
      .get(uri)
      .then(response => {
        response.data.__cache_timestamp = Number(moment().format('x'));
        AsyncStorage.multiSet([
          ['timestamp::' + uri, moment().format('x')],
          [uri, JSON.stringify(response.data)],
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
      expired,
    )
      .then(data => {
        data = [
          { ccode: null, id: 0, title: '전체', images: {}, url: '' },
          ...data,
        ];
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
      expired,
    )
      .then(data => {
        return [
          { ccode: null, id: 0, title: '전체', images: {}, url: '' },
          ...data,
        ];
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

  getClassList(ccode = null, page = 1, sort = 'hot') {
    let url = API_PREFIX + 'v1.1/contents/video-courses';
    const params = {};
    if (ccode) {
      params.ccode = ccode;
    }
    if (page) {
      params.page = page;
    }
    if (sort) {
      params.sort = sort;
    }
    url += '?' + encodeParams(params);

    return axios
      .get(url)
      .then(response => {
        return {
          items: response.data.map(element => ({
            ...element,
            key: element.id.toString(),
          })),
          pagination: this.parsePaginationHeaders(response.headers),
        };
      })
      .catch(error => {
        console.log(error);
      });
  },

  parsePaginationHeaders(headers) {
    const pagination = {};
    Object.keys(headers).forEach(key => {
      if (key.indexOf('pagination-') === 0) {
        try {
          pagination[key.replace('pagination-', '')] = eval(
            headers[key].toLowerCase(),
          );
        } catch (e) {}
      }
    });
    return pagination;
  },

  getLectureListByCategories() {
    return cacheOrLoad(
      API_PREFIX + 'v1.0/contents/video-courses/promotion-with-categories',
      DEFAULT_EXPIRED,
    )
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getAudioBookList(ccode = null, page = 1, sort = 'hot') {
    let url = API_PREFIX + 'v1.1/contents/audiobooks';

    // default 신규 'new' , sort=new
    // 인기 , sort=hot
    const params = {};
    if (ccode) {
      params.ccode = ccode;
    }
    if (page) {
      params.page = page;
    }

    if (sort) {
      params.sort = sort;
    }

    url += '?' + encodeParams(params);

    return axios
      .get(url)
      .then(response => {
        return {
          items: response.data.map(element => ({
            ...element,
            key: element.id.toString(),
          })),
          pagination: this.parsePaginationHeaders(response.headers),
        };
      })
      .catch(error => {
        console.log(error);
      });
  },

  getAudioBookByCategories() {
    return cacheOrLoad(
      API_PREFIX + 'v1.0/contents/audiobooks/group-by/categories',
      DEFAULT_EXPIRED,
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

  getEventList() {
    return new Promise((resolve, reject) => {
      axios
        .get(API_PREFIX + 'v1.0/cms/bbs/event')
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

  getAuthToken(email, password) {
    let params = encodeParams({
      username: email,
      password: password,
      scope: 'profile',
      grant_type: 'password',
    });
    // console.log('getAuthToken:', HOS + 'oauth/token', email, password);
    // console.log('encodedParams:', params);

    return new Promise((resolve, reject) => {
      axios
        .post(API_PREFIX_FOR_AUTH_TOKEN + '/oauth/token', params, {
          headers: {
            Authorization: 'Basic ' + authBasicCode,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
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
      grant_type: 'password',
    });
    console.log('encodedParams:', params);

    return new Promise((resolve, reject) => {
      axios
        .post(API_PREFIX_FOR_AUTH_TOKEN + '/oauth/token', params, {
          headers: {
            Authorization: 'Basic ' + authBasicCode,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getMembershipBanner() {
    const url = API_PREFIX + 'v1.0/cms/banner/membership-top';
    const params = {
      platform: Platform.OS,
    };
    return axios
      .get(url, { params: params })
      .then(resp => {
        console.log('membership_banner', resp);
        return resp.data;
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  },

  getMainPopup(popup_type) {
    //popup_type
    //공백 - 기존과 동일
    //membership - 멤버십 가입 후

    const url = API_PREFIX + 'v1.0/users/popup';
    const params = {
      platform: Platform.OS,
      popup_type: popup_type,
    };
    return axios
      .get(url, { params: params })
      .then(resp => {
        console.log('popup', resp);
        return resp.data;
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
      expired,
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
    return cacheOrLoad(
      API_PREFIX + 'v1.0/cms/main/banner?platform=' + Platform.OS,
      expired,
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
      expired,
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

  getUserHeartContent: function(contentType, page = 1) {
    const urlMappings = {
      audiobooks: 'audiobooks',
      videoCourses: 'video-courses',
    };

    if (!(contentType in urlMappings)) {
      return false;
    }

    let url = `${API_PREFIX}v1.0/users/heart/${urlMappings[contentType]}`;

    return axios
      .get(url, { params: { page } })
      .then(resp => {
        return {
          items: resp.data.map(element => ({
            ...element,
            key: element.id.toString(),
          })),
          pagination: this.parsePaginationHeaders(resp.headers),
        };
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
    const url = API_PREFIX + 'v1.0/membership/current';

    return axios
      .get(url)
      .then(res => {
        return res.data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  async getMembershipCurrentFresh() {
    return axios.get(API_PREFIX + 'v1.0/membership/current');
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
        data,
      )
      .then(resp => resp.data);
  },
  // fcm token 등록
  async registeFcmToken(bool) {
    const fcmToken = await firebase.messaging().getToken();

    const NativeConstants = Native.getConstants();
    const versionNumber = NativeConstants.versionNumber;
    const deviceId = NativeConstants.deviceId;
    const model = NativeConstants.model;
    console.log('versionNumber: ', versionNumber);
    console.log('deviceId: ' + deviceId);
    console.log('model:' + model);

    if (fcmToken) {
      let params = {
        app_name: 'welaaa',
        app_os: Platform.OS === 'ios' ? 0 : 1,
        app_os_version: Platform.Version,
        app_version: versionNumber,
        device_id: deviceId,
        device_model: model,
        fcm_token: fcmToken,
        push_receive: bool,
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

  //이메일 중복검증
  email_vailidate(email) {
    return axios
      .get(API_PREFIX + 'v1.0/email-validation', {
        params: {
          email: email,
        },
      })
      .then(resp => {
        return resp.data;
      });
  },

  //회원가입
  signUp(name, email, password) {
    let params = {
      name: name,
      username: email,
      password: password,
      grant_type: 'password',
      source: Platform.OS,
    };
    params = encodeParams(params);

    return axios
      .post(API_PREFIX + 'v1.0/signup', params, {
        headers: {
          Authorization: 'Basic ' + authBasicCode,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
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
  },

  async getPlayPermissionByCid(cid) {
    const { data } = await axios.get(
      `${API_PREFIX}v1.0/play/permissions/${cid}`,
    );
    return data;
  },

  getBotmData(month, sort) {
    return axios
      .get(API_PREFIX + `v1.0/contents/audiobooks/botm/${month}/${sort}`)
      .then(resp => {
        return resp.data;
      });
  },

  getEventDetail(id) {
    return axios.get(API_PREFIX + `v1.0/cms/event/${id}`).then(response => {
      return response.data;
    });
  },

  searchQuery(type, query) {
    // type: {video-course, audiobook}
    let url = API_PREFIX + 'v1.0/contents/search/' + type;
    const params = { search: query };
    url += '?' + encodeParams(params);
    return axios
      .get(url)
      .then(response => {
        return {
          items: response.data.map(element => ({
            ...element,
            key: element.id.toString(),
          })),
        };
      })
      .catch(error => {
        console.log(error);
      });
  },

  cancelMembership() {
    let url = API_PREFIX + 'v1.0/membership/unsubscribe-membership';
    return axios
      .get(url)
      .then(resp => {
        return resp.data;
      })
      .catch(error => {
        Alert.alert(
          '안내',
          '일시적인 오류가 발생하였습니다. 잠시후 다시 시도해주세요.',
          [{ text: '확인' }],
        );
        console.log(error);
      });
  },

  async getCartItems() {
    return axios.get(`${API_PREFIX}v1.0/payment/cart-items`);
  },

  async addToCart(contentType, itemId) {
    const data = {
      id: itemId,
      type: contentType,
    };
    return axios.post(`${API_PREFIX}v1.0/payment/cart-items`, data);
  },

  async removeCartItem(cartItemId) {
    return axios.delete(`${API_PREFIX}v1.0/payment/cart-items/${cartItemId}`);
  },

  async getCartStatus() {
    return axios.get(`${API_PREFIX}v1.0/payment/cart-items/status`);
  },

  async postPurchaseCallback(imp_uid, merchant_uid) {
    const data = {
      imp_uid,
      merchant_uid,
    };
    return axios.post(`${API_PREFIX}v1.0/payment/import/callback`, data);
  },

  getContentInfo(cid) {
    return axios
      .get(API_PREFIX + 'v1.0/play/contents-info/' + cid)
      .then(data => {
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  },

  getPlayDataInfo(cid) {
    return axios
      .get(API_PREFIX + 'v1.0/play/play-data/' + cid)
      .then(data => {
        return data;
      })
      .catch(error => {
        Alert.alert(
          '안내',
          '일시적인 오류가 발생하였습니다. 잠시후 다시 시도해주세요.',
          [{ text: '확인' }],
        );
        console.log(error);
      });
  },

  postAddContentViewCount(cid) {
    return axios
      .post(API_PREFIX + 'v1.0/contents/add-view-count/' + cid)
      .then(data => {
        console.log('addContentView', data);
        return data;
      });
  },

  registerCoupon(coupon_num) {
    // 테스트 케이스
    // return new Promise((resolve, reject) => {
    //   if (coupon_num.toLowerCase() === 'qwer1234') {
    //     resolve(({ message: '등록되었습니다.' }))
    //   }
    //   reject({ message: '쿠폰 번호가 일치하지 않습니다. 확인 후 다시 등록해주세요.' })
    // })

    let params = {
      coupon_num: coupon_num.toLowerCase(),
    };
    return axios
      .post(API_PREFIX + 'v1.0/membership/coupon-register', params)
      .then(response => response.data)
      .catch(error => {
        if (error.response.status === 400)
          throw new Error(error.response.data.msg);
        throw new Error('오류가 발생했습니다. 잠시후에 다시 시도해 주세요.');
      });
  },
};
