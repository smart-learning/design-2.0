
#import <UIKit/UIKit.h>
#import "common.h"

@protocol IFScriptControlViewDelegate;

@interface IFScriptControlView : UIView

@property (nonatomic, weak) id <IFScriptControlViewDelegate> delegate;
@end

@protocol IFScriptControlViewDelegate <NSObject>
@optional
- (void) scriptControlView: (IFScriptControlView *) view
           changedFontSize: (id) sender;
@end
