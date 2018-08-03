
#import "ApiManager.h"
#import "common.h"

@interface LogManager : NSObject

+ (LogManager *) sharedInstance;

- (void) sendLogWithContentKey: (NSString *) cKey
                           sec: (NSInteger) sec
                         force: (BOOL) force;

- (void) sendLogWithGroupKey: (NSString *) gKey
                  contentKey: (NSString *) cKey
                      status: (NSString *) contentStatus
                  downloaded: (BOOL) isDownloadFile
                startingTime: (NSInteger) startingTime
                  endingTime: (NSInteger) endingTime;

@end
