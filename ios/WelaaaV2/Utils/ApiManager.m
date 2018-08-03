
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
#if APPSTORE | ADHOC
        NSURL *baseURL = [NSURL URLWithString: BASE_DOMAIN];
#else
        NSURL *baseURL = [NSURL URLWithString: TEST_DOMAIN];
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
    NSString *URLString = [NSString stringWithContentsOfURL : [NSURL URLWithString : @"http://welaaa.co.kr"]
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
#if APPSTORE | ADHOC
        url = [NSString stringWithFormat : @"http://%@%@", BASE_DOMAIN, url];
#else
        url = [NSString stringWithFormat : @"http://%@%@", TEST_DOMAIN, url];
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
           success: ^(NSURLSessionDataTask * _Nonnull task, id _Nullable responseObject)
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
           failure: ^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error)
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

- (void) setReachabilityStatusChangeBlock: (void (^)(NSInteger status)) block
{
    [[AFNetworkReachabilityManager sharedManager] setReachabilityStatusChangeBlock: ^(AFNetworkReachabilityStatus status)
    {
        _networkStatus = status;
        
        if ( block )
        {
            block(status);
        }
    }];
    
    [[AFNetworkReachabilityManager sharedManager] startMonitoring];
}


@end







