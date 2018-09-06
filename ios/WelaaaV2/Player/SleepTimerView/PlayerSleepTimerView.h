
#import <UIKit/UIKit.h>
#import "common.h"

#import "PlayerSleepTimerButton.h"
#import "UIImage+TintColor.h"

@protocol PlayerSleepTimerViewDelegate;

@interface PlayerSleepTimerView : UIView

@property (nonatomic, weak) id <PlayerSleepTimerViewDelegate> delegate;

@end

@protocol PlayerSleepTimerViewDelegate <NSObject>
@optional
- (void) playerSleepTimerView : (PlayerSleepTimerView *) view
                    closeView : (id) sender;
- (void) playerSleepTimerView : (PlayerSleepTimerView *) view
              didSelectedTime : (NSString *) time;

@end
