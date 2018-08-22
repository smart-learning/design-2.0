
#import <Foundation/Foundation.h>

#import "DbContentDownloadItemModel.h"
#import "DbContentAudioGroupItemModel.h"
#import "DbContentVideoGroupItemModel.h"
#import <CoreData/CoreData.h>

#import "common.h"

@interface DbManager : NSObject

+ (DbManager *)sharedInstance;

#pragma mark - download Item

- (void) insertItem: (NSDictionary *) item;
- (NSArray *) getDownloadContents;
- (NSArray *) getDownloadContentWithGroupKey: (NSString *) groupkey;
- (NSDictionary *) getDownloadContentWithGroupKey: (NSString *) groupkey
                                             cKey: (NSString *) ckey;
- (NSArray *) getDownloadContentWithClass: (NSString *) con_class;
- (BOOL) hasContentWithCKey: (NSString *) ckey;
- (void) removeDownloadContentWithGroupKey: (NSString *) groupkey;
- (void) removeDownloadContentWithCKey: (NSString *) ckey;

#pragma mark - audio group Items

- (void) insertAudioGroupItem: (NSDictionary *) item
                     groupKey: (NSString *) groupkey;
- (BOOL) hasAudioGroupItemWithGroupKey: (NSString *) gkey;
- (NSArray *) getAllAudioGroupItem;
- (void) removeAudioGroupItemWithGroupKey: (NSString *) gkey;

#pragma mark - video group Items

- (void) insertVideoGroupItem: (NSDictionary *) item
                     groupKey: (NSString *) groupkey;
- (void) removeVideoGroupItemWithGroupKey: (NSString *) groupkey;
- (BOOL) hasVideoGroupItemWithGroupKey: (NSString *) gkey;
- (NSArray *) getAllVideoGroupItem;

@end
