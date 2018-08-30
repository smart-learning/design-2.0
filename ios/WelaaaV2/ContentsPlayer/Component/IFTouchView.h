
#import <UIKit/UIKit.h>
#import "common.h"

@protocol IFTouchViewDelegate;

@interface IFTouchView : UIView

@property (nonatomic, weak) id<IFTouchViewDelegate> delegate;
@property (nonatomic, strong) UIColor *selectedColor;
@property (nonatomic, strong) NSString *urlString;

@end

@protocol IFTouchViewDelegate <NSObject>
@optional
- (void) puiTouchActionView: (IFTouchView *) view
             didTouchAction: (id) sender;

@end
