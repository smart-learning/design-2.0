
#import "IFDrmPlayerUiView.h"

#import "AppDelegate.h"

#import "IFRateView.h"
#import "UIAlertController+Showable.h"

@interface IFDrmPlayerUiView () < IFPlayerButtonDelegate, IFMediaPlayerScriptViewDelegate, IFPlayListPopupViewDelegate,
                                  IFSleepTimerManagerDelegate, IFTimerViewDelegate >
{
    BOOL _isAudioMode;
    
    UIView *_audioUiView;
    UIImageView *_backgroundImageView;
    UIImageView *_headphoneImageView;
    
    UIButton *_touchButton01;
    UIButton *_touchButton02;
    
    UIView *_contentView;
    
    UIView *_topView;
    UIButton *_closeButton;
    UILabel *_topTitleLabel01;
    UILabel *_topTitleLabel02;
    UIButton *_rateStarButton;  // 탑뷰의 '별점 주기' 버튼. 171211 김태현
    
    UIView *_controlBarView;
    UIButton *_playButton;
    UIButton *_paueseButton;
    UIButton *_rwButton;
    UIButton *_ffButton;
    UIButton *_speedButton;
    UIButton *_listButton;
    
    UILabel *_networkStatusLabel;
    
    UIView *_menuItemView;
    UIView *_menuItemTopLineView;
    UIView *_menuItemBottomLineView;
    
    IFPlayerButton *_autoPlayButton;
    IFPlayerButton *_scriptButton;
    IFPlayerButton *_modeChangeButton;
    IFPlayerButton *_downloadButton;
    IFPlayerButton *_sleepButton;
    IFPlayerButton *_lockButton;
    
    UIView *_bottomView;
    UISlider *_slider;
    UILabel *_timeLabel;
    UILabel *_totalTimeLabel;

    IFMediaPlayerScriptView *_scriptView;
    IFPlayListPopupView *_listView;
    IFTimerView *_timerSelectView;
    
    BOOL _touchDragging;
    BOOL _holdTouchDragging;
    
    IFRateView *_rateView;
    NSString *_currentStar; // 별점 전역변수 171211 김태현
}

@property (nonatomic, strong) NSString *gkey;
@property (nonatomic, strong) NSString *ckey;

@end

@implementation IFDrmPlayerUiView

- (void) dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver: self];
}

- (instancetype) initWithFrame: (CGRect) frame
                   isAudioMode: (BOOL) isAudioMode
                      isAuthor: (BOOL) isAuthor
                          ckey: (NSString *) ckeyToQuery
{
    if ( self = [super initWithFrame: frame] )
    {
        [self initData];
        [self initSubviewsWithAudioMode: isAudioMode
                               isAuthor: isAuthor
                                   ckey: ckeyToQuery];
    }
  
    return self;
}

- (void) initData
{
    _touchDragging = NO;
    _holdTouchDragging = NO;
}

- (void) initSubviewsWithAudioMode: (BOOL) isAudioMode
                          isAuthor: (BOOL) isAuthor
                              ckey: (NSString *) ckeyToQuery
{
    self.backgroundColor = UIColorFromRGB(0x000000, 0.5f);
    
    _isAudioMode = isAudioMode;
    
    // 오디오 UI
    {
        _audioUiView = [[UIView alloc] initWithFrame: self.bounds];
        _audioUiView.backgroundColor = [UIColor blackColor];
        [self addSubview: _audioUiView];

        _backgroundImageView = [[UIImageView alloc] initWithFrame: _audioUiView.bounds];
        [_audioUiView addSubview: _backgroundImageView];
        
        UIImage *headphoneImage = [UIImage imageNamed: @"image_headphones.png"];
        _headphoneImageView = [[UIImageView alloc] initWithFrame: CGRectMake((_audioUiView.frame.size.width - headphoneImage.size.width) / 2.f,
                                                                            ((_audioUiView.frame.size.height - headphoneImage.size.height) / 2.f) - 50.f,
                                                                            headphoneImage.size.width, headphoneImage.size.height)];
        _headphoneImageView.image = headphoneImage;
        [_audioUiView addSubview: _headphoneImageView];
        
        _audioUiView.hidden = !isAudioMode;
    }
    
    _touchButton01 = [UIButton buttonWithType: UIButtonTypeCustom];
    _touchButton01.frame = self.bounds;
    [_touchButton01 addTarget: self
                       action: @selector(pressedShowButton)
             forControlEvents: UIControlEventTouchUpInside];
    [self addSubview: _touchButton01];
    
    _contentView = [[UIView alloc] initWithFrame: self.bounds];
    [self addSubview: _contentView];
    
    _touchButton02 = [UIButton buttonWithType: UIButtonTypeCustom];
    _touchButton02.frame = _contentView.bounds;
    [_touchButton02 addTarget: self
                       action: @selector(pressedHideButton)
             forControlEvents: UIControlEventTouchUpInside];
    [_contentView addSubview: _touchButton02];
    
    // 탑뷰 구성 시작
    //  iPhone X일 경우 notch에 타이틀과 챕터 타이틀이 가려지므로 사이즈 조정이 필요합니다.
    if ( [[common getModel] isEqualToString: @"iPhone X"] )
    {
        _topView = [[UIView alloc] initWithFrame: CGRectMake(0, 0, self.frame.size.width, 75.f)];
    }
    else
    {
        _topView = [[UIView alloc] initWithFrame: CGRectMake(0, 0, self.frame.size.width, 60.f)];
    }
    _topView.backgroundColor = UIColorFromRGB(0x272230, 0.3f);
    [_contentView addSubview: _topView];
    
    _closeButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _closeButton.frame = CGRectMake(0, 0, 60, 55);
    [_closeButton setImage: [UIImage imageNamed: @"icon_player_close"]
                  forState: UIControlStateNormal];
    [_closeButton addTarget: self
                     action: @selector(pressedCloseButton:)
           forControlEvents: UIControlEventTouchUpInside];
    [_topView addSubview: _closeButton];
    
    CGRect frame = CGRectZero;
    frame.origin.x = CGRectGetMaxX(_closeButton.frame) + 10.f;
    if ( [[common getModel] isEqualToString: @"iPhone X"] )
    {
        frame.origin.y = 30.f;
    }
    else
    {
        frame.origin.y = 10.f;
    }
    frame.size.width = self.frame.size.width - (frame.origin.x + 10) - 70;   // 별점주기 버튼 때문에 프레임 넓이 조정.
    frame.size.height = 13.f;
    
    _topTitleLabel01 = [[UILabel alloc] initWithFrame: frame];
    _topTitleLabel01.backgroundColor = [UIColor clearColor];
    _topTitleLabel01.font = [UIFont fontWithName: @"SpoqaHanSans" size: 11];
    _topTitleLabel01.textColor = UIColorFromRGB(0xffffff, 0.5f);
    _topTitleLabel01.textAlignment = NSTextAlignmentLeft;
    _topTitleLabel01.numberOfLines = 1;
    _topTitleLabel01.lineBreakMode = NSLineBreakByTruncatingTail;
    _topTitleLabel01.adjustsFontSizeToFitWidth = NO;
    _topTitleLabel01.text = @"";
    [_topView addSubview: _topTitleLabel01];

    frame.origin.x = CGRectGetMaxX(_closeButton.frame) + 10.f;
    frame.origin.y = CGRectGetMaxY(_topTitleLabel01.frame) + 2.f;
    frame.size.width = self.frame.size.width - (frame.origin.x + 10) - 70;   // 별점주기 버튼 때문에 프레임 넓이 조정.
    frame.size.height = 18.f;

    _topTitleLabel02 = [[UILabel alloc] initWithFrame: frame];
    _topTitleLabel02.backgroundColor = [UIColor clearColor];
    _topTitleLabel02.font = [UIFont fontWithName: @"SpoqaHanSans" size: 15];
    _topTitleLabel02.textColor = UIColorFromRGB(0xffffff, 1.f);
    _topTitleLabel02.textAlignment = NSTextAlignmentLeft;
    _topTitleLabel02.numberOfLines = 1;
    _topTitleLabel02.lineBreakMode = NSLineBreakByTruncatingTail;
    _topTitleLabel02.adjustsFontSizeToFitWidth = NO;
    _topTitleLabel02.text = @"";
    [_topView addSubview: _topTitleLabel02];
    
    // 탑뷰내의 별점주기 버튼
    // 플레이어 시작과 동시에 별점과 콘텐츠 타입 등을 조회합니다.
#if APPSTORE | ADHOC
    NSString *starQueryUrl = [NSString stringWithFormat: @"http://%@/usingapp/contents_each_author_v2.php", BASE_DOMAIN];
#else
    NSString *starQueryUrl = [NSString stringWithFormat: @"http://%@/usingapp/contents_each_author_v2.php", TEST_DOMAIN];
#endif
    NSString *post = [NSString stringWithFormat: @"ckey=%@", ckeyToQuery];
    NSLog(@"    [initSubviewsWithAudioMode] ckey = %@", ckeyToQuery);
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
    
    NSString *jsonData = [[NSString alloc] initWithData: data
                                               encoding: NSUTF8StringEncoding];
    
    NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData: [jsonData dataUsingEncoding: NSUTF8StringEncoding]
                                                                 options: NSJSONReadingAllowFragments
                                                                   error: &error];
    
    NSDictionary *dataDictionary = jsonResponse[@"data"];
    NSDictionary *infoDictionary = jsonResponse[@"info"];
    NSString *userStar = [dataDictionary objectForKey: @"user_star"];
    BOOL isUserLoggedIn = [dataDictionary objectForKey: @"user_logged_in"];
    NSString *cconClassStar = [infoDictionary objectForKey: @"ccon_class"]; // 1 = video clip, 2 = audiobook
    
    NSLog(@"    [initSubviewsWithAudioMode] userStar = %@", userStar);
    NSLog(@"    [initSubviewsWithAudioMode] isUserLoggedIn? %@", isUserLoggedIn ? @"TRUE" : @"FALSE");
    NSLog(@"    [initSubviewsWithAudioMode] ccon_class = %@", cconClassStar);
    // 로그인된 상태이면서 동시에 강의 클립이라면 일단 별점주기 버튼을 그립니다.
    if ( isUserLoggedIn && [cconClassStar isEqualToString: @"1"] )
    {
        _rateStarButton = [UIButton buttonWithType: UIButtonTypeCustom];
        _rateStarButton.frame = CGRectMake(CGRectGetMaxX(_topView.frame)-80, 10, 60, 40);
        [_rateStarButton setImage: [UIImage imageNamed: @"icon_star_green_small"]
                         forState: UIControlStateNormal];
        _rateStarButton.titleLabel.font = [UIFont fontWithName: @"SpoqaHanSans" size: 11];
        _rateStarButton.layer.borderWidth = 1.0f;
        _rateStarButton.layer.cornerRadius = 6.0f;
        
        // 로그인한 계정으로 해당 강의클립에 대한 등록된 별점이 없다면 '별점 주기'버튼을 그려줍니다.
        if ( [userStar isEqualToString: @""] )
        {
            [_rateStarButton setTitle: @"별점 주기" forState: UIControlStateNormal];
            _rateStarButton.layer.borderColor = [UIColor grayColor].CGColor;
        }
        else
        {
            NSString *myStarStr = [NSString stringWithFormat: @" %@%@", userStar, @".0"];
            [_rateStarButton setTitle: myStarStr forState: UIControlStateNormal];
            _rateStarButton.layer.borderColor = [UIColor clearColor].CGColor;
        }
        
        [_rateStarButton addTarget: self
                            action: @selector(pressedRateStarButton)
                  forControlEvents: UIControlEventTouchUpInside];
        [_topView addSubview: _rateStarButton];
    }
    
    //
    //////// 탑뷰 구성 끝
    
    //////// 버텀뷰 구성 시작
    //
    _bottomView = [[UIView alloc] initWithFrame: CGRectMake(0, self.frame.size.height-60.f, self.frame.size.width, 60.f)];
    _bottomView.backgroundColor = UIColorFromRGB(0x272230, 0.3f);
    [_contentView addSubview: _bottomView];
    
    CGFloat margin = 20;
    CGFloat padding = 10;
    CGFloat labelWidth = 45;
    CGFloat barWidth = _bottomView.frame.size.width-(labelWidth * 2)-(margin * 2)-(padding * 2);

    _timeLabel = [[UILabel alloc] initWithFrame: CGRectMake(margin, _bottomView.frame.size.height-45, labelWidth, 30)];
    _timeLabel.font = [UIFont systemFontOfSize:12.f];
    _timeLabel.textColor = [UIColor whiteColor];
    _timeLabel.textAlignment = NSTextAlignmentCenter;
    _timeLabel.text = @"00:00";
    [_bottomView addSubview: _timeLabel];
    
    _totalTimeLabel = [[UILabel alloc] initWithFrame: CGRectMake(margin + labelWidth + padding + barWidth + padding,
                                                                _bottomView.frame.size.height-45,
                                                                labelWidth, 30)];
    _totalTimeLabel.font = [UIFont systemFontOfSize: 12.f];
    _totalTimeLabel.textColor = [UIColor whiteColor];
    _totalTimeLabel.textAlignment = NSTextAlignmentCenter;
    _totalTimeLabel.text = @"00:00";
    [_bottomView addSubview:_totalTimeLabel];
    
    _slider = [[UISlider alloc] initWithFrame: CGRectMake(margin + labelWidth + padding, _bottomView.frame.size.height-44, barWidth, 30.f)];
    
//    UIImage *sliderThumb = [UIImage imageNamed:@"uislider-thumb.png"];
//    [_slider setThumbImage:sliderThumb forState:UIControlStateNormal];
//    [_slider setThumbImage:sliderThumb forState:UIControlStateHighlighted];
    
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
    
    [_slider addTarget: self
                action: @selector(seekbarDidChangeValue:)
      forControlEvents: UIControlEventValueChanged];
    
    [_slider addTarget: self
                action: @selector(seekbarDragBegin:)
      forControlEvents: UIControlEventTouchDown];
    
    [_slider addTarget: self
                action: @selector(seekbarDragEnd:)
      forControlEvents: UIControlEventTouchUpInside];
    
    [_slider addTarget: self
                action: @selector(seekbarDragEnd:)
      forControlEvents: UIControlEventTouchCancel];
    
    [_bottomView addSubview: _slider];
    
    _menuItemView = [[UIView alloc] initWithFrame: CGRectMake(0, CGRectGetMinY(_bottomView.frame)-50.f, self.frame.size.width, 50.f)];
    _menuItemView.backgroundColor = UIColorFromRGB(0x272230, 0.5f);
    [_contentView addSubview: _menuItemView];
    
    _menuItemTopLineView = [[UIView alloc] initWithFrame: CGRectMake(0, 0, _menuItemView.frame.size.width, 1)];
    _menuItemTopLineView.backgroundColor = UIColorFromRGB(0x292431, 1.f);
    [_menuItemView addSubview: _menuItemTopLineView];

    
    NSInteger buttonCount = isAudioMode ? 4 : 6;
    
    CGFloat buttonPadding = isAudioMode ? 70 : 10;
    CGFloat buttonWidth = ((_menuItemView.frame.size.width - (buttonPadding * 2)) / buttonCount);
    
    CGFloat buttonOffsetX = buttonPadding;
    CGFloat buttonOffsetY = 0;
    
    {
        _autoPlayButton = [[IFPlayerButton alloc] initWithId: @"autoplay-mode"
                                                 normalImage: @"icon_autoplay_off.png"
                                            highlightedImage: @"icon_autoplay.png"
                                              maxActiveCount: 2];
        _autoPlayButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _autoPlayButton.delegate = self;
        [_menuItemView addSubview: _autoPlayButton];
        
        NSString *autoPlaySetup = [common getUserSettingValueWithKey: @"autoplay_enable"];
        
        if ( nullStr(autoPlaySetup) )
        {
            [common setUserSettingValueWithKey: @"autoplay_enable" value: @"Y"];
            autoPlaySetup = @"Y";
        }
        
        BOOL isAutoPlay = [@"Y" isEqualToString: autoPlaySetup];
        
        if ( !isAuthor )
            isAutoPlay = NO;
        
        [_autoPlayButton setStatus: isAutoPlay ? 1 : 0];
        
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    if ( !isAudioMode )
    {
        _scriptButton = [[IFPlayerButton alloc] initWithId: @"script-mode"
                                               normalImage: @"icon_caption.png"
                                          highlightedImage: @"icon_caption_active.png"
                                            maxActiveCount: 2];
        _scriptButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _scriptButton.delegate = self;
        [_menuItemView addSubview: _scriptButton];

        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    if ( !isAudioMode )
    {
        _modeChangeButton = [[IFPlayerButton alloc] initWithId: @"view-mode"
                                                   normalImage: @"icon_audiomode.png"
                                              highlightedImage: @"icon_videomode.png"
                                                maxActiveCount: 2];
        _modeChangeButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _modeChangeButton.delegate = self;
        [_menuItemView addSubview: _modeChangeButton];
        
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    {
        _downloadButton = [[IFPlayerButton alloc] initWithId: @"download-mode"
                                                 normalImage: @"icon_download.png"
                                            highlightedImage: @"icon_download.png"
                                              maxActiveCount: 1];
        _downloadButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _downloadButton.delegate = self;
        [_menuItemView addSubview:_downloadButton];
        
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    {
        _sleepButton = [[IFPlayerButton alloc] initWithId: @"timer-mode"
                                              normalImage: @"icon_timer.png"
                                         highlightedImage: @"icon_timer_active.png"
                                           maxActiveCount: 2];
        _sleepButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _sleepButton.delegate = self;
        [_menuItemView addSubview: _sleepButton];
        
        if ( [IFSleepTimerManager sharedInstance].isAlive )
        {
            [_sleepButton setStatus: 1];
            [IFSleepTimerManager sharedInstance].delegate = self;
        }
        
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    {
        _lockButton = [[IFPlayerButton alloc] initWithId: @"lock-mode"
                                             normalImage: @"icon_lock.png"
                                        highlightedImage: @"icon_lock_active.png"
                                          maxActiveCount: 2];
        _lockButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        _lockButton.delegate = self;
        [_menuItemView addSubview: _lockButton];
        
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    _menuItemBottomLineView = [[UIView alloc] initWithFrame: CGRectMake(0, _menuItemView.frame.size.height-1, _menuItemView.frame.size.width, 1)];
    _menuItemBottomLineView.backgroundColor = UIColorFromRGB(0x292431, 1.f);
    [_menuItemView addSubview:_menuItemBottomLineView];

    //컨트롤 뷰
    _controlBarView = [[UIView alloc] initWithFrame: CGRectMake(0, CGRectGetMinY(_menuItemView.frame)-90.f, self.frame.size.width, 80.f)];
    _controlBarView.backgroundColor = [UIColor clearColor];
    [_contentView addSubview: _controlBarView];
    
    _playButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _playButton.frame = CGRectMake((_controlBarView.frame.size.width - 60.f) / 2.f, 0.f, 60.f, 60.f);
    [_playButton setImage: [UIImage imageNamed: @"icon_play.png"]
                 forState: UIControlStateNormal];
    [_playButton setImage: [[UIImage imageNamed: @"icon_play.png"] tintImageWithColor: UIColorFromRGB(0x000000, 0.3f)]
                 forState: UIControlStateHighlighted];
    [_playButton addTarget: self
                    action: @selector(pressedPlayButton)
          forControlEvents: UIControlEventTouchUpInside];
    [_controlBarView addSubview: _playButton];

    _paueseButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _paueseButton.frame = CGRectMake((_controlBarView.frame.size.width - 60.f) / 2.f, 0.f, 60.f, 60.f);
    [_paueseButton setImage: [UIImage imageNamed: @"icon_pause.png"]
                   forState: UIControlStateNormal];
    [_paueseButton setImage: [[UIImage imageNamed: @"icon_pause.png"] tintImageWithColor: UIColorFromRGB(0x000000, 0.3f)]
                   forState: UIControlStateHighlighted];
    [_paueseButton addTarget: self
                      action: @selector(pressedPauseButton)
            forControlEvents: UIControlEventTouchUpInside];
    [_controlBarView addSubview: _paueseButton];

    _rwButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _rwButton.frame = CGRectMake(CGRectGetMinX(_playButton.frame) - 60.f - 10.f, 0.f, 60.f, 60.f);
    [_rwButton setImage: [UIImage imageNamed: @"icon_rw.png"]
               forState: UIControlStateNormal];
    [_rwButton setImage: [[UIImage imageNamed: @"icon_rw.png"] tintImageWithColor: UIColorFromRGB(0x000000, 0.3f)]
               forState: UIControlStateHighlighted];
    [_rwButton addTarget: self
                  action: @selector(pressedRwButton)
        forControlEvents: UIControlEventTouchUpInside];
    [_controlBarView addSubview: _rwButton];

    _ffButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _ffButton.frame = CGRectMake(CGRectGetMaxX(_playButton.frame) + 10.f, 0.f, 60.f, 60.f);
    [_ffButton setImage: [UIImage imageNamed: @"icon_ff.png"]
               forState: UIControlStateNormal];
    [_ffButton setImage: [[UIImage imageNamed: @"icon_ff.png"] tintImageWithColor: UIColorFromRGB(0x000000, 0.3f)]
               forState: UIControlStateHighlighted];
    [_ffButton addTarget: self
                  action: @selector(pressedFfButton)
        forControlEvents: UIControlEventTouchUpInside];
    [_controlBarView addSubview: _ffButton];

    _speedButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _speedButton.frame = CGRectMake(CGRectGetMinX(_rwButton.frame) - 50.f, 10.f, 50.f, 50.f);
    [_speedButton addTarget: self
                     action: @selector(pressedSpeedButton)
           forControlEvents: UIControlEventTouchUpInside];
    [_controlBarView addSubview: _speedButton];

    _listButton = [UIButton buttonWithType: UIButtonTypeCustom];
    _listButton.frame = CGRectMake(CGRectGetMaxX(_ffButton.frame), 10.f, 50.f, 50.f);
    [_listButton setImage: [UIImage imageNamed: @"icon_list.png"]
                 forState: UIControlStateNormal];
    [_listButton setImage: [[UIImage imageNamed: @"icon_list.png"] tintImageWithColor: UIColorFromRGB(0x000000, 0.3f)]
                 forState: UIControlStateHighlighted];
    [_listButton addTarget: self
                    action: @selector(pressedListButton)
          forControlEvents: UIControlEventTouchUpInside];
    [_controlBarView addSubview: _listButton];
    
    
    _networkStatusLabel = [[UILabel alloc] initWithFrame: CGRectMake(0, CGRectGetMaxY(_playButton.frame), _controlBarView.frame.size.width, 20.f)];
    _networkStatusLabel.backgroundColor = [UIColor clearColor];
    _networkStatusLabel.font = [UIFont fontWithName: @"SpoqaHanSans" size: 12];
    _networkStatusLabel.textColor = UIColorFromRGB(0xc8c8c8, 1.f);
    _networkStatusLabel.textAlignment = NSTextAlignmentCenter;
    _networkStatusLabel.numberOfLines = 1;
    _networkStatusLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _networkStatusLabel.adjustsFontSizeToFitWidth = YES;
    _networkStatusLabel.text = @"";
    [_controlBarView addSubview: _networkStatusLabel];
    
    [self setSpeedButtonImage];
    _playButton.hidden = NO;
    _paueseButton.hidden = YES;
    
    [[ApiManager sharedInstance] setReachabilityStatusChangeBlock: ^(NSInteger status)
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

- (void) initScriptUi: (NSArray *) scriptArray
{
    _scriptView = [[IFMediaPlayerScriptView alloc] initWithFrame: CGRectZero];
    _scriptView.frame = CGRectMake(0, CGRectGetMinY(_bottomView.frame), self.frame.size.width, 0);
    _scriptView.delegate = self;
    [self addSubview: _scriptView];
    
    [_scriptView setScript: scriptArray];

    _scriptView.alpha = 0.f;
    _scriptView.hidden = YES;
}

- (void) setSpeedButtonImage
{
    CGFloat speed = [[NSUserDefaults standardUserDefaults] floatForKey: @"playSpeed"];
    speed = (speed == 0.f ? 1.f : speed);

    UIImage *image = nil;
    
    if ( speed == 0.8f )
    {
        image = [UIImage imageNamed: @"icon_speed_08.png"];
    }
    else if ( speed == 1.f )
    {
        image = [UIImage imageNamed: @"icon_speed_10.png"];
    }
    else if ( speed == 1.2f )
    {
        image = [UIImage imageNamed: @"icon_speed_12.png"];
    }
        else if ( speed == 1.5f )
    {
        image = [UIImage imageNamed: @"icon_speed_15.png"];
    }
    
    [_speedButton setImage: image
                  forState: UIControlStateNormal];
    
    [_speedButton setImage: [image tintImageWithColor: UIColorFromRGB(0x000000, 0.3f)]
                  forState: UIControlStateHighlighted];
}

- (void) setScriptViewFrameWithStatus: (NSInteger) status
{
    CGRect clientRect = self.frame;
    
    _scriptView.status = status;
    
    if ( _scriptView.status == IfMediaPlayerScriptViewModeNone )
    {
        CGRect menuFrame = CGRectMake(0, CGRectGetMinY(_bottomView.frame)-50.f, self.frame.size.width, 50.f);
        CGRect controlFrame = CGRectMake(0, CGRectGetMinY(menuFrame)-90.f, self.frame.size.width, 80.f);
        
        [self animationViewsWithTopViewAlpha: 1.f
                                topViewFrame: CGRectMake(0, 0, self.frame.size.width, 60.f)
                             scriptViewAlpha: 0.f
                             scriptViewFrame: CGRectMake(0, CGRectGetMinY(_bottomView.frame), clientRect.size.width, 0)
                               menuViewAlpha: 1.f
                               menuViewFrame: menuFrame
                            controlViewAlpha: 1.f
                            controlViewFrame: controlFrame];
    }
    else if ( _scriptView.status == IfMediaPlayerScriptViewModeText )
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

        [self animationViewsWithTopViewAlpha: 1.f
                                topViewFrame: CGRectMake(0, 0, self.frame.size.width, 60.f)
                             scriptViewAlpha: 1.f
                             scriptViewFrame: scriptFrame
                               menuViewAlpha: 1.f
                               menuViewFrame: menuFrame
                            controlViewAlpha: 1.f
                            controlViewFrame: controlFrame];
    }
    else if ( _scriptView.status == IfMediaPlayerScriptViewModeList )
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

        [self animationViewsWithTopViewAlpha: 0.f
                                topViewFrame: CGRectMake(0, 0, self.frame.size.width, 60.f)
                             scriptViewAlpha: 1.f
                             scriptViewFrame: scriptFrame
                               menuViewAlpha: 0.f
                               menuViewFrame: menuFrame
                            controlViewAlpha: 0.f
                            controlViewFrame: controlFrame];
    }
}

- (void) animationViewsWithTopViewAlpha: (CGFloat) topViewAlpha
                           topViewFrame: (CGRect) topViewFrame
                        scriptViewAlpha: (CGFloat) scriptViewAlpha
                        scriptViewFrame: (CGRect) scriptViewFrame
                          menuViewAlpha: (CGFloat) menuViewAlpha
                          menuViewFrame: (CGRect) menuViewFrame
                       controlViewAlpha: (CGFloat) controlViewAlpha
                       controlViewFrame: (CGRect) controlViewFrame
{
    _topView.hidden = NO;
    _scriptView.hidden = NO;
    _menuItemView.hidden = NO;
    _controlBarView.hidden = NO;
    
    [UIView animateWithDuration: 0.3f
                          delay: 0
                        options: UIViewAnimationOptionAllowUserInteraction
                     animations: ^{
                                    _topView.alpha = topViewAlpha;
                                    _topView.frame = topViewFrame;
                         
                                    _scriptView.alpha = scriptViewAlpha;
                                    _scriptView.frame = scriptViewFrame;
                         
                                    _menuItemView.alpha = menuViewAlpha;
                                    _menuItemView.frame = menuViewFrame;
                         
                                    _controlBarView.alpha = controlViewAlpha;
                                    _controlBarView.frame = controlViewFrame;
                                 }
                     completion: ^(BOOL finished)
                                 {
                                     _topView.hidden = (topViewAlpha == 0.f);
                                     _scriptView.hidden = (scriptViewAlpha == 0.f);
                                     _menuItemView.hidden = (menuViewAlpha == 0.f);
                                     _controlBarView.hidden = (controlViewAlpha == 0.f);
                                 }];
}

- (void) setIsDownloadFile: (BOOL) isDownloadFile
{
    if ( isDownloadFile )
    {
        [_downloadButton setImage: @"icon_download_done.png"];
        [self setTouchEnable: _downloadButton
                      isLock: YES];
    }
    
    _isDownloadFile = isDownloadFile;
}

- (void) reOrderSubviews
{
    // 오디오 UI
    {
        _audioUiView.frame = self.bounds;
        _backgroundImageView.frame = _audioUiView.bounds;
        
        UIImage *headphoneImage = [UIImage imageNamed: @"image_headphones.png"];
        _headphoneImageView.frame = CGRectMake((_audioUiView.frame.size.width - headphoneImage.size.width) / 2.f,
                                               ((_audioUiView.frame.size.height - headphoneImage.size.height) / 2.f) - 50.f,
                                               headphoneImage.size.width, headphoneImage.size.height);
        
        if ( self.frame.size.width > self.frame.size.height && _backgroundImageView.image )
        {
            CGFloat width = [common getRatioWidth: _backgroundImageView.image.size
                                     screenHeight: self.frame.size.height];
            CGFloat height = [common getRatioHeight: _backgroundImageView.image.size
                                        screenWidth: width];
            
            _backgroundImageView.frame = CGRectMake((self.frame.size.width - width)/2.f, 0, width, height);
        }
    }
    
    _touchButton01.frame = self.bounds;
    _contentView.frame = self.bounds;
    _touchButton02.frame = _contentView.bounds;
    
    //탑뷰
    _topView.frame = CGRectMake(0, 0, self.frame.size.width, 60.f);
    _closeButton.frame = CGRectMake(0, 0, 60, 55);
    
    CGRect frame = CGRectZero;
    frame.origin.x = CGRectGetMaxX(_closeButton.frame) + 10.f;
    frame.origin.y = 10.f;
    frame.size.width = self.frame.size.width - (frame.origin.x + 10);
    frame.size.height = 13.f;
    
    _topTitleLabel01.frame = frame;
    
    frame.origin.x = CGRectGetMaxX(_closeButton.frame) + 10.f;
    frame.origin.y = CGRectGetMaxY(_topTitleLabel01.frame) + 2.f;
    frame.size.width = self.frame.size.width - (frame.origin.x + 10);
    frame.size.height = 18.f;
    
    _topTitleLabel02.frame = frame;
    
    _bottomView.frame = CGRectMake(0, self.frame.size.height-60.f, self.frame.size.width, 60.f);

    CGFloat margin = 20;
    CGFloat padding = 10;
    CGFloat labelWidth = 45;
    CGFloat barWidth = _bottomView.frame.size.width-(labelWidth * 2)-(margin * 2)-(padding * 2);
    
    _timeLabel.frame = CGRectMake(margin, _bottomView.frame.size.height-45, labelWidth, 30);
    _totalTimeLabel.frame = CGRectMake(margin + labelWidth + padding + barWidth + padding, _bottomView.frame.size.height-45, labelWidth, 30);
    
    _slider.frame = CGRectMake(margin + labelWidth + padding, _bottomView.frame.size.height-44, barWidth, 30.f);
    
    _menuItemView.frame = CGRectMake(0, CGRectGetMinY(_bottomView.frame)-50.f, self.frame.size.width, 50.f);
    _menuItemTopLineView.frame = CGRectMake(0, 0, _menuItemView.frame.size.width, 1);
    
    NSInteger buttonCount = _isAudioMode ? 4 : 6;
    CGFloat buttonPadding = _isAudioMode ? 70 : 10;
    CGFloat buttonWidth = ((_menuItemView.frame.size.width - (buttonPadding * 2)) / buttonCount);
    
    CGFloat buttonOffsetX = buttonPadding;
    CGFloat buttonOffsetY = 0;
    
    {
        _autoPlayButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    if ( !_isAudioMode )
    {
        _scriptButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    if ( !_isAudioMode )
    {
        _modeChangeButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    {
        _downloadButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    {
        _sleepButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    {
        _lockButton.frame = CGRectMake(buttonOffsetX, buttonOffsetY, buttonWidth, buttonWidth);
        buttonOffsetX = buttonOffsetX + buttonWidth;
    }
    
    _menuItemBottomLineView.frame = CGRectMake(0, _menuItemView.frame.size.height-1, _menuItemView.frame.size.width, 1);
    _controlBarView.frame = CGRectMake(0, CGRectGetMinY(_menuItemView.frame)-90.f, self.frame.size.width, 80.f);
    _playButton.frame = CGRectMake((_controlBarView.frame.size.width - 60.f) / 2.f, 0.f, 60.f, 60.f);
    _paueseButton.frame = CGRectMake((_controlBarView.frame.size.width - 60.f) / 2.f, 0.f, 60.f, 60.f);
    _rwButton.frame = CGRectMake(CGRectGetMinX(_playButton.frame) - 60.f - 10.f, 0.f, 60.f, 60.f);
    _ffButton.frame = CGRectMake(CGRectGetMaxX(_playButton.frame) + 10.f, 0.f, 60.f, 60.f);
    _speedButton.frame = CGRectMake(CGRectGetMinX(_rwButton.frame) - 50.f, 10.f, 50.f, 50.f);
    _listButton.frame = CGRectMake(CGRectGetMaxX(_ffButton.frame), 10.f, 50.f, 50.f);
    _networkStatusLabel.frame = CGRectMake(0, CGRectGetMaxY(_playButton.frame), _controlBarView.frame.size.width, 20.f);
    
    //자막화면
    if ( _scriptView )
    {
        [self setScriptViewFrameWithStatus: _scriptView.status];
    }
    
    //최근 본 리스트
    if ( _listView )
    {
        frame = self.bounds;
        frame.size.height = frame.size.height - _bottomView.frame.size.height;
        _listView.frame = frame;
        
        [_listView reOrderSubviews];
    }
    
    //타이머
    if ( _timerSelectView )
    {
        CGFloat height = 0;
        
        if ( self.frame.size.width < self.frame.size.height )
        {
            height = 60 + (50 * 4);
        }
        else
        {
            height = 60 + (50 * 2);
        }
        
        frame = CGRectMake(0, CGRectGetMinY(_bottomView.frame) - height, self.frame.size.width, height);
        _timerSelectView.frame = frame;
    }
}

#pragma mark - pravite methods

- (void) unlockDragging
{
    _holdTouchDragging = NO;
}

- (void) setPlayerUIHidden: (BOOL) hidden
{
    NSLog(@"    [setPlayerUIHidden] 이벤트가 발생하여 플레이어 컨트롤러가 사라집니다.");
    self.userInteractionEnabled = NO;
    self.backgroundColor = hidden ? [UIColor clearColor] : UIColorFromRGB(0x000000, 0.5f);
    
    _contentView.hidden = NO;
    _contentView.alpha = hidden ? 1.f : 0.f;
    
    [UIView animateWithDuration: 0.3f
                          delay: 0
                        options: UIViewAnimationOptionAllowUserInteraction
                     animations: ^{
                                    _contentView.alpha = hidden ? 0.f : 1.f;
                         
                                    if ( !hidden )
                                    {
                                        [self setPositionScriptToHideView: hidden];
                                    }
                                }
                     completion: ^(BOOL finished)
                                {
                                    _contentView.hidden = hidden;
                                    self.userInteractionEnabled = YES;
                                    
                                    if ( hidden )
                                    {
                                        [self setPositionScriptToHideView: hidden];
                                    }
                                }];
}

- (void) setPositionScriptToHideView: (BOOL) hidden
{
    if ( _scriptView.status == IfMediaPlayerScriptViewModeText )
    {
        if ( hidden == YES )
        {
            CGRect frame = _scriptView.frame;
            frame.origin.y = self.frame.size.height - frame.size.height;
            
            [UIView animateWithDuration: 0.3f
                                  delay: 0
                                options: UIViewAnimationOptionAllowUserInteraction
                             animations: ^{
                                            _scriptView.frame = frame;
                                         }
                             completion: ^(BOOL finished) {} ];
        }
        else
        {
            [self setScriptViewFrameWithStatus: _scriptView.status];
        }
    }
}

- (void) changeViewMode: (BOOL) isAudioMode
{
    // 오디오모드가 가능한 상태가 아니면서 다운로드받은 파일이 아니라면..
    //
    if ( !self.isPossibleAudioMode && !self.isDownloadFile )
    {
        [_modeChangeButton setStatus: 0];
        NSLog(@"    [changeViewMode]: %@", isAudioMode ? @"YES" : @"NO");
        NSLog(@"    [changeViewMode] 미리보기 상태에서도 오디오모드는 허용되야 합니다!");
        
        return DEFAULT_ALERT(@"", @"본 동영상은 오디오모드를 제공하지 않습니다.");
    }
    
    _audioUiView.hidden = !isAudioMode;
    
    if ( [self.delegate respondsToSelector: @selector(playerUiView:changeToMode:)] )
    {
        [self.delegate playerUiView: self
                       changeToMode: isAudioMode];
    }
}

- (void) openPlayList
{
    // author가 false일 경우는 preview이기때문에 최근 본 리스트를 비활성화 하였습니다. 171101 김태현
    // 하지만 오디오북 미리듣기의 경우 author가 true이기 때문에 기준값을 더 추가하여 플레이리스트를 비활성화해야 합니다.
    NSLog(@"    [openPlayList] 미리보기 & 미리듣기 상태에서는 비활성화 해야합니다!");
    
    if ( !self.isAuthor )
    {
      //AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
      //[app showToast: @"미리보기에서는 이용 하실 수 없습니다."];
        [_contentView makeToast : @"프리뷰 이용중입니다."];
        
        return ;
    }
    
    if ( _listView )
    {
        return ;
    }
    
    NSArray *list = nil;
    
    if ( [self.delegate respondsToSelector: @selector(playerUiView:getContentList:)] )
    {
        list = [self.delegate playerUiView: self
                            getContentList: nil];
    }
    
    NSInteger currentIndex = -1;
    
    if ( [self.delegate respondsToSelector: @selector(playerUiView:getCurrentIndex:)] )
    {
        currentIndex = [self.delegate playerUiView: self
                                   getCurrentIndex: nil];
    }
    
    NSString *groupTitle = @"";
    
    if ( _isAudioMode )
    {
        if ( [self.delegate respondsToSelector: @selector(playerUiView:getGroupTitle:)] )
        {
            groupTitle = [self.delegate playerUiView: self
                                       getGroupTitle: nil];
        }
    }
    
    CGRect frame = self.bounds;
    frame.size.height = frame.size.height - _bottomView.frame.size.height;
    _listView = [[IFPlayListPopupView alloc] initWithFrame: frame];
    _listView.delegate = self;
    _listView.isAudioContentType = _isAudioMode;
    _listView.playList = list;
    _listView.currentPlayIndex = currentIndex;
    _listView.isAuthor = self.isAuthor;
    [self addSubview: _listView];
    [_listView start];
    
    //오디오 콘텐츠 타이틀 삽입
    if ( !nullStr(groupTitle) )
    {
        [_listView setTitle: groupTitle];
    }
}

- (void) openTimerSelectView
{
    if ( _timerSelectView )
    {
        return ;
    }
    
    CGFloat height = 0;
    
    if ( self.frame.size.width < self.frame.size.height )
    {
        height = 60 + (50 * 4);
    }
    else
    {
        height = 60 + (50 * 2);
    }
    
    CGRect frame = CGRectMake(0, CGRectGetMinY(_bottomView.frame) - height, self.frame.size.width, height);
    _timerSelectView = [[IFTimerView alloc] initWithFrame: frame];
    _timerSelectView.delegate = self;
    [self addSubview: _timerSelectView];
}

#pragma mark - sleepTimer
- (void) setTimerMode: (NSString *) text
{
    if ( [@"사용안함" isEqualToString: text] )
    {
        if ( [IFSleepTimerManager sharedInstance].isAlive )
        {
            [[IFSleepTimerManager sharedInstance] stopTimer];
        }
        
        [_sleepButton setText: @""];
        [_sleepButton setStatus: 0];
        
        return ;
    }
    
    BOOL isEpisodeStop = NO;
    
    if ( [@"현재 에피소드까지" isEqualToString: text] )
    {
        isEpisodeStop = YES;
    }
    
    NSInteger timerMin = 0;
    
    if ( [@"5분" isEqualToString: text] )
    {
        timerMin = 5;
    }
    else if ( [@"10분" isEqualToString: text] )
    {
        timerMin = 10;
    }
    else if ( [@"15분" isEqualToString: text] )
    {
        timerMin = 15;
    }
    else if ( [@"30분" isEqualToString: text] )
    {
        timerMin = 30;
    }
    else if ( [@"45분" isEqualToString: text] )
    {
        timerMin = 45;
    }
    else if ( [@"1시간" isEqualToString: text] )
    {
        timerMin = 60;
    }
    
    [_sleepButton setStatus: 1];
    
    NSDate *stopDate = nil;
    
    if ( !isEpisodeStop )
    {
        stopDate = [[NSDate date] dateByAddingTimeInterval: (timerMin * 60)];
    }
    
    [IFSleepTimerManager sharedInstance].delegate = self;
    [[IFSleepTimerManager sharedInstance] startTimer: stopDate
                                     stopEpisodeMode: isEpisodeStop];
}

- (void) setTouchEnable: (UIView *) view
                 isLock: (BOOL) isLock
{
    view.userInteractionEnabled = !isLock;
    view.alpha = isLock ? 0.7f : 1.f;
}

#pragma mark - public methods
- (void) setGkey: (NSString *) gkey
            ckey: (NSString *) ckey
{
    self.gkey = gkey;
    self.ckey = ckey;
    
    NSLog(@"    [setGkey] gkey : %@", self.gkey);
    NSLog(@"    [   ckey] ckey : %@", self.ckey);
    
    if ( [[DownloadManager sharedInstance] checkCurrentDownloadingWithGkey: gkey ckey: ckey] )
    {
        [_downloadButton setImage: @"icon_download_ing.png"];
        
        self.isDownloading = YES;
        [self setTouchEnable: _downloadButton
                      isLock: YES];
    }
    else if ( [[DownloadManager sharedInstance] checkHasDownloadingWithGkey: gkey ckey: ckey] )
    {
        [_downloadButton setImage: @"icon_download_waiting.png"];

        self.isDownloading = YES;
        [self setTouchEnable: _downloadButton
                      isLock: YES];
    }
    
    NSString *notificationKey = [NSString stringWithFormat: @"download_%@", ckey];
    [[NSNotificationCenter defaultCenter] addObserver: self
                                             selector: @selector(downloadNotification:)
                                                 name: notificationKey
                                               object: nil];
}

- (void) setTitleLabel01: (NSString *) text
{
    _topTitleLabel01.text = text;
}

- (void) setTitleLabel02: (NSString *) text
{
    _topTitleLabel02.text = text;
}

- (void) setAudioContentBackgroundImageUrl: (NSString *) url
{
    if ( !nullStr(url) )
    {
        [_backgroundImageView sd_setImageWithURL: [NSURL URLWithString: url]
                                       completed: ^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL)
                                                  {
                                                      if ( self.frame.size.width > self.frame.size.height && _backgroundImageView.image )
                                                      {
                                                          CGFloat width = [common getRatioWidth: _backgroundImageView.image.size
                                                                                   screenHeight: self.frame.size.height];
                                                          
                                                          CGFloat height = [common getRatioHeight: _backgroundImageView.image.size
                                                                                      screenWidth: width];
                                                          
                                                          _backgroundImageView.frame = CGRectMake((self.frame.size.width - width)/2.f, 0, width, height);
                                                      }
                                                  }];
    }
}

- (void) setScriptArray: (NSArray *) scriptArray
{
    [self initScriptUi: scriptArray];
}

- (void) setPreparedToPlayInfo: (NSDictionary *) info
{
    CGFloat currentTime = [info[@"currentTime"] floatValue];
    CGFloat totalTime = [info[@"totalTime"] floatValue];
    
    if ( _slider )
    {
        _slider.minimumValue = 0.f;
        
        [self setCurrentTime: currentTime
                 forceChange: YES];
        
        
        if ( _isAudioMode && !self.isAuthor )       // 오디오 모드 이면서 권한이 없으면 미리듣기이므로 미리보기의 90초가 아닌 원래 챕터시간으로 세팅해야함. 문제 생기면 롤백해야함!! 171102 김태현
        {
            _slider.maximumValue = totalTime;
            [self setTotalTime: totalTime];
        }
        else if ( !_isAudioMode && !self.isAuthor ) // 영상 모드 이면서 권한이 없으면 미리보기이므로 미리보기의 90초로 세팅해야함. 문제 생기면 롤백해야함!! 171102 김태현
        {
            _slider.maximumValue = 90.f;
            [self setTotalTime: 90.f];
        }
        else
        {
            _slider.maximumValue = totalTime;  // 그 밖의 경우는 원래 시간으로 세팅함. 문제 생기면 롤백해야함!! 171102 김태현
            [self setTotalTime: totalTime];
        }
        
        //_slider.maximumValue = (self.isAuthor ? totalTime : 90.f);  // 60.f -> 90.f (60초에서 90초로 변경) 171101 김태현
        //[self setTotalTime: (self.isAuthor ? totalTime : 90.f)];    // 60.f -> 90.f (60초에서 90초로 변경) 171101 김태현
    }
    
    // 영상시작후 3초간 입력이 없으면 컨트롤러를 자동으로 닫음 171103 김태현
    [self performSelector: @selector(pressedHideButton)
               withObject: nil
               afterDelay: 3.0f];
}

- (void) setPlayState: (BOOL) isPlay
{
    _paueseButton.hidden = !isPlay;
    _playButton.hidden = !_paueseButton.hidden;
}

- (void) setCurrentTime: (CGFloat) time
            forceChange: (BOOL) forceChange
{
    if ( _timeLabel && (!_touchDragging || forceChange) )
    {
        _timeLabel.text = [common convertTimeToString: time
                                               Minute: YES];
    }
    
    if ( _scriptView )
    {
        [_scriptView setCurrentTime: time];
    }
}

- (void) setTotalTime: (CGFloat) time
{
    if ( _totalTimeLabel )
    {
        _totalTimeLabel.text = [common convertTimeToString: time
                                                    Minute: YES];
    }
}

- (void) setSeekbarCurrentValue: (CGFloat) value
{
    if ( _slider && !_touchDragging )
    {
        [_slider setValue: value];
    }
    
    if ( [[IFSleepTimerManager sharedInstance] isStopEpisodeMode] )
    {
        // 에피소드 모드 시간 적용
        NSInteger c = [common convertStringToTime: _timeLabel.text];
        NSInteger t = [common convertStringToTime: _totalTimeLabel.text];

        NSString *timerStr = [common convertTimeToString: (t-c)
                                                  Minute: YES];
        
        if ( _sleepButton )
        {
            [_sleepButton setText: timerStr];
        }
    }
}

#pragma mark - selectors
- (void) pressedCloseButton: (id) sender
{
    if ( [self.delegate respondsToSelector: @selector(playerUiView:closeView:)] )
    {
        [self.delegate playerUiView: self
                          closeView: nil];
    }
}

- (void) pressedRateStarButton
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
                                                     // 별점주기 팝업을 띄운 후 별점을 주지 않으면 별점만 초기화하고 그냥 닫습니다.
                                                     if ( nil == _currentStar || [_currentStar isEqualToString: @"0"] || [_currentStar isEqualToString: @""] )
                                                     {
                                                         _currentStar = @"";
                                                     }
                                                     else
                                                     {
                                                         NSLog(@"  [pressedRateStarButton] 최종별점 : %@", _currentStar);
                                                         NSLog(@"  [pressedRateStarButton] ckey : %@", self.ckey);
                                                         // 지식영상이 끝나면 별점을 등록하기 위해 조회를 먼저합니다.
                                                         NSString *starUpdateUrl;
#if APPSTORE | ADHOC
                                                         starUpdateUrl = [NSString stringWithFormat: @"http://%@/usingapp/update_star.php", BASE_DOMAIN];
#else
                                                         starUpdateUrl = [NSString stringWithFormat: @"http://%@/usingapp/update_star.php", TEST_DOMAIN];
#endif
                                                         NSString *post = [NSString stringWithFormat: @"star=%@&ckey=%@", _currentStar, self.ckey];
                                                         NSData *postData = [post dataUsingEncoding: NSUTF8StringEncoding];
                                                         
                                                         NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
                                                         [request setURL: [NSURL URLWithString: [NSString stringWithFormat: @"%@", starUpdateUrl]]];
                                                         [request setHTTPBody: postData];
                                                         [request setHTTPMethod: @"POST"];
                                                         NSError *error;
                                                         NSURLResponse *resp = nil;
                                                         // 비동기방식이 아닌 동기방식으로 접속한다.
                                                         [NSURLConnection sendSynchronousRequest: request
                                                                               returningResponse: &resp
                                                                                           error: &error];
                                                         
                                                         NSString *myStarStr = [NSString stringWithFormat: @" %@%@", _currentStar, @".0"];
                                                         
                                                         _currentStar = @"";   // 다음 강의 평가를 위해 별점 초기화. 171207 김태현
                                                         [_rateStarButton setTitle: myStarStr forState: UIControlStateNormal];
                                                         _rateStarButton.layer.borderColor = [UIColor clearColor].CGColor;
                                                         //_rateStarButton.userInteractionEnabled = NO; // 탑뷰 내 별점주기버튼 비활성화
                                                     }
                                               }];
    
    UIAlertAction *cancelAction;
    cancelAction = [UIAlertAction actionWithTitle: @"취소"
                                            style: UIAlertActionStyleDestructive
                                          handler: ^(UIAlertAction *action)
                                                   {
                                                       NSLog(@"Cancel action");
                                                   }];
    
    [okAction setValue: UIColorFromRGB(0x32c183, 1.f)
                forKey: @"titleTextColor"];
    
    [cancelAction setValue: UIColorFromRGB(0x4a494a, 1.f)
                    forKey: @"titleTextColor"];
    
    [alert addAction: okAction];
    [alert addAction: cancelAction];
    
    [alert show];
}

- (void) pressedShowButton
{
    [self setPlayerUIHidden: NO];
}

- (void) pressedHideButton
{
    [self setPlayerUIHidden: YES];
}

- (void) pressedPlayButton
{
    if ( [self.delegate respondsToSelector: @selector(playerUiView:setPlay:)] )
    {
        [self.delegate playerUiView: self
                            setPlay: YES];
    }
}

// 일시중지버튼 이벤트처리
- (void) pressedPauseButton
{
    if ( [self.delegate respondsToSelector: @selector(playerUiView:setPlay:)] )
    {
        [self.delegate playerUiView: self
                            setPlay: NO];
    }
}

// 뒤로가기버튼 이벤트처리
- (void) pressedRwButton
{
    if ( [self.delegate respondsToSelector: @selector(playerUiView:setRW:)] )
    {
        // 이용로그 전송 시작
      //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
        NSTimeInterval cTime = 0000;
      //NSTimeInterval tTime = [AquaSDK getTotalPlaybackTime];
        [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                              contentKey: self.ckey
                                                  status: @"BACK"
                                              downloaded: self.isDownloadFile
                                            startingTime: (int) (cTime * 1000)
                                              endingTime: (int) (cTime * 1000 + 30000)];
        // 이용로그 전송 종료
        
        [self.delegate playerUiView: self
                              setRW: 10.f];
    }
}

// 앞으로가기버튼 이벤트처리
- (void) pressedFfButton
{
    if ([self.delegate respondsToSelector: @selector(playerUiView:setFF:)])
    {
        // 이용로그 전송 시작
      //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
        NSTimeInterval cTime = 0000;
        [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                              contentKey: self.ckey
                                                  status: @"FORWARD"
                                              downloaded: self.isDownloadFile
                                            startingTime: (int) (cTime * 1000)
                                              endingTime: (int) (cTime * 1000 + 30000)];
        // 이용로그 전송 종료
        
        [self.delegate playerUiView: self
                              setFF: 10.f];
    }
}

- (void) pressedSpeedButton
{
    CGFloat speed = [[NSUserDefaults standardUserDefaults] floatForKey: @"playSpeed"];
    
    if ( speed == 0 )
    {
        speed = 1.f;
    }
    
    if ( speed == 1.f )
    {
        speed = 1.2f;
    }
    else if ( speed == 1.2f )
    {
        speed = 1.5f;
    }
    else if ( speed == 1.5f )
    {
        speed = 0.8f;
    }
    else if ( speed == 0.8f )
    {
        speed = 1.0f;
    }
    
    [[NSUserDefaults standardUserDefaults] setFloat: speed
                                             forKey: @"playSpeed"];
    
    [[NSUserDefaults standardUserDefaults] synchronize];
    
    [self setSpeedButtonImage];
    
    if ( [self.delegate respondsToSelector: @selector(playerUiView:setSpeed:)] )
    {
        [self.delegate playerUiView: self
                           setSpeed: speed];
    }
}

- (void) pressedListButton
{
    NSLog(@"    [pressedListButton] 최근재생 지식클립 리스트 - 미리보기에서는 비활성화 시켜야 함.");
    [self openPlayList];
}

#pragma mark - slider action
- (void) seekbarDragBegin: (id) sender
{
    _touchDragging = YES;
}

- (void) seekbarDidChangeValue: (id) sender
{
    UISlider *bar = (UISlider *) sender;
    
    [self setCurrentTime: bar.value
             forceChange: YES];

    if ( _holdTouchDragging )
    {
        return ;
    }
    
    if ( [self.delegate respondsToSelector: @selector(playerUiView:seekbarDragging:)] )
    {
        [self.delegate playerUiView: self
                    seekbarDragging: bar.value];
        
        _holdTouchDragging = YES;
        
        [self performSelector: @selector(unlockDragging)
                   withObject: nil
                   afterDelay: 0.5f];
    }
}

- (void) seekbarDragEnd: (id) sender
{
    _touchDragging = NO;
    
    UISlider *bar = (UISlider *) sender;
    
    if ( [self.delegate respondsToSelector: @selector(playerUiView:seekbarDragEnd:)] )
    {
        [self.delegate playerUiView: self
                     seekbarDragEnd: bar.value];
        
        _holdTouchDragging = NO;
        [NSObject cancelPreviousPerformRequestsWithTarget: self
                                                 selector: @selector(unlock)
                                                   object: nil];
        NSLog(@"  [SeekBar] Dragging ends. (%f)", bar.value);
        // 이용로그 전송 시작
      //NSTimeInterval cTime = [AquaSDK getCurrentPlaybackTime];
        NSTimeInterval cTime = 0000;
        [[LogManager sharedInstance] sendLogWithGroupKey: self.gkey
                                              contentKey: self.ckey
                                                  status: @"MOVE"
                                              downloaded: self.isDownloadFile
                                            startingTime: (int) (cTime * 1000)
                                              endingTime: (int) (cTime * 1000 + 30000)];
        // 이용로그 전송 종료
    }
}

- (void) pressedPlayerButtonWithId: (NSString *) buttonId
                            status: (NSInteger) status
{
    if ( !self.isAuthor )
    {
        BOOL isToast = NO;
        
        if ( [@"script-mode" isEqualToString: buttonId] )
        {
            [_scriptView setStatus: IfMediaPlayerScriptViewModeNone];
            isToast = YES;
        }
        else if ( [@"download-mode" isEqualToString: buttonId] )
        {
            [_downloadButton setStatus: 0];
            isToast = YES;
        }
        
        if ( isToast )
        {
          //AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
            [_contentView makeToast : @"미리보기에서는 이용 하실 수 없습니다."];
            
            return ;
        }
    }
    
    if ( [@"script-mode" isEqualToString: buttonId] )
    {
        [self setScriptViewFrameWithStatus: status];
    }
    else if ( [@"view-mode" isEqualToString: buttonId] )
    {
        [self changeViewMode: (status == 1)];
    }
    else if ( [@"autoplay-mode" isEqualToString: buttonId])
    {
        [common setUserSettingValueWithKey: @"autoplay_enable"
                                     value: status == 0 ? @"N" : @"Y"];
    }
    else if ( [@"lock-mode" isEqualToString: buttonId] )
    {
        BOOL isLock = (status == 1);
        
        [self setTouchEnable: _closeButton
                      isLock: isLock];
        
        [self setTouchEnable: _playButton
                      isLock: isLock];
        
        [self setTouchEnable: _paueseButton
                      isLock: isLock];
        
        [self setTouchEnable: _rwButton
                      isLock: isLock];
        
        [self setTouchEnable: _ffButton
                      isLock: isLock];
        
        [self setTouchEnable: _speedButton
                      isLock: isLock];
        
        [self setTouchEnable: _listButton
                      isLock: isLock];
        
        [self setTouchEnable:_autoPlayButton
                      isLock: isLock];
        
        [self setTouchEnable:_scriptButton
                      isLock: isLock];
        
        [self setTouchEnable:_modeChangeButton
                      isLock: isLock];
        
        [self setTouchEnable:_sleepButton
                      isLock: isLock];
        
        [self setTouchEnable: _slider
                      isLock: isLock];
        
        if ( self.isDownloadFile || self.isDownloading )
        {
            [self setTouchEnable: _downloadButton
                          isLock: YES];
        }
        else
        {
            [self setTouchEnable: _downloadButton
                          isLock: isLock];
        }
    }
    else if ( [@"timer-mode" isEqualToString: buttonId])
    {
        if ( status == 1 )
        {
            if ( [IFSleepTimerManager sharedInstance].isAlive )
            {
                [[IFSleepTimerManager sharedInstance] stopTimer];
            }
            
            [_sleepButton setStatus: 0];
            [_sleepButton setText: @""];
            
            [self openTimerSelectView];
        }
        else
        {
            [self setTimerMode: @"사용안함"];
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
                                                                 }];
            [alert addAction : ok];
          
          //[_contentView presentViewController:alert animated:YES completion:nil];
          
            return ;
        }
        
        [[DownloadManager sharedInstance] insertDownloadWithContentKey: self.ckey];
        
        self.isDownloading = YES;
        [self setTouchEnable: _downloadButton
                      isLock: YES];
    }
}

#pragma mark - downloadNotification
- (void) downloadNotification: (NSNotification *) notification
{
    NSLog(@"userInfo : %@", notification.userInfo);
    NSString *status = notification.userInfo[@"status"];
    
    if ( [@"ready" isEqualToString: status] )
    {
        [_downloadButton setImage: @"icon_download_waiting.png"];
    }
    else if ( [@"start" isEqualToString: status] )
    {
        [_downloadButton setImage: @"icon_download_ing.png"];
    }
    else if ( [@"end" isEqualToString: status] )
    {
        [_downloadButton setImage: @"icon_download_done.png"];
        /*
        AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
      
        [app showAlertWithTitle: @"다운로드 완료"
                        message: @"다운로드된 파일로 재생하시겠습니까?"
              cancelButtonTitle: @"아니오"
         destructiveButtonTitle: nil
              otherButtonTitles: @[ @"예" ]
                       tapBlock: ^(UIAlertController * _Nonnull controller, UIAlertAction * _Nonnull action, NSInteger buttonIndex)
                                 {
                                     if ( buttonIndex == controller.firstOtherButtonIndex )
                                     {
                                         if ( [self.delegate respondsToSelector: @selector(playerUiView:changeToDownloadFile:)] )
                                         {
                                             self.isDownloadFile = YES;
                                             _networkStatusLabel.text = @"다운로드 파일로 재생";
                                             
                                             [self.delegate playerUiView: self
                                                    changeToDownloadFile: !_audioUiView.hidden];
                                         }
                                     }
                                 }];
        */
    }
}

#pragma mark - IFMediaPlayerScriptViewDelegate
- (void) mediaPlayerScriptView: (IFMediaPlayerScriptView *) view
                  statusChange: (IfMediaPlayerScriptViewMode) mode
{
    [_scriptButton setStatus: mode];
    [self setScriptViewFrameWithStatus: mode];
}

#pragma mark - IFPlayListPopupViewDelegate
- (void) playListPopupView: (IFPlayListPopupView *) view
                 closeView: (id) sender
{
    if ( _listView )
    {
        [_listView removeFromSuperview];
        _listView = nil;
    }
}

- (void) playListPopupView: (IFPlayListPopupView *) view
        selectedOtherIndex: (NSInteger) index
{
    if ( [self.delegate respondsToSelector: @selector(playerUiView:selectedOtherIndex:)] )
    {
        [self.delegate playerUiView: self
                 selectedOtherIndex: index];
    }
}

#pragma mark - IFTimerViewDelete Methods
- (void) timerView: (IFTimerView *) view
         closeView: (id)sender
{
    if ( _timerSelectView )
    {
        [_timerSelectView removeFromSuperview];
        _timerSelectView = nil;
    }
}

- (void) timerView: (IFTimerView *) view
   didSelectedTime: (NSString *) time
{
    [self setTimerMode: time];
}

#pragma mark - IFSleepTimerManagerDelegate
- (void) secondFromSleepTimerManager: (NSInteger) second
{
    if ( _sleepButton && second >= 0 )
    {
        [_sleepButton setText: [common convertTimeToString: (float) second
                                                    Minute: YES]];
    }
}

- (void) finishFromSleepTimerManager
{
    if ( _sleepButton )
    {
        [_sleepButton setStatus: 0];
        [_sleepButton setText: @""];
    }

    [self pressedPauseButton];
}

#pragma mark - IFRateView

- (void) rateView: (IFRateView *) rateView
 changedToNewRate: (NSNumber *) rate
{
    //NSLog(@"    현재별점: %d", rate.intValue);
    _currentStar = [rate stringValue];
}

@end











