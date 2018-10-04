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

// args 가 하나의 콘텐츠(Dictionary)일 때.
- (void) downloadContent : (NSDictionary *) args
{
    [[FPSDownloadManager sharedInstance] startDownload : args
                                            completion : ^(NSError *error, NSMutableDictionary *result)
                                                         {}];
}

// args 가 여러개의 콘텐츠(Array)로 넘어오는걸로 적용. 2018.10.1
- (void) downloadContents : (NSArray *) args
{
  // gid 를 구한다.
  NSString* gid = nil;
  
  if (args && args.count > 0) {
    NSString* cid = args[0][@"cid"];
    if (cid && cid.length>1) {
      gid = [cid substringToIndex:[cid indexOf:@"_"]];
    }
  }
  
  if (gid && gid.length > 0) {
    // 강좌 그룹 전체 내용에 대한 메타정보를 먼저 구하고,
    NSDictionary *contentsInfo = [ApiManager getContentsInfoWithCgid : gid
                                                       andHeaderInfo : args[0][@"token"]];
    [[FPSDownloadManager sharedInstance] setContentsInfo:contentsInfo];
    // 다운로드 시작.
    for(NSDictionary* arg in args){
      [[FPSDownloadManager sharedInstance] startDownload : arg
                                              completion : ^(NSError *error, NSMutableDictionary *result)
       {}];
    }
  }
  
  // 테스트로 하나만 뽑아서 다운로드할 때.
  /*
  if (args && args.count>0) {
    [[FPSDownloadManager sharedInstance] startDownload : args[0]
                                            completion : ^(NSError *error, NSMutableDictionary *result)
     {}];
  }
  */
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

- (void) selectDownloadedList : (NSString *)option
                     resolver : (RCTPromiseResolveBlock)resolve
                     rejecter : (RCTPromiseRejectBlock)reject
{
  NSLog(@"  selectDownloadedList:resolver:rejecter:");
  
  NSMutableArray *allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsAll];
  
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject : allRecords
                                                     options : 0
                                                       error : &error];
  if ( !jsonData && error )
  {
    NSLog(@"  Json Parse Error : %@",error);
    reject(nil,@"Json Parse Error",error);
  }
  else
  {
    NSString *jsonString = [[NSString alloc] initWithData : jsonData
                                                 encoding : NSUTF8StringEncoding];
    NSLog(@"  Parsed jsonString : %@",jsonString);
    resolve(jsonString);
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

RCT_EXPORT_METHOD( download : (NSArray *) argsFromReactNative )
{
    //[self downloadContent : argsFromReactNative]; // argsFromReactNative 가 Dictionary 일 때
    [self downloadContents : argsFromReactNative];  // argsFromReactNative 가 Array 일 때(여러개의 Dictionary)
}

RCT_EXPORT_METHOD( downloadDelete : (NSDictionary *) argsFromReactNative )
{
    [self deleteDownloadedContent : argsFromReactNative];
}

RCT_EXPORT_METHOD( selectDatabase : (NSDictionary *) argsFromReactNative )
{
    [self selectDownloadedContent : argsFromReactNative];
}

RCT_EXPORT_METHOD( getDownloadList : (RCTPromiseResolveBlock)resolve
                          rejecter : (RCTPromiseRejectBlock)reject )
{
  [self selectDownloadedList:nil resolver:resolve rejecter:reject];
}

@end
