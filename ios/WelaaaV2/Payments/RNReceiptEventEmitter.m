
#import "RNReceiptEventEmitter.h"

@implementation RNReceiptEventEmitter

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



@end
