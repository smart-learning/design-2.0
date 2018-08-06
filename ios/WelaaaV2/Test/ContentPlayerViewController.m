
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
  //self.view.backgroundColor = [UIColor greenColor];
  
  NSLog(@"  type          : %@", [_args objectForKey : @"type"]); // streaming or download
  NSLog(@"  uri           : %@", [_args objectForKey : @"uri"]);  // content path
  NSLog(@"  name          : %@", [_args objectForKey : @"name"]);
  NSLog(@"  drmSchemeUuid : %@", [_args objectForKey : @"drmSchemeUuid"]);
  NSLog(@"  drmLicenseUrl : %@", [_args objectForKey : @"drmLicenseUrl"]);
  NSLog(@"  userId        : %@", [_args objectForKey : @"userId"]);
  NSLog(@"  cid           : %@", [_args objectForKey : @"cid"]);
  NSLog(@"  oid           : %@", [_args objectForKey : @"oid"]);
  NSLog(@"  token         : %@", [_args objectForKey : @"token"]);
  NSLog(@"  webToken      : %@", [_args objectForKey : @"webToken"]);
  
  
  // 1. initialize a PallyConFPS SDK. PallyConFPS SDK 객체를 생성합니다.
  _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                            siteKey : PALLYCON_SITE_KEY
                                 fpsLicenseDelegate : self
                                              error : nil             ];
  
  
}

- (void) viewDidAppear : (BOOL) animated
{
  //////
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
  AVPlayerViewController *playerController = [AVPlayerViewController new];
  playerController.player = player;
  //playerController.videoGravity = AVLayerVideoGravityResize;            // 가로세로 비율을 무시하고 레이어의 경계를 채우기 위해 비디오를 늘리도록 지정합니다.
  playerController.videoGravity = AVLayerVideoGravityResizeAspect;      // 가로세로 비율을 유지하고 비디오를 레이어의 경계 내에 맞출 수 있도록 지정합니다.
  //playerController.videoGravity = AVLayerVideoGravityResizeAspectFill;  // 가로세로 비율을 유지하고 레이어의 경계를 채우도록 지정합니다.
  
  playerController.showsPlaybackControls = YES; // NO : 재생 컨트롤 UI컴포넌트가 나오지 않음.
  
  [self presentViewController : playerController
                     animated : YES
                   completion : nil];
  
  [ [NSNotificationCenter defaultCenter] addObserver : self
                                            selector : @selector(videoPlayBackDidFinish:)
                                                name : AVPlayerItemDidPlayToEndTimeNotification
                                              object : [playerController.player currentItem]  ];
  
  
  [playerController.player play];   // 플레이어 재생 실행
  //[playerController.player setRate : 14.0]; // 시작 시간 위치
  //[playerController.player setMuted : true];
  //[playerController.player pause];  // 플레이어 재생 정지
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
  
  //[self.avVideoController.view removeFromSuperview];
  //self.avVideoController = nil;
  UIAlertController *alertController;
  alertController = [ UIAlertController alertControllerWithTitle : @"Video Playback"
                                                         message : @"Just finished the video playback. The video is now removed."
                                                  preferredStyle : UIAlertControllerStyleAlert                                  ];
  
  UIAlertAction *okayAction = [ UIAlertAction actionWithTitle : @"OK"
                                                        style : UIAlertActionStyleDefault
                                                      handler : nil                     ];
  [alertController addAction : okayAction];
  [self presentViewController:alertController animated:YES completion:nil];
}

@end
