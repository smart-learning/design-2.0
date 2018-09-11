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
  NSString* title;
  NSString* memo;
  NSString* cid;
  NSString* playTime;
  double totalSec;
  int index;
  BOOL downloaded;
  NSURL* contentUrl;
  NSString* contentPath;
}

@property NSString* title;
@property NSString* memo;
@property NSString* cid;
@property NSString* playTime;
@property double totalSec;
@property int index;
@property BOOL downloaded;
@property NSURL* contentUrl;
@property NSString* contentPath;

-(id)initWithTitle:(NSString *)title
              memo:(NSString *)memo
               cid:(NSString *)cid
          playTime:(NSString *)playTime
             index:(int)index;

@end
