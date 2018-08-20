//
//  RNNativePlayer.m
//  WelaaaV2
//
//  Created by SmartLearning_iOSDev on 2018. 7. 25..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "RNNativePlayer.h"

#import "AppDelegate.h"

#define PALLYCON_SITE_ID    @"O8LD"
#define PALLYCON_SITE_KEY   @"YxIe3SrPPWWH6hHPkJdG1pUewkB1T6Y9"

@implementation RNNativePlayer

// To export a module named FPSManager
RCT_EXPORT_MODULE();

#pragma mark - Private Methods

- (void) showMediaPlayer : (NSDictionary *) args
{
    RCTLogInfo(@"  type          : %@", [args objectForKey : @"type"]); // streaming or download
    RCTLogInfo(@"  uri           : %@", [args objectForKey : @"uri"]);  // content path
    RCTLogInfo(@"  name          : %@", [args objectForKey : @"name"]);
    RCTLogInfo(@"  drmSchemeUuid : %@", [args objectForKey : @"drmSchemeUuid"]);
    RCTLogInfo(@"  drmLicenseUrl : %@", [args objectForKey : @"drmLicenseUrl"]);
    RCTLogInfo(@"  userId        : %@", [args objectForKey : @"userId"]);
    RCTLogInfo(@"  cid           : %@", [args objectForKey : @"cid"]);
    RCTLogInfo(@"  oid           : %@", [args objectForKey : @"oid"]);
    RCTLogInfo(@"  token         : %@", [args objectForKey : @"token"]);
    RCTLogInfo(@"  webToken      : %@", [args objectForKey : @"webToken"]);
    /*
     type : "streaming",
     uri: "https://contents.welaaa.com/contents/DASH_0028_001_mp4/stream.mpd",
     name: "140년 지속 성장을 이끈 MLB 사무국의 전략",
     drmSchemeUuid: "widevine",
     drmLicenseUrl: "http://tokyo.pallycon.com/ri/licenseManager.do",
     userId: "valid-user",
     cid: "0028_001",
     oid: "order id",
     token: "", // pallyCon token
     webToken: "" // RN 에서 가져올 토큰 정보 , 서버 호출간 이용
     */

    // 1. initialize a PallyConFPS SDK. PallyConFPS SDK 객체를 생성합니다.
    _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                              siteKey : PALLYCON_SITE_KEY
                                   fpsLicenseDelegate : self
                                                error : nil             ];

    //////
    NSURL *contentUrl = [ NSURL URLWithString : [args objectForKey : @"uri"] ]; // CONTENT_PATH
    AVURLAsset *urlAsset = [ [AVURLAsset alloc] initWithURL : contentUrl
                                                    options : nil       ];

    // 2. Set parameters required for FPS content playback. FPS 콘텐츠가 재생 되기 전에 FPS 콘텐츠 정보를 설정합니다.
    [ _fpsSDK prepareWithUrlAsset : urlAsset
                           userId : [args objectForKey : @"userId"]
                        contentId : [args objectForKey : @"cid"] // PALLYCON_CONTENT_ID
                       optionalId : [args objectForKey : @"oid"] // PALLYCON_OPTIONAL_ID
                  liveKeyRotation : NO              ];

    AVPlayerItem *playerItem = [ AVPlayerItem playerItemWithAsset : urlAsset ];
    playerItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmVarispeed;  // 재생속도 관련.
    AVPlayer *player = [ AVPlayer playerWithPlayerItem : playerItem ];
    AVPlayerViewController *playerController = [AVPlayerViewController new];
    playerController.player = player;
  //playerController.videoGravity = AVLayerVideoGravityResize;            // 가로세로 비율을 무시하고 레이어의 경계를 채우기 위해 비디오를 늘리도록 지정합니다.
    playerController.videoGravity = AVLayerVideoGravityResizeAspect;      // 가로세로 비율을 유지하고 비디오를 레이어의 경계 내에 맞출 수 있도록 지정합니다.
  //playerController.videoGravity = AVLayerVideoGravityResizeAspectFill;  // 가로세로 비율을 유지하고 레이어의 경계를 채우도록 지정합니다.

    playerController.showsPlaybackControls = YES; // NO : 재생 컨트롤 UI컴포넌트가 나오지 않음.


    AppDelegate *delegate = (AppDelegate *) [ [UIApplication sharedApplication] delegate ];
    [delegate.window.rootViewController presentViewController : playerController
                                                     animated : YES
                                                   completion : nil];

    [ [NSNotificationCenter defaultCenter] addObserver : self
                                              selector : @selector(videoPlayBackDidFinish:)
                                                  name : AVPlayerItemDidPlayToEndTimeNotification
                                                object : [playerController.player currentItem]  ];


    [playerController.player play];   // 플레이어 재생 실행
  //[playerController.player setRate : 14.0]; // 시작 시간 위치
  //[playerController.player setMuted : true];
  //[playerController.player pause];  // 플레이어 재생 정지
}

- (void) downloadSomething : (NSDictionary *) args
{
    // 1. initialize a PallyConFPS SDK. PallyConFPS SDK 객체를 생성합니다.
    _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                              siteKey : PALLYCON_SITE_KEY
                                   fpsLicenseDelegate : self
                                                error : nil             ];

    NSURL *contentUrl = [ NSURL URLWithString : [args objectForKey : @"uri"] ]; // CONTENT_PATH


    // 2. DownloadTask 객체 생성합니다.
    // 콘텐츠 다운로드를 위해 DownloadTask 객체를 생성해서 사용합니다.
    // DownloadTask는 반드시 PallyConFPS 객체를 사용해서 생성해야만 합니다.
    DownloadTask *downloadTask;
    downloadTask = [ _fpsSDK createDownloadTaskWithUrl : contentUrl
                                                userId : [args objectForKey : @"userId"]
                                             contentId : [args objectForKey : @"cid"]
                                            optionalId : [args objectForKey : @"oid"]
                                      downloadDelegate : self ];
    [downloadTask resume];
}

- (void) fpsLicenseDidSuccessAcquiringWithContentId : (NSString * _Nonnull) contentId
{
    NSLog(@"fpsLicenseDidSuccessAcquiringWithContentId (%@)", contentId);
}

- (void) fpsLicenseWithContentId : (NSString * _Nonnull) contentId
                didFailWithError : (NSError * _Nonnull) error
{
    NSLog(@"fpsLicenseWithContentId. Error Message (%@)", error.localizedDescription);
}

- (void) videoPlayBackDidFinish : (NSNotification *) notification
{
    NSLog(@"  [videoPlayBackDidFinish] FINITO !!");

    [ [NSNotificationCenter defaultCenter] removeObserver : self
                                                     name : AVPlayerItemDidPlayToEndTimeNotification
                                                   object : nil                                     ];

    //[self.avVideoController.view removeFromSuperview];
    //self.avVideoController = nil;
    UIAlertController *alertController;
    alertController = [ UIAlertController alertControllerWithTitle : @"Video Playback"
                                                           message : @"Just finished the video playback. The video is now removed."
                                                    preferredStyle : UIAlertControllerStyleAlert                                  ];

    UIAlertAction *okayAction = [ UIAlertAction actionWithTitle : @"OK"
                                                          style : UIAlertActionStyleDefault
                                                        handler : nil                     ];
    [alertController addAction : okayAction];
    AppDelegate *delegate = (AppDelegate *) [ [UIApplication sharedApplication] delegate ];
    [delegate.window.rootViewController presentViewController:alertController animated:YES completion:nil];
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