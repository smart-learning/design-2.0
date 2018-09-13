
#import "RNReceiptEventEmitter.h"

@implementation RNReceiptEventEmitter

RCT_EXPORT_MODULE();

- (NSArray <NSString *> *) supportedEvents
{
    // 이벤트명을 등록합니다.
    // eg. return @[@"SPECIFIC_EVENT_NAME"];
    return @[@"SPECIFIC_EVENT_NAME"];
}

// JS로 보내고 싶은 이벤트를 다음과 같이 작성합니다.
// eg. [self sendEventWithName:@"SPECIFIC_EVENT_NAME" body:@{}];



@end
