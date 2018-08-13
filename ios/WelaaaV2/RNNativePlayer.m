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

@implementation RNNativePlayer

// To export a module named FPSManager
RCT_EXPORT_MODULE();

#pragma mark - Private Methods

- (void) showMediaPlayer : (NSDictionary *) args
{
    ContentPlayerViewController *playerViewController = [[ContentPlayerViewController alloc] init];
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



#pragma mark - RCT_EXPORT

RCT_EXPORT_METHOD( play : (NSDictionary *) args )
{
    [self showMediaPlayer : args];
}

RCT_EXPORT_METHOD( download : (NSDictionary *) args )
{
    [self downloadSomething : args];
}

@end









