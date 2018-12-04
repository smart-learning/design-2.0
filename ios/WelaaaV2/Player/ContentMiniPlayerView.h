
#import <UIKit/UIKit.h>

#import "ContentPlayerTouchView.h"

@protocol ContentMiniPlayerViewDelegate;

@interface ContentMiniPlayerView : UIView

@property (nonatomic, weak) id <ContentMiniPlayerViewDelegate> delegate;
@property (nonatomic, assign) BOOL isAuthor;

- (void) reOrderSubviews;
- (void) setControllerColorWithAudioMode : (BOOL) isAudioMode;
- (void) setTitleLabel00 : (NSString *) text;
- (void) setTitleLabel01 : (NSString *) text;
- (void) setPreparedToPlayInfo : (NSDictionary *) info;
- (void) setPlayState : (BOOL) isPlay;
- (void) setSeekbarCurrentValue : (CGFloat) time;
@end

@protocol ContentMiniPlayerViewDelegate <NSObject>
@optional
- (void) miniPlayerUiView : (ContentMiniPlayerView *) view
                 openView : (id) sender;

- (void) miniPlayerUiView : (ContentMiniPlayerView *) view
                  setPlay : (BOOL) isPlay;

- (void) miniPlayerUiView : (ContentMiniPlayerView *) view
                closeView : (id) sender;
@end
