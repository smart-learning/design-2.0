//
//  FPSDownloadManager.m
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "FPSDownloadManager.h"
#import "FPSDownload.h"
#import "QueryService.h"
#import "Clip.h"
#import "DatabaseManager.h"

#define PALLYCON_SITE_ID    @"O8LD"
#define PALLYCON_SITE_KEY   @"YxIe3SrPPWWH6hHPkJdG1pUewkB1T6Y9"
#define PALLYCON_USER_ID    @"93"

#define DEFAULT_NET_TIMEOUT_SEC 30  // 네트워크 타임아웃
#define MAX_NUMBER_OF_THREADS    2  // 최대 동시 다운로드 작업 갯수(1로 설정하면 1개씩 받음).
                                    // 초과요청 되는 작업들은 대기큐(downloadingQueue)에 쌓임.


@interface FPSDownloadManager()
{
  QueryService *queryService;
}
- (void)launchNextDownload;
- (NSUInteger)numberOfItemsInQueue;
@end


@implementation FPSDownloadManager

+ (FPSDownloadManager *)sharedInstance
{
  static FPSDownloadManager *sharedFpsDownloadManager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedFpsDownloadManager = [[FPSDownloadManager alloc] init];
    
  });
  return sharedFpsDownloadManager;
}


- (id)init
{
  self = [super init];
  if (self) {
    _downloadingQueue = [[NSMutableArray alloc] init];
    _activeDownloads = [[NSMutableDictionary alloc] init];
    _maximumNumberOfThreads = MAX_NUMBER_OF_THREADS;
    _connectionTimeout = DEFAULT_NET_TIMEOUT_SEC;
    queryService = [[QueryService alloc] init];
  }
  return self;
}


- (void)downloadSomething:(NSDictionary *)args  // 테스트를 위한 메소드
{
  NSLog(@"downloadSomething");
  
  // 1. initialize a PallyConFPS SDK. PallyConFPS SDK 객체를 생성합니다.
  _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                            siteKey : PALLYCON_SITE_KEY
                                 fpsLicenseDelegate : self
                                              error : nil             ];
  
  NSURL *contentUrl = [NSURL URLWithString:[args objectForKey:@"uri"]]; // CONTENT_PATH
  NSLog(@"contentUrl : %@", [contentUrl absoluteString]);
  
  // 2. DownloadTask 객체 생성합니다.
  // 콘텐츠 다운로드를 위해 DownloadTask 객체를 생성해서 사용합니다.
  // DownloadTask는 반드시 PallyConFPS 객체를 사용해서 생성해야만 합니다.
  DownloadTask *downloadTask;
  downloadTask = [ _fpsSDK createDownloadTaskWithUrl : contentUrl
                                              userId : [args objectForKey : @"userId"]
                                           contentId : [args objectForKey : @"cid"]
                                          optionalId : [args objectForKey : @"oid"]
                                    downloadDelegate : self ];    //  id<PallyConFPSDownloadDelegate> downloadDelegate
  [downloadTask resume];
}


- (DownloadTask *)prepareFPSDownloadTask:(NSDictionary *)args
{
  NSLog(@"prepareFPSDownloadTask");
  
  _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                            siteKey : PALLYCON_SITE_KEY
                                 fpsLicenseDelegate : self
                                              error : nil             ];
  
  NSURL *contentUrl = [NSURL URLWithString:[args objectForKey:@"uri"]]; // CONTENT_PATH
  NSLog(@"contentUrl : %@", [contentUrl absoluteString]);
  
  if(!_fpsSDK){
    return nil;
  }
  
  DownloadTask *downloadTask;
  downloadTask = [ _fpsSDK createDownloadTaskWithUrl : contentUrl
                                              userId : [args objectForKey : @"userId"]
                                           contentId : [args objectForKey : @"cid"]
                                          optionalId : [args objectForKey : @"oid"]
                                    downloadDelegate : self ];
  if (!downloadTask) {
    return nil;
  }
  return downloadTask;
}


- (void)startDownload:(Clip *)clip completion:(void (^)(NSString* resultMsg))resultHandler
{
  [self queueFPSDownloadRequest:clip completion:resultHandler]; // 큐에 작업 할당
}


- (void)startDownload:(Clip *)clip
{
  [self queueFPSDownloadRequest:clip completion:nil]; // 큐에 작업 할당(결과값 돌려받지 않을 경우)
}


- (void)pauseDownload:(Clip *)clip
{
  
}


- (void)cancelDownload:(Clip *)clip
{
  
}


- (void)resumeDownload:(Clip *)clip
{
  
}


// cid 를 통해 다운로드 컨텐츠 경로를 리턴받고 해당 경로가 유효할 경우 queue 에 추가.
//  그렇지 않을 경우엔 콜백으로 컨텐츠 경로가 존재하지 않는다고 리턴.(여기선 굳이 백그라운드일 필요 없다)
- (void)queueFPSDownloadRequest:(Clip *)clip completion:(void (^)(NSString* resultMsg))resultHandler
{
  NSString* cid = clip.cid;
  NSString* userId = PALLYCON_USER_ID;  // TODO : 실제 Id 값으로 변경. clip 에 저장해서 가져오는 방법도 있고.
  
  if(!cid) return;
  if(!userId) return;
  
  [queryService getSearchWelaaaPlayDataResults:cid queryResults:^(NSDictionary* dicResult, NSString* errMsg){
    
    NSLog(@"errMsg : %@", errMsg);
    NSLog(@"custom_data_v2 : %@", [dicResult objectForKey:@"custom_data_v2"]);
    NSLog(@"media_urls : %@", [dicResult objectForKey:@"media_urls"]);
    NSLog(@"permission : %@", [dicResult objectForKey:@"permission"]);
    NSLog(@"progress : %@", [dicResult objectForKey:@"progress"]);
    
    // cid 가 v100015_001 인 경우의 response Sample
    /*
     {
       "custom_data_v2": {
       "FairPlay": "eyJzaXRlX2lkIjogIk84TEQiLCAiZHJtX3R5cGUiOiAiRmFpclBsYXkiLCAiZGF0YSI6ICI2OVRBdnpOeEpOK2J1Y0hSbkE2ajVGQnhKRXhnc3oxek1sdjRhcDZEVlVQUXE5NVdsd2YrcGZjVzBxN3pRZHVSaGMzcDNiMzZqYUxjZzd5MWs0dFJHdz09In0=",
       "PlayReady": "eyJzaXRlX2lkIjogIk84TEQiLCAiZHJtX3R5cGUiOiAiUGxheVJlYWR5IiwgImRhdGEiOiAiNjlUQXZ6TnhKTitidWNIUm5BNmo1RkJ4SkV4Z3N6MXpNbHY0YXA2RFZVUFFxOTVXbHdmK3BmY1cwcTd6UWR1UmhjM3AzYjM2amFMY2c3eTFrNHRSR3c9PSJ9",
       "WideVine": "eyJzaXRlX2lkIjogIk84TEQiLCAiZHJtX3R5cGUiOiAiV2lkZVZpbmUiLCAiZGF0YSI6ICI2OVRBdnpOeEpOK2J1Y0hSbkE2ajVGQnhKRXhnc3oxek1sdjRhcDZEVlVQUXE5NVdsd2YrcGZjVzBxN3pRZHVSaGMzcDNiMzZqYUxjZzd5MWs0dFJHdz09In0="
       },
       "media_urls": {
       "DASH": "https://contents.welaaa.com/media/v100015/DASH_v100015_001/stream.mpd",
       "HLS": "https://contents.welaaa.com/media/v100015/HLS_v100015_001/master.m3u8"
     },
     "permission": {
     "can_play": true,
     "expire_at": "Fri, 30 Nov 2018 14:09:56 GMT",
     "is_free": false
     },
     "progress": {
     "id": 2407,
     "played_at": "Fri, 24 Aug 2018 10:51:04 GMT",
     "start_seconds": 421
     },
     "type": 10
     }
     */
    
    // 다운로드 경로 유무 체크
    NSString* urlString = dicResult[@"media_urls"][@"HLS"];
    if (!urlString || [urlString length]<=0) {
      // React 로 에러메시지 전달
      NSLog(@"No HLS Url!");
      resultHandler(@"경로가 존재하지 않습니다.");
      return;
    }
    
    // 다운로드 권한 체크
    if(!dicResult[@"permission"][@"can_play"]){
      // React 로 에러메시지 전달
      NSLog(@"No Permission to Play!");
      resultHandler(@"다운로드 권한이 없습니다.");
      return;
    }
    
    __block NSUInteger indexFound = NSNotFound;
    // 다운로드 경로 중복체크 필요
    // 대기큐에 이미 있는지?
    [self->_downloadingQueue enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
      FPSDownload *r = obj;
      if ([cid isEqualToString:r.clip.cid]) {
        *stop = YES;
        indexFound = idx;
      }
    }];
    
    if(indexFound != NSNotFound){
      NSLog(@"Already in Downloading Queue!");
      resultHandler(@"다운로드 대기중입니다.");
      return;
    }
    
    // TODO : 현재 다운로드중 리스트에 있는지?
    if([self->_activeDownloads objectForKey:cid]){
      NSLog(@"Already in Active Downloads!");
      resultHandler(@"이미 다운로드 중입니다.");
      return;
    }
    
    FPSDownload* fpsDownload = [[FPSDownload alloc] initWithClip:clip];
    NSDictionary* dicDownloadInfo = [[NSDictionary alloc] initWithObjectsAndKeys:urlString,@"uri",cid,@"cid",userId,@"userId",nil];
    fpsDownload.task = [self prepareFPSDownloadTask:dicDownloadInfo];
    fpsDownload.clip.contentUrl = [NSURL URLWithString:urlString];
    if (fpsDownload.task) {
      [self->_downloadingQueue addObject:fpsDownload];
    }
    
    [self launchNextDownload];
    
    resultHandler(@"다운로드를 시작합니다."); // 성공. 호출한 쪽에 필요한 정보들을 리턴. 예) "다운로드를 시작합니다."
  }];
}


- (void)clearQueue
{
  NSLog(@"clearQueue");
  [self->_downloadingQueue removeAllObjects];
  [self->_activeDownloads removeAllObjects];
}


- (NSUInteger)numberOfItemsInQueue  // 다운로드 대기중인 작업갯수 리턴.
{
  return self->_downloadingQueue.count;
}


- (void)launchNextDownload
{
  NSLog(@"launchNextDownload");
  
  if (_activeDownloads.count >= self.maximumNumberOfThreads) {
    NSLog(@"동시 다운로드 작업갯수 초과. 대기.");
    return;
  }
  
  if (self.numberOfItemsInQueue == 0) {
    NSLog(@"Nothing in Downloading Queue.(남아있는 작업 없음)");
    
    if(_activeDownloads.count == 0){
      NSLog(@"모든 다운로드 완료.");
      // noti -> 다운로드
      if (_delegateFpsMsg) {
        [_delegateFpsMsg fpsDownloadMsg:@"다운로드 완료"];
      }
    }
    
    return;
  }
  
  NSLog(@"큐에서 다운로드 대기중인 작업 갯수 : %lu", (unsigned long)self.numberOfItemsInQueue);
  
  // 새 작업 하나 시작
  FPSDownload* fpsDownload = [self->_downloadingQueue objectAtIndex:0];
  [self->_downloadingQueue removeObjectAtIndex:0];
  [fpsDownload.task resume];
  fpsDownload.isDownloading = true;
  [self->_activeDownloads setObject:fpsDownload forKey:fpsDownload.clip.cid];    // 다운로드후 contentId 로 컨텐츠를 조회하기 때문에.
}


#pragma mark - FPS License implementaions

- (void) fpsLicenseDidSuccessAcquiringWithContentId : (NSString * _Nonnull) contentId
{
  NSLog(@"fpsLicenseDidSuccessAcquiringWithContentId (%@)", contentId);
  // 라이센스 인증 성공.
}


- (void) fpsLicenseWithContentId : (NSString * _Nonnull) contentId
                didFailWithError : (NSError * _Nonnull) error
{
  NSLog(@"fpsLicenseWithContentId. Error Message (%@)", error.localizedDescription);
  // TODO : 라이센스 인증 실패시엔 다운로드 시작을 안하고 에러 메시지를 콜백(델리게이트 등)으로 리턴하는 방안.
}


#pragma mark - FPS Download implementaions

- (void) downloadContent : (NSString * _Nonnull) contentId
  didFinishDownloadingTo : (NSURL * _Nonnull) location
{
  NSLog(@"download contentId : %@, location : %@",contentId, location.absoluteString);
  if (_delegateFpsDownload) {
    [_delegateFpsDownload downloadContent:contentId didFinishDownloadingTo:location];
  }
  // 콜백에 먼저 처리할 수 있게 해주고 그 다음에 데이터를 갱신한다.(현재 다운로드에서 제거 등).
  
  // 다운로드 성공시 이후의 처리(코어데이타 동기화 등)를 하고 다음 다운로드 시작
  
  FPSDownload* fpsDownload = nil;
  @try {
    fpsDownload = [_activeDownloads objectForKey:contentId];
    [_activeDownloads removeObjectForKey:contentId];
    
    // TODO
    // contentId vs fpsDownload.clip.cid 동일해야 한다.
    
    NSDictionary* downloadedContent = [[NSDictionary alloc] initWithObjectsAndKeys:fpsDownload.clip.cid,@"cid" \
                                       , fpsDownload.clip.title,@"cTitle" \
                                       , location.path,@"contentPath" \
                                       , nil];
    // TODO : 중복체크 방안
    [[DatabaseManager sharedInstance] saveDownloadedContent:downloadedContent]; // SQLite 를 통해 저장(welaaa.db)
    fpsDownload.clip.downloaded = true;
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
    return;
  }
  @finally {}
  
  [self launchNextDownload];  // 다음 작업 진행.
}


- (void) downloadContent : (NSString * _Nonnull) contentId
                 didLoad : (CMTimeRange) timeRange
   totalTimeRangesLoaded : (NSArray<NSValue *> * _Nonnull) loadedTimeRanges
 timeRangeExpectedToLoad : (CMTimeRange) timeRangeExpectedToLoad
{
  NSLog(@"download contentId : %@ -> timeRange.start : %f", contentId, CMTimeGetSeconds(timeRange.start));
  if (_delegateFpsDownload) {
    [_delegateFpsDownload downloadContent:contentId didLoad:timeRange totalTimeRangesLoaded:loadedTimeRanges timeRangeExpectedToLoad:timeRangeExpectedToLoad];
  }
  
  // 다운로드 하는 곳의 UI 를 여기서 업데이트 해준다(프로그레스바 등). 그럴려면 프로그레스바의 UI 주소를 미리 받아둬야 한다.
  // 델리게이트 방식 등으로.
}


- (void)  downloadContent : (NSString * _Nonnull) contentId
didStartDownloadWithAsset : (AVURLAsset * _Nonnull) asset
      subtitleDisplayName : (NSString * _Nonnull) subtitleDisplayName
{
  NSLog(@"download contentId : %@, didStartDownloadWithAsset : %@, subtitleDisplayName : %@",contentId, asset.URL.absoluteString,subtitleDisplayName);
  if (_delegateFpsDownload) {
    [_delegateFpsDownload downloadContent:contentId didStartDownloadWithAsset:asset subtitleDisplayName:subtitleDisplayName];
  }
}


- (void) downloadContent : (NSString * _Nonnull) contentId
        didStopWithError : (NSError * _Nullable) error
{
  NSLog(@"download contentId : %@, error code : %ld",contentId, [error code]);
  // TODO : 다운로드 실패시엔 다운로드 시작을 안하고 에러 메시지를 콜백(델리게이트 등)으로 리턴하고 다음 다운로드 진행.
  if (_delegateFpsDownload) {
    [_delegateFpsDownload downloadContent:contentId didStopWithError:error];
  }
  [self launchNextDownload];
}

@end
