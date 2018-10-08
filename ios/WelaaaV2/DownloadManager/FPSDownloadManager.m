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
                                      downloadDelegate : self ];    //  id<PallyConFPSDownloadDelegate> downloadDelegate
    [downloadTask resume];
}


- (void) startDownload : (NSDictionary *) item
            completion : (void (^) (NSError *error, NSMutableDictionary *result)) resultHandler
{
    [self queueDownloadRequest : item
                    completion : resultHandler];
}


- (void) startDownloadContents : (NSArray *) items
                    completion : (void (^) (NSError *error, NSMutableDictionary *result)) resultHandler
{
  NSMutableDictionary *details = [NSMutableDictionary dictionary];  // 에러에 대한 상세내용을 저장
  
  [self clearQueue];
  
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
    
    // 기존 DB 에 동일 cid 의 콘텐츠가 이미 있는 경우 삭제하고 새로 받는다.
    // (혹은, '이미 다운로드된 항목입니다. 다시 받으시겠습니까?'->아니요의 경우 전체 다운로드 취소 등의 시나리오 등도 고려)
    // DB 레코드 삭제하고 로컬에 저장된 파일도 삭제한다.(DB 에 들어있는 단계까지 갔다면 이미 파일 다운로드가 완료된 상태까지 갔다는 것이므로)
    
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
  
  [self doNextDownload];  // 다운로드 작업 시작 요청
  
  // Download Request Success(네트워크 요청 직전 단계까지 성공한 상태)
  if ( self -> _delegateFpsMsg )
  {
    NSLog(@"  다운로드를 시작합니다");
    [self -> _delegateFpsMsg fpsDownloadMsg : @"다운로드를 시작합니다"];
  }
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
  
  NSString *apiPlayData = @"/dev/api/v1.0/play/play-data/";
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
                    
                    [_activeDownloads removeObjectForKey : cid];
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
                    
                    [_activeDownloads removeObjectForKey : cid];
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
                    
                    [_activeDownloads removeObjectForKey : cid];
                    [self doNextDownload];
                    return ;
                  }
                  
                  FPSDownload *fpsDownload = _activeDownloads[cid];
                  
                   NSDictionary *downloadInfo = @{ @"uri"    : urlString,
                                                   @"cid"    : cid,
                                                   @"userId" : fpsDownload.clip.userId };
                   fpsDownload.downloadTask = [self prepareFPSDownloadTask : downloadInfo];
                   fpsDownload.clip.contentUrl = [NSURL URLWithString : urlString];
                  
                   if ( fpsDownload.downloadTask )
                   {
                     [fpsDownload.downloadTask resume];
                     /*
                     dispatch_async(dispatch_get_main_queue(), ^{
                       [fpsDownload.downloadTask resume];
                     });
                      */
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
                  
                  [_activeDownloads removeObjectForKey : cid];
                  [self doNextDownload];
                }
                
                //completion(self->dic, self->errorMessage);
                /*
                 dispatch_async(dispatch_get_main_queue(), ^{
                 // 메인스레드(UI Thread)에서 실행해야 할 때는 이 블럭 사용.
                 completion(self->items, self->errorMessage);
                 });
                 */
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
      // noti -> 다운로드 완료.
      if ( _delegateFpsMsg )
      {
        [_delegateFpsMsg fpsDownloadMsg : @"다운로드 완료"];
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
  Clip *clip = [[Clip alloc] init];
  
  clip.gTitle = _contentsInfo[@"data"][@"title"];
  clip.audioVideoType = _contentsInfo[@"type"];
  clip.drmLicenseUrl = @"drmUrl";
  clip.drmSchemeUuid = @"fairplay";
  clip.cPlayTime = @""; // 아래에서 개별 클립 정보를 통해 다시 구한다.
  clip.cPlaySeconds = @""; // 아래에서 개별 클립 정보를 통해 다시 구한다. -> 0 일 경우 다운로드 안받는다.
  clip.groupImg = @"";
  clip.oid = @"";
  clip.thumbnailImg = _contentsInfo[@"data"][@"images"][@"list"];
  clip.userId = args[@"userId"];
  clip.groupkey = _contentsInfo[@"data"][@"cid"];
  clip.groupAllPlayTime = _contentsInfo[@"data"][@"play_time"];
  clip.groupContentScnt = _contentsInfo[@"data"][@"clip_count"];
  clip.view_limitdate = _contentsInfo[@"permission"][@"expire_at"];
  clip.ckey = args[@"cid"];
  clip.contentPath = @""; // 다운로드 완료 후에 결정되는 로컬경로.
  clip.totalSize = @"";
  clip.groupTeacherName = _contentsInfo[@"data"][@"teacher"][@"name"];
  clip.cTitle = @"";  // 아래에서 개별 클립 정보를 통해 다시 구한다.
  clip.cid = args[@"cid"];
  
  NSArray *clipsList = nil; // 개별 클립(혹은 오디오북 챕터) 정보
  
  if ([clip.audioVideoType isEqualToString:@"video-course"]) {
    clipsList = _contentsInfo[@"data"][@"clips"]; // 개별 클립(혹은 오디오북 챕터) 정보
  }else if([clip.audioVideoType isEqualToString:@"audiobook"]){
    clipsList = _contentsInfo[@"data"][@"chapters"]; // 개별 클립(혹은 오디오북 챕터) 정보
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
  
  // 할당되어 있거나 진행중인 네트워크 리퀘스트가 있다면 모두 취소하고 큐에서 삭제.
  
  [self -> _downloadingQueue enumerateObjectsUsingBlock : ^(id _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop)
   {
     FPSDownload *r = obj;
     if(r.playDataTask){
       [r.playDataTask cancel];
     }
     if(r.downloadTask){
       [r.downloadTask cancel];
     }
   }];
  
  [self -> _activeDownloads enumerateKeysAndObjectsUsingBlock:^(id _Nonnull key, id _Nonnull obj, BOOL * _Nonnull stop)
   {
     FPSDownload *r = obj;
     if(r.playDataTask){
       [r.playDataTask cancel];
     }
     if(r.downloadTask){
       [r.downloadTask cancel];
     }
   }];
  
  [self -> _downloadingQueue removeAllObjects];
  [self -> _activeDownloads removeAllObjects];
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
            // noti -> 다운로드
        
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
  
    if ( _delegateFpsDownload )
    {
        [_delegateFpsDownload downloadContent : contentId
                       didFinishDownloadingTo : location];
    }
    // 콜백에 먼저 처리할 수 있게 해주고 그 다음에 데이터를 갱신한다.(현재 다운로드중 목록에서 제거 등).
  
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
    }
    @catch (NSException *exception) {
        NSLog(@"  %@", exception.reason);
        return ;
    }
    @finally {}
  
    //[self launchNextDownload];  // 다음 작업 진행.
    [self doNextDownload];
}


- (void) downloadContent : (NSString * _Nonnull) contentId
                 didLoad : (CMTimeRange) timeRange
   totalTimeRangesLoaded : (NSArray<NSValue *> * _Nonnull) loadedTimeRanges
 timeRangeExpectedToLoad : (CMTimeRange) timeRangeExpectedToLoad
{
  // NSLog(@"  download contentId : %@ -> timeRange.start : %f", contentId, CMTimeGetSeconds(timeRange.start));
  // 진행된 percent 로 출력하도록 수정 2018.10.7
  
  double percentComplete = 0.0;
  for(NSValue* value in loadedTimeRanges){
    CMTimeRange loadedTimeRange = value.CMTimeRangeValue;
    percentComplete += CMTimeGetSeconds(loadedTimeRange.duration) / CMTimeGetSeconds(timeRangeExpectedToLoad.duration);
  }
  
  FPSDownload* download = nil;
  @try {
    download = [_activeDownloads objectForKey:contentId];
  }
  @catch (NSException *exception) {
    NSLog(@"%@", exception.reason);
    return;
  }
  @finally {}
  
  if (download) {
    download.progress = percentComplete;
    NSLog(@"  activeDownload contentId : %@ ( %f )", contentId, percentComplete * 100.0);
  }else{
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
    NSLog(@"  download contentId : %@, error code : %ld", contentId, [error code]);
    // TODO : 다운로드 실패시엔 다운로드 시작을 안하고 에러 메시지를 콜백(델리게이트 등)으로 리턴하고 다음 다운로드 진행.
    if ( _delegateFpsDownload )
    {
        [_delegateFpsDownload downloadContent : contentId
                             didStopWithError : error];
    }
  
    //[self launchNextDownload];
  
    [_activeDownloads removeObjectForKey : contentId];
    [self doNextDownload];
}

@end














