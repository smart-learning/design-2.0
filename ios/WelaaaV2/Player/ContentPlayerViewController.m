
#import "ContentPlayerViewController.h"

@implementation ContentPlayerViewController

//
// RN에서 넘겨받은 arguments를 세팅합니다.
//
- (void) setContentData : (NSMutableDictionary *) args
{
    _args = args;
    NSLog(@"  Arguments : %@", [_args description]);
  
    // download 일 경우 API서버와 통신하면 안됩니다.
}

// 해당 뷰컨트롤러 클래스가 생성될 때(ViewWillAppear전에 실행) 실행됩니다.
// Low memory와같은 특별한 경우가 아니라면 딱 한번만 실행되기 때문에 초기화 할 때 사용 할 수 있습니다.
- (void) viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [self.view setBackgroundColor : [UIColor blackColor]];
  
    // PallyConFPS SDK 객체를 생성합니다.
    _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                              siteKey : PALLYCON_SITE_KEY
                                   fpsLicenseDelegate : self
                                                error : nil             ];
  
    // 오디오 콘텐츠인지 구분.
    if ( [[_args objectForKey : @"cid"] hasPrefix : @"b"] )
    {
        _isAudioContent = YES;
        _isAudioMode = YES;   // 오디오북일 경우 기본적으로 오디오모드 on인 상태에서 콘텐츠 재생을 시작합니다.
    }
    else if ( [[_args objectForKey : @"cid"] hasPrefix : @"v"] )
    {
        _isAudioContent = NO;
        _isAudioMode = false; // 영상강의의 경우 기본적으로 오디오모드 off인 상태에서 콘텐츠 재생을 시작합니다.
    }
    else if ( [[_args objectForKey : @"cid"] hasPrefix : @"z"] )  // z_ : 매일 책한권 콘텐츠.
    {
      _isDailyBook = YES;
      _isAudioMode = YES;
    }
  
    if ( [[_args objectForKey : @"contentPath"] hasPrefix : @"/private/var/mobile/"] )
        _isDownloadFile = true;
    else
        _isDownloadFile = false;
  
    [self drawContentView];
  
    _fpsDownloadManager = [FPSDownloadManager sharedInstance];
    _fpsDownloadManager.delegateFpsMsg = self;
    _fpsDownloadManager.delegateFpsDownload = self;
  
    // 어플리케이션이 백그라운드로 들어갔을 때 재생을 멈추지 않게 하기 위한 처리. 2018.8.21
    [[NSNotificationCenter defaultCenter] addObserver : self
                                             selector : @selector(applicationDidEnterBackground:)
                                                 name : UIApplicationDidEnterBackgroundNotification
                                               object : nil];
}

// 뷰 컨트롤러가 화면에 나타나기 직전에 실행됩니다.
// 뷰 컨트롤러가 나타나기 직전에 항상 실행되기 때문에 해당 뷰 컨트롤러가 나타나기 직전마다 일어나는 작업들을 여기에 배치 시킬 수 있습니다.
- (void) viewWillAppear : (BOOL) animated
{
    [common hideStatusBar];
  
    // RN 콘텐츠 상세페이지에서 큰 재생아이콘을 탭해서 재생할 경우 Content ID가 아닌 Content Group ID를 arguments로 받아옵니다
    // 일단 history check 보다는 group의 제일 처음이 _001을 append시킵니다.
    // Netflix나 다른 동영상 서비스처럼 재생 이력을 JSON에서 읽어와서 최근 재생시간부터 재생합니다.
    NSString *str = @"";
    str = [_args objectForKey : @"cid"];
    NSRange strRange;
    strRange = [str rangeOfString : @"_"];
  
    if ( strRange.location == NSNotFound )
    {
        [_args setObject : [str stringByAppendingString : @"_001"]
                  forKey : @"cid"];
    }
  
    // 강좌 전체 클립 또는 오디오북 전체 챕터를 가져옵니다.
    NSArray *chunks = [[_args objectForKey : @"cid"] componentsSeparatedByString : @"_"]; // cid를 '_'로 분류하여 각각 array chunk처리합니다.
    // content-info API에 파라미터로 Content Group ID를 넣어 chapter또는clip 데이터를 가져옵니다.
    _currentContentsInfo = [ApiManager getContentsInfoWithCgid : chunks[0]
                                                 andHeaderInfo : [_args objectForKey : @"token"]];
  
    // 현재 콘텐트의 재생권한.
    if ( [[_currentContentsInfo[@"permission"][@"can_play"] stringValue] isEqualToString : @"0"] )
    {
        _isAuthor = false;
    }
    else
    {
        _isAuthor = true;
    }
    NSLog(@"  Permission check : %@", _isAuthor? @"YES" : @"NO");
  
    // 오디오북 제목 챕터로 시작되면 다음챕터로 넘깁니다.
    // 오디오북 콘텐츠만이 제목챕터를 가지고 있습니다.
    if ( _isAudioContent )
    {
        // 오디오북 or 오디오모드 용 배경이미지를 세팅합니다.
        [self setAudioContentBackgroundImageUrl : _currentContentsInfo[@"data"][@"images"][@"cover"]];
      
        NSArray *contentsListArray = _currentContentsInfo[@"data"][@"chapters"];
        NSInteger indexOfCurrentContent = 0;
      
        // 재생 권한이 없는 오디오북이라면 프리뷰챕터의 인덱스를 검색합니다.
        if ( !_isAuthor )
        {
            for ( int i=0; i<contentsListArray.count; i++ )
            {
                if ( [[contentsListArray[i][@"is_preview"] stringValue] isEqualToString : @"1"] )
                {
                    indexOfCurrentContent = i;
                    break;
                }
            }
        }
        // 재생 권한이 있는 오디오북에서는..
        else if ( _isAuthor )
        {
            for ( int i=0; i<contentsListArray.count; i++ )
            {
                // 현재 재생중인 콘텐트의 cid와 콘텐츠정보의 배열의 cid와 일치한다면..
                if ( [[_args objectForKey:@"cid"] isEqualToString : contentsListArray[i][@"cid"]] )
                {
                    // 현재 재생할 콘텐트의 play_seconds의 정수값이 0일 경우
                    if ( [[contentsListArray[i][@"play_seconds"] stringValue] isEqualToString : @"0"] )
                    {
                        NSLog(@"  Audiobook title chapter.");
                        // 다음 콘텐츠의 play_seconds가 '0'이 아닌 경우에만 해당 cid와 uri를 세팅하여 playNext로 넘깁시다.
                        for ( i = i+1; i < contentsListArray.count-1; i++ )
                        {
                            if ( ![[contentsListArray[i][@"play_seconds"] stringValue] isEqualToString : @"0"] )
                            {
                                break;
                            }
                        }
                      
                        indexOfCurrentContent = i;
                        break;
                    }
                    // 현재 재생할 콘텐트의 play_seconds의 정수값이 0이 아닐 경우
                    else
                    {
                        indexOfCurrentContent = i;
                        break;
                    }
                }
            }
        }
      
        [_args setObject : contentsListArray[indexOfCurrentContent][@"cid"]
                  forKey : @"cid"];
      
        // 2018.10.23 ~
        // 로컬에 저장된 콘텐츠가 있는지 확인해서 있으면 uri 를 그 경로로 대체한다.
        // cid 를 검색해서 다운받은 콘텐츠가 있으면 그 콘텐츠 재생경로로 셋팅하는 방식(버튼도 다운로드 완료된 상태로 업데이트)
        //  -> 재생권한에 대해서는 체크 필요 없는걸로 판단(오디오북이므로 권한이 없는 경우에도 다운받은 프리뷰 챕터는 재생해도 되기 때문)
        // 다운로드 중일 때의 상태도 체크해서 버튼 반영
        [_args setObject : [self getContentUri:[_args objectForKey:@"cid"]]
                  forKey : @"uri"];
        // ~ 2018.10.24
      
        _currentLectureTitle = contentsListArray[indexOfCurrentContent][@"title"];  // 챕터 이동과 상관없이 일단 소챕터명을 세팅합니다.
    }
    else if ( !_isAudioContent )  // '영상 콘텐츠' 또는 '매일 책 한권'의 경우..
    {
        NSArray *contentsListArray = _currentContentsInfo[@"data"][@"clips"]; // '매일 책 한권' 도 data.clips의 구조로 되어있습니다.
        NSInteger indexOfCurrentContent = 0;
      
        for ( int i=0; i<contentsListArray.count; i++ )
        {
            // 현재 재생중인 콘텐트의 cid와 콘텐츠정보의 배열의 cid와 일치한다면..
            if ( [[_args objectForKey:@"cid"] isEqualToString : contentsListArray[i][@"cid"]] )
            {
                indexOfCurrentContent = i;
                break;
            }
        }
      
        [_args setObject : contentsListArray[indexOfCurrentContent][@"cid"]
                  forKey : @"cid"];
      
        NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                      andHeaderInfo : [_args objectForKey : @"token"]];
      
        if ( !_isAuthor )
        {
            NSLog(@"  playDataDics : %@", playDataDics);
            NSLog(@"  playDataDics.preview_urls : %@", playDataDics[@"preview_urls"]);
            if ( [playDataDics[@"preview_urls"] isKindOfClass : [NSDictionary class]] )
            {
                [_args setObject : playDataDics[@"preview_urls"][@"HLS"]
                          forKey : @"uri"];
            }
            else
            {
                NSLog(@"  preview_urls.HLS == nil");
                [self closePlayer];
            }
            
        }
        else if ( _isAuthor )
        {
          // 2018.10.23 ~
          // cid 를 검색해서 다운받은 콘텐츠가 있으면 그 콘텐츠로 셋팅(버튼도 다운로드 완료된 상태로 업데이트)
          // 다운로드 대기중일 때 상태도 체크해서 버튼 반영
          [_args setObject : [self getContentUri:[_args objectForKey:@"cid"]]
                    forKey : @"uri"];
          // ~ 2018.10.24
        }
      
        _currentLectureTitle = contentsListArray[indexOfCurrentContent][@"title"];
    }
  
    [self fpsSetUrlAsset];
  
    _playerItem = [AVPlayerItem playerItemWithAsset : _urlAsset];
    _playerItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmSpectral;  // 재생속도 관련.
    _player = [ AVPlayer playerWithPlayerItem : _playerItem ];
  
    // _contentView에 add하기위해 AVPlayerViewController가 아닌 AVPlayerLayer를 사용합니다.
    _playerLayer = [AVPlayerLayer playerLayerWithPlayer : _player];
    _playerLayer.frame = _contentView.bounds;
    [_playerLayer setVideoGravity : AVLayerVideoGravityResizeAspect]; // 가로세로 비율을 유지하고 비디오를 레이어의 경계 내에 맞출 수 있도록 지정합니다.
  
    [_contentView.layer addSublayer : _playerLayer];
  
    // 오디오북 콘텐츠일 경우 Player Layer를 숨깁니다.
    if ( _isAudioContent )
    {
        _playerLayer.hidden = YES;
    }
}

// 뷰 컨트롤러가 화면에 나타난 직후에 실행됩니다.
// 화면에 적용될 애니메이션을 그리거나 API로 부터 정보를 받아와 화면을 업데이트 할 때 이곳에 로직을 위치시키면 좋습니다.
// 왜냐하면 지나치게 빨리 애니메이션을 그리거나 API에서 정보를 받아와 뷰 컨트롤러를 업데이트 할 경우 화면에 반영되지 않습니다.
- (void) viewDidAppear : (BOOL) animated
{
    // 스프링보드의 제어센터에서의 이벤트를 앱내에서 받습니다.
    [[UIApplication sharedApplication] beginReceivingRemoteControlEvents];
    [self becomeFirstResponder];
  
    // title을 변경합니다. 추후에 사용하지 않을 수 도 있습니다.
    [_args setObject : _currentContentsInfo[@"data"][@"title"]
              forKey : @"name"];
  
    [self drawPlayerControlHeader];
    [self drawPlayerControlBottom];
    [self updateDownloadState];
  
    // URL Asset에서 duration을 가져올 수 있지만 setContentData에서 API를 통한 세팅도 고려해 볼 수 있습니다.
    //CGFloat totalTime = CMTimeGetSeconds(_urlAsset.duration);// + 1; 추후에 +1초 할 수 있습니다.
  
    [self setPreparedToPlay];
    [self initScriptUi];
  
    // 플레이어 뷰컨트롤러가 생성되고 첫 재생 시작.
    _playbackRate = 1.f;  // 재생 속도의 default는 항상 1입니다.
    [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    [_player play];   // 플레이어 재생 실행
    [ [NSNotificationCenter defaultCenter] addObserver : self
                                              selector : @selector(videoPlayBackDidFinish:)
                                                  name : AVPlayerItemDidPlayToEndTimeNotification
                                                object : [_player currentItem]  ];
    [self setPlayState : YES];
  
  //[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
  
    [ [NSNotificationCenter defaultCenter] addObserver : self
                                              selector : @selector(audioSessionInterrupted:)
                                                  name : AVAudioSessionInterruptionNotification
                                                object : nil];
  
    [self setupNowPlayingInfoCenter]; // 시간값을 파라미터로 받아서 Pause또는Play시에 시간값을 반영하도록 만듭시다!
    
    // 플레이어가 시작되면 일단 백그라운드에서 돌고있을지도 모를 타이머를 일단 종료합니다.
    [_logTimer invalidate];
  
    NSString *netStatus = @"no_network";  // 첫 로그를 보낼때 no_network로 그대로 찍히는 경우가 있음.. 비동기방식으로 net status를 받아와서 일까?
    if ( _isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-Fi";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
    }
    NSLog(@"  Net Status = %@", netStatus);
    [ApiManager sendPlaybackProgressWith : [_args objectForKey : @"cid"]
                                  action : @"START"             // START / ING / END / FORWARD / BACK
                             startSecond : [self getCurrentPlaybackTime]
                               endSecond : [self getCurrentPlaybackTime] + 30
                                duration : 30 - [self getCurrentPlaybackTime]
                               netStatus : netStatus
                               authToken : [_args objectForKey : @"token"]];
    // NSTimer를 통해 30초마다 로그내역을 전송
    _logTimer = [NSTimer scheduledTimerWithTimeInterval : 30
                                                 target : self
                                               selector : @selector(reloadLogData:)
                                               userInfo : nil
                                                repeats : YES];
  
    // 영상시작후 3초간 입력이 없으면 컨트롤러를 자동으로 Hide.
    [self performSelector : @selector(pressedHideAndShowButton)
               withObject : nil
               afterDelay : 3.0f];
}

// View가 사라질 준비가 끝날을 때 호출되는 메서드
- (void) viewWillDisappear : (BOOL) animated
{
    [super viewWillDisappear : animated];
    NSLog(@"  [viewWillDisappear] This view will disappear..");
  
    [_player pause];
    [_playerLayer removeFromSuperlayer];
    _playerLayer.player = nil;
    [self invalidateTimerOnSlider];
    [_logTimer invalidate];
    [[NSNotificationCenter defaultCenter] removeObserver : self
                                                    name : AVPlayerItemDidPlayToEndTimeNotification
                                                  object : nil];
    [[NSNotificationCenter defaultCenter] removeObserver : self
                                                    name : UIApplicationDidEnterBackgroundNotification
                                                  object : nil];
     
    [common showStatusBar];
  
    [[UIApplication sharedApplication] endReceivingRemoteControlEvents];
    [self resignFirstResponder];
}

- (void) didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
- (void) fpsSetUrlAsset
{
    NSURL *contentUrl = [NSURL URLWithString : [_args objectForKey : @"uri"]];
    _urlAsset = [[AVURLAsset alloc] initWithURL:contentUrl options:nil];
  
    // FPS 콘텐츠가 재생 되기 전에 FPS 콘텐츠 정보를 설정합니다.
    [_fpsSDK prepareWithUrlAsset : _urlAsset
                          userId : [_args objectForKey : @"userId"]
                       contentId : [_args objectForKey : @"cid"] // PALLYCON_CONTENT_ID
                      optionalId : [_args objectForKey : @"oid"] // PALLYCON_OPTIONAL_ID
                 liveKeyRotation : NO];
}
*/
- (void) fpsSetUrlAsset
{
    FPSDownloadManager *fps = [FPSDownloadManager sharedInstance];
    
    NSString* assetPath = [_args objectForKey : @"uri"];
    
    if([fps isPlayableOfflineAsset:assetPath]){ // 오프라인 재생 가능 파일인지 확인
        NSURL* baseURL = [NSURL fileURLWithPath:NSHomeDirectory()];
        NSString* assetURL = [[baseURL absoluteString] stringByAppendingPathComponent:[fps getPathFromLibraryDir:assetPath]];
        NSLog(@"오프라인 재생 가능 -> assetURL : %@", assetURL);
        _urlAsset = [AVURLAsset assetWithURL:[NSURL URLWithString:assetURL]];
        _isDownloadFile = true;
    }else{  // 오프라인 재생 파일이 아닌 경우
        NSLog(@"오프라인 재생 불가 파일 -> 스트리밍 재생");
        NSURL *contentUrl = [NSURL URLWithString : [_args objectForKey : @"uri"]];
        _urlAsset = [[AVURLAsset alloc] initWithURL:contentUrl options:nil];
        _isDownloadFile = false;
    }
    
    // FPS 콘텐츠가 재생 되기 전에 FPS 콘텐츠 정보를 설정합니다.
    [_fpsSDK prepareWithUrlAsset : _urlAsset
                          userId : [_args objectForKey : @"userId"]
                       contentId : [_args objectForKey : @"cid"] // PALLYCON_CONTENT_ID
                      optionalId : [_args objectForKey : @"oid"] // PALLYCON_OPTIONAL_ID
                 liveKeyRotation : NO];
}

- (void) fpsLicenseDidSuccessAcquiringWithContentId : (NSString * _Nonnull) contentId
{
    NSLog(@"  [fpsLicenseDidSuccessAcquiringWithContentId] ContentID : %@", contentId);
}

- (void) fpsLicenseWithContentId : (NSString * _Nonnull) contentId
                didFailWithError : (NSError * _Nonnull) error
{
    NSLog(@"  [fpsLicenseWithContentId:didFailWithError:] : %@", error.localizedDescription);
    // 종료 메시지와 함께 뷰를 종료시킵니다.
}

//
// 컨텐트의 재생이 모두 끝나면 호출됩니다.
//
- (void) videoPlayBackDidFinish : (NSNotification *) notification
{
    [_player pause];
    [ [NSNotificationCenter defaultCenter] removeObserver : self
                                                     name : AVPlayerItemDidPlayToEndTimeNotification
                                                   object : nil                                     ];
  
    // 콘텐츠에 대한 권한이 있어도 사용자가 자동재생을 disable시켰다면 종료시켜야합니다.
    NSString *autoPlaySetup = [common getUserSettingValueWithKey : @"autoplay_enable"];
  
    if ( [autoPlaySetup isEqualToString : @"N"] )
    {
        [self closePlayer];
      
        return ;
    }
  
    // 현재 재생중인 콘텐트의 권한이 없다면 종료시킵니다.
    if ( !_isAuthor )
    {
        [self closePlayer];
      
        return ;
    }
  
    // '매일 책 한권' 콘텐츠일 경우 종료시킵니다.
    if ( _isDailyBook )
    {
        [self closePlayer];
      
        return ;
    }
    
    // 다음 재생할 item이 있는지 검색하여 플레이할 것인지 추천영상뷰를 띄울것인지 결정해야합니다.
    NSArray *contentsListArray;
    if ( _isAudioContent )
      contentsListArray = _currentContentsInfo[@"data"][@"chapters"];
    else if ( !_isAudioContent )
      contentsListArray = _currentContentsInfo[@"data"][@"clips"];
  
    NSInteger indexOfCurrentContent = 0;
  
    for (int i=0; i<contentsListArray.count; i++)
    {
        // 현재 재생중인 콘텐트의 cid와 콘텐츠정보의 배열의 cid와 일치한다면..
        if ( [[_args objectForKey:@"cid"] isEqualToString : contentsListArray[i][@"cid"]] )
        {
            indexOfCurrentContent = i;
        }
    }
  
    // 재생할 다음 콘텐츠가 남아있다면..
    if ( indexOfCurrentContent < contentsListArray.count-1 )
    {
        // 무조건 다음 CID와 URI를 세팅하지 말고 오디오북의 제목챕터인지 검사하여 정상적인 다음 순서의 콘텐츠로 재생해야 합니다.
        // 일단 오디오북 콘텐츠인지 확인부터 합니다.
        if ( _isAudioContent )
        {
          // 다음 콘텐츠의 play_seconds가 '0'이 아닌 경우에만 해당 cid와 uri를 세팅하여 playNext로 넘깁시다.
          NSInteger i = 0;
          for ( i = indexOfCurrentContent+1; i < contentsListArray.count-1; i++ )
          {
            if ( ![[contentsListArray[i][@"play_seconds"] stringValue] isEqualToString : @"0"] )
            {
              break;
            }
          }

          /*
            [_args setObject : contentsListArray[i][@"cid"]
                      forKey : @"cid"];
          
            NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                          andHeaderInfo : [_args objectForKey : @"token"]];
          
            [_args setObject : playDataDics[@"media_urls"][@"HLS"]
                      forKey : @"uri"];
            _currentLectureTitle = contentsListArray[i][@"title"];  // 소챕터명 세팅 합니다.
          
            [self playNext];  // 새로운 콘텐츠 재생이므로 시작 시간이 0 입니다.
          */
          // 아래와 같이 수정 2018.10.24
          [_args setObject : contentsListArray[i][@"cid"]
                    forKey : @"cid"];
          
          [_args setObject : [self getContentUri:[_args objectForKey:@"cid"]]
                    forKey : @"uri"];
          
          _currentLectureTitle = contentsListArray[i][@"title"];  // 소챕터명 세팅 합니다.
          
          [self playNext];  // 새로운 콘텐츠 재생이므로 시작 시간이 0 입니다.
        }
        else if ( !_isAudioContent )  // 영상 콘텐츠라면 다음 순서의 cid와 uri를 세팅하고 playNext를 실행합니다.
        {
          /*
            [_args setObject : contentsListArray[indexOfCurrentContent+1][@"cid"]
                      forKey : @"cid"];
          
            NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                          andHeaderInfo : [_args objectForKey : @"token"]];
          
            [_args setObject : playDataDics[@"media_urls"][@"HLS"]
                      forKey : @"uri"];
            _currentLectureTitle = contentsListArray[indexOfCurrentContent+1][@"title"];  // 소챕터명 세팅 합니다.
          
            [self playNext];  // 새로운 콘텐츠 재생이므로 시작 시간이 0 입니다.
          */
          // 아래와 같이 수정 2018.10.24
          [_args setObject : contentsListArray[indexOfCurrentContent+1][@"cid"]
                    forKey : @"cid"];
          
          [_args setObject : [self getContentUri:[_args objectForKey : @"cid"]]
                    forKey : @"uri"];
          
          _currentLectureTitle = contentsListArray[indexOfCurrentContent+1][@"title"];  // 소챕터명 세팅 합니다.
          
          [self playNext];  // 새로운 콘텐츠 재생이므로 시작 시간이 0 입니다.
        }
    }
    else if ( indexOfCurrentContent == contentsListArray.count-1 )  // 배열의 마지막이라면 재생할 콘텐트가 없는 것입니다.
    {
        // 영상 콘텐츠의 마지막이면 연관 콘텐츠 뷰를 로딩합니다.
        if ( !_isAudioContent )
        {
          /*
            // 오디오북은 연관컨텐츠뷰를 띄우면 안됩니다.
            self.recommendViewController = [[IFRecommendViewController alloc] init];
            NSArray *chunks = [[_args objectForKey : @"cid"] componentsSeparatedByString : @"_"]; // cid를 '_'로 분류하여 각각 array chunk처리합니다.
            [self.recommendViewController setDataWithCurrentCgid : chunks[0]];
            [self.view addSubview : self.recommendViewController.view];
          */
            [self closePlayer]; // 추천 콘텐츠 뷰의 정책이 확실히 정해지면 다시 주석을 해제하도록 하겠습니다.
        }
        else if ( _isAudioContent )
        {
            [self closePlayer];
        }
    }
    else
    {
        [self closePlayer];
    }
}

//
// 전화통화 등으로 재생에 interrupt가 걸렸을 경우..
//
- (void) audioSessionInterrupted : (NSNotification *) notification
{
    int interruptionType = [notification.userInfo[AVAudioSessionInterruptionTypeKey] intValue];
  
    if ( interruptionType == AVAudioSessionInterruptionTypeBegan )
    {
        NSLog(@"  Pausing for audio session interruption");
        [self pressedPauseButton];
    }
    else if ( interruptionType == AVAudioSessionInterruptionTypeEnded )
    {
        NSLog(@"  Resuming after audio session interruption");
        // 통화전에 정지 상태였다면.. 통화후에도 정지상태여야 합니다.
        //[self pressedPlayButton];
    }
}

//
// 홈버튼 등을 눌러 앱이 백그라운드로 들어갔을 때 플레이어를 실행합니다. (콘텐츠가 재생중이었을 경우에만 해당됩니다.)
//
- (void) applicationDidEnterBackground : (NSNotification *) notification
{
    NSLog(@"  [applicationDidEnterBackground] ? %@", _urlAsset);
    // 재생중일 경우
    if ( _playButton.hidden )
    {
        [self performSelector : @selector(pressedPlayButton)
                   withObject : nil
                   afterDelay : 0.01];
    }
}

#pragma mark - Drawing Player UI components

- (void) drawContentView
{
    // 오디오 UI
    _audioUiView = [[UIView alloc] initWithFrame : self.view.bounds];
    _audioUiView.backgroundColor = [UIColor blackColor];
    [self.view addSubview : _audioUiView];
  
    _backgroundImageView = [[UIImageView alloc] initWithFrame : _audioUiView.bounds];
    [_audioUiView addSubview : _backgroundImageView];
  
    UIImage *headphoneImage = [UIImage imageNamed : @"image_headphones"];
    _headphoneImageView = [[UIImageView alloc] initWithFrame : CGRectMake((_audioUiView.frame.size.width - headphoneImage.size.width) / 2.f,
                                                                          ((_audioUiView.frame.size.height - headphoneImage.size.height) / 2.f) - 50.f,
                                                                          headphoneImage.size.width, headphoneImage.size.height)];
    _headphoneImageView.image = headphoneImage;
    [_audioUiView addSubview : _headphoneImageView];
    _audioUiView.hidden = !_isAudioMode;
  
    // contentView 구성.
    _contentView = [[UIView alloc] initWithFrame : self.view.bounds];
    [_contentView setBackgroundColor : [UIColor blackColor]];
    [self.view addSubview : _contentView];
  
    _hideAndShowButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _hideAndShowButton.frame = _contentView.bounds;
    [_hideAndShowButton addTarget : self
                           action : @selector(pressedHideAndShowButton)
                 forControlEvents : UIControlEventTouchUpInside];
    _isPlaybackContollerHidden = NO;  // 플레이어 시작과 동시에 모든 재생 컨트롤러 UI는 표시 상태입니다.
    [_contentView addSubview : _hideAndShowButton];
}

- (void) drawPlayerControlHeader
{
    // 탑뷰 구성 시작
    //  iPhone X일 경우 notch에 타이틀과 챕터 타이틀이 가려지므로 사이즈 조정이 필요합니다.
    if ( [common hasNotch] )
        _topView = [[UIView alloc] initWithFrame : CGRectMake(0, 0, self.view.frame.size.width, 75.f)];
    else
        _topView = [[UIView alloc] initWithFrame : CGRectMake(0, 0, self.view.frame.size.width, 60.f)];
  
    _topView.backgroundColor = UIColorFromRGB(0x272230, 0.3f);
  
    // 미니플레이어 전환.
    _closeButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _closeButton.frame = CGRectMake(0, 0, 60, 55);
    [_closeButton setImage : [UIImage imageNamed : @"button_player_close"]
                  forState : UIControlStateNormal];
    [_closeButton addTarget : self
                     action : @selector(pressedCloseButton)
           forControlEvents : UIControlEventTouchUpInside];
    [_topView addSubview : _closeButton];
  
    CGRect frame = CGRectZero;
    frame.origin.x = CGRectGetMaxX(_closeButton.frame) + 10.f;
  
    if ( [common hasNotch] )
        frame.origin.y = 30.f;
    else
        frame.origin.y = 10.f;
  
    frame.size.width = self.view.frame.size.width - (frame.origin.x + 10) - 70;   // 별점주기 버튼 때문에 프레임 넓이 조정.
    frame.size.height = 13.f;
  
    _courseTitleLabel = [[UILabel alloc] initWithFrame : frame];
    _courseTitleLabel.backgroundColor = [UIColor clearColor];
    _courseTitleLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:11];
    _courseTitleLabel.textColor = UIColorFromRGB(0xffffff, 0.5f);
    _courseTitleLabel.textAlignment = NSTextAlignmentLeft;
    _courseTitleLabel.numberOfLines = 1;
    _courseTitleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _courseTitleLabel.adjustsFontSizeToFitWidth = NO;
    _courseTitleLabel.text = [_args objectForKey : @"name"];
    [_topView addSubview : _courseTitleLabel];
  
    frame.origin.x = CGRectGetMaxX(_closeButton.frame) + 10.f;
    frame.origin.y = CGRectGetMaxY(_courseTitleLabel.frame) + 2.f;
    frame.size.width = self.view.frame.size.width - (frame.origin.x + 10) - 70;   // 별점주기 버튼 때문에 프레임 넓이 조정.
    frame.size.height = 18.f;
  
    _lectureTitleLabel = [[UILabel alloc] initWithFrame: frame];
    _lectureTitleLabel.backgroundColor = [UIColor clearColor];
    _lectureTitleLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:15];
    _lectureTitleLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
    _lectureTitleLabel.textAlignment = NSTextAlignmentLeft;
    _lectureTitleLabel.numberOfLines = 1;
    _lectureTitleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _lectureTitleLabel.adjustsFontSizeToFitWidth = NO;
    _lectureTitleLabel.text = _currentLectureTitle;
    [_topView addSubview : _lectureTitleLabel];
  
    // 탑뷰내의 별점주기 버튼
    // 플레이어 시작과 동시에 별점과 콘텐츠 타입 등을 조회합니다.
  /*
    if ( !_isAudioContent )
    {
        NSString *userStar = @""; // 1~5
        BOOL isUserLoggedIn = YES;
        NSString *cconClassStar = @"1";// 1 = video clip, 2 = audiobook
      
        // 로그인된 상태이면서 동시에 강의 클립이라면 일단 별점주기 버튼을 그립니다.
        if ( isUserLoggedIn && [cconClassStar isEqualToString : @"1"] )
        {
            _rateStarButton = [UIButton buttonWithType : UIButtonTypeCustom];
            _rateStarButton.frame = CGRectMake(CGRectGetMaxX(_topView.frame)-80, 10, 60, 40);
            [_rateStarButton setImage : [UIImage imageNamed: @"icon_star_green_small"]
                             forState : UIControlStateNormal];
            _rateStarButton.titleLabel.font = [UIFont fontWithName : @"SpoqaHanSans" size : 11];
            _rateStarButton.layer.borderWidth = 1.0f;
            _rateStarButton.layer.cornerRadius = 6.0f;
          
            // 로그인한 계정으로 해당 강의클립에 대한 등록된 별점이 없다면 '별점 주기'버튼을 그려줍니다.
            if ( [userStar isEqualToString : @""] )
            {
              [_rateStarButton setTitle : @"별점 주기" forState : UIControlStateNormal];
              _rateStarButton.layer.borderColor = [UIColor grayColor].CGColor;
            }
            else
            {
              NSString *myStarStr = [NSString stringWithFormat : @" %@%@", userStar, @".0"];
              [_rateStarButton setTitle : myStarStr forState : UIControlStateNormal];
              _rateStarButton.layer.borderColor = [UIColor clearColor].CGColor;
            }
          
            [_rateStarButton addTarget : self
                                action : @selector(pressedRateStarButton)
                      forControlEvents : UIControlEventTouchUpInside];
            [_topView addSubview : _rateStarButton];
        }
    }
  */
  
    [_contentView addSubview : _topView];
}

- (void) drawPlayerControlBottom
{
    // iPhone X 의 경우 슬라이더와 Anchor가 충돌하므로 기기에 따른 분기 처리가 필요합니다.
    if ( [common hasNotch] )
        _bottomView = [[UIView alloc] initWithFrame : CGRectMake(0, self.view.frame.size.height-80.f, self.view.frame.size.width, 60.f)];
    else
        _bottomView = [[UIView alloc] initWithFrame : CGRectMake(0, self.view.frame.size.height-60.f, self.view.frame.size.width, 60.f)];

    _bottomView.backgroundColor = UIColorFromRGB(0x272230, 0.3f);
    [_contentView addSubview : _bottomView];
  
    CGFloat margin = 20;
    CGFloat padding = 10;
    CGFloat labelWidth = 45;
    CGFloat barWidth = _bottomView.frame.size.width-(labelWidth * 2)-(margin * 2)-(padding * 2);
  
    _timeLabel = [[UILabel alloc] initWithFrame : CGRectMake(margin, _bottomView.frame.size.height-45, labelWidth, 30)];
    _timeLabel.font = [UIFont systemFontOfSize : 12.f];
    _timeLabel.textColor = [UIColor whiteColor];
    _timeLabel.textAlignment = NSTextAlignmentCenter;
    _timeLabel.text = @"00:00";
    [_bottomView addSubview : _timeLabel];
  
    _totalTimeLabel = [[UILabel alloc] initWithFrame : CGRectMake(margin + labelWidth + padding + barWidth + padding,
                                                                 _bottomView.frame.size.height-45,
                                                                 labelWidth, 30)];
    _totalTimeLabel.font = [UIFont systemFontOfSize : 12.f];
    _totalTimeLabel.textColor = [UIColor whiteColor];
    _totalTimeLabel.textAlignment = NSTextAlignmentCenter;
    _totalTimeLabel.text = @"00:00";
    _totalTimeLabel.text = [common convertTimeToString : CMTimeGetSeconds(_urlAsset.duration) // +1은 소수점 이하를 포함합니다.
                                                Minute : YES];
    [_bottomView addSubview : _totalTimeLabel];
  
    _slider = [[UISlider alloc] initWithFrame : CGRectMake(margin + labelWidth + padding, _bottomView.frame.size.height-44, barWidth, 30.f)];
  
    if ( _isAudioContent )
    {
        _slider.minimumTrackTintColor = UIColorFromRGB(0xff4f72, 1.f);
        _slider.maximumTrackTintColor = [UIColor grayColor];
    }
    else
    {
        _slider.minimumTrackTintColor = UIColorFromRGB(0x26C281, 1.f);
        _slider.maximumTrackTintColor = [UIColor grayColor];
    }
  
    [_slider addTarget : self
                action : @selector(seekbarDidChangeValue:)
      forControlEvents : UIControlEventValueChanged];
  
    [_slider addTarget : self
                action : @selector(seekbarDragBegin:)
      forControlEvents : UIControlEventTouchDown];
  
    [_slider addTarget : self
                action : @selector(seekbarDragEnd:)
      forControlEvents : UIControlEventTouchUpInside];
  
    [_slider addTarget : self
                action : @selector(seekbarDragEnd:)
      forControlEvents : UIControlEventTouchCancel];
  
    [_bottomView addSubview : _slider];
  
    if ( [common hasNotch] )
        _menuItemView = [[UIView alloc] initWithFrame : CGRectMake(0, CGRectGetMinY(_bottomView.frame)-41.f, self.view.frame.size.width, 50.f)];
    else
        _menuItemView = [[UIView alloc] initWithFrame : CGRectMake(0, CGRectGetMinY(_bottomView.frame)-50.f, self.view.frame.size.width, 50.f)];
  
    _menuItemView.backgroundColor = UIColorFromRGB(0x272230, 0.5f);
    [_contentView addSubview : _menuItemView];
  
    _menuItemTopLineView = [[UIView alloc] initWithFrame : CGRectMake(0, 0, _menuItemView.frame.size.width, 1)];
    _menuItemTopLineView.backgroundColor = UIColorFromRGB(0x292431, 1.f);
    [_menuItemView addSubview : _menuItemTopLineView];
  
  
    NSInteger buttonCount = _isAudioContent ? 4 : 6;
  
    CGFloat buttonPadding = _isAudioContent ? 70 : 10;
    CGFloat buttonWidth = ((_menuItemView.frame.size.width - (buttonPadding * 2)) / buttonCount);
  
    CGFloat buttonOffsetX = buttonPadding;
    CGFloat buttonOffsetY = 0;
  
    {
        _autoPlayButton = [[ContentPlayerButton alloc] initWithId : @"autoplay-mode"
                                                      normalImage : @"icon_autoplay_off"
                                                 highlightedImage : @"icon_autoplay"
                                                   maxActiveCount : 2];
        _autoPlayButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _autoPlayButton.delegate = self;
        [_menuItemView addSubview : _autoPlayButton];
      
        NSString *autoPlaySetup = [common getUserSettingValueWithKey : @"autoplay_enable"];
      
        if ( nullStr(autoPlaySetup) )
        {
            [common setUserSettingValueWithKey : @"autoplay_enable" value : @"Y"];
            autoPlaySetup = @"Y";
        }
      
        BOOL isAutoPlay = [@"Y" isEqualToString : autoPlaySetup];
      
        [_autoPlayButton setStatus : isAutoPlay ? 1 : 0];
      
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
  
    if ( !_isAudioContent )
    {
        _scriptButton = [[ContentPlayerButton alloc] initWithId : @"script-mode"
                                                    normalImage : @"icon_caption"
                                               highlightedImage : @"icon_caption_active"
                                                 maxActiveCount : 2];
        _scriptButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _scriptButton.delegate = self;
        [_menuItemView addSubview : _scriptButton];
      
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
  
    if ( !_isAudioContent )
    {
        _modeChangeButton = [[ContentPlayerButton alloc] initWithId : @"view-mode"
                                                        normalImage : @"icon_audiomode"
                                                   highlightedImage : @"icon_videomode"
                                                     maxActiveCount : 2];
        _modeChangeButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _modeChangeButton.delegate = self;
        [_menuItemView addSubview : _modeChangeButton];
        
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
  
    {
        _downloadButton = [[ContentPlayerButton alloc] initWithId : @"download-mode"
                                                      normalImage : @"icon_download"
                                                 highlightedImage : @"icon_download"
                                                   maxActiveCount : 1];
        _downloadButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _downloadButton.delegate = self;
        [_menuItemView addSubview : _downloadButton];
      
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
  
    {
        _sleepButton = [[ContentPlayerButton alloc] initWithId : @"timer-mode"
                                                   normalImage : @"icon_timer"
                                              highlightedImage : @"icon_timer_active"
                                                maxActiveCount : 2];
        _sleepButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _sleepButton.delegate = self;
        [_menuItemView addSubview : _sleepButton];
      
        if ( [IFSleepTimerManager sharedInstance].isAlive )
        {
            [_sleepButton setStatus : 1];
            [IFSleepTimerManager sharedInstance].delegate = self;
        }
      
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
  
    {
        _lockButton = [[ContentPlayerButton alloc] initWithId : @"lock-mode"
                                                  normalImage : @"icon_lock"
                                             highlightedImage : @"icon_lock_active"
                                               maxActiveCount : 2];
        _lockButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _lockButton.delegate = self;
        [_menuItemView addSubview : _lockButton];
      
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
  
    _menuItemBottomLineView = [[UIView alloc] initWithFrame: CGRectMake(0, _menuItemView.frame.size.height-1, _menuItemView.frame.size.width, 1)];
    _menuItemBottomLineView.backgroundColor = UIColorFromRGB(0x292431, 1.f);
    [_menuItemView addSubview : _menuItemBottomLineView];
  
    //컨트롤 뷰
    _controlBarView = [ [UIView alloc] initWithFrame : CGRectMake(0, CGRectGetMinY(_menuItemView.frame)-90.f, self.view.frame.size.width, 80.f) ];
    _controlBarView.backgroundColor = [UIColor clearColor];
    [_contentView addSubview : _controlBarView];
  
    _playButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _playButton.frame = CGRectMake((_controlBarView.frame.size.width - 60.f) / 2.f, 0.f, 60.f, 60.f);
    [_playButton setImage : [UIImage imageNamed : @"icon_play"]
                 forState : UIControlStateNormal];
    [_playButton setImage : [[UIImage imageNamed : @"icon_play"] tintImageWithColor : UIColorFromRGB(0x000000, 0.3f)]
                 forState : UIControlStateHighlighted];
    [_playButton addTarget : self
                    action : @selector(pressedPlayButton)
          forControlEvents : UIControlEventTouchUpInside];
    [_controlBarView addSubview : _playButton];
  
    _paueseButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _paueseButton.frame = CGRectMake((_controlBarView.frame.size.width - 60.f) / 2.f, 0.f, 60.f, 60.f);
    [_paueseButton setImage : [UIImage imageNamed : @"icon_pause"]
                   forState : UIControlStateNormal];
    [_paueseButton setImage : [[UIImage imageNamed : @"icon_pause"] tintImageWithColor : UIColorFromRGB(0x000000, 0.3f)]
                   forState : UIControlStateHighlighted];
    [_paueseButton addTarget : self
                      action : @selector(pressedPauseButton)
            forControlEvents : UIControlEventTouchUpInside];
    [_controlBarView addSubview : _paueseButton];
  
    _rwButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _rwButton.frame = CGRectMake(CGRectGetMinX(_playButton.frame) - 60.f - 10.f, 0.f, 60.f, 60.f);
    [_rwButton setImage : [UIImage imageNamed : @"icon_rw"]
               forState : UIControlStateNormal];
    [_rwButton setImage : [[UIImage imageNamed : @"icon_rw"] tintImageWithColor : UIColorFromRGB(0x000000, 0.3f)]
               forState : UIControlStateHighlighted];
    [_rwButton addTarget : self
                  action : @selector(pressedRwButton)
        forControlEvents : UIControlEventTouchUpInside];
    [_controlBarView addSubview : _rwButton];
  
    _ffButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _ffButton.frame = CGRectMake(CGRectGetMaxX(_playButton.frame) + 10.f, 0.f, 60.f, 60.f);
    [_ffButton setImage : [UIImage imageNamed : @"icon_ff"]
               forState : UIControlStateNormal];
    [_ffButton setImage : [[UIImage imageNamed : @"icon_ff"] tintImageWithColor : UIColorFromRGB(0x000000, 0.3f)]
               forState : UIControlStateHighlighted];
    [_ffButton addTarget : self
                  action : @selector(pressedFfButton)
        forControlEvents : UIControlEventTouchUpInside];
    [_controlBarView addSubview : _ffButton];
  
    _speedButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _speedButton.frame = CGRectMake(CGRectGetMinX(_rwButton.frame) - 50.f, 10.f, 50.f, 50.f);
    [_speedButton addTarget : self
                     action : @selector(pressedSpeedButton)
           forControlEvents : UIControlEventTouchUpInside];
    [_controlBarView addSubview : _speedButton];
  
    _listButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _listButton.frame = CGRectMake(CGRectGetMaxX(_ffButton.frame), 10.f, 50.f, 50.f);
    [_listButton setImage : [UIImage imageNamed : @"icon_list"]
                 forState : UIControlStateNormal];
    [_listButton setImage : [[UIImage imageNamed : @"icon_list"] tintImageWithColor : UIColorFromRGB(0x000000, 0.3f)]
                 forState : UIControlStateHighlighted];
    [_listButton addTarget : self
                    action : @selector(pressedListButton)
          forControlEvents : UIControlEventTouchUpInside];
    [_controlBarView addSubview : _listButton];
    if ( _isDailyBook ) _listButton.hidden = true;  // '매일 책 한권' 콘텐츠의 경우 리스트뷰버튼 자체를 원천 차단합니다.
  
    _networkStatusLabel = [[UILabel alloc] initWithFrame : CGRectMake(0, CGRectGetMaxY(_playButton.frame), _controlBarView.frame.size.width, 20.f)];
    _networkStatusLabel.backgroundColor = [UIColor clearColor];
    _networkStatusLabel.font = [UIFont fontWithName: @"SpoqaHanSans" size: 12];
    _networkStatusLabel.textColor = UIColorFromRGB(0xc8c8c8, 1.f);
    _networkStatusLabel.textAlignment = NSTextAlignmentCenter;
    _networkStatusLabel.numberOfLines = 1;
    _networkStatusLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _networkStatusLabel.adjustsFontSizeToFitWidth = YES;
    _networkStatusLabel.text = @"";
    [_controlBarView addSubview : _networkStatusLabel];
  
    [self setSpeedButtonImage];
    _playButton.hidden = NO;
    _paueseButton.hidden = YES;
  
    [[ApiManager sharedInstance] setReachabilityStatusChangeBlock : ^(NSInteger status)
                                                                    {
                                                                        if ( self.isDownloadFile )
                                                                        {
                                                                            self->_networkStatusLabel.text = @"다운로드 재생";
                                                                        }
                                                                        else
                                                                        {
                                                                            if ( status == 0 )
                                                                            {
                                                                                self->_networkStatusLabel.text = @"인터넷 연결안됨";
                                                                            }
                                                                            else if ( status == 1 )
                                                                            {
                                                                                self->_networkStatusLabel.text = @"LTE/3G 재생";
                                                                            }
                                                                            else if ( status == 2 )
                                                                            {
                                                                                self->_networkStatusLabel.text = @"Wi-Fi 재생";
                                                                            }
                                                                        }
                                                                    }];
}

- (void) setSpeedButtonImage
{
    UIImage *image = nil;
  
    if ( _playbackRate == 0.8f )
    {
        image = [UIImage imageNamed : @"icon_speed_08"];
    }
    else if ( _playbackRate == 1.f )
    {
        image = [UIImage imageNamed : @"icon_speed_10"];
    }
    else if ( _playbackRate == 1.2f )
    {
        image = [UIImage imageNamed : @"icon_speed_12"];
    }
    else if ( _playbackRate == 1.5f )
    {
        image = [UIImage imageNamed : @"icon_speed_15"];
    }
  
    [_speedButton setImage : image
                  forState : UIControlStateNormal];
  
    [_speedButton setImage : [image tintImageWithColor : UIColorFromRGB(0x000000, 0.3f)]
                  forState : UIControlStateHighlighted];
}

- (void) setAudioContentBackgroundImageUrl : (NSString *) url
{
    if ( !nullStr(url) )
    {
        [_backgroundImageView sd_setImageWithURL : [NSURL URLWithString: url]
                                       completed : ^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL)
                                                   {
                                                       if ( self.view.frame.size.width > self.view.frame.size.height && self->_backgroundImageView.image )
                                                       {
                                                           CGFloat width = [common getRatioWidth : self->_backgroundImageView.image.size
                                                                                    screenHeight : self.view.frame.size.height];
                                                         
                                                           CGFloat height = [common getRatioHeight : self->_backgroundImageView.image.size
                                                                                       screenWidth : width];
                                                         
                                                           self->_backgroundImageView.frame = CGRectMake((self.view.frame.size.width - width)/2.f, 0, width, height);
                                                       }
                                                   }];
    }
}

#pragma mark - Public Methods

//
// 재생 또는 일시정지 버튼의 표시를 번갈아가며 바꿉니다.
//
- (void) setPlayState : (BOOL) isPlaying
{
    _paueseButton.hidden = !isPlaying;
    _playButton.hidden = !_paueseButton.hidden;
}

- (void) setCurrentTime : (CGFloat) time
            forceChange : (BOOL) forceChange
{
    if ( _timeLabel && (!_touchDragging || forceChange) )
    {
        _timeLabel.text = [common convertTimeToString : time
                                               Minute : YES];
    }
  
    if ( _scriptView )
    {
        [_scriptView setCurrentTime : time];
    }
}

//
// 플레이어 구동초기에 호출합니다.
//
- (void) setPreparedToPlay
{
    NSLog(@"  [setPreparedToPlay]");
  
    if ( _slider )
    {
        _slider.minimumValue = 0.f;
        _slider.maximumValue = CMTimeGetSeconds(_urlAsset.duration);
    }
  
    _playbackRate = 1.f;
    [_speedButton setImage : [UIImage imageNamed : @"icon_speed_10"]
                  forState : UIControlStateNormal];
}

//
// 재생 가능한 이전 콘텐츠를 찾아 set합니다. 없으면 그냥 리턴합니다.
//
- (void) setPreviousContent
{
    NSLog(@"  [setPreviousContent] 재생 가능한 이전 콘텐츠를 찾아 set합니다.");
  
    return ;
}
//
// 재생 가능한 다음 콘텐츠를 찾아 set합니다. 없으면 그냥 리턴합니다.
//
- (void) setNextContent
{
    NSLog(@"  [setNextContent] 재생 가능한 다음 콘텐츠를 찾아 set합니다.");
  
    return ;
}

//
// 다음 콘텐트를 재생합니다. 재생할 _args가 미리 세팅되어 있기때문에 파라미터가 필요하지 않습니다.
//
- (void) playNext
{
    [_player pause];
    [self invalidateTimerOnSlider];
  
    // 다운로드받은 콘텐츠의 재생을 마치면 일단 처음으로 돌리고 정지시킵니다.
    /*
    if ( _isDownloadFile )
    {
        [_player seekToTime : CMTimeMakeWithSeconds(0.f, [self getDuration])];
        [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
        [self setPlayState : false];
      
        return ;
    }
    */
  
    [self fpsSetUrlAsset];
  
    _playerItem = [ AVPlayerItem playerItemWithAsset : _urlAsset ];
    [_player replaceCurrentItemWithPlayerItem : _playerItem];
    [_player play];
  
    [ [NSNotificationCenter defaultCenter] addObserver : self
                                              selector : @selector(videoPlayBackDidFinish:)
                                                  name : AVPlayerItemDidPlayToEndTimeNotification
                                                object : [_player currentItem]  ];
  
    _totalTimeLabel.text = [common convertTimeToString : CMTimeGetSeconds(_urlAsset.duration) // +1은 소수점 이하를 포함합니다.
                                                Minute : YES];
    [self setPreparedToPlay];
    [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    [self setPlayState : YES];
    _lectureTitleLabel.text = _currentLectureTitle;
  
    // 자막뷰가 on인 경우 초기화 시키고 다음 콘텐트의 자막을 가져옵니다. 오디오북일 경우는 수행하지 않습니다.
    if ( !_isAudioContent )
    {
        [self setScriptViewFrameWithStatus : 0];
        [_scriptView setScript : [self readScript]];
        [_scriptButton setStatus : 0];
    }
    else if ( _isAudioContent )
    {
        // 오디오북 or 오디오모드 용 배경이미지를 세팅합니다.
        // 해당 경로는 오디오북만 해당됩니다.
        [self setAudioContentBackgroundImageUrl : _currentContentsInfo[@"data"][@"images"][@"cover"]];
    }
  
    [self setupNowPlayingInfoCenter];
  
    // 플레이어가 시작되면 일단 백그라운드에서 돌고있을지도 모를 타이머를 일단 종료합니다.
    [_logTimer invalidate];
  
  /*
    NSString *netStatus = @"no_network";
    if ( _isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
        _networkStatusLabel.text = @"다운로드 재생";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-Fi";
        _networkStatusLabel.text = @"Wi-Fi 재생";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
        _networkStatusLabel.text = @"LTE/3G 재생";
    }
   */
  
  NSString *netStatus = [self updateNetStatusLabel];
  [self updateDownloadState];
  
    [ApiManager sendPlaybackProgressWith : [_args objectForKey : @"cid"]
                                  action : @"START"             // START / ING / END / FORWARD / BACK
                             startSecond : [self getCurrentPlaybackTime]
                               endSecond : [self getCurrentPlaybackTime] + 30
                                duration : 30 - [self getCurrentPlaybackTime]
                               netStatus : netStatus
                               authToken : [_args objectForKey : @"token"]];
    // NSTimer를 통해 30초마다 로그내역을 전송
    _logTimer = [NSTimer scheduledTimerWithTimeInterval : 30
                                                 target : self
                                               selector : @selector(reloadLogData:)
                                               userInfo : nil
                                                repeats : YES];
  
    // 미니플레이어가 활성화된 상태라면 표시되는 데이터도 함께 업데이트 합니다.
    NSTimeInterval currentTime = [self getCurrentPlaybackTime];
    NSTimeInterval totalTime = [self getDuration];
    NSMutableDictionary *playInfo = [NSMutableDictionary dictionary];
    playInfo[@"currentTime"] = @(currentTime);
    playInfo[@"totalTime"] = @(totalTime);
    playInfo[@"isAudioContent"] = @(_isAudioContent);
    [_miniPlayerUiView setPreparedToPlayInfo : playInfo];
    [_miniPlayerUiView setTitleLabel01 : _currentLectureTitle];
}

//
// 플레이어를 종료합니다.
//
- (void) closePlayer
{
    [_player pause];
    [_playerLayer removeFromSuperlayer];
    _playerLayer.player = nil;
    [self invalidateTimerOnSlider];
    // 기존 타이머를 종료시키고 재시작
    [_logTimer invalidate];
    // 이용로그 전송 시작
    NSString *netStatus = @"no_network";
    if ( _isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-Fi";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
    }
    else
    {
        netStatus = @"unknown_netStatus";
    }
  
    [ApiManager sendPlaybackProgressWith : [_args objectForKey : @"cid"]
                                  action : @"END"             // START / ING / END / FORWARD / BACK
                             startSecond : [self getCurrentPlaybackTime]
                               endSecond : [self getCurrentPlaybackTime]
                                duration : 0
                               netStatus : netStatus
                               authToken : [_args objectForKey : @"token"]];
    [[NSNotificationCenter defaultCenter] removeObserver : self
                                                    name : AVPlayerItemDidPlayToEndTimeNotification
                                                  object : [_player currentItem]];
    [self dismissViewControllerAnimated:YES completion:nil];  // playerController를 닫습니다.
    [common showStatusBar];
}

#pragma mark - Selectors

- (void) pressedCloseButton
{
    self.isMiniPlayer = YES;
  
    if ( [common hasNotch] )
        _miniPlayerUiView = [[ContentMiniPlayerView alloc] initWithFrame : CGRectMake(0, 0, self.view.frame.size.width, 60.f)];
    else
        _miniPlayerUiView = [[ContentMiniPlayerView alloc] initWithFrame : CGRectMake(0, 0, self.view.frame.size.width, 40.f)];
  
    _miniPlayerUiView.tag = 1;
    _miniPlayerUiView.delegate = self;
    _miniPlayerUiView.isAuthor = _isAuthor;
    [_miniPlayerUiView setControllerColorWithAudioMode : _isAudioContent];
    NSTimeInterval currentTime = [self getCurrentPlaybackTime];
    NSTimeInterval totalTime = [self getDuration];
    NSMutableDictionary *playInfo = [NSMutableDictionary dictionary];
    playInfo[@"currentTime"] = @(currentTime);
    playInfo[@"totalTime"] = @(totalTime);
    playInfo[@"isAudioContent"] = @(_isAudioContent);
    [_miniPlayerUiView setPreparedToPlayInfo : playInfo];
    [_miniPlayerUiView setTitleLabel01 : _currentLectureTitle];
    [self.view addSubview : _miniPlayerUiView];
  
    if ( _playButton.hidden )
        [_miniPlayerUiView setPlayState : YES];
    else if ( _paueseButton.hidden )
        [_miniPlayerUiView setPlayState : NO];
  
    [self changedPlayerMode : YES];
  
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      if ( [common hasNotch] )
                                          [self.view.superview setFrame : CGRectOffset([self.view frame], 0, self.view.frame.size.height-60.f)];
                                      else
                                          [self.view.superview setFrame : CGRectOffset([self.view frame], 0, self.view.frame.size.height-40.f)];
                                  }
                     completion : ^(BOOL finished)
                                  {
                                      self.view.frame = self.view.bounds;
                                  }];
  
    [common showStatusBar];
    _screenMode = ContentsPlayerScreenModeMiniPlayer;
}

/* API등록 전까지는 별점 기능을 일단 주석처리하였습니다.
- (void) pressedRateStarButton
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle : @"지식클립이 흥미로우셨나요?"
                                                                   message : @"\n회원님의 의견이 더 좋은 강의를 만드는 원동력이 됩니다.\n\n\n"
                                                            preferredStyle : UIAlertControllerStyleAlert];
                                                          //preferredStyle : UIAlertControllerStyleActionSheet];
  
    [alert.view setBackgroundColor: [UIColor clearColor]]; // alertView 배경 색상
  
    StarRatingView *rateView = [[StarRatingView alloc] initWithFrame : CGRectMake(20, 95, alert.view.bounds.size.width, 60)
                                                            fullStar : [UIImage imageNamed : @"icon_star_full_large"]
                                                           emptyStar : [UIImage imageNamed : @"icon_star_empty_large"]];
    rateView.padding = 20;
    rateView.alignment = RateViewAlignmentLeft;
    rateView.editable = YES;
    rateView.delegate = self;
  
    [alert.view addSubview : rateView];
  
    UIAlertAction *okAction;
    okAction = [UIAlertAction actionWithTitle : @"확인"
                                        style : UIAlertActionStyleDefault
                                      handler : ^(UIAlertAction *action)
                                                {
                                                    // 별점주기 팝업을 띄운 후 별점을 주지 않으면 별점만 초기화하고 그냥 닫습니다.
                                                    if ( nil == self->_currentStar || [self->_currentStar isEqualToString : @"0"] || [self->_currentStar isEqualToString : @""] )
                                                    {
                                                        self->_currentStar = @"";
                                                    }
                                                    else
                                                    {
                                                        NSLog(@"  [pressedRateStarButton] 최종별점 : %@", self->_currentStar);
                                                        NSString *myStarStr = [NSString stringWithFormat : @" %@%@", self->_currentStar, @".0"];
                                                      
                                                        self->_currentStar = @"";   // 다음 강의 평가를 위해 별점 초기화. 171207 김태현
                                                        [self->_rateStarButton setTitle : myStarStr
                                                                         forState : UIControlStateNormal];
                                                        self->_rateStarButton.layer.borderColor = [UIColor clearColor].CGColor;
                                                        self->_rateStarButton.userInteractionEnabled = NO; // 탑뷰 내 별점주기버튼 비활성화
                                                    }
                                                }];
  
    UIAlertAction *cancelAction;
    cancelAction = [UIAlertAction actionWithTitle : @"취소"
                                            style : UIAlertActionStyleDestructive
                                          handler : ^(UIAlertAction *action)
                                                    {
                                                        NSLog(@"  Cancel action");
                                                    }];
  
    [okAction setValue : UIColorFromRGB(0x32c183, 1.f)
                forKey : @"titleTextColor"];
  
    [cancelAction setValue : UIColorFromRGB(0x4a494a, 1.f)
                    forKey : @"titleTextColor"];
  
    [alert addAction : okAction];
    [alert addAction : cancelAction];
  
    [self presentViewController : alert
                       animated : YES
                     completion : nil];
}
*/

//
// 플레이어 컨트롤러UI를 감추거나 표시합니다.
//
- (void) pressedHideAndShowButton
{
    // 현재 재생 컨트롤러 UI가 감춰진 상태라면 표시하고 _isPlaybackContollerHidden 를 NO로 업데이트 해야합니다.
    if ( _isPlaybackContollerHidden == YES )
    {
        [self setPlayerUIHidden : NO];
        _isPlaybackContollerHidden = NO;
    }
    // 현재 재생 컨트롤러 UI가 표시 상태라면 감추고 _isPlaybackContollerHidden 를 YES로 업데이트 해야합니다.
    else if ( _isPlaybackContollerHidden == NO )
    {
        [self setPlayerUIHidden : YES];
        _isPlaybackContollerHidden = YES;
    }
}

- (void) pressedPlayButton
{
    NSLog(@"  플레이어 재생 버튼!!");
    [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    [_player play];
    [_player setRate : _playbackRate];
    // pauseButton으로 변경해주어야 합니다.
    [self setPlayState : YES];
}

- (void) pressedPauseButton
{
    NSLog(@"  플레이어 정지 버튼!!");
    [self invalidateTimerOnSlider];  // 슬라이더 바의 타이머를 정지합니다.
    [_player pause];
    // playButton으로 변경해주어야 합니다.
    [self setPlayState : NO];
}

- (void) pressedRwButton
{
    NSLog(@"  플레이어 뒤로 가기 버튼!!");
  
    NSTimeInterval cTime = [self getCurrentPlaybackTime];
    NSTimeInterval tTime = [self getDuration];
  
    if ( cTime > 10.f )
    {
        CMTime newTime = CMTimeMakeWithSeconds(cTime - 10.f, tTime);
        [_player seekToTime : newTime];
        [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    }
    else
    {
        CMTime newTime = CMTimeMakeWithSeconds(0, tTime);
        [_player seekToTime : newTime];//playImmediatelyAtRate
        [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    }
  
    // 이용로그 전송 시작
    NSString *netStatus = @"no_network";
    if ( _isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-Fi";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
    }
  
    [ApiManager sendPlaybackProgressWith : [_args objectForKey : @"cid"]
                                  action : @"BACK"             // START / ING / END / FORWARD / BACK
                             startSecond : [self getCurrentPlaybackTime]
                               endSecond : [self getCurrentPlaybackTime] + 30
                                duration : 30
                               netStatus : netStatus
                               authToken : [_args objectForKey : @"token"]];
    // 이용로그 전송 종료
}

- (void) pressedFfButton
{
    NSLog(@"  플레이어 앞으로 가기 버튼!!");
  
    NSTimeInterval cTime = [self getCurrentPlaybackTime];
    NSTimeInterval tTime = [self getDuration];
  
    if ( cTime + 10.f < tTime )
    {
        CMTime newTime = CMTimeMakeWithSeconds(cTime + 10.f, tTime);
        [_player seekToTime : newTime];
        [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    }
    else
    {
        CMTime newTime = CMTimeMakeWithSeconds(tTime, tTime);
        [_player seekToTime : newTime];
        [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    }
  
    // 이용로그 전송 시작
    NSString *netStatus = @"no_network";
    if ( _isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-Fi";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
    }
  
    [ApiManager sendPlaybackProgressWith : [_args objectForKey : @"cid"]
                                  action : @"FORWARD"             // START / ING / END / FORWARD / BACK
                             startSecond : [self getCurrentPlaybackTime]
                               endSecond : [self getCurrentPlaybackTime] + 30
                                duration : 30
                               netStatus : netStatus
                               authToken : [_args objectForKey : @"token"]];
    // 이용로그 전송 종료
}

- (void) pressedSpeedButton
{
    if ( _playbackRate == 1.f )
    {
        _playbackRate = 1.2f;
    }
    else if ( _playbackRate == 1.2f )
    {
        _playbackRate = 1.5f;
    }
    else if ( _playbackRate == 1.5f )
    {
        _playbackRate = 0.8f;
    }
    else if ( _playbackRate == 0.8f )
    {
        _playbackRate = 1.0f;
    }
  
    [self setSpeedButtonImage];
  
    [_player setRate : _playbackRate];
    [self setPlayState : true]; // setRate: 을 실행하면 _player가 자동으로 재생을 재개합니다.
}

//
// 재생 리스트뷰를 띄웁니다.
//
- (void) pressedListButton
{
    if ( !_isAuthor )
    {
        [_contentView makeToast : @"프리뷰 이용중입니다."];
      
        return ;
    }
  
    if ( _listView )
    {
        return ;
    }
  
    NSArray *playListArray;
    if ( [_currentContentsInfo[@"type"] hasPrefix : @"video"] )
    {
        playListArray = _currentContentsInfo[@"data"][@"clips"];
    }
    else if ( [_currentContentsInfo[@"type"] hasPrefix : @"audio"] )
    {
        playListArray = _currentContentsInfo[@"data"][@"chapters"];
    }
  
    NSInteger currentIndex = playListArray.count;
    NSString *groupTitle = _currentContentsInfo[@"data"][@"title"]; //group_title

    CGRect frame = self.view.bounds;
  
    if ( [common hasNotch] )
        frame.size.height = frame.size.height - _bottomView.frame.size.height - 12;
    else
        frame.size.height = frame.size.height - _bottomView.frame.size.height;
  
    _listView = [[ContentsListPopupView alloc] initWithFrame : frame];
    _listView.delegate = self;

    _listView.contentsInfoDictionary = [_currentContentsInfo mutableCopy];
    _listView.currentPlayIndex = currentIndex;
    _listView.isAuthor = _isAuthor;
    [self.view addSubview : _listView];
    [_listView start];

    //오디오 콘텐츠 타이틀 삽입
    if ( !nullStr(groupTitle) )
    {
        [_listView setTitle : groupTitle];
    }
}


#pragma mark - Slider action

- (void) seekbarDragBegin : (id) sender
{
    _touchDragging = YES;
}

- (void) seekbarDidChangeValue : (id) sender
{
    UISlider *bar = (UISlider *) sender;
  
    [self setCurrentTime : bar.value
             forceChange : YES];
  
    if ( _holdTouchDragging )
    {
        return ;
    }
  
    if ( [self respondsToSelector : @selector(seekbarDragging:)] )
    {
        [self seekbarDragging : bar.value];
      
        _holdTouchDragging = YES;
      
        [self performSelector : @selector(unlockDragging)
                   withObject : nil
                   afterDelay : 0.5f];
    }
}

- (void) seekbarDragEnd : (id) sender
{
    _touchDragging = NO;
  
    UISlider *bar = (UISlider *) sender;
  
    if ( [self respondsToSelector : @selector(seekbarDragEndForTimeWarp:)] )
    {
        [self seekbarDragEndForTimeWarp : bar.value];
      
        _holdTouchDragging = NO;
        [NSObject cancelPreviousPerformRequestsWithTarget : self
                                                 selector : @selector(unlock)
                                                   object : nil];
    }
}

- (void) seekbarDragging : (NSTimeInterval) time
{
    [_player pause];
    [self invalidateTimerOnSlider];
    [_player seekToTime : CMTimeMakeWithSeconds(time, [self getDuration])];
}

- (void) unlockDragging
{
    _holdTouchDragging = NO;
}

//
// Slider에서 dragging이 끝나면 시간을 계산하여 해당 시간으로 이동하여 플레이합니다.
//
- (void) seekbarDragEndForTimeWarp : (NSTimeInterval) time
{
    [_player seekToTime : CMTimeMakeWithSeconds(time, [self getDuration])];
    [self setTimerOnSlider];
    [_player play];
    // pauseButton으로 변경해주어야 합니다.
    [self setPlayState : YES];
    [_player setRate : _playbackRate];
  
    // 기존 타이머를 종료시키고 재시작
    [_logTimer invalidate];
    // 이용로그 전송 시작
    NSString *netStatus = @"no_network";
    if ( _isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-Fi";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
    }
  
    [ApiManager sendPlaybackProgressWith : [_args objectForKey : @"cid"]
                                  action : @"MOVE"             // START / ING / END / FORWARD / BACK
                             startSecond : [self getCurrentPlaybackTime]
                               endSecond : [self getCurrentPlaybackTime] + 30
                                duration : 30
                               netStatus : netStatus
                               authToken : [_args objectForKey : @"token"]];
    // NSTimer를 통해 30초마다 로그내역을 전송
    _logTimer = [NSTimer scheduledTimerWithTimeInterval : 30
                                                 target : self
                                               selector : @selector(reloadLogData:)
                                               userInfo : nil
                                                repeats : YES];
}

//
// Slider의 값을 변경합니다.
//
- (void) setSeekbarCurrentValue : (CGFloat) value
{
    if ( _slider && !_touchDragging )
    {
        [_slider setValue : value];
    }
  
    // IFSleepTimerManager ???
  /*
    if ( [[IFSleepTimerManager sharedInstance] isStopEpisodeMode] )
    {
        // 에피소드 모드 시간 적용
        NSInteger c = [common convertStringToTime : _timeLabel.text];
        NSInteger t = [common convertStringToTime : _totalTimeLabel.text];
      
        NSString *timerStr = [common convertTimeToString : (t-c)
                                                  Minute : YES];
      
        if ( _sleepButton )
        {
            [_sleepButton setText : timerStr];
        }
    }
  */
}

#pragma mark - Private Methods

//
// ContentView의 투명버튼을 통해 Playback Controller UI Components를 사라지게 하거나 나타나게 합니다.
//
- (void) setPlayerUIHidden : (BOOL) hidden
{
    if ( hidden )
        NSLog(@"  [setPlayerUIHidden] Playback Controller : Hidden");
    else
        NSLog(@"  [setPlayerUIHidden] Playback Controller : Visable");
  
    self.view.userInteractionEnabled = NO;
    self.view.backgroundColor = hidden ? [UIColor clearColor] : UIColorFromRGB(0x000000, 0.5f);
  
    _topView.hidden = NO;
    _topView.alpha = hidden ? 1.f : 0.f;
    _bottomView.hidden = NO;
    _bottomView.alpha = hidden ? 1.f : 0.f;
    _menuItemView.hidden = NO;
    _menuItemView.alpha = hidden ? 1.f : 0.f;
    _menuItemTopLineView.hidden = NO;
    _menuItemTopLineView.alpha = hidden ? 1.f : 0.f;
    _menuItemBottomLineView.hidden = NO;
    _menuItemBottomLineView.alpha = hidden ? 1.f : 0.f;
    _controlBarView.hidden = NO;
    _controlBarView.alpha = hidden ? 1.f : 0.f;
  
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      self->_topView.alpha = hidden ? 0.f : 1.f;
                                      self->_bottomView.alpha = hidden ? 0.f : 1.f;
                                      self->_menuItemView.alpha = hidden ? 0.f : 1.f;
                                      self->_menuItemTopLineView.alpha = hidden ? 0.f : 1.f;
                                      self->_menuItemBottomLineView.alpha = hidden ? 0.f : 1.f;
                                      self->_controlBarView.alpha = hidden ? 0.f : 1.f;
                       
                                      if ( !hidden )
                                      {
                                          [self setPositionScriptToHideView : hidden];
                                      }
                                  }
                     completion : ^(BOOL finished)
                                  {
                                      self->_topView.hidden = hidden;
                                      self->_bottomView.hidden = hidden;
                                      self->_menuItemView.hidden = hidden;
                                      self->_menuItemTopLineView.hidden = hidden;
                                      self->_menuItemBottomLineView.hidden = hidden;
                                      self->_controlBarView.hidden = hidden;
                                    
                                      self.view.userInteractionEnabled = YES;
       
                                      if ( hidden )
                                      {
                                          [self setPositionScriptToHideView : hidden];
                                      }
                                  }];
}

//
// 오디오모드 여부에 따라 플레이어 레이어를 감추거나 다시 보여줍니다.
//
- (void) changeViewMode : (BOOL) isAudioMode
{
    _audioUiView.hidden = !isAudioMode;
  
    if ( isAudioMode )
    {
        _playerLayer.hidden = YES;
    }
    else if ( !isAudioMode )
    {
        _playerLayer.hidden = NO;
    }
}

//
// 타이머를 통해 슬라이더 왼쪽의 현재시간을 0.5초 주기로 업데이트합니다.
//
- (void) setTimerOnSlider
{
    NSLog(@"  [setTimerOnSlider]");
    [self invalidateTimerOnSlider]; // 일단 기존 타이머 중지.
  
    _seekTimer = [NSTimer scheduledTimerWithTimeInterval : 0.5f
                                                 repeats : YES
                                                   block : ^(NSTimer * _Nonnull timer)
                                                           {
                                                               NSTimeInterval playTime = [self getCurrentPlaybackTime];
                                                               [self setSeekbarCurrentValue : playTime];
                                                               [self setCurrentTime : playTime
                                                                        forceChange : NO];
                                                               [self->_miniPlayerUiView setSeekbarCurrentValue : playTime];
                                                            }];
  
    if ( _seekTimer )
    {
        [[NSRunLoop currentRunLoop] addTimer : _seekTimer
                                     forMode : NSRunLoopCommonModes];
    }
}

//
// 슬라이더 타이머를 중지합니다.
//
- (void) invalidateTimerOnSlider
{
    NSLog(@"  [invalidateTimerOnSlider]");
  
    if ( _seekTimer && _seekTimer.isValid )
    {
        [_seekTimer invalidate];
    }
  
    _seekTimer = nil;
}

//
// UI 컴포넌트의 활성화 또는 비활성화 시킵니다.
//
- (void) setTouchEnable : (UIView *) view
                 isLock : (BOOL) isLock
{
    view.userInteractionEnabled = !isLock;
    view.alpha = isLock ? 0.7f : 1.f;
}
- (void) pressedPlayerButtonWithId : (NSString *) buttonId
                            status : (NSInteger) status
{
    // 권한이 없으면..
    if ( !_isAuthor )
    {
        BOOL isToast = NO;
      
        if ( [@"script-mode" isEqualToString : buttonId] )
        {
            [_scriptView setStatus : MediaPlayerScriptViewModeNone];
            isToast = YES;
        }
        else if ( [@"download-mode" isEqualToString : buttonId] )
        {
            [_downloadButton setStatus : 0];
            isToast = YES;
        }
      
        if ( isToast )
        {
            [_contentView makeToast : @"프리뷰 이용 중입니다."];
          
            return ;
        }
    }
  
    if ( [@"script-mode" isEqualToString : buttonId] )
    {
        [self setScriptViewFrameWithStatus : status];
        [self readScript];
    }
    else if ( [@"view-mode" isEqualToString : buttonId] )
    {
        [self changeViewMode: (status == 1)];
    }
    else if ( [@"autoplay-mode" isEqualToString: buttonId])
    {
        [common setUserSettingValueWithKey : @"autoplay_enable"
                                     value : status == 0 ? @"N" : @"Y"];
    }
    else if ( [@"lock-mode" isEqualToString : buttonId] )
    {
        BOOL isLock = (status == 1);
        NSLog(@"  lock-mode : %@", isLock? @"잠금완료" : @"잠금해제");
        [self setTouchEnable : _closeButton
                      isLock : isLock];
      
      //[self setTouchEnable : _rateStarButton
      //              isLock : isLock];
      
        [self setTouchEnable : _playButton
                      isLock : isLock];
      
        [self setTouchEnable : _paueseButton
                      isLock : isLock];
      
        [self setTouchEnable : _rwButton
                      isLock : isLock];
      
        [self setTouchEnable : _ffButton
                      isLock : isLock];
      
        [self setTouchEnable : _speedButton
                      isLock : isLock];
      
        [self setTouchEnable : _listButton
                      isLock : isLock];
      
        [self setTouchEnable : _autoPlayButton
                      isLock : isLock];
      
        [self setTouchEnable : _scriptButton
                      isLock : isLock];
      
        [self setTouchEnable : _modeChangeButton
                      isLock : isLock];
      
        [self setTouchEnable : _sleepButton
                      isLock : isLock];
      
        [self setTouchEnable : _slider
                      isLock : isLock];
      
        // 아직 다운로드 구현이 완료되지 않았으므로 일괄적으로 다운로드버튼도 잠금처리합니다.
      //if ( self.isDownloadFile || self.isDownloading )
      //{
      //    [self setTouchEnable : _downloadButton
      //                  isLock : YES];
      //}
      //else
      //{
            [self setTouchEnable : _downloadButton
                          isLock : isLock];
      //}
    }
    else if ( [@"timer-mode" isEqualToString : buttonId] )
    {
        if ( status == 1 )
        {
            if ( [IFSleepTimerManager sharedInstance].isAlive )
            {
                [[IFSleepTimerManager sharedInstance] stopTimer];
            }
          
            [_sleepButton setStatus : 0];
            [_sleepButton setText : @""];
          
            [self openTimerSelectView];
        }
        else
        {
            [self setTimerMode : @"사용안함"];
        }
    }
    else if ( [@"download-mode" isEqualToString : buttonId] )
    {
        NSString *wifiDown = [[NSUserDefaults standardUserDefaults] objectForKey : @"wifiDown"];
      
        if ( [@"on" isEqualToString:wifiDown] && ![[ApiManager sharedInstance] isConnectionWifi] )
        {
            UIAlertController *alert = [UIAlertController alertControllerWithTitle : @"확인"
                                                                           message : @"LTE/3G로 연결되어 있습니다. 사용자 설정에 따라 Wi-fi에서만 다운로드가 가능합니다."
                                                                    preferredStyle : UIAlertControllerStyleAlert];
          
            UIAlertAction *ok = [UIAlertAction actionWithTitle : @"닫 기"
                                                         style : UIAlertActionStyleDefault
                                                       handler : ^(UIAlertAction * action)
                                                                 {
                                                                     [alert dismissViewControllerAnimated:YES completion:nil];
                                                                 }];
            [alert addAction : ok];
          
            //[_contentView presentViewController:alert animated:YES completion:nil];
          
            return ;
        }
      
        // 2018. 9.14 ~
        [_fpsDownloadManager startDownload:_args completion:^(NSError* error, NSMutableDictionary* result){}];
    }
}

#pragma mark - Notifications
//
// 2~3초 정도의 토스트메시지를 보여줍니다.
//
- (void) showToast : (NSString *) text
{
    [self.view makeToast : text];
}

#pragma mark - Time Control

//
// 콘텐트의 전체 재생 시간을 구합니다.
//
- (NSTimeInterval) getDuration
{
    AVPlayerItem *item = _player.currentItem;
    // 권한 체크에 따라 01:30 로 리턴할 필요가 있습니다.
  
    if ( item.status == AVPlayerItemStatusReadyToPlay )
    {
        double loadedDuration = CMTimeGetSeconds(item.duration);
      
        return (NSTimeInterval) loadedDuration;
    }
    else
    {
        return (CMTimeGetSeconds(kCMTimeInvalid));
    }
}

//
// 콘텐트의 현재 재생 시간을 구합니다.
//
- (NSTimeInterval) getCurrentPlaybackTime
{
    AVPlayerItem *item = _player.currentItem;
  
    if ( item.status == AVPlayerItemStatusReadyToPlay )
    {
        double currentTime = CMTimeGetSeconds(item.currentTime);
      //NSLog(@"  Current time : %f", currentTime);
      
        return (NSTimeInterval) currentTime;
    }
    else
    {
        return (CMTimeGetSeconds(kCMTimeInvalid));
    }
}

#pragma mark - SleepTimer
//
// 슬립타이머버튼을 누르면 시간선택 팝업뷰가 뜹니다.
//
- (void) openTimerSelectView
{
    NSLog(@"  [openTimerSelectView]");
    if ( _playerSleepTimerSelectView )
    {
        return ;
    }
  
    CGFloat height = 0;
  
    if ( self.view.frame.size.width < self.view.frame.size.height )
    {
        height = 60 + (50 * 4);
    }
    else
    {
        height = 60 + (50 * 2);
    }
  
    CGRect frame = CGRectMake(0, CGRectGetMinY(_bottomView.frame) - height, self.view.frame.size.width, height);
    _playerSleepTimerSelectView = [[PlayerSleepTimerView alloc] initWithFrame : frame];
    _playerSleepTimerSelectView.delegate = self;
    [self.view addSubview : _playerSleepTimerSelectView];
}

- (void) setTimerMode : (NSString *) text
{
    NSLog(@"  [setTimerMode] : %@", text);
    if ( [@"사용안함" isEqualToString : text] )
    {
        if ( [IFSleepTimerManager sharedInstance].isAlive )
        {
            [[IFSleepTimerManager sharedInstance] stopTimer];
        }
      
        [_sleepButton setText : @""];
        [_sleepButton setStatus : 0];
      
        return ;
    }
  
    BOOL isEpisodeStop = NO;
  
    if ( [@"현재 에피소드까지" isEqualToString : text] )
    {
        isEpisodeStop = YES;
    }
  
    NSInteger timerMin = 0;
  
    if ( [@"5분" isEqualToString : text] )
    {
        timerMin = 5;
    }
    else if ( [@"10분" isEqualToString : text] )
    {
        timerMin = 10;
    }
    else if ( [@"15분" isEqualToString : text] )
    {
        timerMin = 15;
    }
    else if ( [@"30분" isEqualToString : text] )
    {
        timerMin = 30;
    }
    else if ( [@"45분" isEqualToString : text] )
    {
        timerMin = 45;
    }
    else if ( [@"1시간" isEqualToString : text] )
    {
        timerMin = 60;
    }
  
    [_sleepButton setStatus : 1];
  
    NSDate *stopDate = nil;
  
    if ( !isEpisodeStop )
    {
        stopDate = [[NSDate date] dateByAddingTimeInterval : (timerMin * 60)];
    }
  
    [IFSleepTimerManager sharedInstance].delegate = self;
    [[IFSleepTimerManager sharedInstance] startTimer : stopDate
                                     stopEpisodeMode : isEpisodeStop];
}

//
// 슬립타이머 선택 뷰를 닫습니다.
//
- (void) playerSleepTimerView : (PlayerSleepTimerView *) view
                    closeView : (id) sender
{
    NSLog(@"  [playerSleepTimerView:closeView:]");
    if ( _playerSleepTimerSelectView )
    {
        [_playerSleepTimerSelectView removeFromSuperview];
        _playerSleepTimerSelectView = nil;
    }
}

- (void) playerSleepTimerView : (PlayerSleepTimerView *) view
              didSelectedTime : (NSString *) time
{
    NSLog(@"  [playerSleepTimerView:didSelectedTime:]");
    [self setTimerMode : time];
}

- (void) secondFromSleepTimerManager : (NSInteger) second
{
    if ( _sleepButton && second >= 0 )
    {
        [_sleepButton setText : [common convertTimeToString : (float) second
                                                     Minute : YES]];
    }
}

- (void) finishFromSleepTimerManager
{
    if ( _sleepButton )
    {
        [_sleepButton setStatus : 0];
        [_sleepButton setText : @""];
    }
  
    [self pressedPauseButton];
}

# pragma mark - Contents Pop-up List
//
// 재생 리스트뷰를 닫습니다.
//
- (void) playListPopupView : (ContentsListPopupView *) view
                 closeView : (id) sender
{
    if ( _listView )
    {
        [_listView removeFromSuperview];
        _listView = nil;
    }
}

//
// 재생 리스트뷰의 선택된 셀의 콘텐트를 읽어와서 재생합니다.
//
- (void) playListPopupView : (ContentsListPopupView *) view
        selectedOtherIndex : (NSInteger) index
{
    NSLog(@"  [playListPopupView:selectedOtherIndex:] index : %li", (long)index);
    // 선택된 index에서 uri와 cid를 읽어와서 재생하는 것을 구현해야 합니다.
    if ( _isAudioContent )
    {
        [_args setObject : _currentContentsInfo[@"data"][@"chapters"][index][@"cid"]
                  forKey : @"cid"];
        _currentLectureTitle = _currentContentsInfo[@"data"][@"chapters"][index][@"title"];
    }
    else if ( !_isAudioContent )
    {
        [_args setObject : _currentContentsInfo[@"data"][@"clips"][index][@"cid"]
                  forKey : @"cid"];
        _currentLectureTitle = _currentContentsInfo[@"data"][@"clips"][index][@"title"];
    }
  
    NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                  andHeaderInfo : [_args objectForKey : @"token"]];
  
    [_args setObject : playDataDics[@"media_urls"][@"HLS"]
              forKey : @"uri"];
  
    if ( _listView )
    {
        [_listView removeFromSuperview];
        _listView = nil;
    }
  
    // 플레이어 재생목록에서 선택해서 재생하는 경우에도 다운로드 받은 콘텐츠인지를 확인해서
    //  다운로드 받은 콘텐츠일 경우 다운로드 받은 경로 설정. 2018.10.29.
    [_args setObject : [self getContentUri:[_args objectForKey:@"cid"]]
              forKey : @"uri"];
  
    [self playNext];  // 새로운 콘텐츠 재생이므로 시작 시간이 0 입니다.
}

# pragma mark - Script View
//
// 로컬에 저장된 자막파일이 있는지 검색해보고 없으면 API를 통해 자막데이터를 가져옵니다.
//
- (NSArray *) readScript
{
    // documents 디렉토리의 경로를 가져옵니다.
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    // 파일 경로를 만듭니다.
    NSString *fileName = [[_args objectForKey : @"cid"] stringByAppendingString : @"_subtitles.plist"];
    NSString *filePath = [documentsDirectory stringByAppendingPathComponent : fileName];
    // 파일로 부터 읽어오기
    NSMutableArray *arrDicData = [NSMutableArray arrayWithContentsOfFile : filePath];

    // 파일이 존재하지 않을 때
    if ( arrDicData == nil )
    {
        NSLog(@"  [-readScript] No subtitles file stored. Get subtitles from API server.");
      
        return [ApiManager getSubtitles : [_args objectForKey : @"cid"]];
    }
    else  // 파일이 존재 할 때
    {
        NSLog(@"  [-readScript] Found a subtitles file stored.");
      
        return arrDicData;
    }
}

//
// 자막UI를 초기화합니다.
//
- (void) initScriptUi
{
    NSLog(@"  자막 UI 구성이 시작되었습니다.");
    NSArray *scriptArray;
    if ( _isAuthor )
      scriptArray = [self readScript];
    else
      scriptArray = @[];
  
    _scriptView = [[MediaPlayerScriptView alloc] initWithFrame : CGRectZero];
    _scriptView.frame = CGRectMake(0, CGRectGetMinY(_bottomView.frame), self.view.frame.size.width, 0);
    _scriptView.delegate = self;
    [self.view addSubview : _scriptView];
  
    [_scriptView setScript : scriptArray];
  
    _scriptView.alpha = 0.f;
    _scriptView.hidden = YES;
    NSLog(@"  자막 UI 구성이 완료되었습니다.");
}
- (void) setScriptViewFrameWithStatus : (NSInteger) status
{
    CGRect clientRect = self.view.frame;
  
    _scriptView.status = status;
  
    if ( _scriptView.status == MediaPlayerScriptViewModeNone )
    {
        CGRect menuFrame = CGRectMake(0, CGRectGetMinY(_bottomView.frame)-50.f, self.view.frame.size.width, 50.f);
        CGRect controlFrame = CGRectMake(0, CGRectGetMinY(menuFrame)-90.f, self.view.frame.size.width, 80.f);
      
        [self animationViewsWithTopViewAlpha : 1.f
                                topViewFrame : CGRectMake(0, 0, self.view.frame.size.width, 60.f)
                             scriptViewAlpha : 0.f
                             scriptViewFrame : CGRectMake(0, CGRectGetMinY(_bottomView.frame), clientRect.size.width, 0)
                               menuViewAlpha : 1.f
                               menuViewFrame : menuFrame
                            controlViewAlpha : 1.f
                            controlViewFrame : controlFrame];
    }
    else if ( _scriptView.status == MediaPlayerScriptViewModeText )
    {
        CGRect scriptFrame;
        scriptFrame.origin.x = 0.f;
        scriptFrame.origin.y = CGRectGetMinY(_bottomView.frame) - 110;
        scriptFrame.size.width = clientRect.size.width;
        scriptFrame.size.height = 110;
      
        CGRect menuFrame;
        menuFrame.origin.x = 0.f;
        menuFrame.origin.y = CGRectGetMinY(scriptFrame) - 50.f;
        menuFrame.size.width = clientRect.size.width;
        menuFrame.size.height = 50.f;
      
        CGRect controlFrame;
        controlFrame.origin.x = 0.f;
        controlFrame.origin.y = CGRectGetMinY(menuFrame) - 80.f;
        controlFrame.size.width = clientRect.size.width;
        controlFrame.size.height = 80.f;
      
        [self animationViewsWithTopViewAlpha : 1.f
                                topViewFrame : CGRectMake(0, 0, self.view.frame.size.width, 60.f)
                             scriptViewAlpha : 1.f
                             scriptViewFrame : scriptFrame
                               menuViewAlpha : 1.f
                               menuViewFrame : menuFrame
                            controlViewAlpha : 1.f
                            controlViewFrame : controlFrame];
    }
    else if ( _scriptView.status == MediaPlayerScriptViewModeList )
    {
        CGRect scriptFrame;
        scriptFrame.origin.x = 0.f;
        scriptFrame.origin.y = 0.f;
        scriptFrame.size.width = clientRect.size.width;
        scriptFrame.size.height = clientRect.size.height - _bottomView.frame.size.height;
      
        CGRect menuFrame;
        menuFrame.origin.x = 0.f;
        menuFrame.origin.y = CGRectGetMinY(scriptFrame) - 50.f;
        menuFrame.size.width = clientRect.size.width;
        menuFrame.size.height = 50.f;
      
        CGRect controlFrame;
        controlFrame.origin.x = 0.f;
        controlFrame.origin.y = CGRectGetMinY(menuFrame) - 80.f;
        controlFrame.size.width = clientRect.size.width;
        controlFrame.size.height = 80.f;
      
        [self animationViewsWithTopViewAlpha : 0.f
                                topViewFrame : CGRectMake(0, 0, self.view.frame.size.width, 60.f)
                             scriptViewAlpha : 1.f
                             scriptViewFrame : scriptFrame
                               menuViewAlpha : 0.f
                               menuViewFrame : menuFrame
                            controlViewAlpha : 0.f
                            controlViewFrame : controlFrame];
    }
}

- (void) animationViewsWithTopViewAlpha : (CGFloat) topViewAlpha
                           topViewFrame : (CGRect) topViewFrame
                        scriptViewAlpha : (CGFloat) scriptViewAlpha
                        scriptViewFrame : (CGRect) scriptViewFrame
                          menuViewAlpha : (CGFloat) menuViewAlpha
                          menuViewFrame : (CGRect) menuViewFrame
                       controlViewAlpha : (CGFloat) controlViewAlpha
                       controlViewFrame : (CGRect) controlViewFrame
{
    _topView.hidden = NO;
    _scriptView.hidden = NO;
    _menuItemView.hidden = NO;
    _controlBarView.hidden = NO;
  
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      self->_topView.alpha = topViewAlpha;
                                      self->_topView.frame = topViewFrame;
                       
                                      self->_scriptView.alpha = scriptViewAlpha;
                                      self->_scriptView.frame = scriptViewFrame;
                       
                                      self->_menuItemView.alpha = menuViewAlpha;
                                      self->_menuItemView.frame = menuViewFrame;
                       
                                      self->_controlBarView.alpha = controlViewAlpha;
                                      self->_controlBarView.frame = controlViewFrame;
                                  }
                     completion : ^(BOOL finished)
                                  {
                                      self->_topView.hidden = (topViewAlpha == 0.f);
                                      self->_scriptView.hidden = (scriptViewAlpha == 0.f);
                                      self->_menuItemView.hidden = (menuViewAlpha == 0.f);
                                      self->_controlBarView.hidden = (controlViewAlpha == 0.f);
                                  }];
}
- (void) setPositionScriptToHideView : (BOOL) hidden
{
    if ( _scriptView.status == MediaPlayerScriptViewModeText )
    {
        if ( hidden == YES )
        {
            CGRect frame = _scriptView.frame;
            frame.origin.y = self.view.frame.size.height - frame.size.height;
          
            [UIView animateWithDuration : 0.3f
                                  delay : 0
                                options : UIViewAnimationOptionAllowUserInteraction
                             animations : ^{
                                              self->_scriptView.frame = frame;
                                          }
                             completion : ^(BOOL finished) {} ];
        }
        else
        {
            [self setScriptViewFrameWithStatus : _scriptView.status];
        }
    }
}
- (void) mediaPlayerScriptView : (MediaPlayerScriptView *) view
                  statusChange : (MediaPlayerScriptViewMode) mode
{
    [_scriptButton setStatus : mode];
    [self setScriptViewFrameWithStatus : mode];
}

# pragma mark - Contents mini Player

// 플레이어 모드 변경 (미니<->일반 플레이어뷰)
- (void) changedPlayerMode : (BOOL) isMiniPlayer
{
  //self.view.hidden = NO;
  //_miniPlayerUiView.hidden = NO;
  
  //self.view.alpha = isMiniPlayer ? 1.f : 0.f;
  //_miniPlayerUiView.alpha = isMiniPlayer ? 0.f : 1.f;
  /*
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      //_playerUiView.alpha = isMiniPlayer ? 0.f : 1.f;
                                      self.view.alpha = isMiniPlayer ? 0.f : 1.f;
                                      _miniPlayerUiView.alpha = isMiniPlayer ? 1.f : 0.f;
                                   }
                     completion : ^(BOOL finished)
                                  {
                                      self.isMiniPlayer = isMiniPlayer;
                                      //_playerUiView.hidden = self.isMiniPlayer;
                                      self.view.hidden = self.isMiniPlayer;
                                      _miniPlayerUiView.hidden = !self.isMiniPlayer;
                                  }];
  */
    if ( isMiniPlayer )
    {
      // 이용로그 전송 시작
      //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
      /*
      NSTimeInterval cTime = 0000;
      [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                            contentKey: self.ckey
                                                status: @"miniPlayer"
                                            downloaded: self.isDownloadFile
                                          startingTime: (int) (cTime * 1000)
                                            endingTime: (int) (cTime * 1000 + 30000)];
      */
    }
    else
    {
      // 이용로그 전송 시작
      //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
      /*
      NSTimeInterval cTime = 0000;
      [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                            contentKey: self.ckey
                                                status: @"fullPlayer"
                                            downloaded: self.isDownloadFile
                                          startingTime: (int) (cTime * 1000)
                                            endingTime: (int) (cTime * 1000 + 30000)];
      */
    }
}
- (void) miniPlayerUiView : (ContentMiniPlayerView *) view
                 openView : (id) sender
{
    NSLog(@"  [-miniPlayerUiView:openView:] mini Player -> Full Screen Player");
  /*
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
  }*/
  
    [self changedPlayerMode : NO];
  
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      [self.view.superview setFrame : CGRectOffset([self.view frame], 0, 0)];
                                   }
                     completion : ^(BOOL finished)
                                  {
                                      self.view.frame = self.view.bounds;
                                      [[self.view viewWithTag:1] removeFromSuperview];
                                  }];
    self.isMiniPlayer = NO;
    _miniPlayerUiView = nil;
    [[self.view viewWithTag:1] removeFromSuperview];
  //_screenMode = ContentsPlayerScreenModeMiniPlayer;
    [common hideStatusBar];
}

- (void) miniPlayerUiView : (ContentMiniPlayerView *) view
                  setPlay : (BOOL) isPlay
{
    if ( isPlay )
    {
        [self pressedPlayButton];
        [_miniPlayerUiView setPlayState : YES];
    }
    else
    {
        [self pressedPauseButton];
        [_miniPlayerUiView setPlayState : NO];
    }
}

- (void) miniPlayerUiView : (ContentMiniPlayerView *) view
                closeView : (id) sender
{
    [self closePlayer];
}


#pragma mark - Timer event
//
// 정해진 타이머대로 로그데이터를 전송합니다.
//
- (void) reloadLogData : (NSTimer *) timer
{
    NSLog(@"  [reloadLogData] 타이머에 예약에 의해 30초마다 서버로 사용로그를 전송합니다.");
    // 이용로그 전송 시작
    NSString *netStatus = @"no_network";
    if ( _isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-Fi";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
    }
  
    [ApiManager sendPlaybackProgressWith : [_args objectForKey : @"cid"]
                                  action : @"ING"             // START / ING / END / FORWARD / BACK
                             startSecond : [self getCurrentPlaybackTime]
                               endSecond : [self getCurrentPlaybackTime] + 30
                                duration : 30
                               netStatus : netStatus
                               authToken : [_args objectForKey : @"token"]];
}

# pragma mark - PallyCon FPS Download Delegate
//
// 다운로드가 종료되었을 때 호출됩니다.
//
- (void) downloadContent : (NSString * _Nonnull) contentId
  didFinishDownloadingTo : (NSURL * _Nonnull) location
{
    NSLog(@"  download contentId : %@, location : %@", contentId, location.absoluteString);
  
    if ( ![contentId isEqualToString:[_args objectForKey:@"cid"]] )
    {
        // 다운로드 완료된 파일이 현재 재생중인 콘텐츠와 다를 경우(다른 영상에서 다운로드를 요청한 케이스)에는 팝업을 띄우지 않습니다.
        return ;
    }
  
    if ( self.isMiniPlayer )
    {
        [self miniPlayerUiView:_miniPlayerUiView openView:self];
    }
  
    NSString *assetPath = location.relativePath;
    NSURL *baseURL = [NSURL fileURLWithPath : NSHomeDirectory()];
    NSString *assetURL = [[baseURL absoluteString] stringByAppendingPathComponent : assetPath];
    NSLog(@"  assetURL : %@", assetURL);
  
    //다운로드 버튼 업데이트
    _downloadedFilePath = location.path;
    [self updateDownloadState];
  
    UIAlertController *alert = [UIAlertController alertControllerWithTitle : @"다운로드 완료"
                                                                   message : @"다운로드된 파일로 재생하시겠습니까?"
                                                            preferredStyle : UIAlertControllerStyleAlert];
  
    UIAlertAction *y = [UIAlertAction actionWithTitle : @"예"
                                                style : UIAlertActionStyleDefault
                                              handler : ^(UIAlertAction * action)
                                                        {
                                                            self->_isDownloadFile = YES;
                                                            [self updateNetStatusLabel];
                                                            NSTimeInterval cTime = [self getCurrentPlaybackTime];
                                                            NSTimeInterval tTime = [self getDuration];
                                                          
                                                            [alert dismissViewControllerAnimated:YES completion:nil];
                                                          
                                                            [self->_args setObject : assetURL
                                                                      forKey : @"uri"];   // 현재 스트리밍하고 있는 콘텐츠와 cid가 같으므로 생략해도 됩니다.
                                                          
                                                            [self fpsSetUrlAsset];
                                                          
                                                            self->_playerItem = [ AVPlayerItem playerItemWithAsset : self->_urlAsset ];
                                                            [self->_player replaceCurrentItemWithPlayerItem : self->_playerItem];
                                                          
                                                            CMTime newTime = CMTimeMakeWithSeconds(cTime, tTime);
                                                            [self->_player seekToTime : newTime];//playImmediatelyAtRate
                                                            [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
                                                          
                                                            [[NSNotificationCenter defaultCenter] addObserver : self
                                                                                                     selector : @selector(videoPlayBackDidFinish:)
                                                                                                         name : AVPlayerItemDidPlayToEndTimeNotification
                                                                                                       object : [self->_player currentItem]];
                                                       }];
  
    UIAlertAction *n = [UIAlertAction actionWithTitle : @"아니오"
                                                style : UIAlertActionStyleDefault
                                              handler : ^(UIAlertAction * action)
                                                        {
                                                          [alert dismissViewControllerAnimated:YES completion:nil];
                                                          self->_isDownloadFile = NO;
                                                          [self updateNetStatusLabel];
                                                        }];
  
    [alert addAction : y];
    [alert addAction : n];
  
    [self presentViewController : alert
                       animated : YES
                     completion : nil];
}

//
// 언제 호출되는지 잘 모릅니다.
//
- (void) downloadContent : (NSString * _Nonnull) contentId
                 didLoad : (CMTimeRange) timeRange
   totalTimeRangesLoaded : (NSArray<NSValue *> * _Nonnull) loadedTimeRanges
 timeRangeExpectedToLoad : (CMTimeRange) timeRangeExpectedToLoad
{
    // 다운로드 진행률에 따라 주기적으로 호출됨.
}

//
// 언제 호출되는지 잘 모르지만 다운로드가 막 시작되는 시점에 호출되는 것 같습니다.
//
- (void)  downloadContent : (NSString * _Nonnull) contentId
didStartDownloadWithAsset : (AVURLAsset * _Nonnull) asset
      subtitleDisplayName : (NSString * _Nonnull) subtitleDisplayName
{
  NSLog(@"  downloadContent:didStartDownloadWithAsset:subtitleDisplayName -> %@", contentId);
  
  if ([contentId isEqualToString:[_args objectForKey:@"cid"]]) {
    _downloadedFilePath = nil;
    [self updateDownloadState];
  }
}


- (void) downloadContent : (NSString * _Nonnull) contentId
        didStopWithError : (NSError * _Nullable) error
{
    NSLog(@"  download contentId : %@, error code : %ld ", contentId, [error code]);
    // FPS 다운로드간 에러 발생시 여기서 처리합니다.
}


# pragma mark - FPSDownload Delegate

- (void) fpsDownloadMsg : (NSString *) downloadMsg
{
    if ( downloadMsg )
    {
        [self showToast : downloadMsg]; // 다운로드 진행상황 관련 메시지
    }
}


# pragma mark - Download State Check and GUI Update
//
// 지금은 다운로드 상태에 따른 버튼 이미지만 교체하는 수준이지만
// 추후에는 보다 디테일한 다운로드 진행 상태 업데이트(프로그레스바) 등의 처리 고려
- (void) updateDownloadState
{
    [_downloadButton setImage:@"icon_download"];  // 기본상태
    
    if (_downloadedFilePath && [_downloadedFilePath containsString:@"/"]) {
        [_downloadButton setImage:@"icon_download_done"]; // 다운로드 완료
    }else{
        if ( [[[FPSDownloadManager sharedInstance] activeDownloads] objectForKey:_args[@"cid"]] ){
            [_downloadButton setImage:@"icon_download_ing"];  // 다운로드중
        }else{
            [[[FPSDownloadManager sharedInstance] downloadingQueue] enumerateObjectsUsingBlock : ^(id obj, NSUInteger idx, BOOL *stop)
             {
                 FPSDownload *r = obj;
                 if ( [self->_args[@"cid"] isEqualToString : r.clip.cid] )
                 {
                     *stop = YES;
                     [self->_downloadButton setImage:@"icon_download_waiting"]; // 다운로드 대기중
                     return ;
                 }
             }];
        }
    }
}

// 재생모드 표시 업데이트(다운로드 파일이지만 사용자가 스트리밍 재생을 원할 경우도 있으므로 다운로드 상태 표시와 별도로 구분)
- (NSString *) updateNetStatusLabel
{
  NSString *netStatus = @"no_network";
  if ( _isDownloadFile )
  {
    netStatus = @"DOWNLOAD";
    _networkStatusLabel.text = @"다운로드 재생";
  }
  else if ( [[ApiManager sharedInstance] isConnectionWifi] )
  {
    netStatus = @"Wi-Fi";
    _networkStatusLabel.text = @"Wi-Fi 재생";
  }
  else if ( [[ApiManager sharedInstance] isConnectionCellular] )
  {
    netStatus = @"LTE/3G";
    _networkStatusLabel.text = @"LTE/3G 재생";
  }
  
  return netStatus;
}

# pragma mark - Content URI Setting

// 로컬에 다운로드된 파일일 경우 로컬 경로를 리턴해주고 그렇지 않을 경우 스트리밍 URL 을 리턴해준다.
- (NSString *) getContentUri:(NSString *)cid
{
  NSString *contentPath = [self getDownloadedContentPath:_args[@"cid"]];
  if (contentPath && [contentPath containsString:@"/"]){
    _downloadedFilePath = contentPath;  // 로컬 파일 재생 여부 확인을 위해 전역에 보관
    return contentPath;
  }else{
    _downloadedFilePath = nil;  // 로컬 파일 재생 여부 확인을 위해 전역에 보관
    NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                  andHeaderInfo : [_args objectForKey : @"token"]];
    return playDataDics[@"media_urls"][@"HLS"];
  }
}

// 로컬에 이미 다운로드된 콘텐츠가 있는지 확인하고 있을 경우 경로를 리턴해준다.
- (NSString *) getDownloadedContentPath:(NSString *)cid
{
  NSString *contentPath = nil;
  
  NSMutableArray *downloaded = [[DatabaseManager sharedInstance] searchDownloadedContentsId:cid];
  
  if (downloaded && downloaded.count > 0) {
    Clip* clip = downloaded[0];
    contentPath = clip.contentPath;
  }
  
  return contentPath;
}

# pragma mark - Event Responder
//
// 정의된 외부 이벤트에 의해 호출됩니다.
//
- (void) remoteControlReceivedWithEvent : (UIEvent *) receivedEvent
{
    if ( receivedEvent.type == UIEventTypeRemoteControl )
    {
        switch ( receivedEvent.subtype )
        {
            // EarPod 또는 다른 헤드폰의 이벤트를 받았을 경우 호출됩니다.
            case UIEventSubtypeRemoteControlTogglePlayPause:
                if ( _playButton.hidden )  // 플레이 중인지 체크해야 합니다.
                    [self pressedPauseButton];
                else
                    [self pressedPlayButton];
            
                break;
            
            // 스프링보드의 제어센터에서 재생버튼을 탭할 경우 호출됩니다.
            case UIEventSubtypeRemoteControlPlay:
                [self pressedPlayButton];
                break;
            
            // 스프링보드의 제어센터에서 정지?버튼을 탭할 경우 호출됩니다.
            case UIEventSubtypeRemoteControlPause:
                [self pressedPauseButton];
                break;
            
            // 스프링보드의 제어센터에서 중지?버튼을 탭할 경우 호출됩니다.
            case UIEventSubtypeRemoteControlStop:
                [self closePlayer];
                break;
            
            // 스프링보드의 제어센터에서 이전곡버튼을 탭할 경우 호출됩니다.
            case UIEventSubtypeRemoteControlPreviousTrack:
                [self setPreviousContent];
                break;
            
            // 스프링보드의 제어센터에서 다음곡버튼을 탭할 경우 호출됩니다.
            case UIEventSubtypeRemoteControlNextTrack:
                [self setNextContent];
                break;
            
            default:
                return;
        }
    }
}

# pragma mark - Media Center

- (void) setupNowPlayingInfoCenter
{
    Class playingInfoCenter = NSClassFromString(@"MPNowPlayingInfoCenter");
  
    if ( playingInfoCenter )
    {
        NSMutableDictionary *songInfo = [[NSMutableDictionary alloc] init];
        MPMediaItemArtwork *albumArt = [[MPMediaItemArtwork alloc] initWithBoundsSize : CGSizeMake(600, 600)  // or image.size
                                                                       requestHandler : ^UIImage * _Nonnull(CGSize size)
                                                                                        {
                                                                                            UIImage *lockScreenArtworkApp;
                                                                                            lockScreenArtworkApp = [UIImage imageNamed : @"AlbumArt"];
                                                                                          
                                                                                            return [self resizeImageWithImage : lockScreenArtworkApp
                                                                                                                 scaledToSize : size];
                                                                                        }];
      
        [songInfo setObject : [_currentLectureTitle stringByReplacingOccurrencesOfString:@"\n" withString:@" "]
                     forKey : MPMediaItemPropertyTitle];
        [songInfo setObject : _currentContentsInfo[@"data"][@"teacher"][@"name"]
                     forKey : MPMediaItemPropertyArtist];
        [songInfo setObject : [_args objectForKey : @"name"]
                     forKey : MPMediaItemPropertyAlbumTitle];
        /*
        [songInfo setObject : @(0.0)
                     forKey : MPNowPlayingInfoPropertyElapsedPlaybackTime];*/
        [songInfo setObject : [NSNumber numberWithFloat:CMTimeGetSeconds(_urlAsset.duration)]
                     forKey : MPMediaItemPropertyPlaybackDuration];
         
        [songInfo setObject : albumArt
                     forKey : MPMediaItemPropertyArtwork];
        [[MPNowPlayingInfoCenter defaultCenter] setNowPlayingInfo : songInfo];
    }
}
- (UIImage *) resizeImageWithImage : (UIImage *) image
                      scaledToSize : (CGSize) newSize
{
    UIGraphicsBeginImageContextWithOptions(newSize, NO, 0.0);
    [image drawInRect : CGRectMake(0, 0, newSize.width, newSize.height)];
    UIImage *newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
  
    return newImage;
}

@end
