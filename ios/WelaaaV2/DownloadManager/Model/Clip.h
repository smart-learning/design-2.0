//
//  Clip.h
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Clip : NSObject
{
  NSString* cTitle;
  NSString* memo;
  NSString* cid;
  double totalSec;
  int index;
  BOOL downloaded;
  NSURL* contentUrl;
  NSString* contentPath;
  // DB 에 삽입하기 위한 부가정보들에 대한 변수
  NSString* groupkey;
  NSString* ckey;
  NSString* userId;
  NSString* drmSchemeUuid;
  NSString* drmLicenseUrl;
  NSString* oid;
  NSString* totalSize;
  NSString* gTitle;
  NSString* groupImg;
  NSString* thumbnailImg;
  NSString* audioVideoType;
  NSString* groupTeacherName;
  NSString* cPlayTime;
  NSString* groupContentScnt;
  NSString* groupAllPlayTime;
  NSString* view_limitdate;
  NSString* modified;
  NSNumber* cPlaySeconds;
}

@property NSString* cTitle;
@property NSString* memo;
@property NSString* cid;
@property double totalSec;
@property int index;
@property BOOL downloaded;
@property NSURL* contentUrl;
@property NSString* contentPath;
@property NSString* groupkey;
@property NSString* ckey;
@property NSString* userId;
@property NSString* drmSchemeUuid;
@property NSString* drmLicenseUrl;
@property NSString* oid;
@property NSString* totalSize;
@property NSString* gTitle;
@property NSString* groupImg;
@property NSString* thumbnailImg;
@property NSString* audioVideoType;
@property NSString* groupTeacherName;
@property NSString* cPlayTime;
@property NSString* groupContentScnt;
@property NSString* groupAllPlayTime;
@property NSString* view_limitdate;
@property NSString* modified;
@property NSNumber* cPlaySeconds;


-(id)initWithTitle:(NSString *)title
              memo:(NSString *)memo
               cid:(NSString *)cid
          playTime:(NSString *)playTime
             index:(int)index;

-(id)init;

@end
