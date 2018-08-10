
#import <UIKit/UIKit.h>
#import "common.h"

@protocol ContentPlayerTouchViewDelegate;

@interface ContentPlayerTouchView : UIView

@property (nonatomic, weak) id<ContentPlayerTouchViewDelegate> delegate;
@property (nonatomic, strong) UIColor *selectedColor;
@property (nonatomic, strong) NSString *urlString;

@end

@protocol ContentPlayerTouchViewDelegate <NSObject>
@optional
- (void) puiTouchActionView: (ContentPlayerTouchView *) view
             didTouchAction: (id) sender;

@end
