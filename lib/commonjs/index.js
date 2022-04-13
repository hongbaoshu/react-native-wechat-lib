'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addListener = exports.WechatError = void 0;
exports.chooseInvoice = chooseInvoice;
exports.isWXAppSupportApi = exports.isWXAppInstalled = exports.getWXAppInstallUrl = exports.getApiVersion = void 0;
exports.launchMiniProgram = launchMiniProgram;
exports.openWXApp = exports.once = void 0;
exports.pay = pay;
exports.removeAllListeners = exports.registerApp = void 0;
exports.sendAuthRequest = sendAuthRequest;
exports.shareFile = shareFile;
exports.shareImage = shareImage;
exports.shareLocalImage = shareLocalImage;
exports.shareMiniProgram = shareMiniProgram;
exports.shareMusic = shareMusic;
exports.shareText = shareText;
exports.shareToFavorite = shareToFavorite;
exports.shareVideo = shareVideo;
exports.shareWebpage = shareWebpage;
exports.subscribeMessage = subscribeMessage;

var _reactNative = require("react-native");

var _events = require("events");

let isAppRegistered = false;
const {
  WeChat
} = _reactNative.NativeModules; // Event emitter to dispatch request and response from WeChat.

const emitter = new _events.EventEmitter();

_reactNative.DeviceEventEmitter.addListener('WeChat_Resp', resp => {
  emitter.emit(resp.type, resp);
});

_reactNative.DeviceEventEmitter.addListener('WeChat_Req', resp => {
  emitter.emit(resp.type, resp);
});

function wrapRegisterApp(nativeFunc) {
  if (!nativeFunc) {
    return undefined;
  }

  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (isAppRegistered) {
      return Promise.resolve(true);
    }

    isAppRegistered = true;
    return new Promise((resolve, reject) => {
      nativeFunc.apply(null, [...args, (error, result) => {
        if (!error) {
          return resolve(result);
        }

        if (typeof error === 'string') {
          return reject(new Error(error));
        }

        reject(error);
      }]);
    });
  };
}

function wrapApi(nativeFunc) {
  if (!nativeFunc) {
    return undefined;
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (!isAppRegistered) {
      return Promise.reject(new Error('registerApp required.'));
    }

    return new Promise((resolve, reject) => {
      nativeFunc.apply(null, [...args, (error, result) => {
        if (!error) {
          return resolve(result);
        }

        if (typeof error === 'string') {
          return reject(new Error(error));
        }

        reject(error);
      }]);
    });
  };
}
/**
 * `addListener` inherits from `events` module
 * @method addListener
 * @param {String} eventName - the event name
 * @param {Function} trigger - the function when event is fired
 */


const addListener = emitter.addListener.bind(emitter);
/**
 * `once` inherits from `events` module
 * @method once
 * @param {String} eventName - the event name
 * @param {Function} trigger - the function when event is fired
 */

exports.addListener = addListener;
const once = emitter.once.bind(emitter);
/**
 * `removeAllListeners` inherits from `events` module
 * @method removeAllListeners
 * @param {String} eventName - the event name
 */

exports.once = once;
const removeAllListeners = emitter.removeAllListeners.bind(emitter);
/**
 * @method registerApp
 * @param {String} appid - the app id
 * @return {Promise}
 */

exports.removeAllListeners = removeAllListeners;
const registerApp = wrapRegisterApp(WeChat.registerApp); // /**
//  * @method registerAppWithDescription
//  * @param {String} appid - the app id
//  * @param {String} appdesc - the app description
//  * @return {Promise}
//  */
// export const registerAppWithDescription = wrapRegisterApp(
//   WeChat.registerAppWithDescription,
// );

/**
 * Return if the wechat app is installed in the device.
 * @method isWXAppInstalled
 * @return {Promise}
 */

exports.registerApp = registerApp;
const isWXAppInstalled = wrapApi(WeChat.isWXAppInstalled);
/**
 * Return if the wechat application supports the api
 * @method isWXAppSupportApi
 * @return {Promise}
 */

exports.isWXAppInstalled = isWXAppInstalled;
const isWXAppSupportApi = wrapApi(WeChat.isWXAppSupportApi);
/**
 * Get the wechat app installed url
 * @method getWXAppInstallUrl
 * @return {String} the wechat app installed url
 */

exports.isWXAppSupportApi = isWXAppSupportApi;
const getWXAppInstallUrl = wrapApi(WeChat.getWXAppInstallUrl);
/**
 * Get the wechat api version
 * @method getApiVersion
 * @return {String} the api version string
 */

exports.getWXAppInstallUrl = getWXAppInstallUrl;
const getApiVersion = wrapApi(WeChat.getApiVersion);
/**
 * Open wechat app
 * @method openWXApp
 * @return {Promise}
 */

exports.getApiVersion = getApiVersion;
const openWXApp = wrapApi(WeChat.openWXApp); // wrap the APIs

exports.openWXApp = openWXApp;
const nativeShareToTimeline = wrapApi(WeChat.shareToTimeline);
const nativeLaunchMiniProgram = wrapApi(WeChat.launchMiniProgram);
const nativeShareToSession = wrapApi(WeChat.shareToSession);
const nativeShareToFavorite = wrapApi(WeChat.shareToFavorite);
const nativeSendAuthRequest = wrapApi(WeChat.sendAuthRequest);
const nativeShareText = wrapApi(WeChat.shareText);
const nativeShareImage = wrapApi(WeChat.shareImage);
const nativeShareLocalImage = wrapApi(WeChat.shareLocalImage);
const nativeShareMusic = wrapApi(WeChat.shareMusic);
const nativeShareVideo = wrapApi(WeChat.shareVideo);
const nativeShareWebpage = wrapApi(WeChat.shareWebpage);
const nativeShareMiniProgram = wrapApi(WeChat.shareMiniProgram);
const nativeSubscribeMessage = wrapApi(WeChat.subscribeMessage);
const nativeChooseInvoice = wrapApi(WeChat.chooseInvoice);
const nativeShareFile = wrapApi(WeChat.shareFile);
/**
 * @method sendAuthRequest
 * @param {Array} scopes - the scopes for authentication.
 * @return {Promise}
 */

function sendAuthRequest(scopes, state) {
  return new Promise((resolve, reject) => {
    WeChat.sendAuthRequest(scopes, state, () => {});
    emitter.once('SendAuth.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share text
 * @method shareText
 * @param {Object} data
 */


function shareText(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  return new Promise((resolve, reject) => {
    nativeShareText(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Choose Invoice
 * @method chooseInvoice
 * @param {Object} data
 */


function chooseInvoice() {
  let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new Promise((resolve, reject) => {
    nativeChooseInvoice(data);
    emitter.once('WXChooseInvoiceResp.Resp', resp => {
      if (resp.errCode === 0) {
        if (_reactNative.Platform.OS === 'android') {
          const cardItemList = JSON.parse(resp.cardItemList);
          resp.cards = cardItemList ? cardItemList.map(item => ({
            cardId: item.card_id,
            encryptCode: item.encrypt_code
          })) : [];
        }

        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share File
 * @method shareFile
 * @param {Object} data
 */


function shareFile(data) {
  return new Promise((resolve, reject) => {
    nativeShareFile(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share image
 * @method shareImage
 * @param {Object} data
 */


function shareImage(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  return new Promise((resolve, reject) => {
    nativeShareImage(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share local image
 * @method shareLocalImage
 * @param {Object} data
 */


function shareLocalImage(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  return new Promise((resolve, reject) => {
    nativeShareLocalImage(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share music
 * @method shareMusic
 * @param {Object} data
 */


function shareMusic(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  return new Promise((resolve, reject) => {
    nativeShareMusic(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share video
 * @method shareVideo
 * @param {Object} data
 */


function shareVideo(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  return new Promise((resolve, reject) => {
    nativeShareVideo(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share webpage
 * @method shareWebpage
 * @param {Object} data
 */


function shareWebpage(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  return new Promise((resolve, reject) => {
    nativeShareWebpage(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share miniProgram
 * @method shareMiniProgram
 * @param {Object} data
 */


function shareMiniProgram(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  if (data && data.miniProgramType == null) {
    data.miniProgramType = 0;
  }

  return new Promise((resolve, reject) => {
    nativeShareMiniProgram(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * 打开小程序
 * @method launchMini
 * @param
 * @param {String} userName - 拉起的小程序的username
 * @param {Integer} miniProgramType - 拉起小程序的类型. 0-正式版 1-开发版 2-体验版
 * @param {String} path - 拉起小程序页面的可带参路径，不填默认拉起小程序首页
 */


function launchMiniProgram(_ref) {
  let {
    userName,
    miniProgramType = 0,
    path = ''
  } = _ref;
  return new Promise((resolve, reject) => {
    if (miniProgramType !== 0 && miniProgramType !== 1 && miniProgramType !== 2) {
      reject(new WechatError({
        errStr: '拉起小程序的类型不对，0-正式版 1-开发版 2-体验版',
        errCode: -1
      }));
      return;
    }

    nativeLaunchMiniProgram({
      userName,
      miniProgramType,
      path
    });
    emitter.once('WXLaunchMiniProgramReq.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * 一次性订阅消息
 * @method shareVideo
 * @param {Object} data
 */


function subscribeMessage(data) {
  if (data && data.scene == null) {
    data.scene = 0;
  }

  return new Promise((resolve, reject) => {
    nativeSubscribeMessage(data);
    emitter.once('WXSubscribeMsgReq.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * Share something to favorite
 * @method shareToFavorite
 * @param {Object} data
 * @param {String} data.thumbImage - Thumb image of the message, which can be a uri or a resource id.
 * @param {String} data.type - Type of this message. Could be {news|text|imageUrl|imageFile|imageResource|video|audio|file}
 * @param {String} data.webpageUrl - Required if type equals news. The webpage link to share.
 * @param {String} data.imageUrl - Provide a remote image if type equals image.
 * @param {String} data.videoUrl - Provide a remote video if type equals video.
 * @param {String} data.musicUrl - Provide a remote music if type equals audio.
 * @param {String} data.filePath - Provide a local file if type equals file.
 * @param {String} data.fileExtension - Provide the file type if type equals file.
 */


function shareToFavorite(data) {
  return new Promise((resolve, reject) => {
    nativeShareToFavorite(data);
    emitter.once('SendMessageToWX.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * wechat pay
 * @param {Object} data
 * @param {String} data.partnerId
 * @param {String} data.prepayId
 * @param {String} data.nonceStr
 * @param {String} data.timeStamp
 * @param {String} data.package
 * @param {String} data.sign
 * @returns {Promise}
 */


function pay(data) {
  function correct(actual, fixed) {
    if (!data[fixed] && data[actual]) {
      data[fixed] = data[actual];
      delete data[actual];
    }
  }

  correct('prepayid', 'prepayId');
  correct('noncestr', 'nonceStr');
  correct('partnerid', 'partnerId');
  correct('timestamp', 'timeStamp'); // FIXME(94cstyles)
  // Android requires the type of the timeStamp field to be a string

  if (_reactNative.Platform.OS === 'android') data.timeStamp = String(data.timeStamp);
  return new Promise((resolve, reject) => {
    WeChat.pay(data, result => {
      if (result) reject(result);
    });
    emitter.once('PayReq.Resp', resp => {
      if (resp.errCode === 0) {
        resolve(resp);
      } else {
        reject(new WechatError(resp));
      }
    });
  });
}
/**
 * promises will reject with this error when API call finish with an errCode other than zero.
 */


class WechatError extends Error {
  constructor(resp) {
    const message = resp.errStr || resp.errCode.toString();
    super(message);
    this.name = 'WechatError';
    this.code = resp.errCode; // avoid babel's limition about extending Error class
    // https://github.com/babel/babel/issues/3083

    if (typeof Object.setPrototypeOf === 'function') {
      Object.setPrototypeOf(this, WechatError.prototype);
    } else {
      this.__proto__ = WechatError.prototype;
    }
  }

}

exports.WechatError = WechatError;
//# sourceMappingURL=index.js.map