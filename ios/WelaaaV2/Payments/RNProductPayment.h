
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h> // 멤버십 구매 결과를 리액트쪽으로 보내주기 위한 처리를 위해 추가.
#import "IAPShare.h"
#import "common.h"
#import "RNReceiptEventEmitter.h"

@interface RNProductPayment : RCTEventEmitter <RCTBridgeModule>

@end
