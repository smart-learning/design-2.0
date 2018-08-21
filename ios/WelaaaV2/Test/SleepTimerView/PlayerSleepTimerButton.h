
#import <UIKit/UIKit.h>
#import "common.h"

@protocol PlayerSleepTimerButtonDelegate;

@interface PlayerSleepTimerButton : UIView

@property (nonatomic, weak) id <PlayerSleepTimerButtonDelegate> delegate;

- (instancetype) initWithFrame : (CGRect) frame
                          time : (NSString *) time;
- (void) setSelected : (BOOL) isSelected;

@end

@protocol PlayerSleepTimerButtonDelegate <NSObject>
@optional
- (void) playerSleepTimerButton : (PlayerSleepTimerButton *) button
                  didTouchTimer : (NSString *) timeStr;
@end
