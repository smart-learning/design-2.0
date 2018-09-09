
#import "RNNativeBase.h"

@implementation RNNativeBase

RCT_EXPORT_MODULE();

#pragma mark - Private Method

- (NSString *) getWebToken
{
    // 1.0 로그인 유저의 F_Token을 확인합니다.
    NSString *webToken = [[NSUserDefaults standardUserDefaults] stringForKey : @"webToken"];
  
    if ( nil == webToken )
    {
        webToken = @"NO_F_TOKEN";
    }
  
    return webToken;
}

#pragma mark - RCT_EXPORT
//
// Obj-C -> JS callback method
// 참고 : https://gist.github.com/chourobin/f83f3b3a6fd2053fad29fff69524f91c#file-callbacks-md
//
RCT_EXPORT_METHOD( getF_TOKEN : (RCTResponseSenderBlock) resultCallback )
{
    NSString *f_token = [self getWebToken];
    resultCallback(@[[NSNull null], f_token]); // (error, someData) in js
}

@end
