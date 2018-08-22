
#import <UIKit/UIKit.h>

#import "IFTouchView.h"

@protocol IFDrmMiniPlayerUiViewDelegate;

@interface IFDrmMiniPlayerUiView : UIView

@property (nonatomic, weak) id <IFDrmMiniPlayerUiViewDelegate> delegate;
@property (nonatomic, assign) BOOL isAuthor;

- (void) reOrderSubviews;
- (void) setControllerColorWithAudioMode: (BOOL) isAudioMode;
- (void) setTitleLabel01: (NSString *) text;
- (void) setPreparedToPlayInfo: (NSDictionary *) info;
- (void) setPlayState: (BOOL) isPlay;
- (void) setSeekbarCurrentValue: (CGFloat) time;
@end

@protocol IFDrmMiniPlayerUiViewDelegate <NSObject>
@optional
- (void) miniPlayerUiView: (IFDrmMiniPlayerUiView *) view
                 openView: (id) sender;

- (void) miniPlayerUiView: (IFDrmMiniPlayerUiView *) view
                  setPlay: (BOOL) isPlay;

- (void) miniPlayerUiView: (IFDrmMiniPlayerUiView *) view
                closeView: (id) sender;
@end
