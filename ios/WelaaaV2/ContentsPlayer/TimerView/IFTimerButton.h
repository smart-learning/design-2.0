
#import <UIKit/UIKit.h>
#import "common.h"

@protocol IFTimerButtonDelegate;

@interface IFTimerButton : UIView

@property (nonatomic, weak) id <IFTimerButtonDelegate> delegate;

- (instancetype) initWithFrame: (CGRect) frame
                          time: (NSString *) time;
- (void) setSelected: (BOOL) isSelected;

@end

@protocol IFTimerButtonDelegate <NSObject>
@optional
- (void) timerButton: (IFTimerButton *) button
       didTouchTimer: (NSString *) timeStr;
@end
