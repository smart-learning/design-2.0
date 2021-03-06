
#import "ApiManager.h"

@interface ApiManager ()
{
    NSInteger _networkStatus;
}

@end

@implementation ApiManager

#pragma mark - Lifecycle

+ (ApiManager *) sharedInstance
{
    static ApiManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
#if DEBUG
        NSURL *baseURL = [NSURL URLWithString: TEST_DOMAIN];
#else
        NSURL *baseURL = [NSURL URLWithString: BASE_DOMAIN];
#endif
        sharedInstance = [[ApiManager alloc] initWithBaseURL: baseURL];
    });

    return sharedInstance;
}

- (instancetype) initWithBaseURL: (NSURL *) url
{
    self = [super initWithBaseURL: url];
    
    if ( self )
    {
        [self.reachabilityManager startMonitoring];

        [AFNetworkActivityIndicatorManager sharedManager].enabled = YES;

        self.requestSerializer = [AFJSONRequestSerializer serializer];
        [self.requestSerializer setValue : @"gzip"
                      forHTTPHeaderField : @"Accept-Encoding"];

        self.responseSerializer = [AFJSONResponseSerializer serializer];

        self.responseSerializer.acceptableContentTypes = [ NSSet setWithObjects : @"application/json", @"application/xml", @"application/x-javascript",
                                                                                  @"text/html", @"text/javascript", @"text/xml", @"text/plain", nil   ];
    }

    return self;
}

#pragma mark - Property

- (BOOL) canNetworking
{
    return self.reachabilityManager.networkReachabilityStatus;
}

- (BOOL) isConnectionWifi
{
    return _networkStatus == AFNetworkReachabilityStatusReachableViaWiFi;
}

- (BOOL) isConnectionCellular
{
    return _networkStatus == AFNetworkReachabilityStatusReachableViaWWAN;
}

// 오프라인 체크
- (BOOL) isConnectedToInternet
{
    NSString *URLString = [NSString stringWithContentsOfURL : [NSURL URLWithString : @"https://welaaa.com/"]
                                                   encoding : NSUTF8StringEncoding
                                                      error : nil];
    
    return ( URLString != NULL ) ? YES : NO;
}

#pragma mark - Common Methods

- (BOOL) isCancelledRequest : (NSError *) error
{
    return ( ([error code] == -999) ? YES : NO );
}

- (NSString *) urlWithParams : (NSDictionary *) params
                         url : (NSString *) url
{
    if ( params.count == 0 )
    {
        return url;
    }
    
    if ( nullStr(url) )
    {
        return @"";
    }
    
    NSString *urlString = [NSString stringWithString : url];
    
    for ( NSString *key in params.allKeys )
    {
        NSString *value = params[key];
        
        if ( -1 == [urlString indexOf : @"?"] )
        {
            urlString = [urlString stringByAppendingString : @"?"];
        }
        else
        {
            urlString = [urlString stringByAppendingString : @"&"];
        }
        
        urlString = [urlString stringByAppendingFormat : @"%@=", key];
        
        if ( !nullStr(value) )
        {
            urlString = [urlString stringByAppendingString : [value escape]];
        }
    }
    
    return urlString;
}

#pragma mark - Public Methods

- (void) requestWithUrl : (NSString *) url
                 method : (NSString *) method
                  param : (NSDictionary *) param
              onSuccess : (kDictionaryCompleteBlock) onSuccess
              onFailure : (kErrorBlock) onFailure
{
    if ( ![url.lowercaseString hasPrefix : @"http://"] && ![url.lowercaseString hasPrefix : @"https://"] )
    {
#if DEBUG
        url = [NSString stringWithFormat : @"http://%@%@", TEST_DOMAIN, url];
#else
        url = [NSString stringWithFormat : @"http://%@%@", BASE_DOMAIN, url];
#endif
    }
    
    if ( [@"GET" isEqualToString : [method uppercaseString]] )
    {
        NSString *requestUrl = [self urlWithParams : param
                                               url : url];
      
        [self GET : requestUrl
       parameters : nil
         progress : ^(NSProgress * _Nonnull downloadProgress)
                     {
                         // ignores?
                     }
          success : ^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject)
                     {
                         NSDictionary *jsonDict = (NSDictionary *) responseObject;
             
                         // nil check && status code
                         if ( jsonDict == nil && onFailure )
                         {
                             NSError *error = [NSError localizedErrorCode : ApiManagerErrorCodeResponseNil
                                                           andDescription : @"responseObject nil"];
                             onFailure(error);
                             
                             return ;
                         }
                         
                         if ( onSuccess )
                         {
                             onSuccess(jsonDict);
                         }
                     }
          failure : ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error)
                     {
                         if ( [self isCancelledRequest : error] == NO && onFailure )
                         {
                             onFailure(error);
                         }
                     }];
    }
    else if ( [@"POST" isEqualToString : [method uppercaseString]] )
    {
        [self POST : url
        parameters : param
          progress : ^(NSProgress * _Nonnull uploadProgress)
                     {
                         // ignores?
                     }
           success : ^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject)
                     {
                         // EUC-KR로 명시적으로 encoding
                         NSDictionary *jsonDict = (NSDictionary *) responseObject;
                         
                         // nil check && status code
                         if ( jsonDict == nil && onFailure )
                         {
                             NSError *error = [NSError localizedErrorCode : ApiManagerErrorCodeResponseNil
                                                           andDescription : @"responseObject nil"];
                             onFailure(error);
                             
                             return ;
                         }
                         
                         if ( onSuccess )
                         {
                             onSuccess(jsonDict);
                         }
                     }
           failure : ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error)
                     {
                         if ( [self isCancelledRequest : error] == NO && onFailure )
                         {
                             onFailure(error);
                         }
                     }];
    }
}

- (NSURLSessionDataTask *) downloadWithUrl : (NSString *) url
                                    params : (NSDictionary *) params
                            uploadProgress : (void (^)(NSProgress *uploadProgress)) uploadProgress
                          downloadProgress : (void (^)(NSProgress *downloadProgress)) downloadProgress
                                   success : (kDictionaryCompleteBlock) onSuccess
                                   failure : (kErrorBlock) onFailure;
{

    NSURLSessionDataTask *sessionDataTask = nil;
    NSString *requestUrl = [self urlWithParams : params
                                           url : url];
    
    NSLog(@"    [sessionDataTask] requestUrl : %@\n", requestUrl);

    sessionDataTask = [self GET: requestUrl
                     parameters: params
                       progress: downloadProgress
                        success: ^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject)
                               {
                                   // EUC-KR로 명시적으로 encoding
                                   NSDictionary *jsonDict = (NSDictionary *)responseObject;
                                   
                                   // nil check && status code
                                   if ( jsonDict == nil && onFailure )
                                   {
                                       NSError *error = [NSError localizedErrorCode: ApiManagerErrorCodeResponseNil
                                                                     andDescription: @"responseObject nil"];
                                       onFailure(error);
                                       
                                       return ;
                                   }
                                   
                                   if ( onSuccess )
                                   {
                                       onSuccess(jsonDict);
                                   }
                               }
                        failure: ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error)
                               {
                                   if ( [self isCancelledRequest: error] == NO && onFailure )
                                   {
                                       onFailure(error);
                                   }
                               }];
    
    return sessionDataTask;
}

+ (NSData *) sendSynchronousRequest : (NSURLRequest *) request
                  returningResponse : (NSURLResponse **) response
                              error : (NSError **) error
{
    NSError __block *err = NULL;
    NSData __block *data;
    BOOL __block reqProcessed = false;
    NSURLResponse __block *resp;
  
    [[[NSURLSession sharedSession] dataTaskWithRequest : request
                                     completionHandler : ^(NSData * _Nullable _data, NSURLResponse * _Nullable _response, NSError * _Nullable _error)
                                                         {
                                                            resp = _response;
                                                            err = _error;
                                                            data = _data;
                                                            reqProcessed = true;
                                                         }
                                                         ] resume];
  
    while ( !reqProcessed )
    {
        [NSThread sleepForTimeInterval : 0];
    }
  
    *response = resp;
    *error = err;
  
    return data;
}

- (void) setReachabilityStatusChangeBlock: (void (^)(NSInteger status)) block
{
    [[AFNetworkReachabilityManager sharedManager] setReachabilityStatusChangeBlock: ^(AFNetworkReachabilityStatus status)
    {
        self->_networkStatus = status;
        
        if ( block )
        {
            block(status);
        }
    }];
    
    [[AFNetworkReachabilityManager sharedManager] startMonitoring];
}

# pragma mark - Transmitting with the Playback API server.
//
// group_ID로 콘텐츠 정보를 가져옵니다.
//
+ (NSDictionary *) getContentsInfoWithCgid : (NSString *) contentGroupID
                             andHeaderInfo : (NSString *) authValue
{
    NSString *apiContentsInfo = @"/api/v1.0/play/contents-info/"; // dev -> ?
    NSString *urlWithParams = [NSString stringWithFormat : @"%@%@%@", API_HOST, apiContentsInfo, contentGroupID];//b300200 와 같은 group_ID
    NSURL *url = [NSURL URLWithString : urlWithParams];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL : url];
    NSString *headerValue = [@"Bearer " stringByAppendingString : authValue];
  
    [request setHTTPMethod : @"GET"];
    // 테스트를 목적으로 권한정보를 강제로 fix하였습니다.
    [request            setValue : headerValue
              forHTTPHeaderField : @"authorization"];
  
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [ApiManager sendSynchronousRequest : request
                                    returningResponse : &resp
                                                error : &error];
  
    NSString *jsonData = [[NSString alloc] initWithData : data
                                               encoding : NSUTF8StringEncoding];
  
    NSDictionary *contentsInfoDics = [NSJSONSerialization JSONObjectWithData : [jsonData dataUsingEncoding : NSUTF8StringEncoding]
                                                                     options : NSJSONReadingAllowFragments
                                                                       error : &error];
  
    return contentsInfoDics;
}

//
// Content_ID로 콘텐츠 재생에 필요한 데이터를 가져옵니다.
//
+ (NSDictionary *) getPlayDataWithCid : (NSString *) contentID
                        andHeaderInfo : (NSString *) authValue
{
    NSString *apiPlayData = @"/api/v1.0/play/play-data/"; // dev -> ?
    NSString *urlWithParams = [NSString stringWithFormat : @"%@%@%@", API_HOST, apiPlayData, contentID];//b300200_001 와 같은 content_ID
    NSURL *url = [NSURL URLWithString : urlWithParams];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL : url];
    NSString *headerValue = [@"Bearer " stringByAppendingString : authValue];
  
    [request setHTTPMethod : @"GET"];
    // 테스트를 목적으로 권한정보를 강제로 fix하였습니다.
    [request            setValue : headerValue
              forHTTPHeaderField : @"authorization"];
  
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [ApiManager sendSynchronousRequest : request
                                    returningResponse : &resp
                                                error : &error];
  
    NSString *jsonData = [[NSString alloc] initWithData : data
                                               encoding : NSUTF8StringEncoding];
  
    NSDictionary *playDataDics = [NSJSONSerialization JSONObjectWithData : [jsonData dataUsingEncoding : NSUTF8StringEncoding]
                                                                 options : NSJSONReadingAllowFragments
                                                                   error : &error];
  
    return playDataDics;
}

//
// 진도 데이터를 전송합니다.
// parameters : header auth, cid, action, start, end, 다운로드파일인지의 여부 (6개.)
//
+ (void) sendPlaybackProgressWith : (NSString *) cid
                           action : (NSString *) action
                      startSecond : (unsigned short) start
                        endSecond : (unsigned short) end
                         duration : (unsigned short) duration
                        netStatus : (NSString *) netStatus
                        authToken : (NSString *) authValue
{
    // Dealing with parameters...
    NSLog(@"  [sendPlaybackProgressWith] loaded properly.....");
    NSString *apiProgress = @"/api/v1.0/play/progress"; // dev -> ?
    NSString *urlStr = [NSString stringWithFormat : @"%@%@", API_HOST, apiProgress];
    NSURL *url = [NSURL URLWithString : urlStr];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL : url];
    NSString *headerValue = [@"Bearer " stringByAppendingString : authValue];
  
    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request addValue:@"application/json" forHTTPHeaderField:@"Accept"];
  
    [request setHTTPMethod : @"POST"];
    // 테스트를 목적으로 권한정보를 강제로 fix하였습니다.
    [request            setValue : headerValue
              forHTTPHeaderField : @"authorization"];
  
    NSError *error;
    NSURLResponse *resp = nil;
  
    NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
    [dictionary setObject:cid                                     forKey:@"cid"];
    [dictionary setObject:@"iphone"                               forKey:@"platform"];
    [dictionary setObject:action                                  forKey:@"action"];
    [dictionary setObject:[NSNumber numberWithDouble : start]     forKey:@"start"];
    [dictionary setObject:[NSNumber numberWithDouble : end]       forKey:@"end"];
    [dictionary setObject:[NSNumber numberWithDouble : duration]  forKey:@"duration"];
    [dictionary setObject:netStatus                               forKey:@"net_status"];
    [dictionary setObject:cid                                     forKey:@"error"];
  /*
    dictionary = [@{@"cid"        : cid,
                    @"platform"   : @"iphone",
                    @"action"     : action,     // START / ING / END / FORWARD / BACK
                    @"start"      : [NSNumber numberWithDouble : start],         // msec
                    @"end"        : [NSNumber numberWithDouble : end],         // msec
                    @"duration"   : [NSNumber numberWithDouble : duration],         // end - start = msec
                    @"net_status" : netStatus,  // "DOWNLOAD" / "Wi-Fi" / "LTE/3G"
                    @"error"      : @"NO_ERROR"} mutableCopy];
  */
    NSLog(@"  [sendPlaybackProgressWith] dictionary = %@", dictionary);
    NSData *postData = [NSJSONSerialization dataWithJSONObject : dictionary
                                                       options : 0
                                                         error : &error];
    [request setHTTPBody : postData];
  
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [ApiManager sendSynchronousRequest : request
                                    returningResponse : &resp
                                                error : &error];
  
    NSString *jsonData = [[NSString alloc] initWithData : data
                                               encoding : NSUTF8StringEncoding];
  
    NSDictionary *playDataDics = [NSJSONSerialization JSONObjectWithData : [jsonData dataUsingEncoding : NSUTF8StringEncoding]
                                                                 options : NSJSONReadingAllowFragments
                                                                   error : &error];
  
    NSLog(@"  [sendPlaybackProgress] result : %@", playDataDics);
  
    return ;
}

//
// 자막 데이터를 가져옵니다.
//
+ (NSArray *) getSubtitles : (NSString *) contentID
{
    if ( [contentID hasPrefix : @"b"] )
        return @[];
  
    NSString *subtitlesUrl = [NSString stringWithFormat : @"https://api-dev.welaaa.com/api/v1.0/play/contents-smi/%@", contentID];
  
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL : [NSURL URLWithString : [NSString stringWithFormat : @"%@", subtitlesUrl]]];
    [request setHTTPMethod : @"GET"];
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [ApiManager sendSynchronousRequest : request
                                    returningResponse : &resp
                                                error : &error];
  
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) resp;
    // 일부 영상 콘텐츠는 자막이 없습니다.
    if ( httpResponse.statusCode == 404 )
    {
        return @[];
    }
  
    NSString *jsonDataStr = [[NSString alloc] initWithData : data
                                                  encoding : NSUTF8StringEncoding];
  
    NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData : [jsonDataStr dataUsingEncoding : NSUTF8StringEncoding]
                                                                 options : NSJSONReadingAllowFragments
                                                                   error : &error];
  
    NSArray *array = [jsonResponse mutableCopy];
  
    // documents 디렉토리의 경로를 가져옵니다.
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    // 파일 경로를 만듭니다.
    NSString *fileName = [contentID stringByAppendingString : @"_subtitles.plist"];
    NSString *filePath = [documentsDirectory stringByAppendingPathComponent : fileName];
  
    BOOL status = [array writeToFile:filePath atomically:YES];
    NSLog(@"  [+getSubtitles:] subtitles saved? : %@", status? @"Success" : @"Failed");
  
    return array;
}

//
// 업데이트 관련 데이터를 가져옵니다.
//
+ (NSDictionary *) getUpdateData
{
    NSString *apiPlatformVersion = @"/api/v1.0/platform/versions/ios";
    NSString *urlStr = [NSString stringWithFormat : @"%@%@", API_HOST, apiPlatformVersion];
    NSURL *url = [NSURL URLWithString : urlStr];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL : url];
  
    [request setHTTPMethod : @"GET"];
  
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [ApiManager sendSynchronousRequest : request
                                    returningResponse : &resp
                                                error : &error];
  
    NSString *jsonData = [[NSString alloc] initWithData : data
                                               encoding : NSUTF8StringEncoding];
  
    NSDictionary *updateDataDics = [NSJSONSerialization JSONObjectWithData : [jsonData dataUsingEncoding : NSUTF8StringEncoding]
                                                                   options : NSJSONReadingAllowFragments
                                                                     error : &error];
  
    return updateDataDics;
}
@end







