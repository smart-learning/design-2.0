
#import <UIKit/UIKit.h>
#import <AVKit/AVKit.h>
#import <Foundation/Foundation.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>

@interface FPSDownloadManager : NSObject <PallyConFPSLicenseDelegate, PallyConFPSDownloadDelegate>

@property (strong, nonatomic) PallyConFPSSDK *fpsSDK;

- (void) downloadSomething : (NSDictionary *) args;  // 테스트를 위해 추가 by Yohan

@end
