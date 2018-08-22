
#import <UIKit/UIKit.h>

#import "IFPlayerScriptItemView.h"
#import "common.h"

@interface IFPlayerScriptCell : UITableViewCell

+ (CGFloat) heightWithTime: (NSString *) time
                      text: (NSString *) text
               screenWidth: (CGFloat) screenWidth
                  fontSize: (CGFloat) fontsize;
- (void) setTime: (NSString *) time
          script: (NSString *) script;
- (void) setTextColor: (UIColor *) color;

@end
