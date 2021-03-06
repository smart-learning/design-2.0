//
//  FPSDownload.h
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <PallyConFPSSDK/PallyConFPSSDK-Swift.h>
#import "Clip.h"


@interface FPSDownload : NSObject
{
  Clip* clip;
  NSURLSessionDataTask* playDataTask;
  DownloadTask* downloadTask; // by PallyConFPSSDK
  BOOL isDownloading;
  NSData* resumeData;
  float progress; // Download delegate sets this value.
}

@property Clip* clip;
@property NSURLSessionDataTask* playDataTask;
@property DownloadTask* downloadTask;
@property BOOL isDownloading;
@property NSData* resumeData;
@property float progress;

-(id)initWithClip:(Clip *)clip;

@end
