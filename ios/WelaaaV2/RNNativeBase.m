
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
// JS -> Obj-C -> JS callback method
// 참고 : https://gist.github.com/chourobin/f83f3b3a6fd2053fad29fff69524f91c#file-callbacks-md
//
RCT_EXPORT_METHOD( getF_TOKEN : (RCTResponseSenderBlock) resultCallback )
{
    NSLog(@"  getF_TOKEN has been called.");
    NSString *f_token = @"";
    f_token = [self getWebToken];
    [[NSUserDefaults standardUserDefaults] setObject:nil forKey:@"webToken"]; // F_Token을 삭제합니다.
    resultCallback(@[f_token]); // (error, someData) in js
}

//
// Obj-C -> JS (Exporting Constants)
// https://facebook.github.io/react-native/docs/native-modules-ios#exporting-constants
//
- (NSDictionary *) constantsToExport
{
    return @{ @"deviceId" : [common getUUID],
              @"model" : [common getModel],
              @"versionNumber" : [[[NSBundle mainBundle] infoDictionary] objectForKey: @"CFBundleShortVersionString"] };
}

@end
