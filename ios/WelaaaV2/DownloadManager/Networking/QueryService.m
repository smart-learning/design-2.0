//
//  QueryService.m
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "QueryService.h"

#define DEFAULT_NET_TIMEOUT_SEC 30  // 네트워크 타임아웃 시간

@implementation QueryService
{
    NSURLSession* defaultSession;
    NSURLSessionDataTask* dataTask;
    NSMutableArray* items;
    NSMutableDictionary* dic;
    NSString* errorMessage;
}


- (id) init
{
  self = [super init];
  
  if (self != nil )
  {
      NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
      defaultSession = [NSURLSession sessionWithConfiguration : defaultConfigObject
                                                     delegate : nil
                                                delegateQueue : [NSOperationQueue mainQueue]];
    
      items = [[NSMutableArray alloc] init];
      errorMessage = @"";
  }
  
  return self;
}


- (void) getSearchWelaaaPlayDataResults : (NSString *) searchCid
                              authToken : (NSString *) token
                           queryResults : (void (^) (NSDictionary *dicResult, NSString *msg)) completion
{
    if ( dataTask )
    {
        [dataTask cancel];
    }
  
    NSString *apiPlayData = @"/dev/api/v1.0/play/play-data/";
    NSString *urlWithParams = [NSString stringWithFormat : @"%@%@%@", API_HOST, apiPlayData, searchCid];
    NSURL *url = [NSURL URLWithString : urlWithParams];
  
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    NSString *headerValue = [@"Bearer " stringByAppendingString : token];
  
    [urlRequest setHTTPMethod : @"GET"];
    [urlRequest setValue : headerValue
      forHTTPHeaderField : @"authorization"];
    [urlRequest setTimeoutInterval : DEFAULT_NET_TIMEOUT_SEC]; // 초단위 지정
  
    dataTask = [defaultSession dataTaskWithRequest : urlRequest
                                 completionHandler : ^(NSData *data, NSURLResponse *response, NSError *error)
    {
        if ( error == nil )
        {
            // No error
            NSLog(@"  data : %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
          
            NSError *error = nil;
            self -> dic = [NSJSONSerialization JSONObjectWithData : data
                                                          options : kNilOptions
                                                            error : &error];
          
            if ( error )
            {
                NSLog(@"  JSON Parse Error : %@", error.localizedDescription);
                self -> errorMessage = [NSString stringWithFormat : @"JSON Parse error: %@", error.localizedDescription];
            }
        }
        else
        {
            self->dataTask = nil;
          
            if ( error.code == -1009 )  // Internet Connection Error
            {
              ;
            }
            else  // 기타 오류
            {
              
            }
          
            self -> errorMessage = [NSString stringWithFormat : @"DataTask error: %@", error.localizedDescription];
        }
      
        completion(self->dic, self->errorMessage);
        /*
         dispatch_async(dispatch_get_main_queue(), ^{
         // 메인스레드(UI Thread)에서 실행해야 할 때는 이 블럭 사용.
         completion(self->items, self->errorMessage);
         });
         */
    } ];
  
    [dataTask resume];
}


- (void) updateWelaaaResults : (NSData *) data
{
    NSDictionary *response;
    [items removeAllObjects];
  
    NSError *error = nil;
    response = [NSJSONSerialization JSONObjectWithData : data
                                               options : kNilOptions
                                                 error : &error];
  
    if ( error )
    {
        NSLog(@"  JSON Parse Error : %@", error.localizedDescription);
        //errorMessage += "JSONSerialization error: \(parseError.localizedDescription)\n"
        return ;
    }
  
    NSDictionary *dicData = response[@"data"];
  
    if ( !dicData )
    {
        NSLog(@"  Dictionary does not contain data key");
        //errorMessage += "Dictionary does not contain results key\n"
        return ;
    }
  
    NSArray *array = dicData[@"clips"];
  
    if ( !array )
    {
        NSLog(@"  Dictionary does not contain results key");
        //errorMessage += "Dictionary does not contain results key\n"
        return ;
    }
    else
    {
        NSLog(@"  clips count : %lu", (unsigned long)[array count]);
    }
  
    int index = 0;
  
    for ( id cilpDictionary in array )
    {
        if ( [cilpDictionary isKindOfClass : [NSDictionary class]] )
        {
            NSString *cid = cilpDictionary[@"cid"];
            NSString *title = cilpDictionary[@"title"];
            NSString *memo = cilpDictionary[@"memo"];
            NSString *playTime = cilpDictionary[@"play_time"];
            Clip *aClip = [[Clip alloc] initWithTitle : title
                                                 memo : memo
                                                  cid : cid
                                             playTime : playTime
                                                index : index];
            [items addObject : aClip];
            index += 1;
        }
        else
        {
            NSLog(@"Problem parsing cilpDictionary");
            //errorMessage += "Problem parsing trackDictionary\n"
        }
    }
}

@end





















