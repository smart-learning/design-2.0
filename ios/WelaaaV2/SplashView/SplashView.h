
#import <UIKit/UIKit.h>
#import <AVFoundation/AVFoundation.h>

static void *MyStreamingMovieViewControllerTimedMetadataObserverContext = &MyStreamingMovieViewControllerTimedMetadataObserverContext;
static void *MyStreamingMovieViewControllerRateObservationContext = &MyStreamingMovieViewControllerRateObservationContext;
static void *MyStreamingMovieViewControllerCurrentItemObservationContext = &MyStreamingMovieViewControllerCurrentItemObservationContext;
static void *MyStreamingMovieViewControllerPlayerItemStatusObserverContext = &MyStreamingMovieViewControllerPlayerItemStatusObserverContext;


@protocol SplashViewDelegate;

@interface SplashView : UIView

@property (nonatomic, weak) id <SplashViewDelegate> delegate;

@end

@protocol SplashViewDelegate <NSObject>

@optional

- (void) splashView : (SplashView *) view
    didFinishedPlay : (id) sender;
@end
