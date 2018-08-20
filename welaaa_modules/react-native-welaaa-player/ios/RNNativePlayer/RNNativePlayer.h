#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>

@interface RNNativePlayer : NSObject <RCTBridgeModule, PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate>

@property (strong, nonatomic) PallyConFPSSDK *fpsSDK;

@end
