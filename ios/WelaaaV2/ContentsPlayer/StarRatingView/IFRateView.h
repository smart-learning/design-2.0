
#import <UIKit/UIKit.h>

@protocol IFRateViewDelegate;

typedef enum {
    RateViewAlignmentLeft,
    RateViewAlignmentCenter,
    RateViewAlignmentRight
} RateViewAlignment;


@interface IFRateView : UIView
{
    UIImage *_fullStarImage;
    UIImage *_emptyStarImage;
    CGPoint _origin;
    int _numOfStars;
}

@property(nonatomic, assign) RateViewAlignment alignment;
@property(nonatomic, assign) CGFloat rate;
@property(nonatomic, assign) CGFloat padding;
@property(nonatomic, assign) BOOL editable;
@property(nonatomic, retain) UIImage *fullStarImage;
@property(nonatomic, retain) UIImage *emptyStarImage;
@property(nonatomic, assign) NSObject<IFRateViewDelegate> *delegate;

- (IFRateView *) initWithFrame: (CGRect) rect
                      fullStar: (UIImage *) fullStarImage
                     emptyStar: (UIImage *) emptyStarImage;

@end

@protocol IFRateViewDelegate

- (void) rateView: (IFRateView *) rateView
 changedToNewRate: (NSNumber *) rate;

@end
