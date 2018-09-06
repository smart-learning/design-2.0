
#import <UIKit/UIKit.h>

@protocol StarRatingViewDelegate;

typedef enum {
    RateViewAlignmentLeft,
    RateViewAlignmentCenter,
    RateViewAlignmentRight
} RateViewAlignment;


@interface StarRatingView : UIView
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
@property(nonatomic, assign) NSObject<StarRatingViewDelegate> *delegate;

- (StarRatingView *) initWithFrame : (CGRect) rect
                          fullStar : (UIImage *) fullStarImage
                         emptyStar : (UIImage *) emptyStarImage;

@end

@protocol StarRatingViewDelegate

- (void) rateView : (StarRatingView *) rateView
 changedToNewRate : (NSNumber *) rate;

@end
