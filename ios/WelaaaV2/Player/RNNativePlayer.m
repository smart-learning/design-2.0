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
  
    // View를 present할때 옵션없이 하면 지시하는 뷰를 컨텍스트에서 날리고 present하기때문에 검은화면이 맨 아래에 깔리게 됩니다.
    // https://magi82.github.io/ios-modal-presentation-style-01/
    playerViewController.modalPresentationStyle = UIModalPresentationOverFullScreen;
  
    // Exception 'accessing _cachedSystemAnimationFence requires the main thread' was thrown while invoking 에러가 발생된다면..
    // ref : https://github.com/MOLPay/molpay-mobile-xdk-reactnative-beta/issues/7
    dispatch_sync(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController : playerViewController
                                                                                     animated : YES
                                                                                   completion : nil];
    });
  /*
    // NavigationView방식으로 push해야한다면 아래를 주석해제합니다.
    dispatch_sync(dispatch_get_main_queue(), ^{
        UINavigationController *navigationController;
        navigationController = (UINavigationController *)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
        [navigationController pushViewController:playerViewController animated:TRUE];
    });
  */
}

- (void) showMiniPlayer
{
    // player를 dismiss하고 miniPlayer를 present합니다.
}

- (void) representMediaPlayer
{
    // miniPlayer를 dismiss하고 player를 present합니다.
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
