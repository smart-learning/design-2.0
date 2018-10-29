
#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <MediaPlayer/MediaPlayer.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>
#import <Toast/UIView+Toast.h>
#import <SDWebImage/UIImageView+WebCache.h>

#import "common.h"
#import "UIImage+TintColor.h"
#import "ContentPlayerButton.h"
#import "IFSleepTimerManager.h"
#import "PlayerSleepTimerView.h"
#import "ContentsListPopupView.h"
#import "ApiManager.h"
#import "UIAlertController+Showable.h"
#import "StarRatingView.h"
#import "MediaPlayerScriptView.h"
#import "ContentMiniPlayerView.h"
#import "FPSDownloadManager.h"
#import "AppDelegate.h"
#import "IFRecommendViewController.h"
#import "Clip.h"

typedef NS_ENUM(NSUInteger, ContentsPlayerScreenMode)
{
    ContentsPlayerScreenModeFullScreen,
    ContentsPlayerScreenModeMiniPlayer
};

@class IFRecommendViewController;

@interface ContentPlayerViewController : UIViewController < ContentPlayerButtonDelegate, IFSleepTimerManagerDelegate,
                                                            PlayerSleepTimerViewDelegate, ContentsListPopupViewDelegate,
                                                            MediaPlayerScriptViewDelegate, ContentMiniPlayerViewDelegate,
                                                            PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate, FPSDownloadDelegate >
{
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
  
    BOOL _isAudioMode;
    BOOL _touchDragging;            // 슬라이더 프로퍼티.
    BOOL _holdTouchDragging;        // 슬라이더 프로퍼티.
    BOOL _isPlaybackContollerHidden;// 재생 컨트롤 UI 모듈 감춤 or 표시.
    BOOL _isAuthor;                 // 유저의 콘텐트에 대한 권한.
    BOOL _isAudioContent;           // 오디오북
    BOOL _isDailyBook;              // 매일 책 한권
  
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
    NSString *_currentLectureTitle; // 현재 재생중인 소제목명. 플레이어가 처음 구동되거나 playNext를 실행할때마다 변경해야 합니다.
  
    AVPlayer *_player;
    AVPlayerItem *_playerItem;
    AVURLAsset *_urlAsset;
  
    CGFloat _playbackRate;
    CGFloat _currentPlaybackDuration;
  
    NSTimer *_seekTimer;
    NSTimer *_logTimer;
}

@property (strong, nonatomic) PallyConFPSSDK *fpsSDK;
@property AVPlayerLayer *playerLayer;
@property (nonatomic, assign) ContentsPlayerScreenMode screenMode;
@property (nonatomic, assign) NSString * downloadedFilePath;
@property (nonatomic, assign) BOOL isDownloadFile;
@property (nonatomic, assign) BOOL isMiniPlayer;
@property (strong, nonatomic) IFRecommendViewController *recommendViewController;
@property (strong, nonatomic) FPSDownloadManager *fpsDownloadManager;


- (void) setContentData : (NSDictionary *) args;
- (void) closePlayer;

@end
