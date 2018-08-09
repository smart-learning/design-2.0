
#import "ContentPlayerViewController.h"

#import "AppDelegate.h"

#define PALLYCON_SITE_ID    @"O8LD"
#define PALLYCON_SITE_KEY   @"YxIe3SrPPWWH6hHPkJdG1pUewkB1T6Y9"

@interface ContentPlayerViewController()
{
    UIView    *_contentView;        // PlayerLayer, TopBar, BottomBar 등을 표시하는 최상단 Layer, PlayerLayer에 여러 view를 add하면 사라지기 때문.
    UIView    *_topView;            // 상단 메뉴 바.
  
    UIButton  *_closeButton;
    UIButton  *_rateStarButton;
    UIButton  *_touchButton01;
    UIButton  *_touchButton02;
  
    UILabel   *_courseTitleLabel;   // 전체 강좌명
    UILabel   *_lectureTitleLabel;  // 강좌 내 강의명
  
    NSDictionary *_args;
}
@end

@implementation ContentPlayerViewController

- (void) viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [self.view setBackgroundColor : [UIColor blackColor]]; // grayColor
  
    // PallyConFPS SDK 객체를 생성합니다.
    _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                              siteKey : PALLYCON_SITE_KEY
                                   fpsLicenseDelegate : self
                                                error : nil             ];
}

- (void) viewDidAppear : (BOOL) animated
{
    //
    // contentView 구성 시작.
    _touchButton01 = [UIButton buttonWithType : UIButtonTypeCustom];
    _touchButton01.frame = self.view.bounds;
    [_touchButton01 addTarget : self
                       action : @selector(pressedShowButton)
             forControlEvents : UIControlEventTouchUpInside];
    [self.view addSubview : _touchButton01];
  
    _contentView = [[UIView alloc] initWithFrame : self.view.bounds];
    [self.view addSubview : _contentView];

    _touchButton02 = [UIButton buttonWithType : UIButtonTypeCustom];
    _touchButton02.frame = _contentView.bounds;
    [_touchButton02 addTarget : self
                       action : @selector(pressedHideButton)
             forControlEvents : UIControlEventTouchUpInside];
    [_contentView addSubview : _touchButton02];
    // contentView 구성 끝.
    //
  
    NSURL *contentUrl = [ NSURL URLWithString : [_args objectForKey : @"uri"] ]; // CONTENT_PATH
    AVURLAsset *urlAsset = [ [AVURLAsset alloc] initWithURL : contentUrl
                                                    options : nil       ];
  
    // 2. Set parameters required for FPS content playback. FPS 콘텐츠가 재생 되기 전에 FPS 콘텐츠 정보를 설정합니다.
    [ _fpsSDK prepareWithUrlAsset : urlAsset
                           userId : [_args objectForKey : @"userId"]
                        contentId : [_args objectForKey : @"cid"] // PALLYCON_CONTENT_ID
                       optionalId : [_args objectForKey : @"oid"] // PALLYCON_OPTIONAL_ID
                  liveKeyRotation : NO              ];
  
    AVPlayerItem *playerItem = [ AVPlayerItem playerItemWithAsset : urlAsset ];
    playerItem.audioTimePitchAlgorithm = AVAudioTimePitchAlgorithmVarispeed;  // 재생속도 관련.
    AVPlayer *player = [ AVPlayer playerWithPlayerItem : playerItem ];
  
    // _contentView에 add하기위해 AVPlayerViewController가 아닌 AVPlayerLayer를 사용합니다.
    _playerLayer = [AVPlayerLayer playerLayerWithPlayer : player];
    _playerLayer.frame = _contentView.bounds;
  //[_playerLayer setVideoGravity : AVLayerVideoGravityResize];           // 가로세로 비율을 무시하고 레이어의 경계를 채우기 위해 비디오를 늘리도록 지정합니다.
    [_playerLayer setVideoGravity : AVLayerVideoGravityResizeAspect];     // 가로세로 비율을 유지하고 비디오를 레이어의 경계 내에 맞출 수 있도록 지정합니다.
  //[_playerLayer setVideoGravity : AVLayerVideoGravityResizeAspectFill]; // 가로세로 비율을 유지하고 레이어의 경계를 채우도록 지정합니다.
  
    [_contentView.layer addSublayer : _playerLayer];
  
    [player play];   // 플레이어 재생 실행
  //[player setRate : 14.0]; // 시작 시간 위치
  //[player setMuted : true];
  //[player pause];  // 플레이어 재생 정지
  
    [ [NSNotificationCenter defaultCenter] addObserver : self
                                              selector : @selector(videoPlayBackDidFinish:)
                                                  name : AVPlayerItemDidPlayToEndTimeNotification
                                                object : [player currentItem]  ];
  
    [self drawPlayerControlHeader];
}

- (void) setContentData : (NSDictionary *) args
{
    _args = args;
}

- (void) downloadSomething : (NSDictionary *) args
{
    // 1. initialize a PallyConFPS SDK. PallyConFPS SDK 객체를 생성합니다.
    _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                              siteKey : PALLYCON_SITE_KEY
                                   fpsLicenseDelegate : self
                                                error : nil             ];
  
    NSURL *contentUrl = [ NSURL URLWithString : [args objectForKey : @"uri"] ]; // CONTENT_PATH
  
  
    // 2. DownloadTask 객체 생성합니다.
    // 콘텐츠 다운로드를 위해 DownloadTask 객체를 생성해서 사용합니다.
    // DownloadTask는 반드시 PallyConFPS 객체를 사용해서 생성해야만 합니다.
    DownloadTask *downloadTask;
    downloadTask = [ _fpsSDK createDownloadTaskWithUrl : contentUrl
                                                userId : [args objectForKey : @"userId"]
                                             contentId : [args objectForKey : @"cid"]
                                            optionalId : [args objectForKey : @"oid"]
                                      downloadDelegate : self ];
    [downloadTask resume];
}

- (void) didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) fpsLicenseDidSuccessAcquiringWithContentId : (NSString * _Nonnull) contentId
{
    NSLog(@"fpsLicenseDidSuccessAcquiringWithContentId (%@)", contentId);
}

- (void) fpsLicenseWithContentId : (NSString * _Nonnull) contentId
                didFailWithError : (NSError * _Nonnull) error
{
    NSLog(@"fpsLicenseWithContentId. Error Message (%@)", error.localizedDescription);
}

- (void) videoPlayBackDidFinish : (NSNotification *) notification
{
    NSLog(@"  [videoPlayBackDidFinish] FINITO !!");
  
    [ [NSNotificationCenter defaultCenter] removeObserver : self
                                                     name : AVPlayerItemDidPlayToEndTimeNotification
                                                   object : nil                                     ];
  
    _playerLayer.player = nil;
    //[self.playerController.view removeFromSuperview];
    //self.avVideoController = nil;
  
    [self dismissViewControllerAnimated:YES completion:nil];  // playerController를 닫습니다.
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
                     action : @selector(pressedCloseButton:)
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
    NSData *data = [self sendSynchronousRequest:request returningResponse:&resp error:&error];
  
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
    NSLog(@"    [initSubviewsWithAudioMode] userStar = %@", userStar);
    NSLog(@"    [initSubviewsWithAudioMode] isUserLoggedIn? %@", isUserLoggedIn ? @"TRUE" : @"FALSE");
    NSLog(@"    [initSubviewsWithAudioMode] ccon_class = %@", cconClassStar);
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
  
    [_contentView addSubview : _topView];
}

#pragma mark - selectors

- (void) pressedCloseButton : (id) sender
{
  ;
}

- (void) pressedRateStarButton
{
  ;
}

- (void) pressedShowButton
{
    [self setPlayerUIHidden : NO];
}

- (void) pressedHideButton
{
    [self setPlayerUIHidden : YES];
}

#pragma mark - Private Methods
// 추후에 Utils 쪽으로 이동시킬 계획입니다.
- (NSData *) sendSynchronousRequest : (NSURLRequest *) request
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

- (void) setPlayerUIHidden : (BOOL) hidden
{
  /*
    NSLog(@"    [setPlayerUIHidden] 이벤트가 발생하여 플레이어 컨트롤러가 사라집니다.");
    self.view.userInteractionEnabled = NO;
    self.view.backgroundColor = hidden ? [UIColor clearColor] : UIColorFromRGB(0x000000, 0.5f);
  
    _contentView.hidden = NO;
    _contentView.alpha = hidden ? 1.f : 0.f;
  
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      _contentView.alpha = hidden ? 0.f : 1.f;
                       
                                      if ( !hidden )
                                      {
                                          [self setPositionScriptToHideView : hidden];
                                      }
                                   }
                     completion : ^(BOOL finished)
                                  {
                                      _contentView.hidden = hidden;
                                      self.view.userInteractionEnabled = YES;
       
                                      if ( hidden )
                                      {
                                          [self setPositionScriptToHideView : hidden];
                                      }
                                  }];
  */
}

- (void) setPositionScriptToHideView : (BOOL) hidden
{
  /*
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
  */
}

#pragma mark - download implementaions

- (void) downloadContent : (NSString * _Nonnull) contentId
  didFinishDownloadingTo : (NSURL * _Nonnull) location
{
}

- (void) downloadContent : (NSString * _Nonnull) contentId
                 didLoad : (CMTimeRange) timeRange
   totalTimeRangesLoaded : (NSArray<NSValue *> * _Nonnull) loadedTimeRanges
 timeRangeExpectedToLoad : (CMTimeRange) timeRangeExpectedToLoad
{
}

- (void)  downloadContent : (NSString * _Nonnull) contentId
didStartDownloadWithAsset : (AVURLAsset * _Nonnull) asset
      subtitleDisplayName : (NSString * _Nonnull) subtitleDisplayName
{
}

- (void) downloadContent : (NSString * _Nonnull) contentId
        didStopWithError : (NSError * _Nullable) error
{
}

- (void) encodeWithCoder : (nonnull NSCoder *) aCoder
{
}

- (void) traitCollectionDidChange : (nullable UITraitCollection *) previousTraitCollection
{
}

- (void) preferredContentSizeDidChangeForChildContentContainer : (nonnull id<UIContentContainer>) container
{
}

- (CGSize) sizeForChildContentContainer : (nonnull id<UIContentContainer>)container
                withParentContainerSize : (CGSize)parentSize
{
    return CGSizeMake(0, 0);
}

- (void) systemLayoutFittingSizeDidChangeForChildContentContainer : (nonnull id<UIContentContainer>) container
{
}

- (void) viewWillTransitionToSize : (CGSize) size
        withTransitionCoordinator : (nonnull id<UIViewControllerTransitionCoordinator>) coordinator
{
}

- (void) willTransitionToTraitCollection : (nonnull UITraitCollection *) newCollection
               withTransitionCoordinator : (nonnull id<UIViewControllerTransitionCoordinator>) coordinator
{
}

- (void) didUpdateFocusInContext : (nonnull UIFocusUpdateContext *) context
        withAnimationCoordinator : (nonnull UIFocusAnimationCoordinator *) coordinator
{
}

- (void) setNeedsFocusUpdate
{
}

- (BOOL) shouldUpdateFocusInContext : (nonnull UIFocusUpdateContext *) context
{
    return false;
}

- (void) updateFocusIfNeeded
{
}

@end
