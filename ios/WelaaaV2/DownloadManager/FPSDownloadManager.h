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
#import <Toast/UIView+Toast.h>
#import "FPSDownload.h"
#import "QueryService.h"
#import "Clip.h"
#import "DatabaseManager.h"
#import "common.h"

@protocol FPSDownloadDelegate <NSObject>
@optional
- (void)fpsDownloadMsg:(NSString *)msg;
@end


@interface FPSDownloadManager : NSObject <PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate>
{
  // 초과요청 되는 작업들은 대기큐(downloadingQueue)에 쌓임.
  QueryService *queryService;
}

@property (strong, nonatomic) NSDictionary        *contentsInfo;
@property (strong, nonatomic) NSMutableArray      *downloadingQueue;
@property (strong, nonatomic) NSMutableDictionary *activeDownloads;
@property (strong, nonatomic) PallyConFPSSDK      *fpsSDK;
@property (nonatomic, assign) NSUInteger           maximumNumberOfThreads;
@property (nonatomic, assign) NSTimeInterval       connectionTimeout;

+ (FPSDownloadManager *)sharedInstance;
- (void)downloadSomething:(NSDictionary *)args;  // 테스트를 위한 메소드
- (void)startDownload:(NSDictionary *)args completion:(void (^)(NSError* error, NSMutableDictionary* result))resultHandler;
- (void)startDownloadContents:(NSArray *)args completion:(void (^)(NSError* error, NSMutableDictionary* result))resultHandler;
- (void)removeDownloadedContent:(NSDictionary *)args completion:(void (^)(NSError* error, NSMutableDictionary* result))resultHandler;
- (void)clearQueue;
- (void)launchNextDownload;
- (NSUInteger)numberOfItemsInWating;
- (NSUInteger)numberOfItemsInActive;

// Pallycon 다운로드 진행 상황에 대한 정보를 다른 곳에서도 받아야 할 때 사용.(콜백 등)
@property (weak, nonatomic) id<PallyConFPSLicenseDelegate> delegateFpsLicense;
@property (weak, nonatomic) id<PallyConFPSDownloadDelegate> delegateFpsDownload;
// 다운로드 진행간 발생하는 메시지들을 전달할 때 사용.
@property (weak, nonatomic) id<FPSDownloadDelegate> delegateFpsMsg;

@end
