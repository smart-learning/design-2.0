
#import "ContentPlayerViewController.h"

#import "AppDelegate.h"
#import "IFRecommendViewController.h"

#define PALLYCON_SITE_ID    @"O8LD"
#define PALLYCON_SITE_KEY   @"YxIe3SrPPWWH6hHPkJdG1pUewkB1T6Y9"

@interface ContentPlayerViewController() <ContentPlayerButtonDelegate, IFSleepTimerManagerDelegate, PlayerSleepTimerViewDelegate,
                                          ContentsListPopupViewDelegate, MediaPlayerScriptViewDelegate, ContentMiniPlayerViewDelegate>
{
    BOOL _isAudioMode;
    BOOL _statusBarHidden;
  
    UIView *_audioUiView;
    UIImageView *_backgroundImageView;
    UIImageView *_headphoneImageView;
    UIView *_contentView;            // PlayerLayer, TopBar, BottomBar 등을 표시하는 최상단 Layer, PlayerLayer에 여러 view를 add하면 사라지기 때문.
    UIView *_topView;                // 상단 메뉴 바.
    UIView *_bottomView;             // 최하단 메뉴 바. 콘텐트 현재 재생 시간, 시간 탐색용 슬라이더, 전체 재생 시간 표시.
    UIView *_menuItemView;           // _bottomView 바로 위에 위치한 메뉴바.
    UIView *_menuItemTopLineView;
    UIView *_menuItemBottomLineView;
    UIView *_controlBarView;         // 재생, 정지, 뒤로 가기, 빨리 가기를 포함한 유틸뷰.
  
    UIButton *_closeButton;
    UIButton *_rateStarButton;
    UIButton *_hideAndShowButton;
    UIButton *_playButton;      // 재생 버튼.
    UIButton *_paueseButton;    // 일시 정지 버튼.
    UIButton *_rwButton;        // 뒤로 가기 버튼.
    UIButton *_ffButton;        // 빨리 가기 버튼.
    UIButton *_speedButton;     // 재생 속도 버튼.
    UIButton *_listButton;      // .
  
    UILabel *_courseTitleLabel;   // 전체 강좌명
    UILabel *_lectureTitleLabel;  // 강좌 내 강의명
    UILabel *_timeLabel;          // 재생중인 콘텐트의 현재 시간.
    UILabel *_totalTimeLabel;     // 재생중인 콘텐트의 전체 시간.
    UILabel *_networkStatusLabel;

    UISlider  *_slider;           // 재생 시간 탐색용 슬라이더.
  
    BOOL _touchDragging;            // 슬라이더 프로퍼티.
    BOOL _holdTouchDragging;        // 슬라이더 프로퍼티.
    BOOL _isPlaybackContollerHidden;// 재생 컨트롤 UI 모듈 감춤 or 표시.
    BOOL _isAuthor;                 // 유저의 콘텐트에 대한 권한. (RN에서 넘겨받는 것이 제일 best입니다. 또는 API를 통해 가져오게 됩니다.)
    bool _isAudioContent;           // 콘텐트 타입. (AVPlayer API를 사용할 수도 있습니다. 추후에 '매일 책 한권' 등의 콘텐트에 대한 분류도 고민해야 할 것입니다.
  
    ContentPlayerButton *_autoPlayButton;
    ContentPlayerButton *_scriptButton;
    ContentPlayerButton *_modeChangeButton;
    ContentPlayerButton *_downloadButton;
    ContentPlayerButton *_sleepButton;
    ContentPlayerButton *_lockButton;
  
    ContentsListPopupView *_listView;
  
    NSMutableDictionary *_args;
    NSDictionary *_currentContentsInfo;
  
    StarRatingView *_rateView;
    PlayerSleepTimerView *_playerSleepTimerSelectView;
    MediaPlayerScriptView *_scriptView;
    ContentMiniPlayerView *_miniPlayerUiView;
  
    NSString *_currentStar;
  
    AVPlayer *_player;
    AVPlayerItem *_playerItem;
    AVURLAsset *_urlAsset;
  
    CGFloat _playbackRate;
    CGFloat _currentPlaybackDuration;
  
    NSTimer *_seekTimer;
}
@end

@implementation ContentPlayerViewController

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
  
    _isAudioMode = false; // 기본적으로 오디오모드 off인 상태에서 콘텐츠 재생을 시작합니다.
    // 오디오 UI
    {
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
    }
    // contentView 구성.
    _contentView = [[UIView alloc] initWithFrame : self.view.bounds];
    [self.view addSubview : _contentView];
  
    _hideAndShowButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _hideAndShowButton.frame = _contentView.bounds;
    [_hideAndShowButton addTarget : self
                           action : @selector(pressedHideAndShowButton)
                 forControlEvents : UIControlEventTouchUpInside];
    _isPlaybackContollerHidden = NO;  // 플레이어 시작과 동시에 모든 재생 컨트롤러 UI는 표시 상태입니다.
    [_contentView addSubview : _hideAndShowButton];
  
    // 어플리케이션이 백그라운드로 들어갔을 때 재생을 멈추지 않게 하기 위한 처리. 2018.8.21
  /* 일단 주석 처리
   *
    [[NSNotificationCenter defaultCenter] addObserver : self
                                             selector : @selector(applicationDidEnterBackground:)
                                                 name : UIApplicationDidEnterBackgroundNotification
                                               object : nil];
  */
}

// 뷰 컨트롤러가 화면에 나타나기 직전에 실행됩니다.
// 뷰 컨트롤러가 나타나기 직전에 항상 실행되기 때문에 해당 뷰 컨트롤러가 나타나기 직전마다 일어나는 작업들을 여기에 배치 시킬 수 있습니다.
- (void) viewWillAppear : (BOOL) animated
{
    [[UIApplication sharedApplication] setStatusBarHidden:YES animated:YES];
    // _args가 잘못 전달받아도 HLS 경로로 수정합니다.
    NSString *uriString = [_args objectForKey : @"uri"];
    uriString = [uriString stringByReplacingOccurrencesOfString : @"/DASH_"
                                                     withString : @"/HLS_"];
    uriString = [uriString stringByReplacingOccurrencesOfString : @"/stream.mpd"
                                                     withString : @"/master.m3u8"];
  
    NSURL *contentUrl = [ NSURL URLWithString : uriString ]; // CONTENT_PATH
    _urlAsset = [ [AVURLAsset alloc] initWithURL : contentUrl
                                         options : nil       ];
  
    // 2. Set parameters required for FPS content playback. FPS 콘텐츠가 재생 되기 전에 FPS 콘텐츠 정보를 설정합니다.
    [ _fpsSDK prepareWithUrlAsset : _urlAsset
                           userId : [_args objectForKey : @"userId"]
                        contentId : [_args objectForKey : @"cid"] // PALLYCON_CONTENT_ID
                       optionalId : [_args objectForKey : @"oid"] // PALLYCON_OPTIONAL_ID
                  liveKeyRotation : NO              ];
  
    _playerItem = [ AVPlayerItem playerItemWithAsset : _urlAsset ];
    _playerItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmSpectral;  // 재생속도 관련. 속도 변경을 하면 퀄리티가 위 옵션보다는 좋음.
    _player = [ AVPlayer playerWithPlayerItem : _playerItem ];
  
    // _contentView에 add하기위해 AVPlayerViewController가 아닌 AVPlayerLayer를 사용합니다.
    _playerLayer = [AVPlayerLayer playerLayerWithPlayer : _player];
    _playerLayer.frame = _contentView.bounds;
    [_playerLayer setVideoGravity : AVLayerVideoGravityResizeAspect]; // 가로세로 비율을 유지하고 비디오를 레이어의 경계 내에 맞출 수 있도록 지정합니다.
  
    [_contentView.layer addSublayer : _playerLayer];
}

// 뷰 컨트롤러가 화면에 나타난 직후에 실행됩니다.
// 화면에 적용될 애니메이션을 그리거나 API로 부터 정보를 받아와 화면을 업데이트 할 때 이곳에 로직을 위치시키면 좋습니다.
// 왜냐하면 지나치게 빨리 애니메이션을 그리거나 API에서 정보를 받아와 뷰 컨트롤러를 업데이트 할 경우 화면에 반영되지 않습니다.
- (void) viewDidAppear : (BOOL) animated
{
    // 오디오 콘텐츠인지 구분.
    if ( [[_args objectForKey : @"cid"] hasPrefix : @"b"] )
    {
        _isAudioContent = YES;
    }
    else if ( [[_args objectForKey : @"cid"] hasPrefix : @"v"] )
    {
        _isAudioContent = NO;
    }
    NSLog(@"  [setContentData] isAudioContent? : %@", _isAudioContent? @"TRUE" : @"FALSE");
  
    // 재생 시작.
    _playbackRate = 1.f;  // 재생 속도의 default는 항상 1입니다.
    [self setTimerOnSlider];  // 슬라이더 바의 타이머를 시작합니다.
    [_player play];   // 플레이어 재생 실행
    [ [NSNotificationCenter defaultCenter] addObserver : self
                                              selector : @selector(videoPlayBackDidFinish:)
                                                  name : AVPlayerItemDidPlayToEndTimeNotification
                                                object : [_player currentItem]  ];
  
    NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                  andHeaderInfo : @"Bearer grbfOAwtiXFaSBEYJkg2cIFazysGJ9MQ3PBHgcPkhN"];
  
    // 현재 콘텐트의 재생권한.
    _isAuthor = playDataDics[@"permission"][@"can_play"]; // 0 or 1
    NSLog(@"  [setContentData] isAuthor? : %@", _isAuthor? @"TRUE" : @"FALSE");
  
    // 강좌 전체 클립 또는 오디오북 전체 챕터를 가져옵니다.
    NSArray *chunks = [[_args objectForKey : @"cid"] componentsSeparatedByString : @"_"]; // cid를 '_'로 분류하여 각각 array chunk처리합니다.
    // content-info API에 파라미터로 Content Group ID를 넣어 chapter또는clip 데이터를 가져옵니다.
    _currentContentsInfo = [ApiManager getContentsInfoWithCgid : chunks[0]
                                                 andHeaderInfo : @"Bearer grbfOAwtiXFaSBEYJkg2cIFazysGJ9MQ3PBHgcPkhN"];
  
    // title을 변경합니다. 추후에 사용하지 않을 수 도 있습니다.
    [_args setObject : _currentContentsInfo[@"data"][@"title"]
              forKey : @"name"];
  
    [self drawPlayerControlHeader];
    [self drawPlayerControlBottom];
  
    [self setPlayState : YES];
  
    // 영상시작후 3초간 입력이 없으면 컨트롤러를 자동으로 Hide.
    [self performSelector : @selector(pressedHideAndShowButton)
               withObject : nil
               afterDelay : 3.0f];
  
    // URL Asset에서 duration을 가져올 수 있지만 setContentData에서 API를 통한 세팅도 고려해 볼 수 있습니다.
    CGFloat totalTime = CMTimeGetSeconds(_urlAsset.duration);// + 1; 추후에 +1초 할 수 있습니다.
  
    if ( _slider )
    {
        _slider.minimumValue = 0.f;
        // 권한이 없는 상태(비 멤버십 유저)라면 90초 미리이용하기로 세팅해야 합니다.
        if ( _isAuthor )
        {
            _slider.maximumValue = totalTime;
        }
        else
        {
            _slider.maximumValue = 90.f;  // 90초에 다다르면 슬라이더 메서드에서 적절한 메시지와 함께 콘텐트 재생을 종료시켜야 합니다.
        }
    }
  
  [self initScriptUi];
}

//
// RN에서 넘겨받은 arguments를 세팅합니다.
//
- (void) setContentData : (NSMutableDictionary *) args
{
    _args = args;
    NSLog(@"  arguments : %@", [_args description]);
  
    // download 일 경우 API서버와 통신하면 안됩니다.
}

- (void) didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) fpsLicenseDidSuccessAcquiringWithContentId : (NSString * _Nonnull) contentId
{
    NSLog(@"  [fpsLicenseDidSuccessAcquiringWithContentId] ContentID : %@", contentId);
}

- (void) fpsLicenseWithContentId : (NSString * _Nonnull) contentId
                didFailWithError : (NSError * _Nonnull) error
{
    NSLog(@"  [fpsLicenseWithContentId] Error Message : %@", error.localizedDescription);
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
  
    // 배열의 마지막이라면 재생할 콘텐트가 없는 것이므로 종료합니다.
    if ( indexOfCurrentContent < contentsListArray.count-1 )
    {
        [_args setObject : contentsListArray[indexOfCurrentContent+1][@"cid"]
                  forKey : @"cid"];
      
        NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                      andHeaderInfo : @"Bearer grbfOAwtiXFaSBEYJkg2cIFazysGJ9MQ3PBHgcPkhN"];
      
        // 플레이할 콘텐트의 재생권한.
        _isAuthor = playDataDics[@"permission"][@"can_play"]; // 0 or 1
        [_args setObject : playDataDics[@"media_urls"][@"HLS"]
                  forKey : @"uri"];
      
        [self playNext];
    }
    else if ( indexOfCurrentContent == contentsListArray.count-1 )
    {
        [self closePlayer];
    }
    else
    {
        [self closePlayer];
    }
  
    // 추가할 사항 : 연속재생 버튼이 'on'상태이면 플레이어를 종료합니다.
}

//
// 다음 콘텐트를 재생합니다. 재생할 _args가 미리 세팅되어 있기때문에 파라미터가 필요하지 않습니다.
//
- (void) playNext
{
    [_player pause];
    [self invalidateTimerOnSlider];
  
    NSURL *contentUrl = [ NSURL URLWithString : [_args objectForKey : @"uri"] ];
    _urlAsset = [ [AVURLAsset alloc] initWithURL : contentUrl
                                         options : nil       ];
  
    // FPS 콘텐츠가 재생 되기 전에 FPS 콘텐츠 정보를 설정합니다.
    [ _fpsSDK prepareWithUrlAsset : _urlAsset
                           userId : [_args objectForKey : @"userId"]
                        contentId : [_args objectForKey : @"cid"] // PALLYCON_CONTENT_ID
                       optionalId : [_args objectForKey : @"oid"] // PALLYCON_OPTIONAL_ID
                  liveKeyRotation : NO              ];
  
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
}

// 홈버튼 등을 눌러 앱이 백그라운드로 들어갔을 때 플레이어가 계속 재생되게 처리. 2018.8.21
- (void) applicationDidEnterBackground : (NSNotification *) notification
{
    NSLog(@"  applicationDidEnterBackground");
    [_player performSelector : @selector(play)
                  withObject : nil
                  afterDelay : 0.01];
}

#pragma mark - statusbar control methods..
- (UIStatusBarStyle) preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (BOOL) prefersStatusBarHidden
{
    return _statusBarHidden;
}

#pragma mark - Drawing Player UI components

- (void) drawPlayerControlHeader
{
    // 탑뷰 구성 시작
    //  iPhone X일 경우 notch에 타이틀과 챕터 타이틀이 가려지므로 사이즈 조정이 필요합니다.
    if ( [[common getModel] isEqualToString : @"iPhone X"] )
    {
      _topView = [[UIView alloc] initWithFrame : CGRectMake(0, 0, self.view.frame.size.width, 75.f)];
    }
    else
    {
      _topView = [[UIView alloc] initWithFrame : CGRectMake(0, 0, self.view.frame.size.width, 60.f)];
    }
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
    if ( [[common getModel] isEqualToString : @"iPhone X"] )
    {
      frame.origin.y = 30.f;
    }
    else
    {
      frame.origin.y = 10.f;
    }
    frame.size.width = self.view.frame.size.width - (frame.origin.x + 10) - 70;   // 별점주기 버튼 때문에 프레임 넓이 조정.
    frame.size.height = 13.f;
  
    _courseTitleLabel = [[UILabel alloc] initWithFrame : frame];
    _courseTitleLabel.backgroundColor = [UIColor clearColor];
    _courseTitleLabel.font = [UIFont fontWithName : @"SpoqaHanSans" size : 11];
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
    _lectureTitleLabel.font = [UIFont fontWithName : @"SpoqaHanSans" size : 15];
    _lectureTitleLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
    _lectureTitleLabel.textAlignment = NSTextAlignmentLeft;
    _lectureTitleLabel.numberOfLines = 1;
    _lectureTitleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _lectureTitleLabel.adjustsFontSizeToFitWidth = NO;
    _lectureTitleLabel.text = [_args objectForKey : @"name"];
    [_topView addSubview : _lectureTitleLabel];
  
    // 탑뷰내의 별점주기 버튼
    // 플레이어 시작과 동시에 별점과 콘텐츠 타입 등을 조회합니다.
    if ( !_isAudioContent )
    {
        NSString *starQueryUrl;
  #if APPSTORE | ADHOC
        starQueryUrl = [NSString stringWithFormat : @"http://%@/usingapp/contents_each_author_v2.php", BASE_DOMAIN];
  #else
        starQueryUrl = [NSString stringWithFormat : @"http://%@/usingapp/contents_each_author_v2.php", TEST_DOMAIN];
  #endif
        NSString *post = [NSString stringWithFormat : @"ckey=582"];
        NSData *postData = [post dataUsingEncoding : NSUTF8StringEncoding];
      
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
        [request setURL : [NSURL URLWithString : [NSString stringWithFormat : @"%@", starQueryUrl]]];
        [request setHTTPBody : postData];
        [request setHTTPMethod : @"POST"];
        NSError *error;
        NSURLResponse *resp = nil;
        // 비동기방식이 아닌 동기방식으로 접속합니다.
        NSData *data = [ApiManager sendSynchronousRequest : request
                                        returningResponse : &resp
                                                    error : &error];
      
        NSString *jsonData = [[NSString alloc] initWithData : data
                                                   encoding : NSUTF8StringEncoding];
      
        NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData : [jsonData dataUsingEncoding : NSUTF8StringEncoding]
                                                                     options : NSJSONReadingAllowFragments
                                                                       error : &error];
      
        NSDictionary *dataDictionary = jsonResponse[@"data"];
        NSDictionary *infoDictionary = jsonResponse[@"info"];
        NSString *userStar = [dataDictionary objectForKey : @"user_star"];
        BOOL isUserLoggedIn = [dataDictionary objectForKey : @"user_logged_in"];
        NSString *cconClassStar = [infoDictionary objectForKey : @"ccon_class"]; // 1 = video clip, 2 = audiobook
      
        userStar = @""; // 1~5
        isUserLoggedIn = YES;
        cconClassStar = @"1";
        NSLog(@"  [initSubviewsWithAudioMode] userStar = %@", userStar);
        NSLog(@"  [initSubviewsWithAudioMode] isUserLoggedIn? %@", isUserLoggedIn ? @"TRUE" : @"FALSE");
        NSLog(@"  [initSubviewsWithAudioMode] ccon_class = %@", cconClassStar);
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
  
    [_contentView addSubview : _topView];
}

- (void) drawPlayerControlBottom
{
    /*
     * iPhone X 의 경우 슬라이더와 Anchor가 충돌하므로 기기에 따른 분기 처리가 필요합니다.
     */
    if ( [[common getModel] isEqualToString : @"iPhone X"] )
    {
      _bottomView = [[UIView alloc] initWithFrame : CGRectMake(0, self.view.frame.size.height-80.f, self.view.frame.size.width, 60.f)];
    }
    else
    {
      _bottomView = [[UIView alloc] initWithFrame : CGRectMake(0, self.view.frame.size.height-60.f, self.view.frame.size.width, 60.f)];
    }
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
    if ( _isAuthor )
    {
        _totalTimeLabel.text = [common convertTimeToString : CMTimeGetSeconds(_urlAsset.duration) // +1은 소수점 이하를 포함합니다.
                                                    Minute : YES];
    }
    else if ( !_isAuthor )  // 오디오북의 프리뷰 챕터에 대한 조건문도 추가해야 합니다!
    {
        _totalTimeLabel.text = @"01:30";
    }
    [_bottomView addSubview : _totalTimeLabel];
  
    _slider = [[UISlider alloc] initWithFrame : CGRectMake(margin + labelWidth + padding, _bottomView.frame.size.height-44, barWidth, 30.f)];
  
    _isAudioMode = FALSE; // 테스트 목적으로 강제로 value를 지정했습니다. 오디오모드를 구분하는 기능이 구현되는 시점에 제거될 예정입니다.
    if ( _isAudioMode )
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
  
    _menuItemView = [[UIView alloc] initWithFrame : CGRectMake(0, CGRectGetMinY(_bottomView.frame)-50.f, self.view.frame.size.width, 50.f)];
    _menuItemView.backgroundColor = UIColorFromRGB(0x272230, 0.5f);
    [_contentView addSubview : _menuItemView];
  
    _menuItemTopLineView = [[UIView alloc] initWithFrame : CGRectMake(0, 0, _menuItemView.frame.size.width, 1)];
    _menuItemTopLineView.backgroundColor = UIColorFromRGB(0x292431, 1.f);
    [_menuItemView addSubview : _menuItemTopLineView];
  
  
    NSInteger buttonCount = _isAudioMode ? 4 : 6;
  
    CGFloat buttonPadding = _isAudioMode ? 70 : 10;
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

      if ( !_isAuthor )
          isAutoPlay = NO;
      
      [_autoPlayButton setStatus : isAutoPlay ? 1 : 0];
      
      buttonOffsetX = buttonOffsetX + buttonWidth;
    }
  
    if ( !_isAudioMode )
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
  
    if ( !_isAudioMode )
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
                                                                            _networkStatusLabel.text = @"다운로드 재생";
                                                                        }
                                                                        else
                                                                        {
                                                                            if ( status == 0 )
                                                                            {
                                                                                _networkStatusLabel.text = @"인터넷 연결안됨";
                                                                            }
                                                                            else if ( status == 1 )
                                                                            {
                                                                                _networkStatusLabel.text = @"LTE/3G 재생";
                                                                            }
                                                                            else if ( status == 2 )
                                                                            {
                                                                                _networkStatusLabel.text = @"Wi-Fi 재생";
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
  //CGFloat currentTime = [self getCurrentPlaybackTime];
    CGFloat currentTime = 0.f;
  //CGFloat totalTime = [self getDuration]; // nan이 나오면 에러...
    CGFloat totalTime = CMTimeGetSeconds(_urlAsset.duration);
  
    _isAudioMode = false; // 테스트를 목적으로 강제로 value를 set하였습니다. 모든 기능이 구현되면 삭제될 예정입니다.
  
    if ( _slider )
    {
        _slider.minimumValue = 0.f;
      
        [self setCurrentTime : currentTime
                 forceChange : YES];
      
        if ( _isAuthor )
        {
            _slider.maximumValue = totalTime;
        }
        else if ( !_isAuthor )
        {
            _slider.maximumValue = 90.f;
        }
    }
  
    _playbackRate = 1.f;
    [_speedButton setImage : [UIImage imageNamed : @"icon_speed_10"]
                  forState : UIControlStateNormal];
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
    [self dismissViewControllerAnimated:YES completion:nil];  // playerController를 닫습니다.
    [[UIApplication sharedApplication] setStatusBarHidden:NO animated:YES]; // Status Bar를 다시 보여줍니다.
}

#pragma mark - Selectors

- (void) pressedCloseButton
{
  //[self toastTestAlert];
    [self closePlayer];
  
    //[self showToast : @"미니플레이어로 변환합니다."];
  /*
  self.isMiniPlayer = YES;
  _miniPlayerUiView = [[ContentMiniPlayerView alloc] initWithFrame: CGRectMake(0, 0, self.view.frame.size.width, 40.f)];
  _miniPlayerUiView.delegate = self;
  _miniPlayerUiView.isAuthor = _isAuthor;
  [_miniPlayerUiView setControllerColorWithAudioMode : _isAudioContent];
  [self.view addSubview : _miniPlayerUiView];
  
  _playerUiView.hidden = self.isMiniPlayer;
  _miniPlayerUiView.hidden = !self.isMiniPlayer;
  [self changedScreenMode : ContentsPlayerScreenModeMiniPlayer];
  */
  
  // 연관 컨텐츠 뷰를 로딩합니다.
  /*
  NSLog(@"  [player_didFinishedPlay] 이제 연관 컨텐츠 뷰를 띄워주어야 합니다!!");
  // 헤더 제목을 위해 IFCollectionView클래스에도 ckey를 보내야할 수도 있습니다.
  self.recommendViewController = [[IFRecommendViewController alloc] init];
  [self.recommendViewController setDataWithCurrentCkey: @"405"];
  [self.view addSubview: self.recommendViewController.view];
  */
}

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
                                                    if ( nil == _currentStar || [_currentStar isEqualToString : @"0"] || [_currentStar isEqualToString : @""] )
                                                    {
                                                        _currentStar = @"";
                                                    }
                                                    else
                                                    {
                                                        NSLog(@"  [pressedRateStarButton] 최종별점 : %@", _currentStar);
                                                        NSLog(@"  [pressedRateStarButton] ckey : %@", @"582");
                                                        // 지식영상이 끝나면 별점을 등록하기 위해 조회를 먼저합니다.
                                                        NSString *starUpdateUrl;
                                                      #if APPSTORE | ADHOC
                                                        starUpdateUrl = [NSString stringWithFormat : @"http://%@/usingapp/update_star.php", BASE_DOMAIN];
                                                      #else
                                                        starUpdateUrl = [NSString stringWithFormat : @"http://%@/usingapp/update_star.php", TEST_DOMAIN];
                                                      #endif
                                                        NSString *post = [NSString stringWithFormat : @"star=%@&ckey=%@", _currentStar, @"582"];
                                                        NSData *postData = [post dataUsingEncoding : NSUTF8StringEncoding];
                                                      
                                                        NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
                                                        [request setURL : [NSURL URLWithString : [NSString stringWithFormat : @"%@", starUpdateUrl]]];
                                                        [request setHTTPBody : postData];
                                                        [request setHTTPMethod : @"POST"];
                                                        NSError *error;
                                                        NSURLResponse *resp = nil;
                                                        // 비동기방식이 아닌 동기방식으로 접속합니다.
                                                        [ApiManager sendSynchronousRequest : request
                                                                         returningResponse : &resp
                                                                                     error : &error];
                                                      
                                                        NSString *myStarStr = [NSString stringWithFormat : @" %@%@", _currentStar, @".0"];
                                                      
                                                        _currentStar = @"";   // 다음 강의 평가를 위해 별점 초기화. 171207 김태현
                                                        [_rateStarButton setTitle : myStarStr
                                                                         forState : UIControlStateNormal];
                                                        _rateStarButton.layer.borderColor = [UIColor clearColor].CGColor;
                                                        //_rateStarButton.userInteractionEnabled = NO; // 탑뷰 내 별점주기버튼 비활성화
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

//
// 플레이어 컨트롤러UI를 감추거나 표시합니다.
//
- (void) pressedHideAndShowButton
{
    NSLog(@"  플레이어 컨트롤러 감춤 & 표시 버튼!!");
  
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
    // 이용로그 전송 시작
    //
    // 이용로그 전송 종료
  
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
}

- (void) pressedFfButton
{
    NSLog(@"  플레이어 앞으로 가기 버튼!!");
    // 이용로그 전송 시작
    //
    // 이용로그 전송 종료
  
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
}

- (void) pressedSpeedButton
{
    NSLog(@"  플레이어 재생속도 조절 버튼!!");
  
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
    NSLog(@"  [pressedListButton] 최근 재생 리스트 - 미리보기에서는 비활성화 시켜야 함.");
  
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
        _listView.isAudioContentType = false;
    }
    else if ( [_currentContentsInfo[@"type"] hasPrefix : @"audio"] )
    {
        playListArray = _currentContentsInfo[@"data"][@"chapters"];
        _listView.isAudioContentType = true;
    }
  
    NSInteger currentIndex = playListArray.count;
    NSString *groupTitle = _currentContentsInfo[@"data"][@"title"]; //group_title

    CGRect frame = self.view.bounds;
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
    NSLog(@"  Dragging on the slider bar has begun!");
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
        NSLog(@"  [SeekBar] Dragging ends. (%f)", bar.value);
        // 이용로그 전송 시작
        //
        // 이용로그 전송 종료
    }
}

- (void) seekbarDragging : (NSTimeInterval) time
{
    NSLog(@"  [seekbarDragging]");
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
    //[self stopLogTimer];
    // NSTimer를 통해 30초마다 로그내역을 전송
    //NSLog(@"  [__NSTimer__] 30초 뒤에 타이머가 가동됩니다.");
}

//
// Slider의 값을 변경합니다.
//
- (void) setSeekbarCurrentValue : (CGFloat) value
{
  //NSLog(@"  [setSeekbarCurrentValue]");
  
    if ( _slider && !_touchDragging )
    {
      //NSLog(@"  [setSeekbarCurrentValue] ");
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
    {
        NSLog(@"  [setPlayerUIHidden] 이벤트가 발생하여 플레이어 컨트롤러가 사라집니다.");
    }
    else
    {
        NSLog(@"  [setPlayerUIHidden] 이벤트가 발생하여 플레이어 컨트롤러가 나타납니다.");
    }
  
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
                                      _topView.alpha = hidden ? 0.f : 1.f;
                                      _bottomView.alpha = hidden ? 0.f : 1.f;
                                      _menuItemView.alpha = hidden ? 0.f : 1.f;
                                      _menuItemTopLineView.alpha = hidden ? 0.f : 1.f;
                                      _menuItemBottomLineView.alpha = hidden ? 0.f : 1.f;
                                      _controlBarView.alpha = hidden ? 0.f : 1.f;
                       
                                      if ( !hidden )
                                      {
                                          [self setPositionScriptToHideView : hidden];
                                      }
                                  }
                     completion : ^(BOOL finished)
                                  {
                                      _topView.hidden = hidden;
                                      _bottomView.hidden = hidden;
                                      _menuItemView.hidden = hidden;
                                      _menuItemTopLineView.hidden = hidden;
                                      _menuItemBottomLineView.hidden = hidden;
                                      _controlBarView.hidden = hidden;
                                    
                                      self.view.userInteractionEnabled = YES;
       
                                      if ( hidden )
                                      {
                                          [self setPositionScriptToHideView : hidden];
                                      }
                                  }];
}

- (void) changeViewMode : (BOOL) isAudioMode
{
  /*
  // 오디오모드가 가능한 상태가 아니면서 다운로드받은 파일이 아니라면..
  //
  if ( !self.isPossibleAudioMode && !self.isDownloadFile )
  {
    [_modeChangeButton setStatus: 0];
    NSLog(@"    [changeViewMode]: %@", isAudioMode ? @"YES" : @"NO");
    NSLog(@"    [changeViewMode] 미리보기 상태에서도 오디오모드는 허용되야 합니다!");
    
    return DEFAULT_ALERT(@"", @"본 동영상은 오디오모드를 제공하지 않습니다.");
  }*/
  
  _audioUiView.hidden = !isAudioMode;
  /*
  if ( [self.delegate respondsToSelector: @selector(playerUiView:changeToMode:)] )
  {
    [self.delegate playerUiView: self
                   changeToMode: isAudioMode];
  }*/
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
                                                             //[_miniPlayerUiView setSeekbarCurrentValue: playTime];
                                                            
                                                              /*
                                                               * 진도체크는 추후에 구현합니다.
                                                               if ( [self.delegate respondsToSelector: @selector(player:didChangedPlayTime:)] )
                                                               {
                                                                  [self.delegate player : self
                                                                     didChangedPlayTime : playTime];
                                                               }
                                                               */
                                                            
                                                                // 유저가 콘텐트에 대한 권한이 없으면서, 콘텐트가 영상이라면...
                                                                if ( !_isAuthor && !_isAudioContent )
                                                                {
                                                                    if ( playTime >= 90.f )
                                                                    {
                                                                        [self closePlayer];
                                                                        [self showToast : @"90 초 프리뷰"]; // Root View에서도 보여야 합니다.
                                                                    }
                                                                }
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
            [_scriptView setStatus: MediaPlayerScriptViewModeNone];
          isToast = YES;
        }
        else if ( [@"download-mode" isEqualToString : buttonId] )
        {
            [_downloadButton setStatus : 0];
            isToast = YES;
        }
      
        if ( isToast )
        {
            //AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
            [_contentView makeToast : @"미리보기에서는 이용 하실 수 없습니다."];
          
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
      
        [self setTouchEnable : _rateStarButton
                      isLock : isLock];
      
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
    else if ( [@"timer-mode" isEqualToString : buttonId])
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
    else if ( [@"download-mode" isEqualToString: buttonId] )
    {
      
      NSString *wifiDown = [[NSUserDefaults standardUserDefaults] objectForKey: @"wifiDown"];
      
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
                                [[UIApplication sharedApplication] setStatusBarHidden:NO animated:YES];
                             }];
        [alert addAction : ok];
        
        //[_contentView presentViewController:alert animated:YES completion:nil];
        
        return ;
      }
      /*
      [[DownloadManager sharedInstance] insertDownloadWithContentKey: self.ckey];
      
      self.isDownloading = YES;
      [self setTouchEnable: _downloadButton
                    isLock: YES];*/
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

- (void) playerSleepTimerView : (PlayerSleepTimerView *) view
                    closeView : (id)sender
{
    if ( _playerSleepTimerSelectView )
    {
        [_playerSleepTimerSelectView removeFromSuperview];
        _playerSleepTimerSelectView = nil;
    }
}

- (void) playerSleepTimerView : (PlayerSleepTimerView *) view
              didSelectedTime : (NSString *) time
{
    [self setTimerMode : time];
}

/*
 *
 * 더 많은 PlayerSleepTimer method 들의 구현이 필요합니다.
 *
 */

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
    }
    else if ( !_isAudioContent )
    {
        [_args setObject : _currentContentsInfo[@"data"][@"clips"][index][@"cid"]
                  forKey : @"cid"];
    }
  
    NSDictionary *playDataDics = [ApiManager getPlayDataWithCid : [_args objectForKey : @"cid"]
                                                  andHeaderInfo : @"Bearer grbfOAwtiXFaSBEYJkg2cIFazysGJ9MQ3PBHgcPkhN"];
  
    // 플레이할 콘텐트의 재생권한.
    _isAuthor = playDataDics[@"permission"][@"can_play"]; // 0 or 1
    [_args setObject : playDataDics[@"media_urls"][@"HLS"]
              forKey : @"uri"];
  
    if ( _listView )
    {
        [_listView removeFromSuperview];
        _listView = nil;
    }
  
    [self playNext];
}

# pragma mark - Script View
- (NSArray *) readScript
{
    // 로컬에 있는 json을 읽어와서 일단 nslog로 출력해보겠습니다.
    NSString *jsonPath = [[NSBundle mainBundle] pathForResource : @"subtitles"
                                                         ofType : @"json"];
    NSData *data = [NSData dataWithContentsOfFile : jsonPath];
    NSError *error = nil;
    id json = [NSJSONSerialization JSONObjectWithData : data
                                              options : kNilOptions
                                                error : &error];
  
    //NSLog(@"  [pressedListButton] JSON output : %@", json);
    // 잘 읽어옵니다.
    return json;
}
- (void) initScriptUi
{
    NSArray *scriptArray = [self readScript];
  
    _scriptView = [[MediaPlayerScriptView alloc] initWithFrame : CGRectZero];
    _scriptView.frame = CGRectMake(0, CGRectGetMinY(_bottomView.frame), self.view.frame.size.width, 0);
    _scriptView.delegate = self;
    [self.view addSubview : _scriptView];
  
    [_scriptView setScript : scriptArray];
  
    _scriptView.alpha = 0.f;
    _scriptView.hidden = YES;
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
                                      _topView.alpha = topViewAlpha;
                                      _topView.frame = topViewFrame;
                       
                                      _scriptView.alpha = scriptViewAlpha;
                                      _scriptView.frame = scriptViewFrame;
                       
                                      _menuItemView.alpha = menuViewAlpha;
                                      _menuItemView.frame = menuViewFrame;
                       
                                      _controlBarView.alpha = controlViewAlpha;
                                      _controlBarView.frame = controlViewFrame;
                                  }
                     completion : ^(BOOL finished)
                                  {
                                      _topView.hidden = (topViewAlpha == 0.f);
                                      _scriptView.hidden = (scriptViewAlpha == 0.f);
                                      _menuItemView.hidden = (menuViewAlpha == 0.f);
                                      _controlBarView.hidden = (controlViewAlpha == 0.f);
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
                                              _scriptView.frame = frame;
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
- (void) changedScreenMode : (ContentsPlayerScreenMode) screenMode
{
    CGRect moveFrame = CGRectZero;
  
    if ( screenMode == ContentsPlayerScreenModeMiniPlayer )
    {
        moveFrame.origin.x = 0.f;
        moveFrame.origin.y = CGRectGetMaxY(self.view.frame)-40.f;
        moveFrame.size.width = self.view.frame.size.width;
        moveFrame.size.height = 40.f;
    }
    else
    {
        moveFrame = self.view.superview.frame;
    }
  
    [self changedPlayerMode : screenMode == ContentsPlayerScreenModeMiniPlayer];
  
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      self.view.frame = moveFrame;
                                  }
                     completion : ^(BOOL finished)
                                  {
                                      self.view.frame = self.view.bounds;
                                  }];
  
      _screenMode = screenMode;
}
// 플레이어 모드 변경 (미니<->일반 플레이어뷰)
- (void) changedPlayerMode : (BOOL) isMiniPlayer
{
    //_playerUiView.hidden = NO;
    self.view.hidden = NO;
    _miniPlayerUiView.hidden = NO;
  
    //_playerUiView.alpha = isMiniPlayer ? 1.f : 0.f;
    self.view.alpha = isMiniPlayer ? 1.f : 0.f;
    _miniPlayerUiView.alpha = isMiniPlayer ? 0.f : 1.f;
  
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
  
    if (isMiniPlayer)
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



# pragma mark - Labatory
- (void) toastTestAlert
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle : @"Logout"
                                                                   message : @"Are You Sure Want to Logout!"
                                                            preferredStyle : UIAlertControllerStyleAlert];
  
    //Add Buttons
    UIAlertAction *yesButton = [UIAlertAction actionWithTitle : @"Yes"
                                                        style : UIAlertActionStyleDefault
                                                      handler : ^(UIAlertAction *action)
                                                                {
                                                                    //Handle your yes please button action here
                                                                    //[self clearAllData];
                                                                  [self closePlayer];
                                                                }];
  
    UIAlertAction *noButton = [UIAlertAction actionWithTitle : @"Cancel"
                                                       style : UIAlertActionStyleDefault
                                                     handler : ^(UIAlertAction *action)
                                                               {
                                                                    //Handle no, thanks button
                                                               }];
  
    //Add your buttons to alert controller
  
    [alert addAction : yesButton];
    [alert addAction : noButton];
  
    [self presentViewController : alert
                       animated : YES
                     completion : nil];
}

// 슬라이더 이동시 썸네일 이미지를 보여주면 좋을듯.. ( http://devhkh.tistory.com/18 )

// 모든 기능 안정화 전까지 세로모드 만 적용합시다.

@end




















