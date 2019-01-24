//
//  FPSDownloadManager.m
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "FPSDownloadManager.h"

#define DEFAULT_NET_TIMEOUT_SEC 30  // 네트워크 타임아웃
#define MAX_NUMBER_OF_THREADS    1  // 최대 동시 다운로드 작업 갯수(1로 설정하면 1개씩 받음).


@interface FPSDownloadManager()
{
}
// 다운로드 완료를 알려주기 위한 콜백함수(파일 하나 다운로드 될때마다 호출해서 화면을 갱신)
@property (nonatomic, copy) void(^downloadCompletion)(NSError* error, NSMutableDictionary* result);
@end

@implementation FPSDownloadManager

+ (FPSDownloadManager *) sharedInstance
{
    static FPSDownloadManager *sharedFpsDownloadManager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
      sharedFpsDownloadManager = [[FPSDownloadManager alloc] init];
    });
  
    return sharedFpsDownloadManager;
}


- (id) init
{
    self = [super init];
  
    if ( self )
    {
        _downloadingQueue = [[NSMutableArray alloc] init];
        _activeDownloads = [[NSMutableDictionary alloc] init];
        _maximumNumberOfThreads = MAX_NUMBER_OF_THREADS;
        _connectionTimeout = DEFAULT_NET_TIMEOUT_SEC;
        queryService = [[QueryService alloc] init];
    }
  
    return self;
}


- (DownloadTask *) prepareFPSDownloadTask : (NSDictionary *) args
{
    NSLog(@"  prepareFPSDownloadTask : %@", args);
  
    _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                              siteKey : PALLYCON_SITE_KEY
                                   fpsLicenseDelegate : self
                                                error : nil             ];
  
    NSURL *contentUrl = [NSURL URLWithString : [args objectForKey : @"uri"]]; // CONTENT_PATH
    NSLog(@"  contentUrl : %@", [contentUrl absoluteString]);
  
    if( !_fpsSDK )
    {
        return nil;
    }
  
    DownloadTask *downloadTask;
    downloadTask = [ _fpsSDK createDownloadTaskWithUrl : contentUrl
                                                userId : [args objectForKey : @"userId"]
                                             contentId : [args objectForKey : @"cid"]
                                            optionalId : [args objectForKey : @"oid"]
                                     //downloadOptions : @""    // PallyConFPSSDK v1.6.3 적용 시 주석을 해제해주시기 바랍니다.
                                      downloadDelegate : self ];
  
    if ( !downloadTask )
    {
        return nil;
    }
  
    return downloadTask;
}


- (void) downloadSomething : (NSDictionary *) args  // 테스트를 위한 메소드
{
    NSLog(@"  downloadSomething : %@", args);
  
    // 1. initialize a PallyConFPS SDK. PallyConFPS SDK 객체를 생성합니다.
    _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                              siteKey : PALLYCON_SITE_KEY
                                   fpsLicenseDelegate : self
                                                error : nil             ];
  
    NSURL *contentUrl = [NSURL URLWithString : [args objectForKey : @"uri"]]; // CONTENT_PATH
    NSLog(@"  contentUrl : %@", [contentUrl absoluteString]);
  
    // 2. DownloadTask 객체 생성합니다.
    // 콘텐츠 다운로드를 위해 DownloadTask 객체를 생성해서 사용합니다.
    // DownloadTask는 반드시 PallyConFPS 객체를 사용해서 생성해야만 합니다.
    DownloadTask *downloadTask;
    downloadTask = [ _fpsSDK createDownloadTaskWithUrl : contentUrl
                                                userId : [args objectForKey : @"userId"]
                                             contentId : [args objectForKey : @"cid"]
                                            optionalId : [args objectForKey : @"oid"]
                                     //downloadOptions : @""    // PallyConFPSSDK v1.6.3 적용 시 주석을 해제해주시기 바랍니다.
                                      downloadDelegate : self ];    //  id<PallyConFPSDownloadDelegate> downloadDelegate
    [downloadTask resume];
}


//  개별 다운로드(플레이어뷰 화면에 있는 다운로드 버튼)
- (void) startDownload : (NSDictionary *) item
            completion : (void (^) (NSError *error, NSMutableDictionary *result)) resultHandler
{
    /*
    [self queueDownloadRequest : item
                    completion : resultHandler];
     */
  // 아래와 같이 수정 2018.10.10
  NSMutableDictionary *details = [NSMutableDictionary dictionary];  // 에러에 대한 상세내용을 저장
  
  NSString* gid = nil;
  
  if (item)
  {
    NSString* cid = item[@"cid"];
    if (cid && cid.length>1)
    {
      gid = [cid substringToIndex:[cid indexOf:@"_"]];
    }
  }else
  {
    NSLog(@"  No item!");
    return;
  }
  
  if (gid && gid.length > 0)
  {
    // 강좌 그룹 전체 내용에 대한 메타정보를 먼저 구하고,
    NSDictionary *contentsInfo = [ApiManager getContentsInfoWithCgid : gid
                                                       andHeaderInfo : item[@"token"]];
    if (contentsInfo == nil)
    {
      NSLog(@"  No contentsInfo!");
      [self showAlertOk:@"알림" message:@"콘텐츠 정보를 불러올 수 없습니다"];
      return;
    }
    
    // 다운로드 시작
    NSString *cid = item[@"cid"];
    NSString *userId = item[@"userId"];
    NSString *token = item[@"token"];
    
    // 다운로드 받을 콘텐츠에 대한 메타정보를 추출해서 미리 저장
    FPSDownload *fpsDownload = [[FPSDownload alloc] initWithClip : [self getClipInfo:item fromContentsInfo:contentsInfo]];
    
    if([fpsDownload.clip.cPlaySeconds intValue] == 0){
      // play_sconds 필드가 0 인 클립은 받지 않음(오디오북의 경우 다운로드 경로가 있다하더라도 내용없는 chapter)
      NSLog(@"  play_seconds 0 contents");
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"다운로드 받을 수 없는 콘텐츠 입니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"contents"
                                         code : 0
                                     userInfo : details], nil);
      return;
    }
    
    //// 데이터 유효성 체크
    if ( !cid || cid.length <= 0 )
    {
      [details setValue : @"No cid"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"콘텐츠 정보(cid)가 없습니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"cid"
                                         code : 0
                                     userInfo : details], nil);
      return ;
    }
    
    if ( !userId || userId.length <= 0 )
    {
      [details setValue : @"No userId"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"사용자 정보(User Id)가 없습니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"userId"
                                         code : 0
                                     userInfo : details], nil);
      return ;
    }
    
    if ( !token || token.length <= 0 )
    {
      [details setValue : @"No token"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"인증 정보(token)가 없습니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"token"
                                         code : 0
                                     userInfo : details], nil);
      return ;
    }
    
    //// 중복 다운로드 체크에 대한 시나리오 고민 필요(gid 로 뽑아서 비교? - 개별다운로드, 전체다운로드 케이스 등)
    
    NSMutableArray *clips = [[DatabaseManager sharedInstance] searchDownloadedContentsId : cid];
    
    if ( clips && clips.count > 0 )
    {
      NSLog(@"  %lu Contents already in DB searched by cid : %@", (unsigned long)clips.count, cid);
      //  DB 에 이미 있는 파일의 경우 패스 -> 이미 다운로드된 파일
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"이미 다운로드된 콘텐츠입니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"download"
                                         code : 0
                                     userInfo : details], nil);
      return;
    }
    else
    {
      NSLog(@"  No Same Contents in DB searched by cid : %@", cid);
    }
    
    __block NSUInteger indexFound = NSNotFound;
    // 다운로드 경로 중복체크(대기큐에 이미 있는지)
    [self -> _downloadingQueue enumerateObjectsUsingBlock : ^(id obj, NSUInteger idx, BOOL *stop)
     {
       FPSDownload *r = obj;
       
       if ( [cid isEqualToString : r.clip.cid] )
       {
         *stop = YES;
         indexFound = idx;
         
         return ;
       }
     }];
    
    //  아래의 두 상황은 전달받은 args 리스트 안에 중복되는 cid 가 있지 않은 이상 발생할 일 없다(큐가 다 지워진 상태이기 때문에).
    //  그래도 만약 그런 중복 상황이 생긴다면 무시하고 다음 item 으로 넘어간다(continue로 루프문 가장 처음으로 동).
    if ( indexFound != NSNotFound )
    {
      NSLog(@"  Already in Downloading Queue wating for downloading!");
      [details setValue : @"Already in Downloading Queue wating for downloading"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( self -> _delegateFpsMsg )
      {
        [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드 대기중입니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"downloading"
                                         code : 0
                                     userInfo : details], nil);
      return ;
    }
    
    if ( [self -> _activeDownloads objectForKey : cid] )
    {
      NSLog(@"  Already in Active Downloading!");
      [details setValue : @"Already in Active Downloading"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( self -> _delegateFpsMsg )
      {
        [self -> _delegateFpsMsg fpsDownloadMsg : @"이미 다운로드 중입니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"downloading"
                                         code : 0
                                     userInfo : details], nil);
      return ;
    }
    
    // 다운로드 경로를 구해오기 위한 리퀘스트를 준비
    fpsDownload.playDataTask = [self preparePlayDataTask:cid authToken:token];
    
    // 다운로드 대기큐에 삽입
    [self->_downloadingQueue addObject : fpsDownload];
    
    [self doNextDownload];  // 다운로드 작업 시작 요청
    
    if ( self -> _delegateFpsMsg )
    {
      [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드를 시작합니다"];
    }
    [self showToast:@"다운로드를 시작합니다"];
    
    resultHandler (nil, nil); // 다운로드 버튼 상태를 업데이트하기 위해 호출. 2018.10.30.
  }
}


//  여러파일 다운로드(강좌단위,오디오북단위)
- (void) startDownloadContents : (NSArray *) items
                    completion : (void (^) (NSError *error, NSMutableDictionary *result)) resultHandler
{
  NSMutableDictionary *details = [NSMutableDictionary dictionary];  // 에러에 대한 상세내용을 저장
  
  [self clearQueue];
  
  _downloadCompletion = resultHandler;  // 다운로드 완료될 때마다 결과를 알려주기 위해 호출(다운로드 완료 콜백이 다른곳에 있기 때문에 전역으로 따로 저장)
  
  int alreadyDownloaded = 0;
  
  for(NSDictionary *item in items)
  {
    NSString *cid = item[@"cid"];
    NSString *userId = item[@"userId"];
    NSString *token = item[@"token"];
    
    // 다운로드 받을 콘텐츠에 대한 메타정보를 추출해서 미리 저장
    FPSDownload *fpsDownload = [[FPSDownload alloc] initWithClip : [self getClipInfo:item]];
    
    if([fpsDownload.clip.cPlaySeconds intValue] == 0){
      // play_sconds 필드가 0 인 클립은 받지 않음(오디오북의 경우 다운로드 경로가 있다하더라도 내용없는 chapter)
      continue;
    }
    
    //// 데이터 유효성 체크
    if ( !cid || cid.length <= 0 )
    {
      [details setValue : @"No cid"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"콘텐츠 정보(cid)가 없습니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"cid"
                                         code : 0
                                     userInfo : details], nil);
      continue ;
    }
    
    if ( !userId || userId.length <= 0 )
    {
      [details setValue : @"No userId"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"사용자 정보(User Id)가 없습니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"userId"
                                         code : 0
                                     userInfo : details], nil);
      continue ;
    }
    
    if ( !token || token.length <= 0 )
    {
      [details setValue : @"No token"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"인증 정보(token)가 없습니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"token"
                                         code : 0
                                     userInfo : details], nil);
      continue ;
    }
    
    //// 중복 다운로드 체크에 대한 시나리오 고민 필요(gid 로 뽑아서 비교? - 개별다운로드, 전체다운로드 케이스 등)
    
    NSMutableArray *clips = [[DatabaseManager sharedInstance] searchDownloadedContentsId : cid];
    
    if ( clips && clips.count > 0 )
    {
      NSLog(@"  %lu Contents already in DB searched by cid : %@", (unsigned long)clips.count, cid);
      //  DB 에 이미 있는 파일의 경우 패스(다음 다운로드로 continue 처리)
      //  어차피 삭제기능 있으므로 지우고 새로 받을 수 있는 시나리오가 있다.
      alreadyDownloaded++;
      continue;
    }
    else
    {
      NSLog(@"  No Same Contents in DB searched by cid : %@", cid);
    }
    
    __block NSUInteger indexFound = NSNotFound;
    // 다운로드 경로 중복체크(대기큐에 이미 있는지)
    [self -> _downloadingQueue enumerateObjectsUsingBlock : ^(id obj, NSUInteger idx, BOOL *stop)
     {
       FPSDownload *r = obj;
       
       if ( [cid isEqualToString : r.clip.cid] )
       {
         *stop = YES;
         indexFound = idx;
         
         return ;
       }
     }];
    
    //  아래의 두 상황은 전달받은 args 리스트 안에 중복되는 cid 가 있지 않은 이상 발생할 일 없다(큐가 다 지워진 상태이기 때문에).
    //  그래도 만약 그런 중복 상황이 생긴다면 무시하고 다음 item 으로 넘어간다(continue로 루프문 가장 처음으로 동).
    if ( indexFound != NSNotFound )
    {
      NSLog(@"  Already in Downloading Queue wating for downloading!");
      [details setValue : @"Already in Downloading Queue wating for downloading"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( self -> _delegateFpsMsg )
      {
        [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드 대기중입니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"downloading"
                                         code : 0
                                     userInfo : details], nil);
      continue ;
    }
    
    if ( [self -> _activeDownloads objectForKey : cid] )
    {
      NSLog(@"  Already in Active Downloading!");
      [details setValue : @"이미 다운로드 중입니다"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( self -> _delegateFpsMsg )
      {
        [self -> _delegateFpsMsg fpsDownloadMsg : @"이미 다운로드 중입니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"downloading"
                                         code : 0
                                     userInfo : details], nil);
      continue ;
    }
    
    // 다운로드 경로를 구해오기 위한 리퀘스트를 준비
    fpsDownload.playDataTask = [self preparePlayDataTask:cid authToken:token];
    
    // 다운로드 대기큐에 삽입
    [self->_downloadingQueue addObject : fpsDownload];
  }
  
  NSLog(@"다운로드 시작");
  [self doNextDownload];  // 다운로드 작업 시작 요청
  
  // Download Request Success(네트워크 요청 직전 단계까지 성공한 상태)
  
  // 이미 모든 콘텐츠가 다운로드 되어 있다면 다운로드 시작메시지 띄우지 않음. 2018.11.7
  if(alreadyDownloaded >= items.count){
    NSLog(@"All items was already downloaded. 이미 모든 콘텐츠(강좌목록) 다운로드된 상태.");
    return;
  }
  
  if ( self -> _delegateFpsMsg )
  {
    [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드를 시작합니다"];
  }
  [self showToast:@"다운로드를 시작합니다"];
}


- (NSURLSessionDataTask *) preparePlayDataTask : (NSString *) cid
                                     authToken : (NSString *) token
{
  NSURLSessionDataTask *dataTask;
  NSMutableDictionary *details = [NSMutableDictionary dictionary];  // 에러에 대한 상세내용을 저장
  
  NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
  NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration : defaultConfigObject
                                                 delegate : nil
                                            delegateQueue : [NSOperationQueue mainQueue]];
  
  NSString *apiPlayData = @"/api/v1.0/play/play-data/";
  NSString *urlWithParams = [NSString stringWithFormat : @"%@%@%@", API_HOST, apiPlayData, cid];
  NSURL *url = [NSURL URLWithString : urlWithParams];
  
  NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
  NSString *headerValue = [@"Bearer " stringByAppendingString : token];
  
  [urlRequest setHTTPMethod : @"GET"];
  [urlRequest setValue : headerValue
    forHTTPHeaderField : @"authorization"];
  [urlRequest setTimeoutInterval : DEFAULT_NET_TIMEOUT_SEC]; // 초단위 지정
  
  dataTask = [defaultSession dataTaskWithRequest : urlRequest
                               completionHandler : ^(NSData *data, NSURLResponse *response, NSError *error)
              {
                if ( error == nil )
                {
                  // No error
                  NSLog(@"  data : %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
                  
                  NSError *error = nil;
                  NSMutableDictionary* dicResult = [NSJSONSerialization JSONObjectWithData : data
                                                                             options : kNilOptions
                                                                               error : &error];
                  if ( error )
                  {
                    NSLog(@"  JSON Parse Error : %@", error.localizedDescription);
                    
                    [self->_activeDownloads removeObjectForKey : cid];
                    [self doNextDownload];
                    return;
                  }
                  
                  // DownloadTask 진행
                  
                  NSLog(@"custom_data_v2 : %@", dicResult[@"custom_data_v2"]);
                  NSLog(@"media_urls : %@", dicResult[@"media_urls"]);
                  NSLog(@"preview_urls : %@", dicResult[@"preview_urls"]);
                  NSLog(@"permission : %@", dicResult[@"permission"]);
                  NSLog(@"progress : %@", dicResult[@"progress"]);
                  
                  // 다운로드 경로 유무 체크
                  NSString *urlString = dicResult[@"media_urls"][@"HLS"];
                  
                  if ( !urlString || [urlString length] <= 0 )
                  {
                    // React 로 에러메시지 전달
                    NSLog(@"  No HLS Url!");
                    [details setValue : @"다운로드 경로가 존재하지 않습니다"
                               forKey : NSLocalizedDescriptionKey];
                    if ( self -> _delegateFpsMsg )
                    {
                      [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드 경로가 존재하지 않습니다"];
                    }
                    [self showAlertOk:nil message:@"다운로드 경로가 존재하지 않습니다"];
                    
                    [self->_activeDownloads removeObjectForKey : cid];
                    [self doNextDownload];
                    return ;
                  }
                  
                  // 다운로드 권한 체크
                  if ( !dicResult[@"permission"][@"can_play"] )
                  {
                    // React 로 에러메시지 전달
                    NSLog(@"  No Permission to Play!");
                    [details setValue : @"다운로드 권한이 없습니다"
                               forKey : NSLocalizedDescriptionKey];
                    
                    if ( self -> _delegateFpsMsg )
                    {
                      [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드 권한이 없습니다"];
                    }
                    [self showAlertOk:nil message:@"다운로드 권한이 없습니다"];
                    
                    [self->_activeDownloads removeObjectForKey : cid];
                    [self doNextDownload];
                    return ;
                  }
                  
                  FPSDownload *fpsDownload = self->_activeDownloads[cid];
                  
                   NSDictionary *downloadInfo = @{ @"uri"    : urlString,
                                                   @"cid"    : cid,
                                                   @"userId" : fpsDownload.clip.userId };
                   fpsDownload.downloadTask = [self prepareFPSDownloadTask : downloadInfo];
                   fpsDownload.clip.contentUrl = [NSURL URLWithString : urlString];
                  
                   if ( fpsDownload.downloadTask )
                   {
                     [fpsDownload.downloadTask resume];
                   }
                }
                else
                {
                  if ( error.code == -1009 )  // Internet Connection Error
                  {
                    ;
                  }
                  else  // 기타 오류
                  {
                  }
                  
                  NSLog(@"NSURLSessionDataTask Error : %ld - %@",(long)error.code, error.description);
                  [self showAlertOk:@"Network Error" message:[NSString stringWithFormat:@"code : %ld\n%@",(long)error.code, error.description]];
                  
                  [self->_activeDownloads removeObjectForKey : cid];
                  [self doNextDownload];
                }
              } ];
  
  return dataTask;
}


- (void) doNextDownload
{
  NSLog(@"  doNextDownload");
  
  if ( _activeDownloads.count >= self.maximumNumberOfThreads )
  {
    NSLog(@"  동시 다운로드 작업갯수 초과. 대기.");
    return ;
  }
  
  if ( self.numberOfItemsInWating == 0 )
  {
    NSLog(@"Nothing in Downloading Queue.(남아있는 작업 없음)");
    
    if ( _activeDownloads.count == 0 )  // 진행중인 다운로드도 없음.
    {
      NSLog(@"  모든 다운로드 완료.");

      [self showAlertOk:@"다운로드 완료" message:@"모든 다운로드가 완료되었습니다"];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"모든 다운로드 완료"];
      }
    }
    
    return;
  }
  
  NSLog(@"  큐에서 대기중인 작업 갯수 : %lu", (unsigned long) self.numberOfItemsInWating);
  
  // 새 작업 하나 시작
  FPSDownload *fpsDownload = [self->_downloadingQueue objectAtIndex : 0];
  [self->_downloadingQueue removeObjectAtIndex : 0];
  [fpsDownload.playDataTask resume];
  fpsDownload.isDownloading = true;
  [self->_activeDownloads setObject : fpsDownload
                             forKey : fpsDownload.clip.cid];    // 추후 contentId 로 딕셔너리를 조회.
}


- (void) removeDownloadedContent : (NSDictionary *) args
                      completion : (void (^) (NSError *error, NSMutableDictionary *result)) resultHandler
{
  NSMutableDictionary *details = [NSMutableDictionary dictionary];  // 에러에 대한 상세내용을 저장

  NSString *cid = args[@"cid"];
  
  // cid 에 해당하는 DB 레코드가 있을시 삭제(연결된 실제 파일도 삭제)
  
  if ( cid == nil || cid.length <= 0 ) {
    
    [details setValue : @"No cid"
               forKey : NSLocalizedDescriptionKey];
    
    if ( _delegateFpsMsg )
    {
      [_delegateFpsMsg fpsDownloadMsg : @"삭제할 콘텐츠 정보(cid)가 없습니다"];
    }
    
    resultHandler ([NSError errorWithDomain : @"args"
                                       code : 0
                                   userInfo : details], nil);
    
    return ;
  }
  
  NSMutableArray *clips = [[DatabaseManager sharedInstance] searchDownloadedContentsId : cid];
  
  if ( clips && clips.count > 0 )
  {
    NSLog(@"  %lu Contents are in DB searched by cid : %@", (unsigned long)clips.count, cid);
    // DB 레코드와 그 레코드에서 가리키고 있는 파일 삭제
    for ( Clip *clip in clips )
    {
      [[DatabaseManager sharedInstance] removeDownloadedContentsId : clip.cid]; // TODO : DB 삭제 실패했을 때의 처리
      
      if( ![self removeHlsFileAtPath : clip.contentPath] )  // 파일 삭제
      {
        NSLog(@"  %@ -> Failed to Remove.", clip.contentPath);
        continue;
      }
      
      NSLog(@"  %@ -> Removed.",clip.contentPath);
    }
  }
  else
  {
    NSLog(@"  No Contents in DB searched by cid : %@", cid);
  }
}


- (void) removeDownloadedContents : (NSArray *) items
                       completion : (void (^) (NSError *error, NSMutableDictionary *result)) resultHandler
{
  NSMutableDictionary *details = [NSMutableDictionary dictionary];  // 에러에 대한 상세내용을 저장
  
  for(NSDictionary *item in items)
  {
    NSString *cid = item[@"cid"];
    
    // cid 에 해당하는 DB 레코드가 있을시 삭제(연결된 실제 로컬 파일도 삭제)
    
    if ( cid == nil || cid.length <= 0 ) {
      
      [details setValue : @"No cid"
                 forKey : NSLocalizedDescriptionKey];
      
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"삭제할 콘텐츠 정보(cid)가 없습니다"];
      }
      
      resultHandler ([NSError errorWithDomain : @"args"
                                         code : 0
                                     userInfo : details], nil);
      
      continue ;
    }
    
    NSMutableArray *clips = [[DatabaseManager sharedInstance] searchDownloadedContentsId : cid];
    
    if ( clips && clips.count > 0 )
    {
      NSLog(@"  %lu Contents are in DB searched by cid : %@", (unsigned long)clips.count, cid);
      // DB 레코드와 그 레코드에서 가리키고 있는 파일 삭제
      for ( Clip *clip in clips )
      {
        [[DatabaseManager sharedInstance] removeDownloadedContentsId : clip.cid]; // TODO : DB 삭제 실패했을 때의 처리
        
        if( ![self removeHlsFileAtPath : clip.contentPath] )  // 파일 삭제
        {
          NSLog(@"  %@ -> Failed to Remove.", clip.contentPath);
          //continue; // File 이 없어서 삭제가 안된 경우도 성공 리턴은 해주도록 처리(그래야 화면을 갱신할 수가 있으므로).
        }else{
          NSLog(@"  %@ -> Removed.",clip.contentPath);
        }
        
        // 성공 리턴
        NSMutableDictionary *result = [[NSMutableDictionary alloc] initWithObjectsAndKeys:cid,@"cid", nil];
        resultHandler(nil, result);
      }
    }
    else
    {
      NSLog(@"  No Contents in DB searched by cid : %@", cid);
    }
  }
}


- (void) queueDownloadRequest : (NSDictionary *) args
                   completion : (void (^) (NSError *error, NSMutableDictionary *result)) resultHandler
{
    NSMutableDictionary *details = [NSMutableDictionary dictionary];  // 에러에 대한 상세내용을 저장
  
    NSString *cid = args[@"cid"];
    NSString *userId = args[@"userId"];
    NSString *token = args[@"token"];
  
    if ( !cid || cid.length <= 0 )
    {
        [details setValue : @"No cid"
                   forKey : NSLocalizedDescriptionKey];
      
        if ( _delegateFpsMsg )
        {
            [_delegateFpsMsg fpsDownloadMsg : @"콘텐츠 정보(cid)가 없습니다"];
        }
      
        resultHandler ([NSError errorWithDomain : @"args"
                                           code : 0
                                       userInfo : details], nil);
      
        return ;
    }
  
    if ( !userId || userId.length <= 0 )
    {
        [details setValue : @"No userId"
                   forKey : NSLocalizedDescriptionKey];
      
        if ( _delegateFpsMsg )
        {
            [_delegateFpsMsg fpsDownloadMsg : @"사용자 정보(User Id)가 없습니다"];
        }
      
        resultHandler ([NSError errorWithDomain : @"args"
                                           code : 0
                                       userInfo : details], nil);
      
        return ;
    }
  
    queryService = [[QueryService alloc] init]; // 2018.10.4
    [queryService getSearchWelaaaPlayDataResults : cid
                                       authToken : token
                                    queryResults : ^(NSDictionary *dicResult, NSString *errMsg)
    {
        NSLog(@"errMsg : %@", errMsg);
        NSLog(@"custom_data_v2 : %@", dicResult[@"custom_data_v2"]);
        NSLog(@"media_urls : %@", dicResult[@"media_urls"]);
        NSLog(@"permission : %@", dicResult[@"permission"]);
        NSLog(@"progress : %@", dicResult[@"progress"]);
    
        // 다운로드 경로 유무 체크
        NSString *urlString = dicResult[@"media_urls"][@"HLS"];
      
        if ( !urlString || [urlString length] <= 0 )
        {
            // React 로 에러메시지 전달
            NSLog(@"  No HLS Url!");
            [details setValue : @"다운로드 경로가 존재하지 않습니다"
                       forKey : NSLocalizedDescriptionKey];
            if ( self -> _delegateFpsMsg )
            {
                [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드 경로가 존재하지 않습니다"];
            }
          
            resultHandler ([NSError errorWithDomain : @"args"
                                               code : 0
                                           userInfo : details], nil);
          
            return ;
        }
    
        // 다운로드 권한 체크
        if ( !dicResult[@"permission"][@"can_play"] )
        {
            // React 로 에러메시지 전달
            NSLog(@"  No Permission to Play!");
            [details setValue : @"다운로드 권한이 없습니다"
                       forKey : NSLocalizedDescriptionKey];
          
            if ( self -> _delegateFpsMsg )
            {
                [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드 권한이 없습니다"];
            }
          
            resultHandler ([NSError errorWithDomain : @"permission"
                                               code : 0
                                           userInfo : details], nil);
          
            return ;
        }
    
        // 이미 기존 DB 에 동일 cid 컨텐츠가 있는 경우 날려버리고 새로 받는다.
        // DB 삭제 , 파일 삭제(DB 에 들어있는 단계까지 갔다면 이미 파일 다운로드가 완료된 상태까지 갔다는 것이므로)
    
        // 일단 중복 확인 및 삭제하는 코드는 넣어놓고 필요시 로직 수정.
        NSMutableArray *clips = [[DatabaseManager sharedInstance] searchDownloadedContentsId : cid];
      
        if ( clips && clips.count > 0 )
        {
            NSLog(@"  %lu Contents already in DB searched by cid : %@", (unsigned long)clips.count, cid);
          
            // DB 레코드와 그 레코드에서 가리키고 있는 파일 삭제
            // ㄴ'이미 다운로드된 항목입니다. 다시 받으시겠습니까?' 등의 처리 방법도 고려.
            for ( Clip *clip in clips )
            {
                [[DatabaseManager sharedInstance] removeDownloadedContentsId : clip.cid];   // TODO : DB 삭제 실패 처리
              
                if( ![self removeHlsFileAtPath : clip.contentPath] )
                {
                  NSLog(@"  %@ -> Failed to Remove.", clip.contentPath);
                  continue;
                }
              
                NSLog(@"  %@ -> Removed.",clip.contentPath);
            }
        }
        else
        {
            NSLog(@"  No Same Contents in DB searched by cid : %@", cid);
        }
      
        __block NSUInteger indexFound = NSNotFound;
        // 다운로드 경로 중복체크(대기큐에 이미 있는지)
        [self -> _downloadingQueue enumerateObjectsUsingBlock : ^(id obj, NSUInteger idx, BOOL *stop)
                                                                {
                                                                    FPSDownload *r = obj;
                                                                  
                                                                    if ( [cid isEqualToString : r.clip.cid] )
                                                                    {
                                                                        *stop = YES;
                                                                        indexFound = idx;
                                                                    
                                                                        return ;
                                                                    }
                                                                }];
      
        if ( indexFound != NSNotFound )
        {
            NSLog(@"  Already in Downloading Queue!");
            [details setValue : @"다운로드 대기중입니다"
                       forKey : NSLocalizedDescriptionKey];
          
            if ( self -> _delegateFpsMsg )
            {
                [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드 대기중입니다"];
            }
          
            resultHandler ([NSError errorWithDomain : @"downloading"
                                               code : 0
                                           userInfo : details], nil);
          
            return ;
        }
      
        // TODO : 현재 다운로드중 리스트에 있는지?
        if ( [self -> _activeDownloads objectForKey : cid] )
        {
            NSLog(@"Already in Active Downloads!");
            [details setValue : @"이미 다운로드 중입니다"
                       forKey : NSLocalizedDescriptionKey];
          
            if ( self -> _delegateFpsMsg )
            {
                [self -> _delegateFpsMsg fpsDownloadMsg : @"이미 다운로드 중입니다"];
            }
          
            resultHandler ([NSError errorWithDomain : @"downloading"
                                               code : 0
                                           userInfo : details], nil);
          
            return ;
        }
      
        FPSDownload *fpsDownload = [[FPSDownload alloc] initWithClip : [self getClipInfo:args]];
        NSDictionary *downloadInfo = @{
                                          @"uri"    : urlString,
                                          @"cid"    : cid,
                                          @"userId" : userId    };
        fpsDownload.downloadTask = [self prepareFPSDownloadTask : downloadInfo];
        fpsDownload.clip.contentUrl = [NSURL URLWithString : urlString];
      
        if ( fpsDownload.downloadTask )
        {
            [self -> _downloadingQueue addObject : fpsDownload];
        }
      
        [self launchNextDownload];
      
        // Download Request Success(네트워크 요청 직전 단계까지 성공한 상태)
        if ( self -> _delegateFpsMsg )
        {
            [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드를 시작합니다"];
        }
      
        resultHandler (nil, nil);
    }];
}


- (Clip *) getClipInfo:(NSDictionary *)args
{
  return [self getClipInfo:args fromContentsInfo:_contentsInfo];
}


- (Clip *) getClipInfo:(NSDictionary *)args fromContentsInfo:(NSDictionary *)contentsInfo
{
  Clip *clip = [[Clip alloc] init];
  
  clip.gTitle = contentsInfo[@"data"][@"title"];
  clip.audioVideoType = contentsInfo[@"type"];
  clip.drmLicenseUrl = @"drmUrl";
  clip.drmSchemeUuid = @"fairplay";
  clip.cPlayTime = @""; // 아래에서 개별 클립 정보를 통해 다시 구한다.
  clip.cPlaySeconds = 0; // 아래에서 개별 클립 정보를 통해 다시 구한다. -> 0 일 경우 다운로드 안받는다.
  clip.groupImg = @"";
  clip.oid = @"";
  clip.thumbnailImg = contentsInfo[@"data"][@"images"][@"list"];
  clip.userId = args[@"userId"];
  clip.groupkey = contentsInfo[@"data"][@"cid"];
  clip.groupAllPlayTime = contentsInfo[@"data"][@"play_time"];
  clip.groupContentScnt = contentsInfo[@"data"][@"clip_count"];
  clip.view_limitdate = contentsInfo[@"permission"][@"expire_at"];
  clip.ckey = args[@"cid"];
  clip.contentPath = @""; // 다운로드 완료 후에 결정되는 로컬경로.
  clip.totalSize = @"";
  // data.teacher가 NSDictionary인지 확인 -> null이면 '작가미상'으로 처리.
  if ( [contentsInfo[@"data"][@"teacher"] isKindOfClass : [NSDictionary class]] ) // teacher dictionary가 null이 아니면..
      clip.groupTeacherName = contentsInfo[@"data"][@"teacher"][@"name"];
  else
      clip.groupTeacherName = @"미상";

  clip.cTitle = @"";  // 아래에서 개별 클립 정보를 통해 다시 구한다.
  clip.cid = args[@"cid"];
  
  NSArray *clipsList = nil; // 개별 클립(혹은 오디오북 챕터) 정보
  
  if ([clip.audioVideoType isEqualToString:@"video-course"]) {
    clipsList = contentsInfo[@"data"][@"clips"]; // 개별 클립(혹은 오디오북 챕터) 정보
  }else if([clip.audioVideoType isEqualToString:@"audiobook"]){
    clipsList = contentsInfo[@"data"][@"chapters"]; // 개별 클립(혹은 오디오북 챕터) 정보
  }
  
  for (NSDictionary *eachClip in clipsList){
    if([eachClip[@"cid"] isEqualToString:clip.cid]){
      clip.cTitle = eachClip[@"title"];
      clip.cPlayTime = eachClip[@"play_time"];
      clip.cPlaySeconds = eachClip[@"play_seconds"];  // -> 0 일 경우 다운로드 안받는다.
    }
  }
  
  return clip;
}


- (void) clearQueue
{
  NSLog(@"  clearQueue");
  
  // 대기중인 다운로드 작업이 있다면 취소하고 리셋(진행중인 다운로드 작업은 계속해서 진행)
  [self -> _downloadingQueue enumerateObjectsUsingBlock : ^(id _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop)
   {
     FPSDownload *r = obj;
     if(r.playDataTask){
       //[r.playDataTask cancel]; // 작업 취소가 필요한 경우
     }
     if(r.downloadTask){
       //[r.downloadTask cancel]; // 작업 취소가 필요한 경우
     }
   }];
  
  [self -> _downloadingQueue removeAllObjects];
}


- (NSUInteger) numberOfItemsInWating  // 다운로드 대기중인 작업갯수 리턴.
{
  return self->_downloadingQueue? self->_downloadingQueue.count : 0;
}


- (NSUInteger) numberOfItemsInActive  // 다운로드 진행중인 작업갯수 리턴.
{
  return self->_activeDownloads? self->_activeDownloads.count : 0;
}


- (void) launchNextDownload
{
    NSLog(@"  launchNextDownload");
  
    if ( _activeDownloads.count >= self.maximumNumberOfThreads )
    {
        NSLog(@"  동시 다운로드 작업갯수 초과. 대기.");
      
        return ;
    }
  
    if ( self.numberOfItemsInWating == 0 )
    {
        NSLog(@"Nothing in Downloading Queue.(남아있는 작업 없음)");
      
        if ( _activeDownloads.count == 0 )
        {
            NSLog(@"  모든 다운로드 완료.");
          
            [self showAlertOk:@"다운로드 완료" message:@"모든 다운로드가 완료되었습니다"];
        
            if ( _delegateFpsMsg )
            {
                [_delegateFpsMsg fpsDownloadMsg : @"다운로드 완료"];
            }
      }
      
      return;
    }
  
    NSLog(@"  큐에서 다운로드 대기중인 작업 갯수 : %lu", (unsigned long) self.numberOfItemsInWating);
  
    // 새 작업 하나 시작
    FPSDownload *fpsDownload = [self -> _downloadingQueue objectAtIndex : 0];
    [self -> _downloadingQueue removeObjectAtIndex : 0];
    [fpsDownload.downloadTask resume];
    fpsDownload.isDownloading = true;
    [self -> _activeDownloads setObject : fpsDownload
                                 forKey : fpsDownload.clip.cid];    // 다운로드후 contentId 로 컨텐츠를 조회하기 때문에.
}


// 전달받은 hlsFilePath 에서 hls 고유폴더와 파일이름을 잘라내서 정확한 삭제경로를 새로 구해서 처리
// 예) com.apple.UserManagedAssets.jtB6U2/v100015_005_2796BB4F50ADAA4C.movpkg 로 잘라내서 앞에 라이브러리 전체 경로를 붙임.
- (BOOL) removeHlsFileAtPath : (NSString *) hlsFilePath
{
    if ( hlsFilePath == nil || [hlsFilePath pathComponents].count < 2 )
    {
        NSLog(@"  Invalid hlsFilePath Error!");
        return false;
    }
  
    NSString *libraryPath = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex : 0];
    NSString *hlsUniqFolderName = [[hlsFilePath stringByDeletingLastPathComponent] lastPathComponent];
    NSString *hlsUniqFileName = [hlsFilePath lastPathComponent];
    NSString *hlsFileFullPath = [NSString stringWithFormat : @"%@/%@/%@",libraryPath,hlsUniqFolderName,hlsUniqFileName];
  
    NSLog(@"  hlsFileFullPath : %@", hlsFileFullPath);
  
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error = nil;
    [fileManager removeItemAtPath : hlsFileFullPath
                            error : &error];
    if ( error )
    {
        NSLog(@"  %@ -> Remove error.description : %@", hlsFileFullPath, error.description);
        return false;
    }
  
    NSLog(@"  %@ -> Removed.", hlsFileFullPath);
  
    return true;
}


// 다운로드 콘텐츠 DB 와 실제 파일간의 동기화.
// 로컬에 저장된 파일과 DB 를 비교해서 유효하지 않은 파일 및 DB 레코드 삭제.
// 다운로드 콘텐츠 페이지 진입시 호출.
// 화면이 resume 될 때에도 리액트 네이티브 단에서 호출하는것 고려.
- (void) synchronizeLocalFilesWithDB
{
    NSLog(@"  synchronizeLocalFilesWithDB");
  
    // 현재 다운로드 중인 파일인데 삭제되어버리면 안되므로 아래의 처리 추가. 2018.10.29
    // ㄴ다운로드 중에 다운로드 콘텐츠 화면 진입시 에러 발생하는 문제 있었다. #364 issue
    // -> 다운로드 중인 상황에서는 동기화 처리 하지 않음.
    /* 진행중인 작업갯수가 0보다 크거나 대기중인 작업갯수가 0보다 크다면 */
    if ( [self numberOfItemsInActive] > 0 || [self numberOfItemsInWating] > 0 )
    {
        return;
    }
  
    // 로컬에 저장된 콘텐츠 파일(동영상 파일 경로)과 연결된 DB 레코드가 있는지 확인해보고 없으면 삭제(트랙킹이 안되는 파일이므로).
    // Asset 폴더 경로부터 비교. 예) com.apple.UserManagedAssets.jtB6U2/v100015_005_2796BB4F50ADAA4C.movpkg
    NSError *error = nil;
    NSString *libraryPath = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSArray *hlsContentsPaths = [self loadLibraryContentsAs : @"com.apple.UserManagedAssets."];
  
    for ( NSString *hlsDirName in hlsContentsPaths )
    {
        NSLog(@"  hlsDirName : %@", hlsDirName);   // ex) com.apple.UserManagedAssets.jtB6U2
        NSString *hlsPath = [libraryPath stringByAppendingPathComponent : hlsDirName];
        NSArray *hlsFiles = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:hlsPath error:&error];
      
        for ( NSString *fileName in hlsFiles )
        {
            NSString *contentFullPath = [NSString stringWithFormat : @"%@/%@", hlsPath, fileName];
            NSLog(@"  HLS contentFullPath : %@", contentFullPath);
          
            // 경로를 줄여서 저장 -> Library/ 부터.
            NSString *contentPath = [self getPathFromLibraryDir : contentFullPath];
            NSLog(@"  HLS contentPath : %@", contentPath);
        
            NSMutableArray *searchResults = [[DatabaseManager sharedInstance] searchDownloadedContentsPath : contentPath];
          
            if ( searchResults != nil && searchResults.count > 0 )
            {
                // DB 와 연결되어 있는 파일
                Clip *searchedClip = searchResults[0];
                NSLog(@"  This File(%@) is connected with cid %@", contentPath, searchedClip.cid);
            }
            else
            {
                // DB 에 기록이 없는 파일 -> 삭제
                NSLog(@"  No DB Record -> remove this file : %@", contentPath);
                [self removeHlsFileAtPath : contentPath];
            }
        }
    }
  
    // DB 레코드에 있는 로컬파일이 실제로 존재하지 않거나 재생불가능한 파일일 경우 해당 DB 레코드 삭제
    NSMutableArray *allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsAll];
  
    for ( NSDictionary *record in allRecords )
    {
        NSString *localFilePath = record[@"contentPath"];
        NSString *cid = record[@"cid"];
      
        if ( cid == nil )
        {
            continue;
        }
      
        if ( localFilePath && localFilePath.length > 0 )
        {
            if ( [self isPlayableOfflineAsset : localFilePath] )
            {
                // 재생가능한 파일
            }
            else
            {
                // 재생불가능 파일(파일없음 혹은 파일오류 등)
                [[DatabaseManager sharedInstance] removeDownloadedContentsId : cid];
            }
        }
        else
        {
            [[DatabaseManager sharedInstance] removeDownloadedContentsId:cid];
        }
    }
}


// 라이브러리 폴더 안에 특정 문자열 패턴이 포함된 이름의 디렉토리나 파일이 있으면 리턴해준다(동영상 저장 경로를 찾기 위해 사용).
- (NSArray *) loadLibraryContentsAs : (NSString *) folderPrefixPattern
{
    NSMutableArray *filteredContents = [[NSMutableArray alloc] init];
  
    NSError *error = nil;
    NSString *libraryPath = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSArray *libraryContents = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:libraryPath error:&error];
  
    if ( error )
    {
        NSLog(@"  error.description : %@", error.description);
        return nil;
    }
  
    for ( NSString *strFileName in libraryContents )
    {
        NSLog(@"  file(or dir) name --> %@", strFileName);
        if ( [strFileName hasPrefix : folderPrefixPattern] )
        {
            [filteredContents addObject : strFileName];
        }
    }
  
    return filteredContents;
}

// 재생가능한 파일인지 확인.
- (BOOL) isPlayableOfflineAsset : (NSString *) contentFullPath
{
    NSLog(@"  HLS contentFullPath : %@", contentFullPath);
  
    NSString *assetPath = [self getPathFromLibraryDir : contentFullPath];
    NSLog(@"  HLS assetPath : %@", assetPath);
  
    NSURL *baseURL = [NSURL fileURLWithPath : NSHomeDirectory()];
    NSString *assetURL = [[baseURL absoluteString] stringByAppendingPathComponent : assetPath];
    NSLog(@"  assetURL absoluteString : %@", assetURL);
  
    AVURLAsset *asset = [AVURLAsset assetWithURL : [NSURL URLWithString : assetURL]];
    AVAssetCache *cache = asset.assetCache;
  
    if ( cache && [cache isPlayableOffline] )
    {
        NSLog(@"  isPlayableOfflineAsset true");
        return YES;
    }
    else
    {
        NSLog(@"  isPlayableOfflineAsset false");
        return NO;
    }
}


// 전체 경로에서 Library 부터 파일이름까지만 잘라서 리턴.
- (NSString *)getPathFromLibraryDir:(NSString *)contentFullPath
{
  NSString* resultPath = @"";
  
  NSString* fileName = [contentFullPath lastPathComponent];
  NSString* hlsUniqFolderName = [[contentFullPath stringByDeletingLastPathComponent] lastPathComponent];
  NSString* libraryFolderName = [[[contentFullPath stringByDeletingLastPathComponent] stringByDeletingLastPathComponent] lastPathComponent];
  resultPath = [NSString stringWithFormat:@"%@/%@/%@",libraryFolderName,hlsUniqFolderName,fileName];
  NSLog(@"  getPathFromLibraryDir -> resultPath : %@", resultPath);
  
  return resultPath;
}


#pragma mark - FPS License implementaions

- (void) fpsLicenseDidSuccessAcquiringWithContentId : (NSString * _Nonnull) contentId
{
    NSLog(@"  fpsLicenseDidSuccessAcquiringWithContentId : %@", contentId);
    // 라이센스 인증 성공.
}


- (void) fpsLicenseWithContentId : (NSString * _Nonnull) contentId
                didFailWithError : (NSError * _Nonnull) error
{
    NSLog(@"  fpsLicenseWithContentId. Error Message : %@", error.localizedDescription);
    // TODO : 라이센스 인증 실패시엔 다운로드 시작을 안하고 에러 메시지를 콜백(델리게이트 등)으로 리턴하는 방안.
  
    [_activeDownloads removeObjectForKey : contentId];
    [self doNextDownload];
}


#pragma mark - FPS Download implementaions

- (void) downloadContent : (NSString * _Nonnull) contentId
  didFinishDownloadingTo : (NSURL * _Nonnull) location
{
    NSLog(@"  download contentId : %@, location : %@",contentId, location.absoluteString);
  
    // 다운로드 성공시 이후의 처리(데이터베이스와 동기화 등)를 하고 다음 다운로드 시작
  
    FPSDownload *fpsDownload = nil;
    @try {
        fpsDownload = [_activeDownloads objectForKey : contentId];
        [_activeDownloads removeObjectForKey : contentId];
      
        if ([fpsDownload.clip.cid isEqualToString:contentId]) {
          NSLog(@"  Downloaded contentId and cid are same. Good to go.");
        }else{
          NSLog(@"  Downloaded contentId and cid are different! Need for check.");
        }
      
        fpsDownload.clip.contentPath = location.path;
      
        Clip *aClip = fpsDownload.clip;
        NSDictionary *downloadedContent = [[NSDictionary alloc] initWithObjectsAndKeys:aClip.cid,@"cid" \
                                           ,aClip.cTitle,@"cTitle" \
                                           ,aClip.contentPath,@"contentPath" \
                                           ,aClip.groupkey,@"groupkey"  \
                                           ,aClip.ckey,@"ckey"             \
                                           ,aClip.userId,@"userId"    \
                                           ,aClip.drmSchemeUuid,@"drmSchemeUuid"  \
                                           ,aClip.drmLicenseUrl,@"drmLicenseUrl"   \
                                           ,aClip.oid,@"oid"   \
                                           ,aClip.totalSize,@"totalSize"    \
                                           ,aClip.gTitle,@"gTitle"    \
                                           ,aClip.groupImg,@"groupImg"    \
                                           ,aClip.thumbnailImg,@"thumbnailImg"   \
                                           ,aClip.audioVideoType,@"audioVideoType"  \
                                           ,aClip.groupTeacherName,@"groupTeacherName" \
                                           ,aClip.cPlayTime,@"cPlayTime"    \
                                           ,aClip.groupContentScnt,@"groupContentScnt" \
                                           ,aClip.groupAllPlayTime,@"groupAllPlayTime" \
                                           ,aClip.view_limitdate,@"view_limitdate"  \
                                           , nil];
        // TODO : 중복체크 방안
        [[DatabaseManager sharedInstance] saveDownloadedContent : downloadedContent]; // SQLite 를 통해 저장(welaaa.db)
        fpsDownload.clip.downloaded = true;
      
        [self doNextDownload];
      
        if ( _delegateFpsDownload )
        {
          [_delegateFpsDownload downloadContent : contentId
                         didFinishDownloadingTo : location];
        }
      
        if (_downloadCompletion) {
          _downloadCompletion(nil, [downloadedContent mutableCopy]);
        }
    }
    @catch (NSException *exception) {
        NSLog(@"  %@", exception.reason);
        return ;
    }
    @finally {}
}


- (void) downloadContent : (NSString * _Nonnull) contentId
                 didLoad : (CMTimeRange) timeRange
   totalTimeRangesLoaded : (NSArray<NSValue *> * _Nonnull) loadedTimeRanges
 timeRangeExpectedToLoad : (CMTimeRange) timeRangeExpectedToLoad
{
    // 다운로드 진행된 percentage 를 계산해서 출력
    double percentComplete = 0.0;

    for ( NSValue *value in loadedTimeRanges )
    {
        CMTimeRange loadedTimeRange = value.CMTimeRangeValue;
        percentComplete += CMTimeGetSeconds(loadedTimeRange.duration) / CMTimeGetSeconds(timeRangeExpectedToLoad.duration);
    }
  
    FPSDownload *download = nil;
    @try {
        download = [_activeDownloads objectForKey : contentId];
    }
    @catch (NSException *exception) {
        NSLog(@"  %@", exception.reason);
        return;
    }
    @finally {}
  
    if ( download )
    {
        download.progress = percentComplete;
        NSLog(@"  activeDownload contentId : %@ ( %f )", contentId, percentComplete * 100.0);
    }
    else
    {
        download.progress = 0.0;
    }
  
    // TODO : 다운로드 진행 상황을 보여주는 곳의 UI 를 여기서 업데이트 해준다(프로그레스바 등). 그럴려면 프로그레스바의 UI 주소를 미리 받아둬야 한다.
    // 델리게이트 방식 등으로.
  
    if ( _delegateFpsDownload )
    {
        [_delegateFpsDownload downloadContent : contentId
                                      didLoad : timeRange
                        totalTimeRangesLoaded : loadedTimeRanges
                      timeRangeExpectedToLoad : timeRangeExpectedToLoad];
    }
}


- (void)  downloadContent : (NSString * _Nonnull) contentId
didStartDownloadWithAsset : (AVURLAsset * _Nonnull) asset
      subtitleDisplayName : (NSString * _Nonnull) subtitleDisplayName
{
    NSLog(@"  contentId : %@", contentId);
    NSLog(@"  didStartDownloadWithAsset : %@", asset.URL.absoluteString);
    NSLog(@"  subtitleDisplayName : %@", subtitleDisplayName);
  
    if ( _delegateFpsDownload )
    {
        [_delegateFpsDownload downloadContent : contentId
                    didStartDownloadWithAsset : asset
                          subtitleDisplayName : subtitleDisplayName];
    }
}


- (void) downloadContent : (NSString * _Nonnull) contentId
        didStopWithError : (NSError * _Nullable) error
{
    NSLog(@"  download contentId : %@, error code : %ld", contentId, error.code);
    // TODO : 다운로드 실패시엔 다운로드 시작을 안하고 에러 메시지를 콜백(델리게이트 등)으로 리턴하고 다음 다운로드 진행.
    // 진행되던 다운로드가 취소될 때 발생할 수 있으므로 사용자에겐 노출하지 않음. 2018.11.7.
    //[self showAlertOk:@"Download Error" message:[NSString stringWithFormat:@"contentId : %@\nerror : %@", contentId, error.description]];
  
    if ( _delegateFpsDownload )
    {
        [_delegateFpsDownload downloadContent : contentId
                             didStopWithError : error];
    }
  
    [_activeDownloads removeObjectForKey : contentId];
    [self doNextDownload];
}


#pragma mark - Notifications 각종 알림 관련
- (void) showToast : (NSString *) text
{
    [[UIApplication sharedApplication].keyWindow makeToast : text];
}

- (void) showAlertOk : (NSString *) title
             message : (NSString *) msg
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle : title
                                                                   message : msg
                                                            preferredStyle : UIAlertControllerStyleAlert];
  
    UIAlertAction *ok = [UIAlertAction actionWithTitle : @"확인"
                                                 style : UIAlertActionStyleDefault
                                               handler : ^(UIAlertAction *action)
                                                         {
                                                             [alert dismissViewControllerAnimated:YES completion:nil];
                                                         }];
  
    [alert addAction : ok];
  
    // root뷰컨트롤러를 덮고 있는 뷰가 있으면 그위에 팝업을 띄우기 위해 아래와 같이 처리. 무조건 rootViewController에 띄우면 안뜨는 경우 있으므로. 2018.11.7.
    UIViewController *frontViewController = [[UIApplication sharedApplication].keyWindow.rootViewController presentedViewController];
    if ( !frontViewController )
    {
        frontViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    }
  
    [frontViewController presentViewController : alert
                                      animated : YES
                                    completion : nil];
}

@end
