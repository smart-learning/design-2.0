
#import "IFDrmPlayer.h"

@interface IFDrmPlayer () < IFDrmPlayerUiViewDelegate, IFDrmMiniPlayerUiViewDelegate >
{
    IFDrmPlayerUiView *_playerUiView;
    IFDrmMiniPlayerUiView *_miniPlayerUiView;
    
    UIView *_player;
    NSTimer *_seekTimer;
    NSTimer *_logTimer;
    
    BOOL _isAudioContent;
    BOOL _isTransperPlayModeFromScreen;
    BOOL _isPlayVideoMode;
}

@end

@implementation IFDrmPlayer

#pragma mark - dealloc
- (void) dealloc
{
    [self removeNotifications];
}

- (void) removeNotifications
{
/*
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: AquaPlayerFinishedPlaybackNotification
                                                  object: nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: AquaPlayerLoadStateDidChangeNotification
                                                  object: nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: AquaPlayerPlaybackStateDidChangeNotification
                                                  object: nil];
    
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: AquaPlayerIsPreparedToPlayDidChangeNotification
                                                  object: nil];
*/
}

- (void) removePlayer
{
    // 플레이어가 미니모드로 내려가거나 플레이어가 종료될 때 호출됩니다.
    if ( _player )
    {
      //[AquaSDK exitPlayer];
        [_player removeFromSuperview];
        _player = nil;
        
        // 타이머도 종료합니다.
        [self stopLogTimer];
        
        // 호출경로 : 풀스크린플레이어 모드 -> 미니플레이어 모드 -> 스와이프 제스쳐로 강제종료. (따라서 미니플레이어 모드일때만 호출됨.)
        if ( _playerUiView.hidden )
        {
            // 이용로그 전송 시작
          //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
            NSTimeInterval cTime = 0000;
            [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                                  contentKey: self.ckey
                                                      status: @"ING"
                                                  downloaded: self.isDownloadFile
                                                startingTime: (int) (cTime * 1000)
                                                  endingTime: (int) (cTime * 1000)];    // 중간에 강제 종료임.
        }
    }
}

- (void) destroyPlayerView
{
    [self removeNotifications];
    [self invalidateTimer];
    
    [self removePlayer];
}

#pragma mark - init methods
- (id) initWithFrame: (CGRect) frame
{
    if ( self = [super initWithFrame: frame] )
    {
        [self initPlayer];
    }
    
    return self;
}

- (void) initPlayer
{
    self.backgroundColor = [UIColor blackColor];
}

- (void) initNotifications
{
  /*
    [[NSNotificationCenter defaultCenter] addObserver: self
                                             selector: @selector(didFinishNotification:)
                                                 name: AquaPlayerFinishedPlaybackNotification
                                               object: nil];
    
    [[NSNotificationCenter defaultCenter] addObserver: self
                                             selector: @selector(loadStateDidChangeNotification:)
                                                 name: AquaPlayerLoadStateDidChangeNotification
                                               object: nil];
    
    [[NSNotificationCenter defaultCenter] addObserver: self
                                             selector: @selector(playbackStateDidChangeNotification:)
                                                 name: AquaPlayerPlaybackStateDidChangeNotification
                                               object: nil];
    
    [[NSNotificationCenter defaultCenter] addObserver: self
                                             selector: @selector(isPreparedToPlayDidChangeNotification:)
                                                 name: AquaPlayerIsPreparedToPlayDidChangeNotification
                                               object: nil];
    
    [[NSNotificationCenter defaultCenter] addObserver: self
                                             selector: @selector(playerNotification:)
                                                 name: AquaPlayerNotification
                                               object: nil];
  */
}

- (void) initUiWithScriptArray: (NSArray *) scriptArray
                 isAudioConent: (BOOL) isAudioConent
{
    NSLog(@" [initUiWithScriptArray] ckey : %@", self.ckey);
    _playerUiView = [[IFDrmPlayerUiView alloc] initWithFrame: self.bounds
                                                 isAudioMode: isAudioConent
                                                    isAuthor: self.isAuthor
                                                        ckey: self.ckey];
    _playerUiView.delegate = self;
    _playerUiView.isPossibleAudioMode = self.isDownloadFile ? YES : !nullStr(self.audioUrl);
    _playerUiView.isDownloadFile = self.isDownloadFile;
    _playerUiView.isAuthor = self.isAuthor;
    [self addSubview: _playerUiView];
    
    _miniPlayerUiView = [[IFDrmMiniPlayerUiView alloc] initWithFrame: CGRectMake(0, 0, self.frame.size.width, 40.f)];
    _miniPlayerUiView.delegate = self;
    _miniPlayerUiView.isAuthor = self.isAuthor;
    [_miniPlayerUiView setControllerColorWithAudioMode: isAudioConent];
    [self addSubview: _miniPlayerUiView];
    
    _playerUiView.hidden = self.isMiniPlayer;
    _miniPlayerUiView.hidden = !self.isMiniPlayer;
    
    [_playerUiView setGkey: self.gkey
                      ckey: self.ckey];
    [_playerUiView setScriptArray: scriptArray];
}

- (void) setLectureTitle: (NSString *) lTitle
            contentTitle: (NSString *) cTitle
       audioBackImageUrl: (NSString *) audioBackImgUrl
{
    [_playerUiView setTitleLabel01: lTitle];
    [_playerUiView setTitleLabel02: cTitle];
    [_playerUiView setAudioContentBackgroundImageUrl: audioBackImgUrl];
    
    [_miniPlayerUiView setTitleLabel01: cTitle];
}

// 플레이어 모드 변경 (미니<->일반 플레이어뷰)
- (void) changedPlayerMode: (BOOL) isMiniPlayer
{
    _playerUiView.hidden = NO;
    _miniPlayerUiView.hidden = NO;
    
    _playerUiView.alpha = isMiniPlayer ? 1.f : 0.f;
    _miniPlayerUiView.alpha = isMiniPlayer ? 0.f : 1.f;
    
    [UIView animateWithDuration: 0.3f
                          delay: 0
                        options: UIViewAnimationOptionAllowUserInteraction
                     animations: ^{
                                     _playerUiView.alpha = isMiniPlayer ? 0.f : 1.f;
                                     _miniPlayerUiView.alpha = isMiniPlayer ? 1.f : 0.f;
                                 }
                     completion: ^(BOOL finished)
                                 {
                                     self.isMiniPlayer = isMiniPlayer;
                                     _playerUiView.hidden = self.isMiniPlayer;
                                     _miniPlayerUiView.hidden = !self.isMiniPlayer;
                                 }];
    
    if (isMiniPlayer)
    {
        // 이용로그 전송 시작
      //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
        NSTimeInterval cTime = 0000;
        [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                              contentKey: self.ckey
                                                  status: @"miniPlayer"
                                              downloaded: self.isDownloadFile
                                            startingTime: (int) (cTime * 1000)
                                              endingTime: (int) (cTime * 1000 + 30000)];
    }
    else
    {
        // 이용로그 전송 시작
      //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
        NSTimeInterval cTime = 0000;
        [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                              contentKey: self.ckey
                                                  status: @"fullPlayer"
                                              downloaded: self.isDownloadFile
                                            startingTime: (int) (cTime * 1000)
                                              endingTime: (int) (cTime * 1000 + 30000)];
    }
    
}

- (void) initPlayer: (NSString *) url
        isAudioMode: (BOOL) isAudioMode
        initialTime: (CGFloat) initialTime
{
    [self initPlayer: url
         isAudioMode: isAudioMode
         initialTime: initialTime
            autoPlay: YES];
}

// 컨텐츠 재생을 위한 플레이어 초기화 (컨텐츠 시작 & 플레이어 모드 변경 시 호출됨.)
- (void) initPlayer: (NSString *) url
        isAudioMode: (BOOL) isAudioMode
        initialTime: (CGFloat) initialTime
           autoPlay: (BOOL) autoPlay
{
  /*
    _isPlayVideoMode = !isAudioMode;
    
    AquaPlayerItem *playItem = [[AquaPlayerItem alloc] initWithURL: [NSURL URLWithString: url]];
    playItem.strAquaAuth = @"1";
    playItem.strMasterKey = @"veloc";
    playItem.bShouldAutoplay = autoPlay;
    playItem.iStartTime = initialTime;
    
    _player = [AquaSDK initPlayerWithItem: playItem
                                 delegate: self];
    _player.frame = self.bounds;
    [self addSubview: _player];
    [self sendSubviewToBack: _player];
    
    // 2017.07.18 - 인플루엔셜 요청으로 동영상도 백그라운드 재생하도록 변경.
    [AquaSDK setBackgroundPlaybackEnabled: YES];
  //[AquaSDK setBackgroundPlaybackEnabled: isAudioMode];
  */
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
    /*
    NSDictionary *dic = [AquaSDK getLocalContentInfoWithCustomerID: @"influential"
                                                               cID: cid];
    NSDictionary *contentInfo = [dic objectForKey: @"contentinfo"];
    
    // 컨텐츠 정보는 별도 UI 구성용으로 사용하거나, 컨텐츠의 상태를 체크하는 용도.
    if ( [[dic objectForKey: @"errcode"] integerValue] == AQSDKCORE_SIGNATURE_MISMATCH )
    {
    }
    else
    {
        if ( [[contentInfo objectForKey: @"expired"] boolValue] == YES )
        {
            // Content Expired
            // 컨텐츠를 정상 재생이 가능하도록 업데이트 한다.
            int resUpdate = [AquaSDK updateLocalContentRightWithCustomerID: @"influential"
                                                                       cID: cid];
            
            if( resUpdate != AQSDKCORE_RESULT_SUCCESS )
            {
                // see AquaSDKErrorCode
                return @"";
            }
        }
    }
    
    int resIsRightContent = 0;
    
    if ( 1 )   // is network status enable?
    {
        resIsRightContent = [AquaSDK isRightLocalContentPlayWithCustomerID: @"influential"
                                                                    userID: @"influential"
                                                                       cID: cid
                                                           childcustomerID: @""
                                                             networkStatus: 1];
    }
    
    // isRightLocalContentPlayWithCustomerID.... 는 컨텐츠 재생을 알리는 api이고,
    // 만약 재생이 불가능 할때는 오류 코드를 AQSDKCORE_RESULT_SUCCESS 가 아닌 코드를 리턴 한다.
    if ( resIsRightContent != AQSDKCORE_RESULT_SUCCESS )
    {
        // see AquaSDKErrorCode
        return @"";
    }
    */
    return path;
}

#pragma mark - layoutSubviews
- (void) layoutSubviews
{
    [super layoutSubviews];
}

- (void) rotateLayoutSubview: (CGSize) size
{
    if ( _playerUiView )
    {
        _playerUiView.frame = CGRectMake(0, 0, size.width, size.height);
        [_playerUiView reOrderSubviews];
    }
    
    if ( _miniPlayerUiView )
    {
        _miniPlayerUiView.frame = CGRectMake(_miniPlayerUiView.frame.origin.x,
                                             _miniPlayerUiView.frame.origin.y,
                                             size.width,
                                             _miniPlayerUiView.frame.size.height);
        [_miniPlayerUiView reOrderSubviews];
    }
}

#pragma mark - run player

// 플레이어시작 지점. 리스트 다음 영상에도 호출 확인 완료. 플레이어 모드 변경시 호출 않됨.
- (void) playWithUrl: (NSString *) url
         initialTime: (CGFloat) initialTime
         scirptArray: (NSArray *) scriptArray
      isAudioContent: (BOOL) isAudioContent
{
    if ( nullStr(url) )
    {
        return ;
    }
    
    [self destroyPlayerView];
    
    [self initNotifications];
    
    [self initPlayer: url
         isAudioMode: isAudioContent
         initialTime: initialTime];
    
    [self initUiWithScriptArray: scriptArray
                  isAudioConent: isAudioContent];
    
    _isAudioContent = isAudioContent;
    
    // 플레이어가 시작되면 일단 백그라운드에서 돌고있을지도 모를 타이머를 일단 종료합니다.
    [self stopLogTimer];
    
    // 이용로그 전송 시작
  //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
    NSTimeInterval cTime = 0000;
    [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                          contentKey: self.ckey
                                              status: @"START"
                                          downloaded: self.isDownloadFile
                                        startingTime: (int) (cTime * 1000)
                                          endingTime: (int) (cTime * 1000 + 30000)];
    
    // NSTimer를 통해 30초마다 로그내역을 전송
    NSLog(@"  [__NSTimer__] 30초 뒤에 타이머가 가동됩니다.");
    _logTimer = [NSTimer scheduledTimerWithTimeInterval: 30
                                                 target: self
                                               selector: @selector(reloadData:)
                                               userInfo: nil
                                                repeats: YES];
    // 30초마다 반복해서 reloadData 함수를 호출.
}

// pause -> play시 호출됨을 확인
- (void) play
{
//    if ( AquaPlayerPlaybackStatePlaying != [AquaSDK getPlaybackState] && AquaPlayerLoadStateUnknown != [AquaSDK getLoadState] )
//    {
//      //NSLog(@"  [PLAYER_play]");
//        [AquaSDK aquaPlay];
//    }
}

// 재생중인 컨텐츠의 일시정지 시 호출됨 (단, 서치바에서의 시간탐색을 실시할 경우에도 실행됨.)
- (void) pause
{
//    if ( AquaPlayerPlaybackStatePlaying == [AquaSDK getPlaybackState] && AquaPlayerLoadStateUnknown != [AquaSDK getLoadState] )
//    {
//      //NSLog(@"  [PLAYER_pause]");
//        [AquaSDK aquaPause];
//      //[self stopLogTimer]; // 로그 전송 일시중지
//    }
}

// 로그로 아직 확인안됨. (시도방법: 밑으로 내린 후 슬라이드로 종료 & 컨텐츠 재생이 끝날때까지 대기)
- (void) stop
{
//    if ( AquaPlayerPlaybackStatePlaying == [AquaSDK getPlaybackState] && AquaPlayerLoadStateUnknown != [AquaSDK getLoadState] )
//    {
//        NSLog(@"  [PLAYER_stop]");
//        [AquaSDK aquaStop];
//    }
}

// 재생 시간 탐색 (수동, 10초 이동 메뉴 등)
- (void) seekToTimeInterval: (NSTimeInterval) time
{
//    if ( AquaPlayerLoadStateUnknown != [AquaSDK getLoadState] )
//    {
//        NSLog(@"  [seekToTimeInterval] 재생시간탐색 : %f 초", time);
//        [AquaSDK seekToTime: time];
//    }
}

// 재생
- (void) didPlay
{
    [self setTimer];
    
    if ( _miniPlayerUiView )
    {
        [_miniPlayerUiView setPlayState: YES];
    }
    
    if ( _playerUiView )
    {
        [_playerUiView setPlayState: YES];
    }
}

// 일시정지
- (void) didPause
{
    [self invalidateTimer];
    
    if ( _miniPlayerUiView )
    {
        [_miniPlayerUiView setPlayState: NO];
    }
    
    if ( _playerUiView )
    {
        [_playerUiView setPlayState: NO];
    }
}

- (void) movePlayTimeWithRewind: (BOOL) isRewind
                           time: (NSTimeInterval) time
{
  //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
    NSTimeInterval cTime = 0000;
  //NSTimeInterval tTime = [AquaSDK getTotalPlaybackTime];
    NSTimeInterval tTime = 60000;
  
    if ( isRewind )
    {
        if ( cTime > time )
        {
            [self seekToTimeInterval: cTime - time];
        }
        else
        {
            [self seekToTimeInterval: 0];
        }
    }
    else
    {
        if ( cTime + time < tTime )
        {
            [self seekToTimeInterval: cTime + time];
        }
        else
        {
            [self seekToTimeInterval: tTime];
        }
    }
}

- (void) setSpeed: (CGFloat) speed
{
//    if ( [AquaSDK getCurrentPlaybackRate] != speed )
//    {
//        [AquaSDK setPlaybackRate: speed];
//    }
}

//- (AquaPlayerPlaybackState) getPlayStatus
//{
//    return [AquaSDK getPlaybackState];
//}

- (CGFloat) getPlaybackTime
{
//    return [AquaSDK getCurrentPlaybackTime];
    return 60000;
}

- (void) changePlayType: (BOOL) isAudioMode
{
  //CGFloat initialTime = [AquaSDK getCurrentPlaybackTime];
    CGFloat initialTime = 0000;
  //BOOL isPaused = ([self getPlayStatus] != AquaPlayerPlaybackStatePlaying);
    BOOL isPaused = true;
    
    [self removePlayer];
    
    NSString *url = isAudioMode ? self.audioUrl : self.videoUrl;
    
    // 다운로드 파일이 있을 경우 무조건 다운로드 파일로 플레이.
    if ( self.isDownloadFile )
    {
        url = self.videoUrl;
    }
    
    [self initPlayer: url
         isAudioMode: isAudioMode
         initialTime: initialTime
            autoPlay: !isPaused];
}

#pragma mark - private methods..
- (void) setTimer
{
    [self invalidateTimer];
    
    _seekTimer = [NSTimer scheduledTimerWithTimeInterval: 0.5f
                                                 repeats: YES
                                                   block: ^(NSTimer * _Nonnull timer)
                                                          {
                                                              //NSTimeInterval playTime = [AquaSDK getCurrentPlaybackTime];
                                                              NSTimeInterval playTime = 0000;
                                                              [_playerUiView setSeekbarCurrentValue: playTime];
                                                              [_playerUiView setCurrentTime: playTime
                                                                                forceChange: NO];
                                                              [_miniPlayerUiView setSeekbarCurrentValue: playTime];
                                                              
                                                              if ( [self.delegate respondsToSelector: @selector(player:didChangedPlayTime:)] )
                                                              {
                                                                  [self.delegate player: self
                                                                     didChangedPlayTime: playTime];
                                                              }
                                                              
                                                              if ( !self.isAuthor && !_isAudioContent )
                                                              {
                                                                  if ( playTime >= 90.f )
                                                                  {
                                                                      [self stop];
                                                                      
                                                                      if ( [self.delegate respondsToSelector: @selector(player:didFinishedPlay:)] )
                                                                      {
                                                                          [self.delegate player: self
                                                                                didFinishedPlay: nil];
                                                                      }
                                                                  }
                                                              }
                                                          }];
    
    if ( _seekTimer )
    {
        [[NSRunLoop currentRunLoop] addTimer: _seekTimer
                                     forMode: NSRunLoopCommonModes];
    }
}

- (void) invalidateTimer
{
    NSLog(@"    [invalidateTimer]");
    
    if ( _seekTimer && _seekTimer.isValid )
    {
        [_seekTimer invalidate];
    }
    
    _seekTimer = nil;
}

#pragma mark - notifications

- (void) playerNotification: (NSNotification *) noti
{
    long lAquaPlayerState = [[noti.userInfo objectForKey: @"AquaPlayerState"] integerValue];
    
    switch ( lAquaPlayerState )
    {
      //case AquaPlayerStateDidExitPlayer:
            break;
    }
}

- (void) didFinishNotification: (NSNotification *) aNotification
{
    if ( [self.delegate respondsToSelector: @selector(player:didFinishedPlay:)] )
    {
        [self.delegate player: self
              didFinishedPlay: nil];
    }
}

- (void) loadStateDidChangeNotification: (NSNotification *) aNotification
{
  //NSLog(@"    [loadStateDidChangeNotification] AquaSDK getLoadState : %ld", (long)[AquaSDK getLoadState]);
    
//    switch ( (long)[AquaSDK getLoadState] )
//    {
//        case AquaPlayerLoadStateUnknown:
//            break;
//
//        case AquaPlayerLoadStatePlayable:
//            break;
//
//        case AquaPlayerLoadStatePlaythroughOK:
//            break;
//
//        case AquaPlayerLoadStateStalled:
//            break;
//    }
}

- (void) playbackStateDidChangeNotification: (NSNotification *) aNotification
{
    CGFloat speed = 0.f;
    
//    switch ( (long)[AquaSDK getPlaybackState] )
//    {
//        case AquaPlayerPlaybackStateStopped:
//            [self didPause];
//            break;
//
//        case AquaPlayerPlaybackStatePlaying:
//            speed = [[NSUserDefaults standardUserDefaults] floatForKey: @"playSpeed"];
//            [self setSpeed:(speed == 0.f ? 1.f : speed)];
//
//            [self didPlay];
//            break;
//
//        case AquaPlayerPlaybackStatePaused:
//            [self didPause];
//            break;
//    }
}

- (void) isPreparedToPlayDidChangeNotification: (NSNotification *) aNotification
{
    NSLog(@"    [isPreparedToPlayDidChangeNotification] aNotification.userInfo : %@", aNotification.userInfo);
    
  //NSTimeInterval currentTime = [AquaSDK getCurrentPlaybackTime];
  //NSTimeInterval totalTime = [AquaSDK getTotalPlaybackTime];
    NSTimeInterval currentTime = 0000;
    NSTimeInterval totalTime = 65000;
    
    NSMutableDictionary *playInfo = [NSMutableDictionary dictionary];
    playInfo[@"currentTime"] = @(currentTime);
    playInfo[@"totalTime"] = @(totalTime);
    playInfo[@"isAudioContent"] = @(_isAudioContent);   // 미니플레이어에서의 미리보기컨텐츠의 시간세팅을 위한 기준 값. 171102 김태현
    
    [_playerUiView setPreparedToPlayInfo: playInfo];
    [_miniPlayerUiView setPreparedToPlayInfo: playInfo];
}

#pragma mark - Protocol

- (void) didExitPlayerWithErrorCode: (NSInteger) errorCode
{
    switch ( errorCode )
    {
        default:
            break;
    }
}

- (void) returnWarningPlayerErrorCode: (NSInteger) errorCode
{
    switch ( errorCode )
    {
//        case AQSDKNOTI_SECTIONPLAY_FINISHED:
//            NSLog(@"    [returnWarningPlayerErrorCode] 재생완료");
//            break;
        
        default:
            break;
    }
}

#pragma mark - IFDrmPlayerUiViewDelegate
- (void) playerUiView: (IFDrmPlayerUiView *) view
            closeView: (id) sender
{
    if ( [self.delegate respondsToSelector: @selector(player:closeView:)] )
    {
        [self.delegate player: self closeView: nil];
    }
    
    //미니플레이어로 전환 : 오디오 모드로 전환
    if ( view.isPossibleAudioMode && _isPlayVideoMode )
    {
        _isTransperPlayModeFromScreen = YES;
        [self playerUiView: view changeToMode: YES];
    }
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
              setPlay: (BOOL) isPlay
{
    if ( isPlay )
        [self play];
    else
        [self pause];
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
                setRW: (NSTimeInterval) time
{
    [self movePlayTimeWithRewind: YES
                            time: time];
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
                setFF: (NSTimeInterval) time
{
    [self movePlayTimeWithRewind: NO
                            time: time];
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
             setSpeed: (CGFloat) speed
{
    [self setSpeed: speed];
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
      seekbarDragging: (NSTimeInterval) time
{
    [self pause];
    [self seekToTimeInterval: time];
}

// 서치바 이동 완료시점에 한번만 호출됨.
- (void) playerUiView: (IFDrmPlayerUiView *) view
       seekbarDragEnd: (NSTimeInterval) time
{
    [self seekToTimeInterval: time];
    [self play];
    
    // 기존 타이머를 종료시키고 재시작
    [self stopLogTimer];
    // NSTimer를 통해 30초마다 로그내역을 전송
    NSLog(@"  [__NSTimer__] 30초 뒤에 타이머가 가동됩니다.");
    _logTimer = [NSTimer scheduledTimerWithTimeInterval: 30
                                                 target: self
                                               selector: @selector(reloadData:)
                                               userInfo: nil
                                                repeats: YES];
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
         changeToMode: (BOOL) isAudioMode
{
    [self changePlayType: isAudioMode];
}

- (NSArray *) playerUiView: (IFDrmPlayerUiView *) view
            getContentList: (id) sender
{
    NSArray *list = nil;
    
    if ( [self.delegate respondsToSelector: @selector(player:getContentList:)] )
    {
        list = [self.delegate player: self getContentList: nil];
    }
    
    return list;
}

- (NSString *) playerUiView: (IFDrmPlayerUiView *) view
              getGroupTitle: (id) sender
{
    NSString *title = @"";
    
    if ( [self.delegate respondsToSelector: @selector(player:getGroupTitle:)])
    {
        title = [self.delegate player: self getGroupTitle: nil];
    }
    
    return title;
}

- (NSInteger) playerUiView: (IFDrmPlayerUiView *) view
           getCurrentIndex: (id) sender
{
    NSInteger index = -1;
    
    if ( [self.delegate respondsToSelector: @selector(player:getCurrentIndex:)] )
    {
        index = [self.delegate player: self getCurrentIndex: nil];
    }
    
    return index;
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
   selectedOtherIndex: (NSInteger) index
{
    if ( [self.delegate respondsToSelector: @selector(player:selectedOtherIndex:)] )
    {
        [self.delegate player: self selectedOtherIndex: index];
    }
}

- (void) playerUiView: (IFDrmPlayerUiView *) view
 changeToDownloadFile: (BOOL) isAudioMode
{
  //CGFloat initialTime = [AquaSDK getCurrentPlaybackTime];
    CGFloat initialTime = 0000;
  
    [self removePlayer];

    self.isDownloadFile = YES;
    
    if ( [[DbManager sharedInstance] hasContentWithCKey: self.ckey] )
    {
        NSDictionary *info = [[DbManager sharedInstance] getDownloadContentWithGroupKey: self.gkey
                                                                                   cKey: self.ckey];
        
        if ( info )
        {
            NSString *path = [self pathFromWithMediaInfo: info];
            
            if ( !nullStr(path) )
            {
                self.videoUrl = path;
                self.isDownloadFile = YES;
            }
        }
    }

    [self initPlayer: self.videoUrl
         isAudioMode: isAudioMode
         initialTime: initialTime];
}

#pragma mark - IFDrmMiniPlayerUiViewDelegate
- (void) miniPlayerUiView: (IFDrmMiniPlayerUiView *) view
                 openView: (id) sender
{
    if ( [self.delegate respondsToSelector: @selector(player:openView:)] )
    {
        [self.delegate player: self openView: nil];
    }
    
    //풀스크린 플레이어로 전환 : 영상 모드로 전환
    //미니플레이어로 전환 : 오디오 모드로 전환
    if ( _isTransperPlayModeFromScreen )
    {
        _isTransperPlayModeFromScreen = NO;
        [self changePlayType: NO];
    }
}

- (void) miniPlayerUiView: (IFDrmMiniPlayerUiView *) view
                  setPlay: (BOOL) isPlay
{
    if ( isPlay )
        [self play];
    else
        [self pause];
}

- (void) miniPlayerUiView: (IFDrmMiniPlayerUiView *) view
                closeView: (id) sender
{
    if ( [self.delegate respondsToSelector: @selector(player:endMoviePlayer:)] )
    {
        [self.delegate player: self endMoviePlayer: nil];
    }
}

#pragma mark - Timer event
- (void) reloadData: (NSTimer *) timer
{
    // 이용로그 전송 시작
  //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
    NSTimeInterval cTime = 0000;
  
    [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                          contentKey: self.ckey
                                              status: @"ING"
                                          downloaded: self.isDownloadFile
                                        startingTime: (int) (cTime * 1000)
                                          endingTime: (int) (cTime * 1000 + 30000)];
    NSLog(@"  [reloadData] 타이머에 예약에 의해 30초마다 서버로 사용로그를 전송합니다.");
}

// 시간탐색, 플레이어 종료, 일시 중지, 등의 이벤트 시 타이머 종료 시킴.
- (void) stopLogTimer
{
    // 타이머 종료.
    [_logTimer invalidate];
    NSLog(@"  [__NSTimer__] 타이머가 종료되었습니다..");
}

@end













