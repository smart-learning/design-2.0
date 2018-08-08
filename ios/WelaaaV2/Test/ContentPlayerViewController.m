
#import "ContentPlayerViewController.h"

#import "AppDelegate.h"

#define PALLYCON_SITE_ID    @"O8LD"
#define PALLYCON_SITE_KEY   @"YxIe3SrPPWWH6hHPkJdG1pUewkB1T6Y9"

@interface ContentPlayerViewController()
@end

@implementation ContentPlayerViewController
NSDictionary *_args;

- (void) viewDidLoad
{
  [super viewDidLoad];
  // Do any additional setup after loading the view from its nib.
  [self.view setBackgroundColor : [UIColor grayColor]];
  // PallyConFPS SDK 객체를 생성합니다.
  _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                            siteKey : PALLYCON_SITE_KEY
                                 fpsLicenseDelegate : self
                                              error : nil             ];
}

- (void) viewDidAppear : (BOOL) animated
{
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
  _playerController = [[AVPlayerViewController alloc] init];
  _playerController.player = player;
  //playerController.videoGravity = AVLayerVideoGravityResize;            // 가로세로 비율을 무시하고 레이어의 경계를 채우기 위해 비디오를 늘리도록 지정합니다.
  _playerController.videoGravity = AVLayerVideoGravityResizeAspect;      // 가로세로 비율을 유지하고 비디오를 레이어의 경계 내에 맞출 수 있도록 지정합니다.
  //playerController.videoGravity = AVLayerVideoGravityResizeAspectFill;  // 가로세로 비율을 유지하고 레이어의 경계를 채우도록 지정합니다.
  
  _playerController.showsPlaybackControls = NO; // NO : 재생 컨트롤 UI컴포넌트가 나오지 않음.
  
  [self presentViewController : _playerController
                     animated : YES
                   completion : nil];
  
  [ [NSNotificationCenter defaultCenter] addObserver : self
                                            selector : @selector(videoPlayBackDidFinish:)
                                                name : AVPlayerItemDidPlayToEndTimeNotification
                                              object : [_playerController.player currentItem]  ];
  
  
  [_playerController.player play];   // 플레이어 재생 실행
  //[playerController.player setRate : 14.0]; // 시작 시간 위치
  //[playerController.player setMuted : true];
  //[playerController.player pause];  // 플레이어 재생 정지
  
  
  
  UIButton *sampleButton = [UIButton buttonWithType : UIButtonTypeCustom];
  [sampleButton setFrame : CGRectMake(20, 10, 52, 52)];
  [sampleButton setTitle : @"Button Title"
                forState : UIControlStateNormal];
  [_playerController.view addSubview : sampleButton];
  
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
  
  _playerController.player = nil;
  //[self.playerController.view removeFromSuperview];
  //self.avVideoController = nil;
  
  [self.presentingViewController dismissViewControllerAnimated:YES completion:nil];  // playerController를 닫습니다.
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
