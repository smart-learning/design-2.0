//
//  QueryService.m
//  WelaaaV2
//
//  Created by YOHAN KIM on 2018. 9. 6..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "QueryService.h"
#import "Clip.h"

// 강의클립/오디오북 재생을 위한 정보 조회(다운로드 경로 조회)
#define URL_PALLYCON_PLAY_DATA   @"https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com/dev/api/v1.0/play/play-data"
// 토큰 문자열(임시 사용)
//#define KEY_SERVER_AUTHORIZATION_HEADER @"Bearer M0R1bF0annKfMLQlLQ69do3lcS1OjMeoDaMbWlnChZ"    // 2018.9.3 ~
#define KEY_SERVER_AUTHORIZATION_HEADER @"Bearer M55szUi8n20Nu2PLox2LZ5dXmsy7JqlLyFs5rvhc89"    // 2018.9.6 ~


#define DEFAULT_NET_TIMEOUT_SEC 30  // 네트워크 타임아웃 시간

@implementation QueryService
{
  NSURLSession* defaultSession;
  NSURLSessionDataTask* dataTask;
  NSMutableArray* items;
  NSMutableDictionary* dic;
  NSString* errorMessage;
}


-(id)init
{
  self = [super init];
  if(self != nil){
    NSURLSessionConfiguration* defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
    defaultSession = [NSURLSession sessionWithConfiguration:defaultConfigObject
                                                   delegate:nil delegateQueue:[NSOperationQueue mainQueue]];
    
    items = [[NSMutableArray alloc] init];
    errorMessage = @"";
  }
  
  return self;
}


- (void)getSearchWelaaaPlayDataResults:(NSString*)searchCid queryResults:(void (^)(NSDictionary* dicResult, NSString* msg))completion
{
  if(dataTask){
    [dataTask cancel];
  }
  
  NSString* urlWithParams = [NSString stringWithFormat:@"%@/%@",URL_PALLYCON_PLAY_DATA,searchCid];
  NSURL* url = [NSURL URLWithString:urlWithParams];
  NSMutableURLRequest* urlRequest = [NSMutableURLRequest requestWithURL:url];
  
  [urlRequest setHTTPMethod:@"GET"];
  [urlRequest setValue:KEY_SERVER_AUTHORIZATION_HEADER forHTTPHeaderField:@"authorization"];
  [urlRequest setTimeoutInterval:DEFAULT_NET_TIMEOUT_SEC]; // 초단위 지정
  
  dataTask = [defaultSession dataTaskWithRequest:urlRequest completionHandler:^(NSData* data, NSURLResponse* response, NSError* error){
    
    if(error == nil){
      // No error
      NSLog(@"data : %@",
            [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
      
      NSError* error = nil;
      self->dic = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:&error];
      if (error) {
        NSLog(@"JSON Parse Error : %@", error.localizedDescription);
        self->errorMessage = [NSString stringWithFormat:@"JSON Parse error: %@",error.localizedDescription];
      }
    }else{
      self->dataTask = nil;
      
      if(error.code == -1009){  // Internet Connection Error
        
      }else{ // 기타 오류
        
      }
      self->errorMessage = [NSString stringWithFormat:@"DataTask error: %@",error.localizedDescription];
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


- (void)updateWelaaaResults:(NSData*)data
{
  NSDictionary* response;
  [items removeAllObjects];
  
  NSError *error = nil;
  response = [NSJSONSerialization JSONObjectWithData:data
                                             options:kNilOptions
                                               error:&error];
  if (error) {
    NSLog(@"JSON Parse Error : %@", error.localizedDescription);
    //errorMessage += "JSONSerialization error: \(parseError.localizedDescription)\n"
    return;
  }
  
  NSDictionary* dicData = response[@"data"];
  
  if(!dicData){
    NSLog(@"Dictionary does not contain data key");
    //errorMessage += "Dictionary does not contain results key\n"
    return;
  }
  
  NSArray* array = dicData[@"clips"];
  
  if(!array){
    NSLog(@"Dictionary does not contain results key");
    //errorMessage += "Dictionary does not contain results key\n"
    return;
  }else{
    NSLog(@"clips count : %lu", (unsigned long)[array count]);
  }
  
  int index = 0;
  for(id cilpDictionary in array) {
    if([cilpDictionary isKindOfClass:[NSDictionary class]]){
      
      /* Sample
       "cid": "v100015_001",
       "end_seconds": null,
       "id": 2407,
       "images": {
       "big": "",
       "list": "https://static.welaaa.co.kr/static/courses/v100015/v100015_list.jpg",
       "wide": "https://static.welaaa.co.kr/contentsUpImage/20180426133743.jpg"
       },
       "is_active": true,
       "memo": " 성공적인 프레젠테이션에서 백전백승하기 위해서는 지피지기가 아닌 '지기지피'를 명심해야 합니다. 발표 준비 단계에서 제일 먼저 고려해야할 것에 대해 알아봅니다.",
       "open_date": "2018-02-01",
       "pay_type": 2,
       "play_time": "00:15:16",
       "price": 2000,
       "progress": null,
       "review_count": 3,
       "star_avg": 5,
       "star_count": 3,
       "title": "지기지피 백전백승! 나의 발표 목적을 제일 먼저 고려하라",
       "type": "video-clip"
       */
      
      NSString* cid = cilpDictionary[@"cid"];
      NSString* title = cilpDictionary[@"title"];
      NSString* memo = cilpDictionary[@"memo"];
      NSString* playTime = cilpDictionary[@"play_time"];
      Clip* aClip = [[Clip alloc] initWithTitle:title memo:memo cid:cid playTime:playTime index:index];
      [items addObject:aClip];
      index += 1;
      
    }else{
      NSLog(@"Problem parsing cilpDictionary");
      //errorMessage += "Problem parsing trackDictionary\n"
    }
  }
}

@end
