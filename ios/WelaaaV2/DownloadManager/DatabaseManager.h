//
//  DatabaseManager.h
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <sqlite3.h>

@interface DatabaseManager : NSObject

@property (strong, nonatomic) NSString *databasePath;
@property (nonatomic) sqlite3 *downloadDB;

+ (DatabaseManager *)sharedInstance;
- (void)saveDownloadedContent:(NSDictionary*)downloadedContent;
- (void)searchDownloadedContentsAll:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler;
- (void)searchDownloadedContents:(NSString *)cid completion:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler;
- (void)removeDownloadedContents:(NSString *)cid;

@end
