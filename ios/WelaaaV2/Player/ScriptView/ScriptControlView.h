
#import <UIKit/UIKit.h>
#import "common.h"

@protocol ScriptControlViewDelegate;

@interface ScriptControlView : UIView

@property (nonatomic, weak) id <ScriptControlViewDelegate> delegate;
@end

@protocol ScriptControlViewDelegate <NSObject>
@optional
- (void) scriptControlView : (ScriptControlView *) view
           changedFontSize : (id) sender;
@end
