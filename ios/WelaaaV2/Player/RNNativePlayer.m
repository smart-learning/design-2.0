//
//  RNNativePlayer.m
//  WelaaaV2
//
//  Created by SmartLearning_iOSDev on 2018. 7. 25..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "RNNativePlayer.h"

@implementation RNNativePlayer
{
  BOOL _hasListeners;
}

// To export a module named FPSManager
RCT_EXPORT_MODULE();

- (NSArray <NSString *> *) supportedEvents
{
    return @[@"selectDatabase"];
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

#pragma mark - Private Methods

- (void) showMediaPlayer : (NSDictionary *) argsFromReactNative
{
    ContentPlayerViewController *playerViewController = [[ContentPlayerViewController alloc] init];
    NSMutableDictionary *args = [argsFromReactNative mutableCopy];
    [playerViewController setContentData : args];
  
    // Exception 'accessing _cachedSystemAnimationFence requires the main thread' was thrown while invoking 에러가 발생된다면..
    // ref : https://github.com/MOLPay/molpay-mobile-xdk-reactnative-beta/issues/7
    dispatch_sync(dispatch_get_main_queue(), ^{
      [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController : playerViewController
                                                                                   animated : YES
                                                                                 completion : nil];
    });
}

- (void) stopMediaPlayer
{
    ;  // playerController를 닫습니다.
}

- (void) downloadSomething : (NSDictionary *) args
{
    // 다운로드 테스트용
    [[FPSDownloadManager sharedInstance] downloadSomething : args];
}

- (void) downloadContent : (NSDictionary *) args
{
    [[FPSDownloadManager sharedInstance] startDownload : args
                                            completion : ^(NSError *error, NSMutableDictionary *result)
                                                         {}];
}

- (void) deleteDownloadedContent : (NSDictionary *) args
{
    [[FPSDownloadManager sharedInstance] removeDownloadedContent : args
                                                      completion : ^(NSError *error, NSMutableDictionary *result)
                                                                   {}];
}

- (void) selectDownloadedContent : (NSDictionary *) args
{
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  
    NSMutableArray *allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsAll];
  
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject : allRecords
                                                       options : NSJSONWritingPrettyPrinted
                                                         error : &error];
    if ( !jsonData )
    {
        NSLog(@"  Json Parse Error : %@", error);
        [params setObject : @""
                   forKey : @"selectDatabase"];
    }
    else
    {
        NSString *jsonString = [[NSString alloc] initWithData : jsonData
                                                     encoding : NSUTF8StringEncoding];
        [params setObject : jsonString
                   forKey : @"selectDatabase"];
    }
  
    if ( _hasListeners )
    {
        [self sendEventWithName : @"selectDatabase"
                           body : params];
    }
}


#pragma mark - RCT_EXPORT

RCT_EXPORT_METHOD( play : (NSDictionary *) argsFromReactNative )
{
    [self showMediaPlayer : argsFromReactNative];
}

RCT_EXPORT_METHOD( stop )
{
  [self stopMediaPlayer];
}

RCT_EXPORT_METHOD( setting : (NSDictionary *) argsFromReactNative )
{
    NSLog(@"  RNNativePlayer setting for RN : %@", argsFromReactNative);
}

RCT_EXPORT_METHOD( download : (NSDictionary *) argsFromReactNative )
{
    //[self downloadSomething : argsFromReactNative]; // 테스트용
    [self downloadContent : argsFromReactNative];
}

RCT_EXPORT_METHOD( downloadDelete : (NSDictionary *) argsFromReactNative )
{
    [self deleteDownloadedContent : argsFromReactNative];
}

RCT_EXPORT_METHOD( selectDatabase : (NSDictionary *) argsFromReactNative )
{
    [self selectDownloadedContent : argsFromReactNative];
}

@end
