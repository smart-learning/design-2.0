//
//  DatabaseManager.m
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "DatabaseManager.h"
#import "Clip.h"

@implementation DatabaseManager

+ (DatabaseManager *)sharedInstance
{
  static DatabaseManager *sharedDatabaseManager = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedDatabaseManager = [[DatabaseManager alloc] init];
  });
  return sharedDatabaseManager;
}


- (instancetype)init
{
  if ( self = [super init] )
  {
    [self createDbIfNeeded];  // DB 가 없을 경우 새로 생성.
  }
  
  return self;
}


- (void)createDbIfNeeded
{
  NSString *docsDir;
  NSArray *dirPaths;
  
  dirPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  
  docsDir = dirPaths[0];
  
  _databasePath = [[NSString alloc] initWithString:[docsDir stringByAppendingPathComponent:@"welaaa.db"]];
  
  NSFileManager *fileManager = [NSFileManager defaultManager];
  
  if([fileManager fileExistsAtPath:_databasePath] == NO){
    const char *dbPath = [_databasePath UTF8String];
    
    if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
      char *errMsg;
      const char *sql_stmt = "CREATE TABLE IF NOT EXISTS DOWNLOAD (_id integer primary key autoincrement, \
      groupkey text not null, \
      ckey text not null, \
      userId text not null, \
      drmSchemeUuid text not null,    \
      drmLicenseUrl text not null,    \
      cid text not null,  \
      oid text not null,  \
      contentPath text not null,  \
      totalSize text, \
      gTitle text not null,   \
      cTitle text not null,   \
      groupImg text not null, \
      thumbnailImg text not null, \
      audioVideoType text not null,   \
      groupTeacherName text not null, \
      cPlayTime text not null,    \
      groupContentScnt text not null, \
      groupAllPlayTime text not null, \
      view_limitdate text not null,   \
      modified text not null  \
      )";
      
      /* 테이블 정보
       _id integer primary key autoincrement,    seq 정보
       groupkey text not null,    groupkey
       ckey text not null,    ckey
       userId text not null,    userId
       drmSchemeUuid text not null,    pallycon drm SchemeUuid
       drmLicenseUrl text not null,    pallycon drm licenseUrl
       cid text not null,    pallycon cid
       oid text not null,    pallycon oid
       contentPath text not null,    콘텐츠 저장 경로
       totalSize text, 용량 정보
       gTitle text not null, 강좌 타이틀 정보
       cTitle text not null, 강의 타이틀 정보
       groupImg text not null,    강좌 썸네일 이미지 경로
       thumbnailImg text not null, 강의 썸네일 이미지 경로
       audioVideoType text not null, 오디오북 or 강좌 정보
       groupTeacherName text not null,    강좌/ 오디오북 저자 정보
       cPlayTime text not null,    콘텐츠 별 개별 재생 시간
       groupContentScnt text not null,    오디오북 전체 갯수
       groupAllPlayTime text not null,    오디오북 전체 재생 시간
       view_limitdate text not null, 유효기간
       modified text not null    업데이트 일자
       */
      
      if (sqlite3_exec(_downloadDB, sql_stmt, NULL, NULL, &errMsg) != SQLITE_OK) {
        // Failed to create table
        NSLog(@"Failed to create DOWNLOAD table");
      }
      sqlite3_close(_downloadDB);
    }else{
      // Failed to open/create database
      NSLog(@"Failed to open/create welaaa.db database");
    }
  }
}


- (void)saveDownloadedContent:(NSDictionary*)downloadedContent
{
  sqlite3_stmt *statement;
  const char *dbPath = [_databasePath UTF8String];
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    
    NSString *insertSQL = [NSString stringWithFormat:@"INSERT INTO DOWNLOAD (groupkey,  \
                           ckey,              \
                           userId,            \
                           drmSchemeUuid,     \
                           drmLicenseUrl,     \
                           cid,               \
                           oid,               \
                           contentPath,       \
                           totalSize,         \
                           gTitle,            \
                           cTitle,            \
                           groupImg,          \
                           thumbnailImg,      \
                           audioVideoType,    \
                           groupTeacherName,  \
                           cPlayTime,         \
                           groupContentScnt,  \
                           groupAllPlayTime,  \
                           view_limitdate,    \
                           modified           \
                           ) VALUES(\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",\"%@\",datetime(\'now\',\'localtime\'))" \
                           ,downloadedContent[@"groupkey"]
                           ,downloadedContent[@"ckey"]
                           ,downloadedContent[@"userId"]
                           ,downloadedContent[@"drmSchemeUuid"]
                           ,downloadedContent[@"drmLicenseUrl"]
                           ,downloadedContent[@"cid"]
                           ,downloadedContent[@"oid"]
                           ,downloadedContent[@"contentPath"]
                           ,downloadedContent[@"totalSize"]
                           ,downloadedContent[@"gTitle"]
                           ,downloadedContent[@"cTitle"]
                           ,downloadedContent[@"groupImg"]
                           ,downloadedContent[@"thumbnailImg"]
                           ,downloadedContent[@"audioVideoType"]
                           ,downloadedContent[@"groupTeacherName"]
                           ,downloadedContent[@"cPlayTime"]
                           ,downloadedContent[@"groupContentScnt"]
                           ,downloadedContent[@"groupAllPlayTime"]
                           ,downloadedContent[@"view_limitdate"]
                           ];
    
    const char *insert_stmt = [insertSQL UTF8String];
    sqlite3_prepare_v2(_downloadDB, insert_stmt, -1, &statement, NULL);
    if(sqlite3_step(statement) == SQLITE_DONE){
      // 성공
      NSLog(@"Success insert to DOWNLOAD table");
    }else{
      // 실패
      NSLog(@"Failed insert to DOWNLOAD table");
    }
    sqlite3_finalize(statement);
    sqlite3_close(_downloadDB);
  }
}


- (NSMutableArray *)searchDownloadedContentsAll{
  
  NSMutableArray* results = [[NSMutableArray alloc] init];
  
  const char *dbPath = [_databasePath UTF8String];
  sqlite3_stmt *statement;
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    NSString *querySQL = [NSString stringWithFormat:@"SELECT _id, cid, cTitle, contentPath, audioVideoType, modified FROM DOWNLOAD"];
    
    const char *query_stmt = [querySQL UTF8String];
    
    if (sqlite3_prepare_v2(_downloadDB, query_stmt, -1, &statement, NULL) == SQLITE_OK) {
      
      while (sqlite3_step(statement) == SQLITE_ROW) {
        NSString *aid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 0)];
        NSString *cid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 1)];
        NSString *cTitle = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 2)];
        NSString *contentPath = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 3)];
        NSString *audioVideoType = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 4)];
        NSString *modified = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 5)];
        
        NSLog(@"_id : %@, cid : %@, cTitle : %@, contentPath : %@, audioVideoType : %@, modified : %@",aid,cid,cTitle,contentPath,audioVideoType,modified);
        
        NSDictionary* dic = [[NSDictionary alloc] initWithObjectsAndKeys:cid,@"cid",cTitle,@"cTitle",contentPath,@"contentPath",audioVideoType,@"audioVideoType",modified,@"modified", nil];
        
        [results addObject:dic];
      }
      sqlite3_finalize(statement);
    }
    
    // TODO : 여기서도 예외처리
    
    sqlite3_close(_downloadDB);
  }else{
    // DB Open Error
    NSLog(@"DB Open Error!");
    return nil;
  }
  
  return results;
}


- (void)searchDownloadedContentsAll:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler
{
  NSMutableArray* results = [[NSMutableArray alloc] init];
  
  const char *dbPath = [_databasePath UTF8String];
  sqlite3_stmt *statement;
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    NSString *querySQL = [NSString stringWithFormat:@"SELECT _id, cid, cTitle, contentPath FROM DOWNLOAD"];
    
    const char *query_stmt = [querySQL UTF8String];
    
    if (sqlite3_prepare_v2(_downloadDB, query_stmt, -1, &statement, NULL) == SQLITE_OK) {
      
      while (sqlite3_step(statement) == SQLITE_ROW) {
        NSString *aid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 0)];
        NSString *cid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 1)];
        NSString *cTitle = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 2)];
        NSString *contentPath = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 3)];
        
        NSLog(@"_id : %@, cid : %@, cTitle : %@, contentPath : %@",aid,cid,cTitle,contentPath);
        
        // TODO : 추출된 데이터를 처리하는 코드
        Clip* clip = [[Clip alloc] initWithTitle:cTitle memo:@"" cid:cid playTime:@"" index:0];
        clip.contentPath = contentPath;
        [results addObject:clip];
      }
      sqlite3_finalize(statement);
    }
    
    // TODO : 여기서도 예외처리
    
    sqlite3_close(_downloadDB);
  }else{
    // DB Open Error
    resultHandler(nil, @"DB Open Error!");
  }
  
  resultHandler(results, nil);
}


- (NSMutableArray *)searchDownloadedContentsId:(NSString *)cid{
  
  NSMutableArray* results = [[NSMutableArray alloc] init];
  
  const char *dbPath = [_databasePath UTF8String];
  sqlite3_stmt *statement;
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    NSString *querySQL = [NSString stringWithFormat:@"SELECT _id, cid, cTitle, contentPath FROM DOWNLOAD WHERE cid=\"%@\"",cid];
    
    const char *query_stmt = [querySQL UTF8String];
    
    if (sqlite3_prepare_v2(_downloadDB, query_stmt, -1, &statement, NULL) == SQLITE_OK) {
      
      while (sqlite3_step(statement) == SQLITE_ROW) {
        NSString *aid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 0)];
        NSString *cid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 1)];
        NSString *cTitle = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 2)];
        NSString *contentPath = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 3)];
        
        NSLog(@"_id : %@, cid : %@, cTitle : %@, contentPath : %@",aid,cid,cTitle,contentPath);
        
        // TODO : 추출된 데이터를 처리하는 코드
        Clip* clip = [[Clip alloc] initWithTitle:cTitle memo:@"" cid:cid playTime:@"" index:0];
        clip.contentPath = contentPath;
        [results addObject:clip];
        
      }
      sqlite3_finalize(statement);
    }
    
    // TODO : 여기서도 예외처리
    
    sqlite3_close(_downloadDB);
  }else{
    // DB Open Error
    NSLog(@"DB Open Error!");
    return nil;
  }
  
  return results;
}


- (void)searchDownloadedContentsId:(NSString *)cid completion:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler{
  
  NSMutableArray* results = [[NSMutableArray alloc] init];
  
  const char *dbPath = [_databasePath UTF8String];
  sqlite3_stmt *statement;
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    NSString *querySQL = [NSString stringWithFormat:@"SELECT _id, cid, cTitle, contentPath FROM DOWNLOAD WHERE cid=\"%@\"",cid];
    
    const char *query_stmt = [querySQL UTF8String];
    
    if (sqlite3_prepare_v2(_downloadDB, query_stmt, -1, &statement, NULL) == SQLITE_OK) {
      
      while (sqlite3_step(statement) == SQLITE_ROW) {
        NSString *aid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 0)];
        NSString *cid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 1)];
        NSString *cTitle = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 2)];
        NSString *contentPath = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 3)];
        
        NSLog(@"_id : %@, cid : %@, cTitle : %@, contentPath : %@",aid,cid,cTitle,contentPath);
        
        // TODO : 추출된 데이터를 처리하는 코드
        Clip* clip = [[Clip alloc] initWithTitle:cTitle memo:@"" cid:cid playTime:@"" index:0];
        clip.contentPath = contentPath;
        [results addObject:clip];
        
      }
      sqlite3_finalize(statement);
    }
    
    // TODO : 여기서도 예외처리
    
    sqlite3_close(_downloadDB);
  }else{
    // DB Open Error
    resultHandler(nil, @"DB Open Error!");
  }
  
  resultHandler(results, nil);
}


- (NSMutableArray*)searchDownloadedContentsPath:(NSString *)contentPath{
  
  NSMutableArray* results = [[NSMutableArray alloc] init];
  
  const char *dbPath = [_databasePath UTF8String];
  sqlite3_stmt *statement;
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    NSString *querySQL = [NSString stringWithFormat:@"SELECT _id, cid, cTitle, contentPath FROM DOWNLOAD WHERE contentPath LIKE \"%%%@\"",contentPath];
    
    const char *query_stmt = [querySQL UTF8String];
    
    if (sqlite3_prepare_v2(_downloadDB, query_stmt, -1, &statement, NULL) == SQLITE_OK) {
      
      while (sqlite3_step(statement) == SQLITE_ROW) {
        NSString *aid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 0)];
        NSString *cid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 1)];
        NSString *cTitle = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 2)];
        NSString *contentPath = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 3)];
        
        NSLog(@"_id : %@, cid : %@, cTitle : %@, contentPath : %@",aid,cid,cTitle,contentPath);
        
        // TODO : 추출된 데이터를 처리하는 코드
        Clip* clip = [[Clip alloc] initWithTitle:cTitle memo:@"" cid:cid playTime:@"" index:0];
        clip.contentPath = contentPath;
        [results addObject:clip];
      }
      sqlite3_finalize(statement);
    }
    
    // TODO : 여기서도 예외처리
    
    sqlite3_close(_downloadDB);
  }else{
    // DB Open Error
    NSLog(@"DB Open Error!");
    return nil;
  }
  
  return results;
}


- (void)searchDownloadedContentsPath:(NSString *)contentPath completion:(void (^)(NSMutableArray* results, NSString* errMsg))resultHandler{
  
  NSMutableArray* results = [[NSMutableArray alloc] init];
  
  const char *dbPath = [_databasePath UTF8String];
  sqlite3_stmt *statement;
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    NSString *querySQL = [NSString stringWithFormat:@"SELECT _id, cid, cTitle, contentPath FROM DOWNLOAD WHERE contentPath LIKE \"%%%@\"",contentPath];
    
    const char *query_stmt = [querySQL UTF8String];
    
    if (sqlite3_prepare_v2(_downloadDB, query_stmt, -1, &statement, NULL) == SQLITE_OK) {
      
      while (sqlite3_step(statement) == SQLITE_ROW) {
        NSString *aid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 0)];
        NSString *cid = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 1)];
        NSString *cTitle = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 2)];
        NSString *contentPath = [[NSString alloc] initWithUTF8String:(const char *)sqlite3_column_text(statement, 3)];
        
        NSLog(@"_id : %@, cid : %@, cTitle : %@, contentPath : %@",aid,cid,cTitle,contentPath);
        
        // TODO : 추출된 데이터를 처리하는 코드
        Clip* clip = [[Clip alloc] initWithTitle:cTitle memo:@"" cid:cid playTime:@"" index:0];
        clip.contentPath = contentPath;
        [results addObject:clip];
      }
      sqlite3_finalize(statement);
    }
    
    // TODO : 여기서도 예외처리
    
    sqlite3_close(_downloadDB);
  }else{
    // DB Open Error
    resultHandler(nil, @"DB Open Error!");
  }
  
  resultHandler(results, nil);
}


- (void)removeDownloadedContentsId:(NSString *)cid{
  
  sqlite3_stmt *statement;
  const char *dbPath = [_databasePath UTF8String];
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    
    NSString *deleteSQL = [NSString stringWithFormat:@"DELETE FROM DOWNLOAD WHERE cid=\"%@\"",cid];
    
    const char *delete_stmt = [deleteSQL UTF8String];
    
    sqlite3_prepare_v2(_downloadDB, delete_stmt, -1, &statement, NULL);
    
    if(sqlite3_step(statement) == SQLITE_DONE){
      // 성공
      NSLog(@"Success DELETE from DOWNLOAD table");
      //self.phone.text = @"";
    }else{
      // 실패
      NSLog(@"Failed DELETE from DOWNLOAD table");
      //self.status.text = @"Failed to add contact";
    }
    sqlite3_finalize(statement);
    sqlite3_close(_downloadDB);
  }
}


- (void)removeDownloadedContentsPath:(NSString *)contentPath{
  
  sqlite3_stmt *statement;
  const char *dbPath = [_databasePath UTF8String];
  
  if(sqlite3_open(dbPath, &_downloadDB) == SQLITE_OK){
    
    NSString *deleteSQL = [NSString stringWithFormat:@"DELETE FROM DOWNLOAD WHERE contentPath LIKE \"%%%@\"",contentPath];
    
    const char *delete_stmt = [deleteSQL UTF8String];
    
    sqlite3_prepare_v2(_downloadDB, delete_stmt, -1, &statement, NULL);
    
    if(sqlite3_step(statement) == SQLITE_DONE){
      // 성공
      NSLog(@"Success DELETE from DOWNLOAD table");
      //self.phone.text = @"";
    }else{
      // 실패
      NSLog(@"Failed DELETE from DOWNLOAD table");
      //self.status.text = @"Failed to add contact";
    }
    sqlite3_finalize(statement);
    sqlite3_close(_downloadDB);
  }
}

@end
