
#import <UIKit/UIKit.h>
#import <Toast/UIView+Toast.h>
#import <SDWebImage/UIImageView+WebCache.h>

#import "UIImage+TintColor.h"
#import "UIActionSheet+Blocks.h"
#import "ApiManager.h"
#import "IFPlayerButton.h"
#import "IFMediaPlayerScriptView.h"
#import "IFPlayListPopupView.h"
#import "IFSleepTimerManager.h"
#import "IFTimerView.h"
#import "DownloadManager.h"
#import "LogManager.h"

@protocol IFDrmPlayerUiViewDelegate;

@interface IFDrmPlayerUiView : UIView

@property (nonatomic, weak) id <IFDrmPlayerUiViewDelegate> delegate;
@property (nonatomic, assign) BOOL isPossibleAudioMode;
@property (nonatomic, assign) BOOL isDownloadFile;
@property (nonatomic, assign) BOOL isDownloading;
@property (nonatomic, assign) BOOL isAuthor;

- (instancetype) initWithFrame: (CGRect) frame
                   isAudioMode: (BOOL) isAudioMode
                      isAuthor: (BOOL) isAuthor
                          ckey: (NSString *) ckeyToQuery;

- (void) reOrderSubviews;

- (void) setGkey: (NSString *) gkey
            ckey: (NSString *) ckey;
- (void) setTitleLabel01: (NSString *) text;
- (void) setTitleLabel02: (NSString *) text;
- (void) setAudioContentBackgroundImageUrl: (NSString *) url;
- (void) setScriptArray: (NSArray *) scriptArray;

- (void) setPreparedToPlayInfo: (NSDictionary *) info;
- (void) setPlayState: (BOOL) isPlay;
- (void) setCurrentTime: (CGFloat) time
            forceChange: (BOOL) forceChange;
- (void) setTotalTime: (CGFloat) time;
- (void) setSeekbarCurrentValue: (CGFloat) value;

@end

@protocol IFDrmPlayerUiViewDelegate <NSObject>
@optional
- (void) playerUiView: (IFDrmPlayerUiView *) view
            closeView: (id) sender;

- (void) playerUiView: (IFDrmPlayerUiView *) view
              setPlay: (BOOL) isPlay;

- (void) playerUiView: (IFDrmPlayerUiView *) view
                setRW: (NSTimeInterval) time;

- (void) playerUiView: (IFDrmPlayerUiView *) view
                setFF: (NSTimeInterval) time;

- (void) playerUiView: (IFDrmPlayerUiView *) view
             setSpeed: (CGFloat) speed;

- (void) playerUiView: (IFDrmPlayerUiView *) view
      seekbarDragging: (NSTimeInterval) time;

- (void) playerUiView: (IFDrmPlayerUiView *) view
       seekbarDragEnd: (NSTimeInterval) time;

- (void) playerUiView: (IFDrmPlayerUiView *) view
         changeToMode: (BOOL) isAudioMode;

- (void) setSeekbarCurrentValue: (CGFloat) value;

- (NSString *) playerUiView: (IFDrmPlayerUiView *) view
              getGroupTitle: (id)sender;

- (NSArray *) playerUiView: (IFDrmPlayerUiView *) view
            getContentList: (id)sender;

- (NSInteger) playerUiView: (IFDrmPlayerUiView *) view
           getCurrentIndex: (id)sender;

- (void) playerUiView: (IFDrmPlayerUiView *) view
   selectedOtherIndex: (NSInteger)index;

- (void) playerUiView: (IFDrmPlayerUiView *) view
 changeToDownloadFile: (BOOL) isAudioMode;

@end
