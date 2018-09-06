
#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>
#import <Toast/UIView+Toast.h>

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

typedef NS_ENUM(NSUInteger, ContentsPlayerScreenMode)
{
    ContentsPlayerScreenModeFullScreen,
    ContentsPlayerScreenModeMiniPlayer
};

@class IFRecommendViewController;

@interface ContentPlayerViewController : UIViewController <PallyConFPSLicenseDelegate>

@property (strong, nonatomic) PallyConFPSSDK *fpsSDK;
@property AVPlayerLayer *playerLayer;
@property (nonatomic, assign) ContentsPlayerScreenMode screenMode;
@property (nonatomic, assign) BOOL isDownloadFile;
@property (nonatomic, assign) BOOL isMiniPlayer;
@property (strong, nonatomic) IFRecommendViewController *recommendViewController;

- (void) setContentData : (NSDictionary *) args;

@end
