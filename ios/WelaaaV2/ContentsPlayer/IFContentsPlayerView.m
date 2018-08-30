
#import "IFContentsPlayerView.h"

#import "AppDelegate.h"
//#import "HomeViewController.h"

#import "IFRateView.h"
#import "IFRecommendViewController.h"
#import "UIAlertController+Showable.h"

@interface IFContentsPlayerView () < IFDrmPlayerDelegate >
{
    IFDrmPlayer *_drmPlayer;
    IFContentsPlayerScreenMode _screenMode;
    
    NSArray *_currentContentList;
    NSString *_currentPlayGroupKey;
    NSString *_currentPlayCkey;
    NSInteger _currentPlayIndex;
    
    NSString *_groupTitle;
    
    IFRateView *_rateView;
    NSString *_currentStar; // 별점 전역변수 171208 김태현
}

@end

@implementation IFContentsPlayerView

- (instancetype) initWithFrame: (CGRect) frame
{
    if ( self = [super initWithFrame: frame] )
    {
        [self initSubviews];
    }
    
    return self;
}

- (void) initSubviews
{
    self.backgroundColor = [UIColor blackColor];
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    if ( _drmPlayer )
    {
        _drmPlayer.frame = self.bounds;
    }
}

- (void) rotateLayoutSubviews: (CGSize) size
{
    if ( _drmPlayer )
    {
        [_drmPlayer rotateLayoutSubview: size];
    }
}

- (void) startWithGroupKey: (NSString *) groupKey
                      cKey: (NSString *) cKey
{
    _currentPlayIndex = 0;
    
    _currentPlayGroupKey = groupKey;
    _currentPlayCkey = cKey;
    _screenMode = IFContentsPlayerScreenModeFullScreen;
    
    NSLog(@"    [startWithGroupKey:] current gkey: %@", _currentPlayGroupKey);
    NSLog(@"    [             cKey:] current ckey: %@", _currentPlayCkey);
    NSLog(@"컨텐츠 시작할때만 호출됨. 단 리스트에서 다음 영상이 시작될때에는 호출되지 않는 것으로 확인됨.");
    
    [self popupWithCompletion: ^(BOOL finished)
                               {
                                   if ( !nullStr(_currentPlayGroupKey) )
                                   {
                                       // currentGroupKey가 있을 경우 Contents_Info를 조회한다.
                                       [self requestContentsInfo];
                                   }
                                   else
                                   {
                                       [self requestDoPlay];
                                   }
                               }];
}

- (void) restartWithGroupKey: (NSString *) groupKey
                        cKey: (NSString *) cKey
{
    [self destroyPlayer];
    
    _currentContentList = nil;
    _currentPlayGroupKey = nil;
    _currentPlayCkey = nil;
    _groupTitle = nil;
    
    [self startWithGroupKey: groupKey
                       cKey: cKey];
}

- (void) restartWithIndex: (NSInteger) index
{
    if ( index >= _currentContentList.count )
    {
        return ;
    }
    
    [self destroyPlayer];

    _currentPlayIndex = index;
    _currentPlayGroupKey = _currentContentList[_currentPlayIndex][@"groupkey"];
    _currentPlayCkey = _currentContentList[_currentPlayIndex][@"ckey"];

    [self requestContentsEachAuthorWithCKey: _currentPlayCkey];
}

- (void) nextPlay
{
    _currentPlayIndex = _currentPlayIndex + 1;
    _currentPlayGroupKey = _currentContentList[_currentPlayIndex][@"groupkey"];
    _currentPlayCkey = _currentContentList[_currentPlayIndex][@"ckey"];
    
    NSLog(@"  [nextPlay_ ] index - _currentPlayIndex: %ld / _currentContentList.count : %ld", _currentPlayIndex, _currentContentList.count);
    
    [self requestContentsEachAuthorWithCKey: _currentPlayCkey];
}

- (void) destroyPlayer
{
    if ( _drmPlayer )
    {
        [_drmPlayer destroyPlayerView];
        [_drmPlayer removeFromSuperview];
        _drmPlayer = nil;
    }
}

- (void) closePlayer
{
    [self destroyPlayer];
    
    _currentContentList = nil;
    _currentPlayGroupKey = nil;
    _currentPlayCkey = nil;
    _groupTitle = nil;

    [[IFSleepTimerManager sharedInstance] stopTimer];
    
    [UIView animateWithDuration: 0.3f
                          delay: 0
                        options: UIViewAnimationOptionAllowUserInteraction
                     animations: ^{
                                     self.frame = CGRectMake(0, self.superview.frame.size.height, self.superview.frame.size.width, 0);
                                 }
                     completion: ^(BOOL finished)
                                 {
//                                     AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
//                                     HomeViewController *homeViewController = [app getHomeViewController];
//
//                                     if ( [homeViewController respondsToSelector: @selector(closePlayer)] )
//                                     {
//                                         [homeViewController closePlayer];
//                                     }
                                 }];
}

- (void) closePlayerFromErrorMessage: (NSString *) message
{
//    AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
//
//    [app showAlertWithTitle: @"확인"
//                    message: message
//          cancelButtonTitle: @"확인"
//     destructiveButtonTitle: nil
//          otherButtonTitles: nil
//                   tapBlock: ^(UIAlertController * _Nonnull controller, UIAlertAction * _Nonnull action, NSInteger buttonIndex)
//                             {
//                                 [self closePlayer];
//                             }];

}

- (void) popupWithCompletion: (void (^ __nullable)(BOOL finished)) completion
{
    CGRect moveFrame = self.superview.frame;
    
    [UIView animateWithDuration: 0.3f
                          delay: 0
                        options: UIViewAnimationOptionAllowUserInteraction
                     animations: ^{
                                     self.frame = moveFrame;
                                 }
                     completion: completion];
}

- (void) changedScreenMode: (IFContentsPlayerScreenMode) screenMode
{
    CGRect moveFrame = CGRectZero;
    
    if ( screenMode == IFContentsPlayerScreenModeMiniPlayer )
    {
        moveFrame.origin.x = 0.f;
        moveFrame.origin.y = CGRectGetMaxY(self.frame)-40.f;
        moveFrame.size.width = self.frame.size.width;
        moveFrame.size.height = 40.f;
    }
    else
    {
        moveFrame = self.superview.frame;
    }
    
    [_drmPlayer changedPlayerMode: screenMode == IFContentsPlayerScreenModeMiniPlayer];
    
    [UIView animateWithDuration: 0.3f
                          delay: 0
                        options: UIViewAnimationOptionAllowUserInteraction
                     animations: ^{
                                     self.frame = moveFrame;
                                 }
                     completion: ^(BOOL finished)
                                 {
                                     [self layoutSubviews];
                                 }];
    
    _screenMode = screenMode;
}

- (void) drmPlayerWithScript: (NSArray *) scriptArray
                    playInfo: (NSDictionary *) playInfo
                    isAuthor: (BOOL) isAuthor
{
    NSLog(@"  [drmPlayerWithScript]: 자막 array 데이터가 너무길어 로그로 찍으려면 추가 조치 필요함.");
    NSLog(@"  [drmPlayerWithScript]: %@", scriptArray);
    NSLog(@"  [           playInfo]: %@", playInfo);
    NSLog(@"  [           isAuthor]: %@", isAuthor? @"YES" : @"NO");
    
    NSLog(@"  [drmPlayerWithScript] Pay? %@", playInfo[@"cpay"]);   // cpay는 컨텐츠 자체가 무료인지 유료인지 나타내는 value.
    
    NSString *videoUrl = playInfo[@"curl"];
    NSString *audioUrl = playInfo[@"caurl"];
    
    NSString *con_class = playInfo[@"con_class"] ? playInfo[@"con_class"] : playInfo[@"ccon_class"];
    BOOL isAudioContents = [con_class integerValue] != 1;
    
    BOOL isDownloadFile = NO;
    
    BOOL isAudioPreview = NO;   // 미리듣기 처리 중. 171102 김태현
    if ( [playInfo[@"audio_preview"] isEqualToString: @"Y"] )   // 미리듣기 처리 중. 171102 김태현
    {
        isAudioPreview = YES;
    }
    
    //재생할 컨텐츠가 다운로드 컨텐츠일 경우 경로를 바꾼다.
    if ( [[DbManager sharedInstance] hasContentWithCKey: _currentPlayCkey] )
    {
        NSDictionary *info = [[DbManager sharedInstance] getDownloadContentWithGroupKey: _currentPlayGroupKey
                                                                                   cKey: _currentPlayCkey];
        
        if ( info )
        {
            NSString *path = [self pathFromWithMediaInfo: info];
            
            if ( !nullStr(path) )
            {
                videoUrl = path;
                isDownloadFile = YES;
            }
        }
    }
    
    //그룹타이틀 가져오기
    NSString *groupTitle = _groupTitle;
    
    if ( nullStr(_groupTitle) )
    {
        NSInteger idx = [self findIndexWithContentInfo: _currentContentList
                                              groupKey: _currentPlayGroupKey
                                                  cKey: _currentPlayCkey];
        groupTitle = _currentContentList[idx][@"grouptitle"];
    }
    
//    AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
//    HomeViewController *homeViewController = [app getHomeViewController];

    [self destroyPlayer];
    
    //미니플레이어에서 다음 동영상 재생할때를 대비해 컨트롤러 사이즈를 정한다.
//  _drmPlayer = [[IFDrmPlayer alloc] initWithFrame: homeViewController.navigationController.view.bounds];
    _drmPlayer.delegate = self;
    _drmPlayer.isMiniPlayer = (_screenMode == IFContentsPlayerScreenModeMiniPlayer);
    _drmPlayer.videoUrl = videoUrl;
    _drmPlayer.audioUrl = audioUrl;
    _drmPlayer.isAuthor = isAuthor;

    self.isAuthor = isAuthor;
    
    // authority가 'false'이고 audio 컨텐츠가 아닐 경우는 미리보기 모드로 drmPlayer를 세팅하여 구동하여 한다.
    // 비로그인 상태  미리보기 가능
    // 회원 , 프리패스 X , 권한 X , 일반 회원 들 , 로그인 상태에서도 가능
    // 미리보기 시간은 60초 => 90초 변경
    // 미리보기에서는 자막 , 다운로드 , 목차를 이용 불가
    //
    if ( isAuthor )
    {
        _drmPlayer.gkey = _currentPlayGroupKey;
        _drmPlayer.ckey = _currentPlayCkey;
        _drmPlayer.isDownloadFile = isDownloadFile;
        [self addSubview:_drmPlayer];
        
        [_drmPlayer playWithUrl: videoUrl
                    initialTime: 0.f
                    scirptArray: scriptArray
                 isAudioContent: isAudioContents];
        
        [_drmPlayer setLectureTitle: groupTitle
                       contentTitle: playInfo[@"cname"]
                  audioBackImageUrl: playInfo[@"pbackimg"]];
        
//        if ( [homeViewController respondsToSelector: @selector(runJavaScript:)] )
//        {
//            NSString *javascript = [NSString stringWithFormat: @"javascript:current_playing_ckey('%@')", _currentPlayCkey];
//            [homeViewController runJavaScript: javascript];
//        }
    }
    else
    {
        // 구입하지 않은 오디오북의 비 프리뷰챕터의 경우는 미리듣기없이 종료시켜야합니다. (권한없음 && 오디오북챕터)
        if ( isAudioContents )
        {
//            [app showToast: @"프리뷰 이용중이셔서 종료합니다."];
            [self closePlayer];
        }
        // 구입하지 않은 영상강의는 안드로이드처럼 1분30초만 보여줍니다.
        else
        {
//            [app showToast: @"비회원 또는 멤버십회원이 아닐 경우 미리보기만 가능합니다."];
            _drmPlayer.gkey = _currentPlayGroupKey;
            _drmPlayer.ckey = _currentPlayCkey;
            _drmPlayer.isDownloadFile = NO;
            [self addSubview:_drmPlayer];
            
            [_drmPlayer playWithUrl: videoUrl
                        initialTime: 0.f
                        scirptArray: nil
                     isAudioContent: isAudioContents];
            
            [_drmPlayer setLectureTitle: groupTitle
                           contentTitle: playInfo[@"cname"]
                      audioBackImageUrl: playInfo[@"pbackimg"]];
            
//            if ( [homeViewController respondsToSelector: @selector(runJavaScript:)] )
//            {
//                NSString *javascript = [NSString stringWithFormat: @"javascript:current_playing_ckey('%@')", _currentPlayCkey];
//                [homeViewController runJavaScript: javascript];
//            }
        }
    }
    
    /*
    _drmPlayer.gkey = _currentPlayGroupKey;
    _drmPlayer.ckey = _currentPlayCkey;
    _drmPlayer.isDownloadFile = isDownloadFile;
    [self addSubview:_drmPlayer];
    
    [_drmPlayer playWithUrl: videoUrl
                initialTime: 0.f
                scirptArray: scriptArray
             isAudioContent: isAudioContents];
    
    [_drmPlayer setLectureTitle: groupTitle
                   contentTitle: playInfo[@"cname"]
              audioBackImageUrl: playInfo[@"pbackimg"]];
    
    if ( [homeViewController respondsToSelector: @selector(runJavaScript:)] )
    {
        NSString *javascript = [NSString stringWithFormat: @"javascript:current_playing_ckey('%@')", _currentPlayCkey];
        [homeViewController runJavaScript: javascript];
    }*/
    
    
}

- (NSString *) pathFromWithMediaInfo: (NSDictionary *) info
{
    NSString *groupkey = info[@"groupkey"];
    NSString *ckey = info[@"ckey"];
    NSString *cid = [NSString stringWithFormat: @"%@_%@", groupkey, ckey];
    
    NSString *path = info[@"path"];
    
    path = [path stringByReplacingOccurrencesOfString: @"/Documents"
                                           withString: @"@"];
    long index = [path indexOf: @"@"];
    
    if ( index != -1 )
    {
        path = [path stringByReplacingCharactersInRange: NSMakeRange(0, index+1)
                                             withString: [common getDocumentsFolderPath]];
        
        path = [@"file://" stringByAppendingString: path];
    }
    
//    NSDictionary *dic = [AquaSDK getLocalContentInfoWithCustomerID: @"influential"
//                                                               cID: cid];
//    NSDictionary *contentInfo = [dic objectForKey: @"contentinfo"];
//    
//    // 컨텐츠 정보는 별도 UI 구성용으로 사용하거나, 컨텐츠의 상태를 체크하는 용도.
//    if ( [[dic objectForKey: @"errcode"] integerValue] == AQSDKCORE_SIGNATURE_MISMATCH )
//    {
//    }
//    else
//    {
//        if ( [[contentInfo objectForKey: @"expired"] boolValue] == YES )
//        {
//            // Content Expired
//            // 컨텐츠를 정상 재생이 가능하도록 업데이트 한다.
//            int resUpdate = [AquaSDK updateLocalContentRightWithCustomerID: @"influential"
//                                                                       cID: cid];
//            
//            if ( resUpdate != AQSDKCORE_RESULT_SUCCESS )
//            {
//                // see AquaSDKErrorCode
//                return @"";
//            }
//        }
//    }
//    
//    int resIsRightContent = 0;
//    
//    if (/* is network status enable? */ (1) )
//    {
//        resIsRightContent = [AquaSDK isRightLocalContentPlayWithCustomerID: @"influential"
//                                                                    userID: @"influential"
//                                                                       cID: cid
//                                                           childcustomerID: @""
//                                                             networkStatus: 1];
//    }
//    
//    // isRightLocalContentPlayWithCustomerID.... 는 컨텐츠 재생을 알리는 api이고,
//    // 만약 재생이 불가능 할때는 오류 코드를 AQSDKCORE_RESULT_SUCCESS 가 아닌 코드를 리턴 한다.
//    if ( resIsRightContent != AQSDKCORE_RESULT_SUCCESS )
//    {
//        // see AquaSDKErrorCode
//        return @"";
//    }
    
    return path;
}

#pragma mark - request Methods

- (void) requestContentsInfo
{
    if ( nullStr(_currentPlayGroupKey) )
    {
        // GroupKey가 세팅되어 있지 않으면 아무것도 실행되지 않는다.
        return ;
    }
    
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    param[@"groupkey"] = _currentPlayGroupKey;
    
    [[ApiManager sharedInstance] requestWithUrl: @"/usingapp/contentsinfo.php"
                                         method: @"GET"
                                          param: param
                                      onSuccess: ^(NSDictionary *object)
                                                 {
                                                     NSLog(@"  [requestContentsInfo] GroupKey를 통해 상당히 긴 컨텐츠정보 리스트를 가져옵니다.");
                                                     NSLog(@"  [requestContentsInfo] object from contentsinfo.php : %@", object);
                                                     NSLog(@"  [requestContentsInfo] object group_title : %@", object[@"group_title"]);
                                                     NSLog(@"  [requestContentsInfo] object group_img : %@", object[@"group_img"]);
                                                     NSLog(@"");
                                                     _groupTitle = object[@"group_title"];
                                                     
                                                     if ( ![[DbManager sharedInstance] hasAudioGroupItemWithGroupKey: _currentPlayGroupKey] )
                                                     {
                                                         [[DbManager sharedInstance] insertAudioGroupItem: object
                                                                                                 groupKey: _currentPlayGroupKey];
                                                     }
                                                     
                                                     NSString *con_class = object[@"con_class"] ? object[@"con_class"] : object[@"ccon_class"];
                                                     BOOL isAudioType = [@"2" isEqualToString: con_class];
                                                     
                                                     if ( isAudioType )
                                                     {
                                                         if ( [@"startDownloadContents" isEqualToString: _currentPlayCkey] )
                                                         {
                                                             [self requestHistoryWithGroupKey: _currentPlayGroupKey
                                                                                 contentInfos: object[@"contentsinfo"]
                                                                                  isAudioType: isAudioType];
                                                         }
                                                         else
                                                         {
                                                             NSLog(@"  [requestContentsInfo] 미리듣기일 경우 어떤처리를 해야하는지 생각해봐야함!!");
                                                             [self receivedContentsInfo: object[@"contentsinfo"]
                                                                            isAudioType: isAudioType
                                                                             startIndex: -1];
                                                         }
                                                     }
                                                     else
                                                     {
                                                         NSLog(@"  [requestContentsInfo] 오디오타입이 아니지만 미리보기 말고 다른 처리가 필요한지 눈여겨 봐야함!!!");
                                                         [self receivedContentsInfo: object[@"contentsinfo"]
                                                                        isAudioType: isAudioType
                                                                         startIndex: -1];
                                                     }
                                                 }
                                      onFailure: ^(NSError *error)
                                                 {
                                                     [self closePlayerFromErrorMessage: @"서비스가 원활하지 않습니다. 잠시 후 다시 시도해주세요."];
                                                 }];
}

- (void) requestDoPlay
{
    [[ApiManager sharedInstance] requestWithUrl: @"/usingapp/play_list.php"
                                         method: @"GET"
                                          param: nil
                                      onSuccess: ^(NSDictionary *object)
                                                 {
                                                     if ( _currentPlayCkey )
                                                     {
                                                         NSArray *contentsInfo = object[@"contentsinfo"];
                                                         
                                                         NSInteger index = -1;
                                                         
                                                         for ( NSInteger i=0; i<contentsInfo.count; i++ )
                                                         {
                                                             NSDictionary *contentDict = contentsInfo[i];
                                                             NSString *listkey = [common forceStringValue: contentDict[@"listkey"]];
                                                             
                                                             if ( [listkey isEqualToString: _currentPlayCkey] )
                                                             {
                                                                 _currentPlayCkey = [common forceStringValue: contentDict[@"ckey"]];
                                                                 _groupTitle = [common forceStringValue: contentDict[@"grouptitle"]];   // 강좌명을 set합니다.
                                                                 index = i;
                                                                 break;
                                                             }
                                                         }
                                                         
                                                         [self receivedContentsInfo: object[@"contentsinfo"]
                                                                        isAudioType: NO
                                                                         startIndex: index];
                                                     }
                                                     else
                                                     {
                                                         [self receivedContentsInfo: object[@"contentsinfo"]
                                                                        isAudioType: NO
                                                                         startIndex: 0];
                                                     }
                                                 }
                                      onFailure: ^(NSError *error)
                                                 {
                                                     [self closePlayerFromErrorMessage: @"서비스가 원활하지 않습니다. 잠시 후 다시 시도해주세요."];
                                                 }];
}

- (void) requestHistoryWithGroupKey: (NSString *) gkey
                       contentInfos: (NSArray *) contentInfos
                        isAudioType: (BOOL) isAudioType
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    param[@"groupkey"] = gkey;
    
    [[ApiManager sharedInstance] requestWithUrl: @"/usingapp/history_check.php"
                                         method: @"GET"
                                          param: param
                                      onSuccess: ^(NSDictionary *object)
                                                 {
                                                     NSArray *historyinfo = object[@"historyinfo"];
                                                     
                                                     if ( historyinfo.count == 0 )
                                                     {
                                                         NSInteger index = -1;
                                                         
                                                         for ( NSInteger i=0; i<contentInfos.count; i++ )
                                                         {
                                                             NSDictionary *contentDict = contentInfos[i];
                                                             
                                                             NSString *firstPlay = [common forceStringValue: contentDict[@"first_play"]];
                                                             
                                                             if ( [@"1" isEqualToString: firstPlay] )
                                                             {
                                                                 index = i;
                                                                 break;
                                                             }
                                                         }
                                                         
                                                         [self receivedContentsInfo: contentInfos
                                                                        isAudioType: isAudioType
                                                                         startIndex: index];
                                                     }
                                                     else
                                                     {
                                                         NSInteger index = -1;
                                                         NSString *ckey = [common forceStringValue: historyinfo[0][@"ckey"]];
                                                         
                                                         for ( NSInteger i=0; i<contentInfos.count; i++ )
                                                         {
                                                             NSDictionary *contentDict = contentInfos[i];
                                                             
                                                             NSString *tCkey = [common forceStringValue: contentDict[@"ckey"]];
                                                             
                                                             if ( [tCkey isEqualToString: ckey] )
                                                             {
                                                                 index = i;
                                                                 break;
                                                             }
                                                         }
                                                         
                                                         [self receivedContentsInfo: contentInfos
                                                                        isAudioType: isAudioType
                                                                         startIndex: index];
                                                     }
                                                 }
                                      onFailure: ^(NSError *error)
                                                 {
                                                     [self receivedContentsInfo: contentInfos
                                                                    isAudioType: isAudioType
                                                                     startIndex: -1];
                                                 }];
}

// content key로 권한 확인 요청.
- (void) requestContentsEachAuthorWithCKey: (NSString *) cKey
{
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    param[@"ckey"] = cKey;
    
    NSLog(@"  [requestContentsEachAuthorWithCKey] ckey : %@", cKey);
    
    [[ApiManager sharedInstance] requestWithUrl: @"/usingapp/contents_each_author.php"
                                         method: @"GET"
                                          param: param
                                      onSuccess: ^(NSDictionary *object)
                                                 {
                                                     NSLog(@"  [requestContentsEachAuthorWithCKey] received from contents_each_author.php : %@", object);
                                                     [self receivedEachAuthorObject: object];
                                                 }
                                      onFailure: ^(NSError *error)
                                                 {
                                                     [self closePlayerFromErrorMessage: @"서비스가 원활하지 않습니다. 잠시 후 다시 시도해주세요."];
                                                 }];
}

// 자막데이터를 요청.
- (void) requestScriptWithUrl: (NSString *) url
                     playInfo: (NSDictionary *) playInfo
                     isAuthor: (BOOL) isAuthor
{
    if ( nullStr(url) )
    {
        return [self drmPlayerWithScript: nil
                                playInfo: playInfo
                                isAuthor: isAuthor];
    }
    
    [[ApiManager sharedInstance] requestWithUrl: url
                                         method: @"GET"
                                          param: nil
                                      onSuccess: ^(NSDictionary *object)
                                                 {
                                                     // 자막데이터가 너무 길어 로그로 찍을 수 없어서 일단 주석처리함. 정상적으로 잘 가져옴.
                                                     //NSLog(@"    [requestScriptWithUrl] GET from \"%@\" : %@", url, object);
                                                     [self drmPlayerWithScript: (NSArray *) object
                                                                      playInfo: playInfo
                                                                      isAuthor: isAuthor];
                                                 }
                                      onFailure: ^(NSError *error)
                                                 {
                                                     [self drmPlayerWithScript: nil
                                                                      playInfo: playInfo
                                                                      isAuthor: isAuthor];
                                                 }];
}

- (void) responseErrorAlert: (NSString *) message
{
    
}

#pragma mark - received data
- (void) receivedContentsInfo: (NSArray *) infos
                  isAudioType: (BOOL) isAudioType
                   startIndex: (NSInteger) startIndex
{
    if ( !infos || infos.count == 0 )
    {
        return [self closePlayerFromErrorMessage: @"contentsinfo가 없습니다."];
    }
    
    NSInteger index = (startIndex != -1 ? startIndex : 0);
    
    //if ( isAudioType && startIndex == -1 )
    if ( startIndex == -1 )   // [중요] 영상, 오디오 상관없이 인덱스를 일단 세팅해 보았음. 만약 미리보기 이외의 상태에 영향을 끼친다면 롤백해야함. 171031 김태현
    {
        index = [self findIndexWithContentInfo: infos
                                      groupKey: _currentPlayGroupKey
                                          cKey: _currentPlayCkey];
    }
    
    if ( index >= infos.count )
    {
        return [self closePlayerFromErrorMessage: @"컨텐츠를 찾을 수 없습니다."];
    }
    
    NSString *tGroupKey = infos[index][@"groupkey"];
    
    if ( !nullStr(tGroupKey) )
    {
        _currentPlayGroupKey = tGroupKey;
    }
    
    _currentPlayIndex = index;
    _currentContentList = [infos copy];
    _currentPlayCkey = _currentContentList[index][@"ckey"];

    // 무조건 인덱스가 0으로 세팅되는 것이 문제인듯...
    //
    //
    NSLog(@"  [receivedContentsInfo] _currentPlayGKey : %@", _currentPlayGroupKey);
    NSLog(@"  [receivedContentsInfo] _currentPlayCkey : %@", _currentPlayCkey);
    
    [self requestContentsEachAuthorWithCKey: _currentPlayCkey];
}

- (void) receivedEachAuthorObject: (NSDictionary *) object
{
    NSDictionary *data = object[@"data"];
    NSLog(@"  [receivedEachAuthorObject] data from requestContentsEachAuthorWithCKey ==> contents_each_author.php : %@", object);
    //BOOL isPreviewMode = false; // 지식영상 미리보기 관련 변수를 최초 생성 및 추가함. 171101 김태현
    
    if ( !data )
    {
        return [self closePlayerFromErrorMessage: @"EachAuthor - data가 없습니다."];
    }
    
    NSString *con_class = object[@"info"][@"con_class"] ? object[@"info"][@"con_class"] : object[@"info"][@"ccon_class"];
    BOOL isAudioContents = [con_class integerValue] != 1;
    
    BOOL author = [data[@"view_author"] boolValue]; // false 이면 무조건 미리보기로 처리해주어야만 함. 하지만 미리듣기 챕터의 경우는 author가 true 이므로 알아서 처리해야함.
    
    // previewPlay 를 위한 조건 : 오디오컨텐츠가 아니면서 view_author 가 false일 것.
    if ( !author && !isAudioContents )
    {
        //return [self closePlayerFromErrorMessage: @"EachAuthor - 재생권한이 없고 오디오컨텐츠가 아닙니다. 영상 미리보기를 따로 구현해야 합니다!!"]; // 171101 김태현
        NSLog(@"  [receivedEachAuthorObject] 미리보기 구현 시작");
        //isPreviewMode = true;
    }
    
    NSLog(@"  [receivedEachAuthorObject] Pay? %@", object[@"info"][@"cpay"]);   // cpay는 컨텐츠 자체가 무료인지 유료인지 나타내는 value.
    
    NSDictionary *cInfo = object[@"info"];
    
    if ( !cInfo )
    {
        return [self closePlayerFromErrorMessage: @"EachAuthor - info가 없습니다."];
    }

    NSMutableDictionary *info = nil;
    
    if ( _currentContentList.count <= _currentPlayIndex )
    {
        return [self closePlayerFromErrorMessage: @"EachAuthor - info가 없습니다."];
    }
    
    info = [_currentContentList[_currentPlayIndex] mutableCopy];
    info[@"pbackimg"] = cInfo[@"pbackimg"];
    
    NSString *scriptUrl = info[@"csmi"];
    //NSLog(@"    [receivedEachAuthorObject] scriptUrl : %@", scriptUrl);
    
    if ( !nullStr(scriptUrl) )
    {
        //NSLog(@"    [receivedEachAuthorObject] 곧 requestScriptWithUrl를 호출함!!");
        [self requestScriptWithUrl: scriptUrl
                          playInfo: info
                          isAuthor: author];
    }
    else
    {
        [self drmPlayerWithScript: nil
                         playInfo: info
                         isAuthor: author];
    }

    if ( [@"1" isEqualToString: con_class] )
    {
        //다운로드를 위해 리스트를 생성한다.
        NSMutableDictionary *downloadObject = [NSMutableDictionary dictionary];
        downloadObject[@"group_teachername"] = cInfo[@"teachername"];
        downloadObject[@"group_title"] = !nullStr(_groupTitle) ? _groupTitle : cInfo[@"grouptitle"];
        downloadObject[@"group_image"] = cInfo[@"pbackimg"];
        downloadObject[@"con_class"] = con_class;
        
        NSMutableArray *contentArray = [NSMutableArray array];
        NSMutableDictionary *contentObject = [NSMutableDictionary dictionary];
        
        contentObject[@"con_class"] = con_class;
        contentObject[@"ckey"] = cInfo[@"ckey"];
        contentObject[@"cmemo"] = cInfo[@"cmemo"];
        contentObject[@"cname"] = cInfo[@"cname"];
        contentObject[@"cplay_time"] = cInfo[@"cplay_time"];
        contentObject[@"curl"] = cInfo[@"curl"];
        contentObject[@"group_teachername"] = cInfo[@"teachername"];
        contentObject[@"group_title"] = !nullStr(_groupTitle) ? _groupTitle : cInfo[@"grouptitle"];
        contentObject[@"groupkey"] = cInfo[@"groupkey"];
        
        [contentArray addObject: contentObject];
        downloadObject[@"contentsinfo"] = contentArray;
        
        [[DownloadManager sharedInstance] setReadyObject: downloadObject
                                                groupKey: cInfo[@"groupkey"]];
    }
}

- (NSInteger) findIndexWithContentInfo: (NSArray *) array
                              groupKey: (NSString *) groupKey
                                  cKey: (NSString *) cKey
{
    if ( nullStr(groupKey) || nullStr(cKey) )
    {
        return 0;
    }
    
    for ( NSInteger i=0; i<array.count; i++ )
    {
        NSDictionary *item = array[i];
        NSString *tGroupKey = item[@"groupkey"];
        NSString *tCKey = item[@"ckey"];

        //오디오 컨텐츠일 경우 response에 groupkey가 없을 수 있음.
        if ( !nullStr(tGroupKey) )
        {
            if ( ![groupKey isEqualToString: tGroupKey] && [cKey isEqualToString: tCKey] )
            {
                return i;
            }
        }
        else
        {
            if ([cKey isEqualToString: tCKey])
            {
                return i;
            }
        }
    }
    
    return 0;
}

#pragma mark - IFDrmPlayerUiViewDelegate
- (void) player: (IFDrmPlayer *) view
      closeView: (id) sender
{
    if ( [self.delegate respondsToSelector: @selector(contentsPlayerView:changedStatusbarHidden:)] )
    {
        [self.delegate contentsPlayerView: self
                   changedStatusbarHidden: NO];
    }
    
    [self changedScreenMode: IFContentsPlayerScreenModeMiniPlayer];
}

- (void) player: (IFDrmPlayer *) view
       openView: (id) sender
{
    if ( [self.delegate respondsToSelector: @selector(contentsPlayerView:changedStatusbarHidden:)] )
    {
        [self.delegate contentsPlayerView: self
                   changedStatusbarHidden: YES];
    }
    
    [self changedScreenMode: IFContentsPlayerScreenModeFullScreen];
}

- (void)    player: (IFDrmPlayer *) view
didChangedPlayTime: (CGFloat) sec
{
    //진도체크
    if ( !nullStr(_currentPlayCkey) )
    {
        [[LogManager sharedInstance] sendLogWithContentKey: _currentPlayCkey
                                                       sec: (NSInteger) sec
                                                     force: NO];
    }
}

// 콘텐츠 종료시점에 호출되는 메서드.
- (void) player: (IFDrmPlayer *) view
didFinishedPlay: (id) sender
{
    // 타이머도 종료합니다.
    [_drmPlayer stopLogTimer];
    
    // 플레이어가 종료되는 시점에 컨텐츠 이용 내역 tracking을 위해 데이터를 전송합니다.
    [[LogManager sharedInstance] sendLogWithGroupKey: _currentPlayGroupKey
                                          contentKey: _currentPlayCkey
                                              status: @"END"
                                          downloaded: _drmPlayer.isDownloadFile
                                        startingTime: 999999        // aquaSDK 호출 필요함.
                                          endingTime: 999999];      // aquaSDK 호출 필요함.
    
    // 진도체크 로그를 별점주기 또는 연관컨텐츠뷰를 띄우기 전에 전송합니다.
    if ( !nullStr(_currentPlayCkey) )
    {
        if ( _currentPlayIndex < _currentContentList.count )
        {
            NSDictionary *item = _currentContentList[_currentPlayIndex];
            NSString *playTime = [common forceStringValue: item[@"cplay_time"]];
            NSInteger timeNum = [common convertStringToTime: playTime];
            
            [[LogManager sharedInstance] sendLogWithContentKey: _currentPlayCkey
                                                           sec: timeNum
                                                         force: YES];
        }
    }
    
    // 지식영상이 끝나면 별점을 등록하기 위해 데이터 조회를 실시합니다.
#if APPSTORE | ADHOC
    NSString *starQueryUrl = [NSString stringWithFormat: @"http://%@/usingapp/contents_each_author_v2.php", BASE_DOMAIN];
#else
    NSString *starQueryUrl = [NSString stringWithFormat: @"http://%@/usingapp/contents_each_author_v2.php", TEST_DOMAIN];
#endif
    NSString *post = [NSString stringWithFormat: @"ckey=%@", _currentPlayCkey];
    NSData *postData = [post dataUsingEncoding: NSUTF8StringEncoding];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL: [NSURL URLWithString: [NSString stringWithFormat: @"%@", starQueryUrl]]];
    [request setHTTPBody: postData];
    [request setHTTPMethod: @"POST"];
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [NSURLConnection sendSynchronousRequest: request
                                         returningResponse: &resp
                                                     error: &error];
    
    NSString *jsonDataStr = [[NSString alloc] initWithData: data
                                                  encoding: NSUTF8StringEncoding];
    
    //jsonData = [jsonData stringByReplacingOccurrencesOfString: @"'" withString: @"\""];   // ' -> " 작은 따옴표를 큰 따옴표로 변경
    NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData: [jsonDataStr dataUsingEncoding: NSUTF8StringEncoding]
                                                                 options: NSJSONReadingAllowFragments
                                                                   error: &error];
    
    NSLog(@"  [player_didFinishedPlay] jsonData : %@", jsonDataStr);
    NSDictionary *dataDictionary = jsonResponse[@"data"];
    NSDictionary *infoDictionary = jsonResponse[@"info"];
    NSString *userStar = [dataDictionary objectForKey: @"user_star"];
    BOOL isUserLoggedIn = [dataDictionary objectForKey: @"user_logged_in"];
    NSString *cconClassStar = [infoDictionary objectForKey: @"ccon_class"]; // 1 = video clip, 2 = audiobook
    // 유저가 로그인한 상태이면서 별점이 공백이면서 콘텐츠가 강의클립이라면 별점주기 팝업(커스텀 레이아웃)이 떠야합니다.    171128 김태현
    NSLog(@"  [player_didFinishedPlay] userStar = %@", userStar);
    NSLog(@"  [player_didFinishedPlay] isUserLoggedIn? %@", isUserLoggedIn ? @"TRUE" : @"FALSE");
    NSLog(@"  [player_didFinishedPlay] ccon_class = %@", cconClassStar);
    // 하지만 오디오북이라면 챕터별로 별점을 주어야할까요? 아니요.
    
    if ( isUserLoggedIn && [userStar isEqualToString: @""] && [cconClassStar isEqualToString: @"1"] )
    {
        UIAlertController *alert = [UIAlertController alertControllerWithTitle: @"지식클립이 흥미로우셨나요?"
                                                                       message: @"\n회원님의 의견이 더 좋은 강의를 만드는 원동력이 됩니다.\n\n\n"
                                                                preferredStyle: UIAlertControllerStyleAlert];
                                                              //preferredStyle: UIAlertControllerStyleActionSheet];
        
        [alert.view setBackgroundColor: [UIColor clearColor]]; // alertView 배경 색상
        
        IFRateView *rateView = [[IFRateView alloc] initWithFrame: CGRectMake(20, 95, alert.view.bounds.size.width, 60)
                                                        fullStar: [UIImage imageNamed: @"icon_star_full_large.png"]
                                                       emptyStar: [UIImage imageNamed: @"icon_star_empty_large.png"]];
        rateView.padding = 20;
        rateView.alignment = RateViewAlignmentLeft;
        rateView.editable = YES;
        rateView.delegate = self;
        
        [alert.view addSubview: rateView];
        
        UIAlertAction *okAction;
        okAction = [UIAlertAction actionWithTitle: @"확인"
                                            style: UIAlertActionStyleDefault
                                          handler: ^(UIAlertAction *action)
                                               {
                                                   if ( nil == _currentStar || [_currentStar isEqualToString: @"0"] || [_currentStar isEqualToString: @""] )
                                                   {
                                                       _currentStar = @"";
                                                   }
                                                   
                                                   NSLog(@"  [player_didFinishedPlay] 최종별점 : %@", _currentStar);
                                                   NSLog(@"  [player_didFinishedPlay] ckey : %@", _currentPlayCkey);
                                                   // 지식영상이 끝나면 별점을 등록하기 위해 조회를 먼저합니다.
                                                   NSString *starUpdateUrl;
#if APPSTORE | ADHOC
                                                   starUpdateUrl = [NSString stringWithFormat: @"http://%@/usingapp/update_star.php", BASE_DOMAIN];
#else
                                                   starUpdateUrl = [NSString stringWithFormat: @"http://%@/usingapp/update_star.php", TEST_DOMAIN];
#endif
                                                   NSString *post = [NSString stringWithFormat: @"star=%@&ckey=%@", _currentStar, _currentPlayCkey];
                                                   NSData *postData = [post dataUsingEncoding: NSUTF8StringEncoding];
                                                   
                                                   NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
                                                   [request setURL: [NSURL URLWithString: [NSString stringWithFormat: @"%@", starUpdateUrl]]];
                                                   [request setHTTPBody: postData];
                                                   [request setHTTPMethod: @"POST"];
                                                   NSError *error;
                                                   NSURLResponse *response = nil;
                                                   // 비동기방식이 아닌 동기방식으로 접속한다.
                                                   [NSURLConnection sendSynchronousRequest: request
                                                                         returningResponse: &response
                                                                                     error: &error];
                                                   
                                                   _currentStar = @"";   // 다음 강의 평가를 위해 별점 초기화. 171207 김태현
                                                   
                                                   // 연관 컨텐츠 뷰를 로딩합니다.
                                                   NSLog(@"  [player_didFinishedPlay] 이제 연관 컨텐츠 뷰를 띄워주어야 합니다!!");
                                                   // 헤더 제목을 위해 IFCollectionView클래스에도 ckey를 보내야할 수도 있습니다.
                                                   self.recommendViewController = [[IFRecommendViewController alloc] init];
                                                   [self.recommendViewController setDataWithCurrentCkey: _currentPlayCkey];
                                                   [self addSubview: self.recommendViewController.view];
                                               }];
        
        UIAlertAction *cancelAction;
        cancelAction = [UIAlertAction actionWithTitle: @"취소"
                                                style: UIAlertActionStyleDestructive
                                              handler: ^(UIAlertAction *action)
                                                       {
                                                           // 별점팝업에서 취소를 눌러도 연관 컨텐츠 뷰를 로딩합니다.
                                                           NSLog(@"  [player_didFinishedPlay] 이제 연관 컨텐츠 뷰를 띄워주어야 합니다!!");
                                                           // 헤더 제목을 위해 IFCollectionView클래스에도 ckey를 보내야할 수도 있습니다.
                                                           self.recommendViewController = [[IFRecommendViewController alloc] init];
                                                           [self.recommendViewController setDataWithCurrentCkey: _currentPlayCkey];
                                                           [self addSubview: self.recommendViewController.view];
                                                       }];
        
        [okAction setValue: UIColorFromRGB(0x32c183, 1.f)
                    forKey: @"titleTextColor"];
        
        [cancelAction setValue: UIColorFromRGB(0x4a494a, 1.f)
                        forKey: @"titleTextColor"];
        
        [alert addAction: okAction];
        [alert addAction: cancelAction];
        
        [alert show];
        
        return ;
    }
    // 로그인한 상태이고 별점이 빈값이 아니고 강의클립이라면 연관 컨텐츠뷰를 띄워야합니다.
    else if ( isUserLoggedIn && ![userStar isEqualToString: @""] && [cconClassStar isEqualToString: @"1"] )
    {
        self.recommendViewController = [[IFRecommendViewController alloc] init];
        [self.recommendViewController setDataWithCurrentCkey: _currentPlayCkey];
        [self addSubview: self.recommendViewController.view];
    }
    
    AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];

    // 에피소드 모드 타이머 설정시
    if ( [IFSleepTimerManager sharedInstance].isStopEpisodeMode )
    {
        [[IFSleepTimerManager sharedInstance] stopTimer];
      //[app showToast: @"에피소드가 종료되었습니다."];
        [self closePlayer];
        
        return ;
    }
    
    // 리스트의 마지막 영상/오디오북 종료 시 호출됩니다.
    if ( _currentPlayIndex == _currentContentList.count-1 )
    {
        if ( _screenMode == IFContentsPlayerScreenModeMiniPlayer )
        {
          //[app showToast: @"모든 컨텐츠를 재생했습니다."];
            [self closePlayer];
            
            return ;
        }
        
        //
//        [app showAlertWithTitle: @"재생완료"
//                        message: @"모든 컨텐츠를 재생했습니다."
//              cancelButtonTitle: @"확인"
//         destructiveButtonTitle: nil
//              otherButtonTitles: nil
//                       tapBlock: ^(UIAlertController * _Nonnull controller, UIAlertAction * _Nonnull action, NSInteger buttonIndex)
//                                 {
//                                     //[self closePlayer];
//                                 }];
        return ;
    }
    
    NSString *autoPlaySetup = [common getUserSettingValueWithKey: @"autoplay_enable"];
    BOOL isAutoPlay = ([@"Y" isEqualToString: autoPlaySetup] || nullStr(autoPlaySetup));

    if ( !self.isAuthor )
    {
        isAutoPlay = NO;
    }
    
    if ( !isAutoPlay )
    {
        if ( _screenMode == IFContentsPlayerScreenModeMiniPlayer )
        {
          //[app showToast: @"동영상이 종료되었습니다."];
            //[self closePlayer];
            return ;
        }
        
        NSString *message = @"";
        
        if ( self.isAuthor )
        {
            message = @"다음 동영상을 재생하겠습니까?";
            
//            [app showAlertWithTitle: @""
//                            message: message
//                  cancelButtonTitle: @"아니오"
//             destructiveButtonTitle: nil
//                  otherButtonTitles: @[ @"예" ]
//                           tapBlock: ^(UIAlertController * _Nonnull controller, UIAlertAction * _Nonnull action, NSInteger buttonIndex)
//                                     {
//                                         if ( buttonIndex == controller.cancelButtonIndex )
//                                         {
//                                             [self closePlayer];
//                                         }
//                                         else
//                                         {
//                                             [self nextPlay];
//                                         }
//                                     }];
        }
        else
        {
            //message = @"미리보기가 종료되었습니다. 다음 동영상을 재생하겠습니까?";
          //[app showToast: @"미리보기 만 가능합니다."];
            [self closePlayer];             // 171026 김태현
        }
        
        /* 권한 체크하는 if문 안으로 밀어넣었음. 문제가 생긴다면 롤백해야함. 171101 김태현
        [app showAlertWithTitle: @""
                        message: message
              cancelButtonTitle: @"아니오"
         destructiveButtonTitle: nil
              otherButtonTitles: @[ @"예" ]
                       tapBlock: ^(UIAlertController * _Nonnull controller, UIAlertAction * _Nonnull action, NSInteger buttonIndex)
                                 {
                                     if ( buttonIndex == controller.cancelButtonIndex )
                                     {
                                         [self closePlayer];
                                     }
                                     else
                                     {
                                         [self nextPlay];
                                     }
                                 }];*/
        
        return ;
	}
    
    // 강의클립이 아니라면 다음 컨텐츠를 재상합니다.
    if ( ![cconClassStar isEqualToString: @"1"] )
    {
        [self nextPlay];    // 주석처리를 하면 오디오북에 영향을 줌.
    }
}

- (NSArray *) player: (IFDrmPlayer *) view
      getContentList: (id) sender
{
    return _currentContentList;
}

- (NSString *) player: (IFDrmPlayer *) view
        getGroupTitle: (id) sender
{
    return !nullStr(_groupTitle) ? _groupTitle : @"";
}

- (NSInteger) player: (IFDrmPlayer *) view
     getCurrentIndex: (id) sender
{
    return _currentPlayIndex;
}

- (void)    player: (IFDrmPlayer *) view
selectedOtherIndex: (NSInteger) index
{
    [self restartWithIndex: index];
}

- (void) player: (IFDrmPlayer *) view
 endMoviePlayer: (id) sender
{
    [self closePlayer];
}

#pragma mark - IFRateView

- (void) rateView: (IFRateView *) rateView
 changedToNewRate: (NSNumber *) rate
{
    //NSLog(@"    현재별점: %d", rate.intValue);
    _currentStar = [rate stringValue];
}

@end









