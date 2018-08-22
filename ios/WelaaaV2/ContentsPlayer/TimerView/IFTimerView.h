
#import <UIKit/UIKit.h>
#import "common.h"

#import "IFTimerButton.h"
#import "UIImage+TintColor.h"

@protocol IFTimerViewDelegate;

@interface IFTimerView : UIView

@property (nonatomic, weak) id <IFTimerViewDelegate> delegate;

@end

@protocol IFTimerViewDelegate <NSObject>
@optional
- (void) timerView: (IFTimerView *) view
         closeView: (id) sender;
- (void) timerView: (IFTimerView *) view
   didSelectedTime: (NSString *) time;

@end
