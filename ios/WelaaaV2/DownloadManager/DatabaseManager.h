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

@property (strong, nonatomic) NSString  *databasePath;
@property (nonatomic)         sqlite3   *downloadDB;

+ (DatabaseManager *)sharedInstance;

// 다운로드 받은 콘텐츠에 대한 정보를 DB 에 저장
- (void)saveDownloadedContent:(NSDictionary*)downloadedContent;

// DB 의 모든 목록을 조회해서 리턴(동기식, 비동기식)
- (NSMutableArray *)searchDownloadedContentsAll;
- (void)searchDownloadedContentsAll:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler;

- (NSMutableArray *)searchDownloadedContentsUserId:(NSString *)userId;
- (NSMutableArray *)searchDownloadedContentsUserId:(NSString *)userId groupKey:(NSString *)cid;
- (NSMutableArray *)searchDownloadedContentsGroupKey:(NSString *)gid;

// DB 에서 cid 로 목록을 조회해서 리턴(동기식, 비동기식)
- (NSMutableArray *)searchDownloadedContentsId:(NSString *)cid;
- (void)searchDownloadedContentsId:(NSString *)cid completion:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler;

// DB 에서 파일경로로 목록을 조회해서 리턴(동기식, 비동기식)
- (NSMutableArray*)searchDownloadedContentsPath:(NSString *)contentPath;
- (void)searchDownloadedContentsPath:(NSString *)contentPath completion:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler;

// DB 에서 cid 로 조회한 레코드를 삭제(동기식)
- (void)removeDownloadedContentsId:(NSString *)cid;

// DB 에서 파일경로로 조회한 레코드를 삭제(동기식)
- (void)removeDownloadedContentsPath:(NSString *)contentPath;

@end
