
#import <UIKit/UIKit.h>

#import "IFDrmPlayer.h"
#import "IFSleepTimerManager.h"
#import "ApiManager.h"
#import "LogManager.h"
#import "DbManager.h"
#import "DownloadManager.h"

typedef NS_ENUM(NSUInteger, IFContentsPlayerScreenMode)
{
    IFContentsPlayerScreenModeFullScreen,
    IFContentsPlayerScreenModeMiniPlayer
};

@protocol IFContentsPlayerViewDelegate;

@class IFRecommendViewController;

@interface IFContentsPlayerView : UIView

@property (nonatomic, weak) id <IFContentsPlayerViewDelegate> delegate;
@property (nonatomic, assign) IFContentsPlayerScreenMode screenMode;
@property (nonatomic, assign) BOOL isAuthor;
@property (strong, nonatomic) IFRecommendViewController *recommendViewController;

- (instancetype) initWithFrame: (CGRect) frame;

- (void) startWithGroupKey: (NSString *) groupKey
                      cKey: (NSString *) cKey;

- (void) restartWithGroupKey: (NSString *) groupKey
                        cKey: (NSString *) cKey;

- (void) rotateLayoutSubviews: (CGSize) size;

@end

@protocol IFContentsPlayerViewDelegate <NSObject>
@optional

- (void) contentsPlayerView: (IFContentsPlayerView *) view
     changedStatusbarHidden: (BOOL) hidden;

@end
