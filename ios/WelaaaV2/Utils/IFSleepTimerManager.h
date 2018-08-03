
#import "NSTimer+Blocks.h"
#import "common.h"

@protocol IFSleepTimerManagerDelegate;

@interface IFSleepTimerManager : NSObject

@property (nonatomic, weak) id <IFSleepTimerManagerDelegate> delegate;
@property (nonatomic, assign) BOOL isAlive;
@property (nonatomic, assign) BOOL isStopEpisodeMode;

+ (IFSleepTimerManager *) sharedInstance;

- (void)startTimer: (NSDate *) stopDate
   stopEpisodeMode: (BOOL) isStop;

- (void)stopTimer;

@end

@protocol IFSleepTimerManagerDelegate <NSObject>
@optional
- (void) secondFromSleepTimerManager: (NSInteger) second;
- (void) finishFromSleepTimerManager;
@end
