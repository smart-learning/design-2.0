
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h> // DB조회 결과를 리액트쪽으로 보내주기 위한 처리를 위해 추가.
#import <React/RCTLog.h>

@interface RNNativePlayer : RCTEventEmitter <RCTBridgeModule>

@end
