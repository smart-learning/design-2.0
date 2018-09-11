//
//  RNNativePlayer.m
//  WelaaaV2
//
//  Created by SmartLearning_iOSDev on 2018. 7. 25..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "RNNativePlayer.h"

#import "AppDelegate.h"
#import "ContentPlayerViewController.h"
#import "FPSDownloadManager.h"
#import "DatabaseManager.h"

@implementation RNNativePlayer
{
  BOOL _hasListeners;
}

// To export a module named FPSManager
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"selectDatabase"];
}

// Will be called when this module's first listener is added.
- (void)startObserving
{
  _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void)stopObserving
{
  _hasListeners = NO;
}

#pragma mark - Private Methods

- (void) showMediaPlayer : (NSDictionary *) argsFromReactNative
{
    ContentPlayerViewController *playerViewController = [[ContentPlayerViewController alloc] init];
    NSMutableDictionary *args = [argsFromReactNative mutableCopy];
    [playerViewController setContentData : args];
  
    AppDelegate *delegate = (AppDelegate *) [ [UIApplication sharedApplication] delegate ];
    [delegate.window.rootViewController presentViewController : playerViewController
                                                     animated : YES
                                                   completion : nil];
}

- (void) downloadSomething : (NSDictionary *) args
{
    // 다운로드 테스트
    FPSDownloadManager *fpsDownloadManager = [[FPSDownloadManager alloc] init];
    [fpsDownloadManager downloadSomething : args];
}

- (void) downloadContent : (NSDictionary *) args
{
  
}

- (void) deleteDownloadedContent : (NSDictionary *) args
{
  
}

- (void) selectDownloadedContent : (NSDictionary *) args
{
  NSMutableDictionary* params = [[NSMutableDictionary alloc] init];
  
  NSMutableArray* allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsAllDics];
  
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:allRecords
                                                     options:NSJSONWritingPrettyPrinted
                                                       error:&error];
  if (!jsonData) {
    NSLog(@"Json Parse Error : %@", error);
    [params setObject:@"" forKey:@"selectDatabase"];
  } else {
    NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    [params setObject:jsonString forKey:@"selectDatabase"];
  }
  
  if (_hasListeners) {
    [self sendEventWithName:@"selectDatabase" body:params];
  }
}


#pragma mark - RCT_EXPORT

RCT_EXPORT_METHOD( play : (NSDictionary *) argsFromReactNative )
{
    [self showMediaPlayer : argsFromReactNative];
}

RCT_EXPORT_METHOD( setting : (NSDictionary *) argsFromReactNative )
{
    NSLog(@"  RNNativePlayer setting for RN : %@", argsFromReactNative);
}

RCT_EXPORT_METHOD( download : (NSDictionary *) argsFromReactNative )
{
    //[self downloadSomething : argsFromReactNative]; // test
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
