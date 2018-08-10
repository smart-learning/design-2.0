
#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>

#import "common.h"
#import "UIImage+TintColor.h"
#import "ContentPlayerButton.h"
#import "IFSleepTimerManager.h"

@interface ContentPlayerViewController : UIViewController <PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate>

@property (strong, nonatomic) PallyConFPSSDK *fpsSDK;
@property AVPlayerLayer *playerLayer;
@property (nonatomic, assign) BOOL isDownloadFile;

- (void) setContentData : (NSDictionary *) args;

@end
