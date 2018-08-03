
#import <Foundation/Foundation.h>

#import "ApiManager.h"
//#import "AquaNManagerSDK.h"
#import "LogManager.h"
#import "DbManager.h"

@protocol downloadManagerDelegate;

@interface DownloadManager : NSObject

+ (DownloadManager *)sharedInstance;

@property (nonatomic, weak) id <downloadManagerDelegate> delegate;
- (NSArray *) getDownloadList;
- (void) findDownloadInfomationFromCkeys: (NSArray *) ckeys;
- (void) readyForDownloadWithGroupKey: (NSString *) groupkey;
- (void) setReadyObject: (NSDictionary *) object
               groupKey: (NSString *) groupKey;
- (void) insertDownloadWithContentKey: (NSString *) cKey;

- (BOOL) checkCurrentDownloadingWithGkey: (NSString *) gkey
                                    ckey: (NSString *) ckey;
- (BOOL) checkHasDownloadingWithGkey: (NSString *) gkey
                                ckey: (NSString *) ckey;

@end

@protocol downloadManagerDelegate <NSObject>
@optional
- (void) downloadManager: (DownloadManager *) manager
            alertMessage: (NSString *) message;
- (void)   downloadManager: (DownloadManager *) manager
finishDownloadWithGroupKey: (NSString *) groupkey
                      ckey: (NSString *) ckey
                      path: (NSString *) path;
@end
