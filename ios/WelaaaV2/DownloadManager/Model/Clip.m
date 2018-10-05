//
//  Clip.m
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "Clip.h"

@implementation Clip

@synthesize cTitle,memo,cid,index,downloaded,contentUrl,totalSec,contentPath, \
            groupkey,ckey,userId,drmSchemeUuid,drmLicenseUrl,oid,totalSize,gTitle,groupImg, \
            thumbnailImg,audioVideoType,groupTeacherName,cPlayTime,groupContentScnt, \
            groupAllPlayTime,view_limitdate,modified;

-(id)initWithTitle:(NSString *)title
              memo:(NSString *)memo
               cid:(NSString *)cid
          playTime:(NSString *)playTime
             index:(int)index
{
  self = [super init];
  if(self != nil){
    self.cTitle = title;
    self.memo = memo;
    self.cid = cid;
    self.cPlayTime = playTime;
    
    // 00:00:00 에서 초(sec)로 변환해서 전체 재생시간을 저장
    NSArray *timeUnits= [playTime componentsSeparatedByString: @":"];
    if (timeUnits && timeUnits.count == 3) {
      NSString* hh = timeUnits[0];
      NSString* mm = timeUnits[1];
      NSString* ss = timeUnits[2];
      self.totalSec = ([hh doubleValue] * 60.0 * 60.0) + ([mm doubleValue] * 60.0) + [ss doubleValue];
    }else if(timeUnits && timeUnits.count == 2){
      NSString* mm = timeUnits[0];
      NSString* ss = timeUnits[1];
      self.totalSec = ([mm doubleValue] * 60.0) + [ss doubleValue];
    }else{
      self.totalSec = 0.0;
    }
    
    self.downloaded = false;
    self.contentUrl = nil;
    self.index = index;
  }
  
  return self;
}

-(id)init
{
  self = [super init];
  if(self != nil){
    self.downloaded = false;
    self.contentUrl = nil;
  }
  
  return self;
}

@end
