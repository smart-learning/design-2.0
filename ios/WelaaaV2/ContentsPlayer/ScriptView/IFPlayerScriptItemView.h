
#import <UIKit/UIKit.h>
#import "common.h"

@interface IFPlayerScriptItemView : UIView

- (void) setFontSize;
- (void) setTime: (NSString *) time
          script: (NSString *) script;
- (void) setTextColor: (UIColor *) color;

@end
