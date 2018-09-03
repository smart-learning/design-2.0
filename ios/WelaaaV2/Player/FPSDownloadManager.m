
#import "FPSDownloadManager.h"

#define PALLYCON_SITE_ID    @"O8LD"
#define PALLYCON_SITE_KEY   @"YxIe3SrPPWWH6hHPkJdG1pUewkB1T6Y9"

@implementation FPSDownloadManager

- (void) downloadSomething : (NSDictionary *) args
{
  
  NSLog(@"downloadSomething");
  // 1. initialize a PallyConFPS SDK. PallyConFPS SDK 객체를 생성합니다.
  _fpsSDK = [ [PallyConFPSSDK alloc] initWithSiteId : PALLYCON_SITE_ID
                                            siteKey : PALLYCON_SITE_KEY
                                 fpsLicenseDelegate : self
                                              error : nil             ];
  
  NSURL *contentUrl = [ NSURL URLWithString : [args objectForKey : @"uri"] ]; // CONTENT_PATH
  NSLog(@"contentUrl : %@", [contentUrl absoluteString]);
  
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

#pragma mark - FPS License implementaions

- (void) fpsLicenseDidSuccessAcquiringWithContentId : (NSString * _Nonnull) contentId
{
  NSLog(@"fpsLicenseDidSuccessAcquiringWithContentId (%@)", contentId);
}

- (void) fpsLicenseWithContentId : (NSString * _Nonnull) contentId
                didFailWithError : (NSError * _Nonnull) error
{
  NSLog(@"fpsLicenseWithContentId. Error Message (%@)", error.localizedDescription);
}

#pragma mark - download implementaions

- (void) downloadContent : (NSString * _Nonnull) contentId
  didFinishDownloadingTo : (NSURL * _Nonnull) location
{
  NSLog(@"download contentId : %@, location : %@",contentId, location.absoluteString);
  
}

- (void) downloadContent : (NSString * _Nonnull) contentId
                 didLoad : (CMTimeRange) timeRange
   totalTimeRangesLoaded : (NSArray<NSValue *> * _Nonnull) loadedTimeRanges
 timeRangeExpectedToLoad : (CMTimeRange) timeRangeExpectedToLoad
{
  NSLog(@"download totalTimeRangesLoaded : ");
}

- (void)  downloadContent : (NSString * _Nonnull) contentId
didStartDownloadWithAsset : (AVURLAsset * _Nonnull) asset
      subtitleDisplayName : (NSString * _Nonnull) subtitleDisplayName
{
  NSLog(@"download contentId : %@, didStartDownloadWithAsset : %@",contentId, asset.URL.absoluteString);
}

- (void) downloadContent : (NSString * _Nonnull) contentId
        didStopWithError : (NSError * _Nullable) error
{
  NSLog(@"download contentId : %@, error code : %ld",contentId, [error code]);
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
