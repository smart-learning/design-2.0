#import <UIKit/UIKit.h>

#import "IFPlayerScriptItemView.h"
#import "IFPlayerScriptCell.h"
#import "IFScriptControlView.h"

typedef NS_ENUM (NSInteger, IfMediaPlayerScriptViewMode)
{
    IfMediaPlayerScriptViewModeNone,
    IfMediaPlayerScriptViewModeText,
    IfMediaPlayerScriptViewModeList
};

@protocol IFMediaPlayerScriptViewDelegate;

@interface IFMediaPlayerScriptView : UIView

@property (nonatomic, weak) id <IFMediaPlayerScriptViewDelegate> delegate;
@property (nonatomic, assign) NSInteger status;

- (void) setScript: (NSArray *) script;
- (void) setCurrentTime: (NSTimeInterval) time;

@end

@protocol IFMediaPlayerScriptViewDelegate <NSObject>
@optional
- (void) mediaPlayerScriptView: (IFMediaPlayerScriptView *) view
                  statusChange: (IfMediaPlayerScriptViewMode) mode;
@end

