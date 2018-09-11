//
//  FPSDownload.m
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "FPSDownload.h"

@implementation FPSDownload

@synthesize clip,task,isDownloading,resumeData,progress;

-(id)initWithClip:(Clip *)clip
{  
  self = [super init];
  if(self != nil){
    self.clip = clip;
    self.progress = 0;
  }
  
  return self;
}

@end
