//
//  FPSDownloadManager.h
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <Foundation/Foundation.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>
#import "Clip.h"

@protocol FPSDownloadDelegate <NSObject>
@optional
- (void)fpsDownloadMsg:(NSString *)msg;
@end


@interface FPSDownloadManager : NSObject <PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate>

@property (strong, nonatomic) NSMutableArray      *downloadingQueue;
@property (strong, nonatomic) NSMutableDictionary *activeDownloads;
@property (strong, nonatomic) PallyConFPSSDK      *fpsSDK;
@property (nonatomic, assign) NSUInteger  maximumNumberOfThreads;
@property (nonatomic, assign) NSTimeInterval  connectionTimeout;

+ (FPSDownloadManager *)sharedInstance;
- (void)downloadSomething:(NSDictionary *)args;  // 테스트를 위한 메소드
- (void)startDownload:(Clip *)clip completion:(void (^)(NSString* resultMsg))resultHandler;
- (void)startDownload:(Clip *)clip;
- (void)pauseDownload:(Clip *)clip;
- (void)cancelDownload:(Clip *)clip;
- (void)resumeDownload:(Clip *)clip;
- (void)queueFPSDownloadRequest:(Clip *)clip completion:(void (^)(NSString* resultMsg))resultHandler;
- (void)clearQueue;

// Pallycon 다운로드 진행 상황에 대한 정보를 다른 곳에서도 받아야 할 때 사용.(콜백 등)
@property (weak, nonatomic) id<PallyConFPSLicenseDelegate> delegateFpsLicense;
@property (weak, nonatomic) id<PallyConFPSDownloadDelegate> delegateFpsDownload;
// 다운로드 진행간 발생하는 메시지들을 전달할 때 사용.
@property (weak, nonatomic) id<FPSDownloadDelegate> delegateFpsMsg;


@end