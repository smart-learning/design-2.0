
#import "NSTimer+Blocks.h"

@implementation NSTimer (Blocks)

+ (id) scheduledTimerWithTimeInterval: (NSTimeInterval) inTimeInterval
                                block: (void (^)(void)) inBlock
                              repeats: (BOOL) inRepeats
{
    void (^block)(void) = [inBlock copy];
    id ret = [self scheduledTimerWithTimeInterval: inTimeInterval
                                           target: self
                                         selector: @selector(jdExecuteSimpleBlock:)
                                         userInfo: block
                                          repeats: inRepeats];
  //[block release];
    
    return ret;
}

+ (id) timerWithTimeInterval: (NSTimeInterval) inTimeInterval
                       block: (void (^)(void))inBlock
                     repeats: (BOOL)inRepeats
{
    void (^block)(void) = [inBlock copy];
    id ret = [self timerWithTimeInterval: inTimeInterval
                                  target: self
                                selector: @selector(jdExecuteSimpleBlock:)
                                userInfo: block
                                 repeats: inRepeats];
  //[block release];
    
    return ret;
}

+( void) jdExecuteSimpleBlock: (NSTimer *) inTimer;
{
    if ( [inTimer userInfo] )
    {
        void (^block)(void) = (void (^)(void))[inTimer userInfo];
        block();
    }
}

@end
