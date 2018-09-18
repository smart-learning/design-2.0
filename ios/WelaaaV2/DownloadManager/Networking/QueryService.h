//
//  QueryService.h
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "Clip.h"
#import "common.h"

@interface QueryService : NSObject

- (id) init;
- (void) getSearchWelaaaPlayDataResults : (NSString *) searchCid
                              authToken : (NSString *) token
                           queryResults : (void (^) (NSDictionary *dicResult, NSString *msg)) completion;

@end
