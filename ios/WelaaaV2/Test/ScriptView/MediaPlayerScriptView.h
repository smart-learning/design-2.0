#import <UIKit/UIKit.h>

#import "PlayerScriptItemView.h"
#import "PlayerScriptCell.h"
#import "ScriptControlView.h"

typedef NS_ENUM (NSInteger, MediaPlayerScriptViewMode)
{
    MediaPlayerScriptViewModeNone,
    MediaPlayerScriptViewModeText,
    MediaPlayerScriptViewModeList
};

@protocol MediaPlayerScriptViewDelegate;

@interface MediaPlayerScriptView : UIView

@property (nonatomic, weak) id <MediaPlayerScriptViewDelegate> delegate;
@property (nonatomic, assign) NSInteger status;

- (void) setScript : (NSArray *) script;
- (void) setCurrentTime : (NSTimeInterval) time;

@end

@protocol MediaPlayerScriptViewDelegate <NSObject>
@optional
- (void) mediaPlayerScriptView : (MediaPlayerScriptView *) view
                  statusChange : (MediaPlayerScriptViewMode) mode;
@end

