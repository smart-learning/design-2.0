
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNReceiptEventEmitter : RCTEventEmitter <RCTBridgeModule>

- (void) sendPaymentResultToReactNative;

@end
