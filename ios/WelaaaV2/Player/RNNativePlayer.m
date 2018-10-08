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
    return @[@"downloadState",@"selectDatabase"];
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
  if ([[FPSDownloadManager sharedInstance] numberOfItemsInWating] > 0) {
    // 다운로드 진행중입니다. 취소하고 다시 받으시겠습니까? -> 리액트에서 먼저 체크해서 팝업 띄우고 예,아니오에 따라 처리.
    // 혹은,
    // 팝업문구 후보안 1 -> 다운로드 대기중인 콘텐츠가 있습니다. 취소하고 새로 받으시겠습니까?
    // 팝업문구 후보안 2 -> 다운로드 진행중인 콘텐츠가 있습니다. 취소하고 새로 받으시겠습니까?
  }
  
  if ([[FPSDownloadManager sharedInstance] numberOfItemsInActive] > 0) {
    // 다운로드중인 콘텐츠가 있는 상태일 경우의 처리. 아직은 처리할 케이스 없음.
  }
  // 지금은 한 강좌단위 다운로드만 지원. 한 강좌만해도 10개 이상(오디오의 경우 30개 이상)이 많고 그에 따른 다운로드 콘텐츠 페이지의 디테일한 시나리오도 없는 상태이기 때문.
  // 시나리오는 보완해서 제안.
  
  // 여기까지 넘어오면, 다운로드 대기큐와 다운로드 진행중인 작업을 모두 취소하고 새로 시작.
  
  // gid 를 구한다.
  NSString* gid = nil;
  
  if (args && args.count > 0)
  {
    NSString* cid = args[0][@"cid"];
    if (cid && cid.length>1)
    {
      gid = [cid substringToIndex:[cid indexOf:@"_"]];
    }
  }else
  {
    NSLog(@"  No args!");
    return;
  }
  
  if (gid && gid.length > 0)
  {
    // 강좌 그룹 전체 내용에 대한 메타정보를 먼저 구하고,
    NSDictionary *contentsInfo = [ApiManager getContentsInfoWithCgid : gid
                                                       andHeaderInfo : args[0][@"token"]];
    
    if (contentsInfo == nil)
    {
      // 알러트 -> 콘텐츠 정보를 불러올 수 없습니다.
      NSLog(@"  No contentsInfo!");
      return;
    }
    
    [[FPSDownloadManager sharedInstance] setContentsInfo:contentsInfo];
    
    // 다운로드 시작
    [[FPSDownloadManager sharedInstance] startDownloadContents:args
                                                    completion:^(NSError *error, NSMutableDictionary *result)
    {
      // 하나 성공할 때마다 호출되면서 화면의 다운로드 목록 갱신
      //[result objectForKey:@"cid"]
      
      NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
      
      [params setObject:[NSNumber numberWithBool:true] forKey:@"complete"];
      [params setObject:[NSNumber numberWithInt:0] forKey:@"progress"];
      
      if ( _hasListeners )
      {
        [self sendEventWithName : @"downloadState"
                           body : params];
      }
    }];
  }
}

- (void) deleteDownloadedContent : (NSDictionary *) args

{
    [[FPSDownloadManager sharedInstance] removeDownloadedContent : args
                                                      completion : ^(NSError *error, NSMutableDictionary *result)
                                                                   {}];
}

- (void) deleteDownloadedContents : (NSArray *) args
                         resolver : (RCTPromiseResolveBlock)resolve
                         rejecter : (RCTPromiseRejectBlock)reject
{
  [[FPSDownloadManager sharedInstance] removeDownloadedContents : args
                                                     completion : ^(NSError *error, NSMutableDictionary *result)
   {
     // 삭제 성공시 cid 를 리턴해준다.
     if (error == nil) {
       NSString *cid = result ? [result objectForKey:@"cid"] : @"";
       resolve(cid);
     }else{
       reject(nil,@"Delete Contents Error",error);
     }
   }];
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

RCT_EXPORT_METHOD( deleteDownload : (NSArray *) argsFromReactNative
                         resolver : (RCTPromiseResolveBlock)resolve
                         rejecter : (RCTPromiseRejectBlock)reject )
{
  [self deleteDownloadedContents:argsFromReactNative resolver:resolve rejecter:reject];
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
