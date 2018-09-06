
#import <UIKit/UIKit.h>

#import "PlayerScriptItemView.h"
#import "common.h"

@interface PlayerScriptCell : UITableViewCell

+ (CGFloat) heightWithTime : (NSString *) time
                      text : (NSString *) text
               screenWidth : (CGFloat) screenWidth
                  fontSize : (CGFloat) fontsize;
- (void) setTime : (NSString *) time
          script : (NSString *) script;
- (void) setTextColor : (UIColor *) color;

@end
