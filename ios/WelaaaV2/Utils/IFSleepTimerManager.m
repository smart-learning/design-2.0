
#import "IFSleepTimerManager.h"

@interface IFSleepTimerManager ()
{
    NSTimer *_stopWatchTimer;
}

@end

@implementation IFSleepTimerManager

+ (IFSleepTimerManager *) sharedInstance
{
    static IFSleepTimerManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[IFSleepTimerManager alloc] init];
    });
    
    return sharedInstance;
}

- (void) startTimer: (NSDate *) stopDate
    stopEpisodeMode: (BOOL) isStop
{
    self.isAlive = YES;
    self.isStopEpisodeMode = isStop;
    
    [self invalidateStopWatch];

    if ( isStop )
    {
        //에피소드모드일 경우에는 타이머를 실행하지 않음.
        return ;
    }
    
    _stopWatchTimer = [NSTimer scheduledTimerWithTimeInterval: 1.f
                                                        block: ^{
                                                                    [self runTimer: stopDate];
                                                                }
                                                      repeats: YES];
    [[NSRunLoop currentRunLoop] addTimer: _stopWatchTimer
                                 forMode: NSRunLoopCommonModes];
}

- (void) runTimer: (NSDate *) stopDate
{
    NSDate *nowDate = [NSDate date];
    
    //현재시간과 이벤트시간을 비교하여 지나간 이벤트인지 확인한다.
    NSInteger second = [common getDistanceDateWithStartDate: nowDate
                                                    EndDate: stopDate];
    
    if ( [self.delegate respondsToSelector: @selector(secondFromSleepTimerManager:)] )
    {
        [self.delegate secondFromSleepTimerManager: second];
    }
    
    if ( second <= 0 )
    {
        if ( [self.delegate respondsToSelector: @selector(finishFromSleepTimerManager)] )
        {
            [self.delegate finishFromSleepTimerManager];
        }

        [self stopTimer];
    }
}

- (void) stopTimer
{
    [self invalidateStopWatch];
    
    self.delegate = nil;
    self.isAlive = NO;
    self.isStopEpisodeMode = NO;
}

- (void) invalidateStopWatch
{
    if ( _stopWatchTimer.isValid )
    {
        [_stopWatchTimer invalidate];
        _stopWatchTimer = nil;
    }
}

@end
