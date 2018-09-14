
#import "RNReceiptEventEmitter.h"

@implementation RNReceiptEventEmitter
{
    BOOL _hasListeners;
}

RCT_EXPORT_MODULE();

+ (id) allocWithZone : (NSZone *) zone
{
    static RNReceiptEventEmitter *sharedInstance = nil;
    static dispatch_once_t onceToken;
  
    dispatch_once(&onceToken, ^{
        sharedInstance = [super allocWithZone : zone];
    });
  
    return sharedInstance;
}

// Will be called when this module's first listener is added.
- (void) startObserving
{
    _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void) stopObserving
{
    _hasListeners = NO;
}

- (NSArray <NSString *> *) supportedEvents
{
    // 이벤트명을 등록합니다.
    // eg. return @[@"SPECIFIC_EVENT_NAME"];
    return @[@"ReceiptVerification"];
}

- (void) sendPaymentResultToReactNative
{
    [self sendEventWithName : @"ReceiptVerification"
                       body : @{
                                //@"status" : @"0",
                                  @"token"  : @"s0met0ken"
                                //@"product_id"
                                //...
                              }];
}
// JS로 보내고 싶은 이벤트를 다음과 같이 작성합니다.
// eg. [self sendEventWithName:@"ReceiptVerification" body:@{}];

// bridge is not set.
// https://www.jianshu.com/p/de7a5d9dd5c6


@end
