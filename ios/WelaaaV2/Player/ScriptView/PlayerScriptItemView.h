
#import <UIKit/UIKit.h>
#import "common.h"

@interface PlayerScriptItemView : UIView

- (void) setFontSize;
- (void) setTime : (NSString *) time
          script : (NSString *) script;
- (void) setTextColor : (UIColor *) color;

@end
