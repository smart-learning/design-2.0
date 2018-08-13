
#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>

#import "common.h"
#import "UIImage+TintColor.h"
#import "ContentPlayerButton.h"
#import "IFSleepTimerManager.h"
#import "ApiManager.h"
#import "UIAlertController+Showable.h"
#import "StarRatingView.h"

@interface ContentPlayerViewController : UIViewController <PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate>

@property (strong, nonatomic) PallyConFPSSDK *fpsSDK;
@property AVPlayerLayer *playerLayer;
@property (nonatomic, assign) BOOL isDownloadFile;

- (void) setContentData : (NSDictionary *) args;

- (void) downloadSomething : (NSDictionary *) args;  // 테스트를 위해 추가 by Yohan

@end