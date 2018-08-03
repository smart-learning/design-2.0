
#import "DownloadManager.h"

#import "AppDelegate.h"
//#import "HomeViewController.h"

@interface DownloadManager () <NSURLSessionDelegate, NSURLSessionDataDelegate, NSURLSessionTaskDelegate>
{
    NSMutableArray *_groupContentArray;
    NSMutableArray *_downloadList;
    
    NSMutableArray *_findCKeyArray;
    NSMutableArray *_findContentArray;
    
  //AquaDownloadInfo *_downloadInfo;
    
    NSURLSession * _downloadSession;
    NSURLSessionDataTask *_dataTask;
    
    BOOL _isDownloading;
    BOOL _isFindingContent;
}

@end

@implementation DownloadManager

+ (DownloadManager *) sharedInstance
{
    static DownloadManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[DownloadManager alloc] init];
    });
    
    return sharedInstance;
}

- (instancetype) init
{
    if ( self = [super init] )
    {
        _groupContentArray = [[NSMutableArray alloc] init];
        _downloadList = [[NSMutableArray alloc] init];
        _findCKeyArray = [[NSMutableArray alloc] init];
        _findContentArray = [[NSMutableArray alloc] init];
    }
    
    return self;
}

- (void) showToast: (NSString *) text
{
  /*
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    HomeViewController *controller = (HomeViewController *)app.navigationController.viewControllers.firstObject;
    
    if ( [controller respondsToSelector: @selector(showToast:)] )
    {
        [controller showToast: text];
    }
  */
}

- (BOOL) checkProvider
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    param[@"customer_id"] = @"influential";
    param[@"user_id"] = @"influential";
    param[@"masterkey"] = @"veloc";
    
  //return [_downloadInfo initProviderInfoWithDictionary: param];
    return true;
}

- (NSArray *) getDownloadList
{
    return _downloadList.count == 0 ? nil : [_downloadList mutableCopy];
}

- (void) readyForDownloadWithGroupKey: (NSString *) groupkey
{
    if ( nullStr(groupkey) )
        return;
    
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    param[@"groupkey"] = groupkey;
    
    [[ApiManager sharedInstance] requestWithUrl: @"/usingapp/contentsinfo.php"
                                         method: @"GET"
                                          param: param
                                      onSuccess: ^(NSDictionary *object)
                                                 {
                                                     if ( ![[DbManager sharedInstance] hasAudioGroupItemWithGroupKey: groupkey] )
                                                     {
                                                         [[DbManager sharedInstance] insertAudioGroupItem: object
                                                                                                 groupKey: groupkey];
                                                     }
                                                     
                                                     [self setReadyObject: object
                                                                 groupKey: groupkey];
                                                 }
                                      onFailure: ^(NSError *error)
                                                 {
                                                     [_groupContentArray removeAllObjects];
                                                 }];
}

- (void) setReadyObject: (NSDictionary *) object
               groupKey: (NSString *) groupKey
{
    NSString *teachername = object[@"group_teachername"];
    NSString *groupTitle = object[@"group_title"];
    NSString *groupImage = object[@"group_image"];

    NSArray *contentsinfo = object[@"contentsinfo"];
    
    if ( [contentsinfo isKindOfClass: [NSArray class]] && contentsinfo.count > 0 )
    {
        [_groupContentArray removeAllObjects];
        
        for ( NSDictionary *item in contentsinfo )
        {
            NSMutableDictionary *tItem = [item mutableCopy];
            tItem[@"group_teachername"] = teachername;
            tItem[@"group_title"] = groupTitle;
            tItem[@"group_image"] = groupImage;
            tItem[@"groupkey"] = groupKey;
            
            [_groupContentArray addObject: tItem];
        }
    }
    else
    {
        [_groupContentArray removeAllObjects];
    }
}

#pragma mark - 비디오 콘텐츠 다운로드 리스트 만들기 (여러개의 다운로드)
- (void) findDownloadInfomationFromCkeys: (NSArray *) ckeys
{
    if ( ![ckeys isKindOfClass: [NSArray class]] || ckeys.count == 0 )
    {
        return ;
    }
    
    
    for ( NSInteger i=0; i<ckeys.count; i++ )
    {
        BOOL hasCkey = NO;
        
        NSString *ckey = ckeys[i];
        
        for ( NSInteger j=0; j<_findCKeyArray.count; j++ )
        {
            NSString *tCkey = _findCKeyArray[j];
            
            if ( [ckey isEqualToString: tCkey] )
            {
                hasCkey = YES;
                break;
            }
        }
        
        if ( !hasCkey )
        {
            [_findCKeyArray addObject: ckey];
        }
    }

    if ( !_isFindingContent && _findCKeyArray.count > 0 )
    {
        [_findContentArray removeAllObjects];
        _isFindingContent = YES;
 
        [self startFindDownloadItem];
    }
}

- (void) startFindDownloadItem
{
    if ( _findCKeyArray.count == 0 )
    {
        _isFindingContent = NO;
        return ;
    }
    
    NSString *ckey = _findCKeyArray[0];
    [self requestContentsEachAuthorWithCKey: ckey
                                  onSuccess: ^(NSDictionary *object)
                                             {
                                                 NSDictionary *data = object[@"data"];
                                                 
                                                 if ( !data )
                                                 {
                                                     return [self nextFindDownloadItem];
                                                 }
                                                 
                                                 BOOL author = [data[@"view_author"] boolValue];
                                                 
                                                 if ( !author )
                                                 {
                                                     return [self nextFindDownloadItem];
                                                 }
                                                 
                                                 NSDictionary *cInfo = object[@"info"];
                                                 
                                                 if ( !cInfo )
                                                 {
                                                     return [self nextFindDownloadItem];
                                                 }
                                                 
                                                 NSMutableDictionary *contentObject = [NSMutableDictionary dictionary];
                                                 
                                                 contentObject[@"con_class"] = cInfo[@"con_class"] ? cInfo[@"con_class"] : cInfo[@"ccon_class"];
                                                 contentObject[@"ckey"] = cInfo[@"ckey"];
                                                 contentObject[@"cmemo"] = cInfo[@"cmemo"];
                                                 contentObject[@"cname"] = cInfo[@"cname"];
                                                 contentObject[@"cplay_time"] = cInfo[@"cplay_time"];
                                                 contentObject[@"curl"] = cInfo[@"curl"];
                                                 contentObject[@"group_teachername"] = cInfo[@"teachername"];
                                                 contentObject[@"group_title"] = cInfo[@"grouptitle"];
                                                 contentObject[@"groupkey"] = cInfo[@"groupkey"];
                                                 contentObject[@"group_image"] = cInfo[@"pbackimg"];
                                                 
                                                 [_findContentArray addObject: contentObject];
                                                 
                                                 [self nextFindDownloadItem];
                                             }
                                  onFailure: ^(NSError *error)
                                             {
                                                 [self nextFindDownloadItem];
                                             }
     ];
}

- (void) nextFindDownloadItem
{
    if ( _findCKeyArray.count > 0 )
    {
        [_findCKeyArray removeObjectAtIndex: 0];
    }
    
    if ( _findCKeyArray.count == 0 )
    {
        //다운로드 시작
        if ( _findContentArray.count != 0 )
        {
            [_groupContentArray removeAllObjects];
            [_groupContentArray addObjectsFromArray: _findContentArray];
            
            [self insertDownloadWithContentKey: @"all"];
        }
        
        _isFindingContent = NO;
        
        return ;
    }
    
    [self startFindDownloadItem];
}

- (void) requestContentsEachAuthorWithCKey: (NSString *) cKey
                                 onSuccess: (kDictionaryCompleteBlock) onSuccess
                                 onFailure: (kErrorBlock) onFailure
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    param[@"ckey"] = cKey;
    param[@"down"] = @"ok";
    
    [[ApiManager sharedInstance] requestWithUrl: @"/usingapp/contents_each_author.php"
                                         method: @"GET"
                                          param: param
                                      onSuccess: ^(NSDictionary *object)
                                                 {
                                                     if ( onSuccess )
                                                     {
                                                         onSuccess(object);
                                                     }
                                                 }
                                      onFailure: ^(NSError *error)
                                                 {
                                                     if ( onFailure )
                                                     {
                                                         onFailure(error);
                                                     }
                                                 }
     ];
}


#pragma mark - 다운로드 유효성 확인
- (BOOL) checkCurrentDownloadingWithGkey: (NSString *) gkey
                                    ckey: (NSString *) ckey
{
    if ( !_isDownloading )
        return NO;

    if ( _downloadList.count == 0 )
        return NO;

    NSString *tGkey = _downloadList[0][@"groupkey"];
    NSString *tCkey = _downloadList[0][@"ckey"];

    if ( [tGkey isEqualToString:gkey] && [tCkey isEqualToString:ckey] )
    {
        return YES;
    }
    
    return NO;
}

- (BOOL) checkHasDownloadingWithGkey: (NSString *) gkey
                                ckey: (NSString *) ckey
{
    if ( !_isDownloading )
        return NO;
    
    if ( _downloadList.count == 0 )
        return NO;
    
    for ( NSInteger i=0; i<_downloadList.count; i++ )
    {
        NSString *tGkey = _downloadList[i][@"groupkey"];
        NSString *tCkey = _downloadList[i][@"ckey"];

        if ( [tGkey isEqualToString: gkey] && [tCkey isEqualToString: ckey] )
        {
            return YES;
        }
    }
    
    return NO;
}

- (BOOL) hasContentWithCKey: (NSString *) ckey
           showToastMessage: (BOOL) showToastMessage
{
    // DB에 있는지 확인
    if ( [[DbManager sharedInstance] hasContentWithCKey: ckey] )
    {
        if ( showToastMessage )
        {
            [self showToast: @"이미 다운로드된 항목입니다."];
        }
        
        return YES;
    }
    
    //다운로드 리스트에 있는지 확인
    BOOL hasItem = NO;
    
    for ( NSInteger i = 0; i<_downloadList.count; i++ )
    {
        NSDictionary *item = _downloadList[i];
        NSString *tCkey = item[@"ckey"];
        
        if ( [tCkey isEqualToString: ckey] )
        {
            hasItem = YES;
            break;
        }
    }
    
    if ( hasItem )
    {
        if ( showToastMessage )
        {
            [self showToast: @"다운로드 대기중입니다."];
        }
    }
    
    return hasItem;
}

- (void) insertDownloadWithContentKey: (NSString *) cKey;
{
    NSString *wifiDown = [[NSUserDefaults standardUserDefaults] objectForKey: @"wifiDown"];
    
    if ( [@"on" isEqualToString: wifiDown] && ![[ApiManager sharedInstance] isConnectionWifi] )
    {
      /*
        AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
        [app showAlertWithTitle: @"확인"
                        message: @"LTE/3G로 연결되어 있습니다. 사용자 설정에 따라 Wi-fi에서만 다운로드가 가능합니다."
              cancelButtonTitle: @"닫 기"
         destructiveButtonTitle: nil
              otherButtonTitles: @[ @"설정 변경" ]
                       tapBlock: ^(UIAlertController * _Nonnull controller, UIAlertAction * _Nonnull action, NSInteger buttonIndex)
                                 {
                                     if ( controller.cancelButtonIndex != buttonIndex )
                                     {
                                         AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
                                         HomeViewController *controller = (HomeViewController *)app.navigationController.viewControllers.firstObject;
                                         
                                         if ( [controller respondsToSelector:@selector(openSetupController)] )
                                         {
                                             [controller openSetupController];
                                         }
                                     }
                                 }];
        */
        return ;
    }
    
    if ( _groupContentArray.count <= 0 )
    {
        if ( [self.delegate respondsToSelector: @selector(downloadManager:alertMessage:)] )
        {
            [self.delegate downloadManager: self
                              alertMessage: @"다운로드를 실행할 수 없습니다. 잠시 후 다시 시도해 주세요."];
        }
        
        return ;
    }
    
    // 이미 등록된 파일 혹은 대기중인지 확인하고,
    if ( [@"all" isEqualToString: cKey] )
    {
        NSInteger haveCount = 0;
        NSInteger contentListCount = 0;
        
        for ( NSInteger i=0; i<_groupContentArray.count; i++ )
        {
            NSDictionary *groupContent = _groupContentArray[i];
            NSString *tCKey = groupContent[@"ckey"];
            NSString *curl = groupContent[@"curl"];
            
            // mp4 파일이 없는 항목을 걸러냄
            if ( !nullStr(curl) && [[curl lowercaseString] hasSuffix: @".mp4"] )
            {
                contentListCount++;
            }

            if ( [self hasContentWithCKey: tCKey showToastMessage: NO] )
            {
                haveCount++;
            }
        }
        
        if ( haveCount == contentListCount )
        {
            [self showToast: @"모든 항목이 다운로드 되었거나, 대기중입니다."];
            
            return ;
        }
    }
    else
    {
        if ( [self hasContentWithCKey: cKey showToastMessage: YES] )
        {
            return ;
        }
    }
    
    // 이상없으면 등록한다. (디비에도 저장한다.)
    NSInteger addDownloadListCount = 0;
    
    for ( NSInteger i=0; i<_groupContentArray.count; i++ )
    {
        NSDictionary *groupContent = _groupContentArray[i];
        NSString *tCKey = groupContent[@"ckey"];
        
        if ( [cKey isEqualToString:tCKey] || [@"all" isEqualToString:cKey] )
        {
            if ( [self hasContentWithCKey: tCKey showToastMessage: NO] )
            {
                continue ;
            }
            
            // mp4 파일이 없는 항목을 걸러냄
            NSString *curl = groupContent[@"curl"];
            
            if ( !(!nullStr(curl) && [[curl lowercaseString] hasSuffix: @".mp4"]) )
            {
                continue ;
            }
            
            NSMutableDictionary *object = [NSMutableDictionary dictionary];
            object[@"ckey"] = tCKey;
            object[@"con_class"] = groupContent[@"con_class"] ? groupContent[@"con_class"] : groupContent[@"ccon_class"];
            object[@"cmemo"] = groupContent[@"cmemo"];
            object[@"cname"] = groupContent[@"cname"];
            object[@"cplay_time"] = groupContent[@"cplay_time"];
            object[@"curl"] = groupContent[@"curl"];
            object[@"group_teachername"] = groupContent[@"group_teachername"];
            object[@"group_title"] = groupContent[@"group_title"];
            object[@"groupkey"] = groupContent[@"groupkey"];
            object[@"group_image"] = groupContent[@"group_image"];
            
            //DB관리를 위한 다운로드 리스트 등록
            [_downloadList addObject: object];
            
            addDownloadListCount++;
        }
    }
    
    if ( addDownloadListCount == 0 )
    {
        [self showToast: @"다운로드가 가능한 항목이 없습니다."];
        
        return ;
    }
    
    // 저장완료 후 다운로드 실행 (실행 중이 아닐 경우)
    if ( !_isDownloading && _downloadList.count > 0 )
    {
        _isDownloading = YES;
        [self runDownload];
        
        [self showToast:@"다운로드를 시작합니다."];
    }
    else
    {
        [self showToast: @"다운로드 리스트에 추가되었습니다."];
        [self sendNotificationWithCkey: cKey
                                status: @"ready"];
    }
}

- (void) runDownload
{
    if ( _downloadList.count <= 0 )
    {
        _isDownloading = NO;
        
        return ;
    }
    /*
    if ( _downloadInfo )
    {
        _downloadInfo = nil;
    }
    
    _downloadInfo = [[AquaDownloadInfo alloc] init];
    
    if ( _downloadInfo )
    {
        BOOL isProvider = [self checkProvider];
        
        if ( !isProvider )
        {
            _isDownloading = NO;
            _downloadInfo = nil;
            NSLog(@"프로바이더 - 리턴!");
            
            return ;
        }
    }
    else
    {
        _isDownloading = NO;
        _downloadInfo = nil;
        NSLog(@"downloadInfo Error - 리턴!");
        
        return ;
    }
    
    _downloadSession = nil;
    _dataTask = nil;

    //Aqua SDK 다운로드 리스트 등록
    NSString *groupkey = _downloadList[0][@"groupkey"];
    NSString *ckey = _downloadList[0][@"ckey"];
    NSString *url = _downloadList[0][@"curl"];
    
    [self sendNotificationWithCkey: ckey
                            status: @"start"];
    
    NSString *path = [NSString stringWithFormat: @"/Apple/%@/%@", groupkey, ckey];

    [_downloadInfo addDownloadUrlWithUrl: url
                                     cid: [NSString stringWithFormat: @"%@_%@", groupkey, ckey]
                                    path: path
                             subtitleUrl: nil];
    
    NSMutableURLRequest *request = [_downloadInfo getDownloadRequestWithIndex: 0
                                                                  redirectUrl: nil];
    
    NSLog(@"donwload request URL[0] : %@\n", request.URL.absoluteString);
    
    [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible: YES];
    NSURLSessionConfiguration *sessionConfiguration = [NSURLSessionConfiguration defaultSessionConfiguration];
    _downloadSession = [NSURLSession sessionWithConfiguration: sessionConfiguration
                                                     delegate: self
                                                delegateQueue: [NSOperationQueue mainQueue]];
    _dataTask = [_downloadSession dataTaskWithRequest: request];
    [_dataTask resume];
  */
}

#pragma mark -
#pragma mark ----------------------- NSURLSession Request -----------------------
- (void)        URLSession: (NSURLSession *) session
                      task: (NSURLSessionTask *) task
willPerformHTTPRedirection: (NSHTTPURLResponse *) response
                newRequest: (NSURLRequest *) request
         completionHandler: (void (^)(NSURLRequest * __nullable)) completionHandler
{
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) response;
    int statusCode = (int) [httpResponse statusCode];
    
    // http statuscodes between 300 & 400 is a redirect ...
    if ( httpResponse && statusCode >= 300 && statusCode < 400 )
    {
        if ( [httpResponse statusCode] == 302 )
        {
            NSLog(@"statusCode 302");
            //[self redirectedDownloadFile:[request.URL absoluteString]];
        }
    }
    //else // original url request
}

- (void)  URLSession: (NSURLSession *) session
                task: (NSURLSessionTask *) task
didCompleteWithError: (nullable NSError *) error
{
  /*
    [[UIApplication sharedApplication] setNetworkActivityIndicatorVisible: NO];
    
    if ( error != nil && _downloadSession == session )
    {
        if ( error.code == -1005 )
        {
            NSLog(@"The network connection was lost.");
        }
        else
        {
            NSLog(@"The network connection was fail.");
        }
        
        [_downloadInfo deleteSessionWithIndex: 0];
    }
    else if ( error == nil && _downloadSession == session )
    {
        NSLog(@"Download Done!!");
        [_downloadInfo endDownloadWithIndex: 0];
        
        //DB정보 저장
        NSMutableDictionary *saveItem = [_downloadList[0] mutableCopy];
        saveItem[@"path"] = [_downloadInfo getMediaFilePathWithIndex: 0];

        NSString *con_class = [common forceStringValue: saveItem[@"con_class"]];
        
        if ( 1 == [con_class integerValue] )
        {
            if ( ![[DbManager sharedInstance] hasVideoGroupItemWithGroupKey: saveItem[@"groupkey"]] )
            {
                [[DbManager sharedInstance] insertVideoGroupItem: saveItem
                                                        groupKey: saveItem[@"groupkey"]];
            }
        }
        
        [[DbManager sharedInstance] insertItem: saveItem];
        
        [self sendNotificationWithCkey: saveItem[@"ckey"]
                                status: @"end"];
        
        if ( self.delegate )
        {
            if ( [self.delegate respondsToSelector: @selector(downloadManager:finishDownloadWithGroupKey:ckey:path:)] )
            {
                [self.delegate downloadManager: self
                    finishDownloadWithGroupKey: saveItem[@"groupkey"]
                                          ckey: saveItem[@"ckey"]
                                          path: saveItem[@"path"]];
            }
        }
        
        [_downloadList removeObjectAtIndex: 0];
        
        if ( [_downloadList count] <= 0 )
        {
            _isDownloading = NO;
            
            NSArray *dbitems = [[DbManager sharedInstance] getDownloadContents];
            NSLog(@"getDownload contents ====== \n%@", dbitems);
            
            [self showToast: @"다운로드가 완료되었습니다."];
        }
        else
        {
            [self performSelector: @selector(runDownload)
                       withObject: nil
                       afterDelay: 0.5f];
        }
    }
  */
}

- (void) URLSession: (NSURLSession *) session
           dataTask: (NSURLSessionDataTask *) dataTask
     didReceiveData: (NSData *) data
{
  /*
    //[_downloadInfo setDownloadUrlsWithData:data];
    
    // ----------- receive media data
    if ( session == _downloadSession )
    {
        long lDownloadedSize = [_downloadInfo writeMediaFileWithIndex: 0 data: data];
        
        if ( lDownloadedSize > 0 )
        {
            NSLog(@"Download %ld Kbytes", lDownloadedSize/1000);
        }
    }
  */
}

- (void) URLSession: (NSURLSession *) session
           dataTask: (NSURLSessionDataTask *) dataTask
 didReceiveResponse: (NSURLResponse *) response
  completionHandler: (void (^)(NSURLSessionResponseDisposition disposition)) completionHandler
{
    long long size = [response expectedContentLength];
    /*
    if ( _downloadSession == session )
    {
        if ( size > 0 )
        {
            [_downloadInfo saveFileSizeWithIndex: 0
                                            size: size];
        }
    }
    */
    completionHandler(NSURLSessionResponseAllow);
}

- (NSDate *) getDoubleUTCDate
{
    NSDate *sourceDate = [NSDate date];
    NSTimeZone *sourceTimeZone = [NSTimeZone timeZoneWithName: @"UTC"];
    NSTimeZone *destinationTimeZone =  [NSTimeZone systemTimeZone];
    NSInteger sourceGMTOffset = [sourceTimeZone secondsFromGMTForDate: sourceDate];
    NSInteger destinationGMTOffset = [destinationTimeZone secondsFromGMTForDate: sourceDate];
    NSTimeInterval interval =  sourceGMTOffset - destinationGMTOffset;
    NSDate *destinationDate = [[NSDate alloc] initWithTimeInterval: interval
                                                         sinceDate: sourceDate];
    
    return destinationDate;
}

- (NSString *) getStartDate
{
    // ** currentCalendar 가 UTC 를 KST 기준으로 날짜를 바꿔서 리턴 한다.
    // ** 일단 UTC와 KST의 시간차를 한번 더 빼준후 currentCalendar 하여 정상적인 UTC 날짜를 만든다.
    NSDateComponents *components = [[NSCalendar currentCalendar] components: NSCalendarUnitSecond | NSCalendarUnitMinute
                                                                             | NSCalendarUnitHour | NSCalendarUnitDay
                                                                             | NSCalendarUnitMonth | NSCalendarUnitYear
                                                                   fromDate: [self getDoubleUTCDate]];
    
    return [NSString stringWithFormat: @"%04ld%02ld%02ld%02ld%02ld%02ld", (long) [components year], (long) [components month], (long) [components day],
                                                                          (long) [components hour], (long) [components minute], (long) [components second]];
}

- (NSString *) getEndDate
{
    NSDateComponents *components = [[NSCalendar currentCalendar] components: NSCalendarUnitSecond | NSCalendarUnitMinute
                                                                             | NSCalendarUnitHour |  NSCalendarUnitDay
                                                                             | NSCalendarUnitMonth | NSCalendarUnitYear
                                                                   fromDate: [self getDoubleUTCDate]];
    
    return [NSString stringWithFormat: @"%04ld%02ld%02ld%02ld%02ld%02ld", (long) [components year], (long) [components month], (long) [components day]+1000,
                                                                          (long) [components hour], (long) [components minute], (long) [components second]];
}


- (void) sendNotificationWithCkey: (NSString *) ckey
                           status: (NSString *) status
{
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    dict[@"status"] = status;
    
    NSString *notificationKey = [NSString stringWithFormat: @"download_%@", ckey];
    [[NSNotificationCenter defaultCenter] postNotificationName: notificationKey
                                                        object: nil
                                                      userInfo: dict];
}

@end
