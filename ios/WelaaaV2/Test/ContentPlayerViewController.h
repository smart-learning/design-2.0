
#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>

#import "common.h"

@interface ContentPlayerViewController : UIViewController <PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate>

@property (strong, nonatomic) PallyConFPSSDK *fpsSDK;
@property AVPlayerLayer *playerLayer;
- (void) setContentData : (NSDictionary *) args;

@end
