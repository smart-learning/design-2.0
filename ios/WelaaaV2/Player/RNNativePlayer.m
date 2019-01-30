//
//  RNNativePlayer.m
//  WelaaaV2
//
//  Created by SmartLearning_iOSDev on 2018. 7. 25..
//  Copyright © 2018년 Facebook. All rights reserved.
//

#import "RNNativePlayer.h"
#import "AFNetworkReachabilityManager.h"

#import <PMS/PMS.h>
#import <PMS/TAS.h>

@implementation RNNativePlayer
{
    BOOL _hasListeners;
}

// To export a module named FPSManager
RCT_EXPORT_MODULE();

- (NSArray <NSString *> *) supportedEvents
{
    return @[@"downloadState",@"selectDatabase"];
}

// Will be called when this module's first listener is added.
- (void) startObserving
{
    _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void) stopObserving
{
    _hasListeners = NO;
}

#pragma mark - Private Methods

- (void) showMediaPlayer : (NSDictionary *) argsFromReactNative
{
    if ( [[common getModel] isEqualToString : @"iPhone 5s"] )
    {
        return [common presentAlertWithTitle:@"윌라" andMessage:@"iPhone 5s에서는 성능 이슈로 콘텐츠 이용이 불가합니다.\n윌라웹에서 이용해 주세요."];
    }
    /*
     현재 네트워크 상태값과 RN 마이윌라 설정값을 비교하고 맞지 않으면 얼럿창을 리턴합니다.
     Wi-Fi에서만 재생허용인데 연결상태가 Wi-Fi가 아닌 경우는 얼럿창을 보여주고 재생을 하지 않습니다.
     */
    /*
    [[ApiManager sharedInstance] setReachabilityStatusChangeBlock : ^(NSInteger status)
                                                                    {
                                                                        if ( status == 2 )
                                                                            self->_isConnectedWiFi = true;
                                                                        else
                                                                            self->_isConnectedWiFi = false;
                                                                    }];
     */
    // 위와 같이 처리할 경우 비동기 콜백함수라 리턴되기 전에 아래의 루틴이 먼저 실행될 수 있으므로 수정합니다.
    // 그리고 플레이어의 재생목록에서 다른 콘텐츠를 선택하거나 자동으로 다음 콘텐츠로 넘어가 재생될 때에도 체크하는 루틴이 필요하므로
    // 해당 처리는 ContentPlayerViewController 에서 하는걸로 수정합니다.
    // - 2018.10.31.~ 김요한.
  
    // 미니플레이어가 떠있을수 있으니 일단 종료시킵니다.
    [self stopMediaPlayer];
  
    ContentPlayerViewController *playerViewController = [[ContentPlayerViewController alloc] init];
    NSMutableDictionary *args = [argsFromReactNative mutableCopy];
    [playerViewController setContentData : args];
  //return [common presentAlertWithTitle:@"args" andMessage:[args description]];  // Test purpose..
    // View를 present할때 옵션없이 하면 지시하는 뷰를 컨텍스트에서 날리고 present하기때문에 검은화면이 맨 아래에 깔리게 됩니다.
    // https://magi82.github.io/ios-modal-presentation-style-01/
    playerViewController.modalPresentationStyle = UIModalPresentationOverFullScreen;
  
    // Exception 'accessing _cachedSystemAnimationFence requires the main thread' was thrown while invoking 에러가 발생된다면..
    // ref : https://github.com/MOLPay/molpay-mobile-xdk-reactnative-beta/issues/7
    dispatch_sync(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController : playerViewController
                                                                                     animated : YES
                                                                                   completion : nil];
    });
  
    // NavigationView방식으로 push해야한다면 아래를 주석해제합니다.
    /*
    dispatch_sync(dispatch_get_main_queue(), ^{
      UINavigationController *navigationController;
      navigationController = (UINavigationController *)[[[[UIApplication sharedApplication] delegate] window] rootViewController];
      [navigationController pushViewController:playerViewController animated:TRUE];
    });
    */
}

- (void) stopMediaPlayer
{
    // 기존 플레이어의 Audio Session을 pause합니다.
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
    [[AVAudioSession sharedInstance] setActive: NO error: nil];
  
    // 모든 뷰컨트롤러를 dismiss시킵니다.
    dispatch_sync(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication].keyWindow.rootViewController dismissViewControllerAnimated : NO
                                                                                           completion : nil];
    });
}

// 앱 시작 시, 마이윌라 설정에서 직접 설정값을 변경할 때마다 호출됩니다.
- (void) setPlayerPolicyFromRN : (NSDictionary *) args
{
    // 설정값으로 세팅
    [[NSUserDefaults standardUserDefaults] setValue:args[@"cellularDataUseDownload"] forKey:@"cellularDataUseDownload"];
    [[NSUserDefaults standardUserDefaults] setValue:args[@"cellularDataUsePlay"] forKey:@"cellularDataUsePlay"];
    // 푸시 동의도 추후에 추가해야 합니다.
    // 이메일 동의도 추후에 추가해야 합니다.
  
    // 세팅 후 저장 완료
    [[NSUserDefaults standardUserDefaults] synchronize];
}

- (void) downloadSomething : (NSDictionary *) args
{
    // 다운로드 테스트용
    [[FPSDownloadManager sharedInstance] downloadSomething : args];
}

// args 가 하나의 콘텐츠(Dictionary)일 때.
- (void) downloadContent : (NSDictionary *) args
{
    [[FPSDownloadManager sharedInstance] startDownload : args
                                            completion : ^(NSError *error, NSMutableDictionary *result)
                                                         {}];
}


- (void) downloadContents : (NSArray *) args
{
  // 네트워크 체크해서 조건에 따라 다음 과정 시작
  [self checkNetworkState:^(NSError *error, bool andStart){
    if (andStart) {
      // 다운로드 상태 체크해서 조건에 따라 다운로드 시작
      [self checkDownloadState:^(NSError *error, bool andStart){
        if (andStart) {
          [self startDownload:args];
        }
      }];
    }
  }];
}


- (void) checkNetworkState : (void (^) (NSError *error, bool andStart)) resultHandler{
  
  // 네트워크 체크
  
  [[AFNetworkReachabilityManager sharedManager] startMonitoring]; // 네트워크 상태 모니터링 시작
  
  [[AFNetworkReachabilityManager sharedManager] setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
    
    if (status == AFNetworkReachabilityStatusNotReachable) {
      NSLog(@"No Network!");
      [self showAlertOk:@"알림" message:@"네트워크 연결상태를 확인해주시기 바랍니다"];
      resultHandler(nil, NO);
      
    } else if (status == AFNetworkReachabilityStatusUnknown){
      NSLog(@"Unknown Network!");
      [self showAlertOk:@"알림" message:@"네트워크 연결상태를 확인해주시기 바랍니다"];
      resultHandler(nil, NO);
      
    } else {
      if (status == AFNetworkReachabilityStatusReachableViaWiFi) {
        NSLog(@"Network is Wi-Fi");
        // 다운로드 시작
        resultHandler(nil, YES);
        
      } else if (status == AFNetworkReachabilityStatusReachableViaWWAN){
        NSLog(@"Network is LTE/3G(Cellular)");
        // 알러트 팝업으로 사용자에게 진행 의사 물어봄
        UIAlertController *alert = [UIAlertController alertControllerWithTitle : @"알림"
                                                                       message : @"현재 네트워크 환경이  Wi-Fi 가 아닙니다.\n Wi-Fi 환경이 아닌 3G/LTE 상에 재생시 가입하신 요금제 따라 데이터 요금이 발생할 수 있습니다. \n 계속 진행 하시겠습니까 ?"
                                                                preferredStyle : UIAlertControllerStyleAlert];
        UIAlertAction *ok = [UIAlertAction actionWithTitle : @"확 인"
                                                     style : UIAlertActionStyleDefault
                                                   handler : ^(UIAlertAction * action)
                             {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               resultHandler(nil, YES);
                             }];
        UIAlertAction *cancel = [UIAlertAction actionWithTitle : @"취 소"
                                                         style : UIAlertActionStyleDefault
                                                       handler : ^(UIAlertAction * action)
                                 {
                                   [alert dismissViewControllerAnimated:YES completion:nil];
                                   resultHandler(nil, NO);
                                 }];
        
        [alert addAction : ok];
        [alert addAction : cancel];
        
        // root뷰컨트롤러를 덮고 있는 뷰가 있으면 그위에 팝업을 띄우기 위해 아래와 같이 처리. 무조건 rootViewController에 띄우면 안뜨는 경우 있으므로. 2018.11.7.
        UIViewController *frontViewController = [[UIApplication sharedApplication].keyWindow.rootViewController presentedViewController];
        if (!frontViewController) {
          frontViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
        }
        [frontViewController presentViewController : alert
                                          animated : YES
                                        completion : nil];
      }
    }
  }];
  
  [[AFNetworkReachabilityManager sharedManager] stopMonitoring];  // 모니터링 중지
}


- (void) checkDownloadState : (void (^) (NSError *error, bool andStart)) resultHandler{
  
  // 다운로드 진행중인 콘텐츠 있는지 확인하고 사용자 선택에 따라 진행여부 결정. 진행하게 되면 기존의 다운로드는 취소.
  //  아직은 다운로드를 취소할 수 있는 시나리오가 없기 때문에 이렇게 처리해둠. 추후 다운로드 시나리오 보완 예정(다운로드 시작,취소,일시정지,재시작 등).
  if ( [[FPSDownloadManager sharedInstance] numberOfItemsInWating] > 0 ) {
    
    UIAlertController *alert = [UIAlertController alertControllerWithTitle : @"알림"
                                                                   message : @"다운로드 진행중인 콘텐츠가 있습니다.\n 취소하고 새로 받으시겠습니까?"
                                                            preferredStyle : UIAlertControllerStyleAlert];
    UIAlertAction *yes = [UIAlertAction actionWithTitle : @"예"
                                                 style : UIAlertActionStyleDefault
                                               handler : ^(UIAlertAction * action)
                         {
                           [alert dismissViewControllerAnimated:YES completion:nil];
                           resultHandler(nil, YES); // 다운로드 대기큐를 리셋하고 새로 시작.
                         }];
    UIAlertAction *no = [UIAlertAction actionWithTitle : @"아니오"
                                                     style : UIAlertActionStyleDefault
                                                   handler : ^(UIAlertAction * action)
                             {
                               [alert dismissViewControllerAnimated:YES completion:nil];
                               resultHandler(nil, NO);
                             }];
    
    [alert addAction : yes];
    [alert addAction : no];
    
    // root뷰컨트롤러를 덮고 있는 뷰가 있으면 그위에 팝업을 띄우기 위해 아래와 같이 처리. 무조건 rootViewController에 띄우면 안뜨는 경우 있으므로. 2018.11.7.
    UIViewController *frontViewController = [[UIApplication sharedApplication].keyWindow.rootViewController presentedViewController];
    if (!frontViewController) {
      frontViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
    }
    [frontViewController presentViewController : alert
                                      animated : YES
                                    completion : nil];
  }else{
    resultHandler(nil, YES);  // 다운로드 대기큐를 리셋하고 새로 시작.
  }
}


- (void) startDownload : (NSArray *) args{
  // gid 를 구한다.
  NSString* gid = nil;
  
  if (args && args.count > 0)
  {
    NSString* cid = args[0][@"cid"];
    if (cid && cid.length>1)
    {
      gid = [cid substringToIndex:[cid indexOf:@"_"]];
    }
  }else
  {
    NSLog(@"  No args!");
    return;
  }
  
  if (gid && gid.length > 0)
  {
    // 강좌 그룹 전체 내용에 대한 메타정보를 먼저 구하고,
    NSDictionary *contentsInfo = [ApiManager getContentsInfoWithCgid : gid
                                                       andHeaderInfo : args[0][@"token"]];
    if (contentsInfo == nil)
    {
      // 알러트 -> 콘텐츠 정보를 불러올 수 없습니다.
      NSLog(@"  No contentsInfo!");
      [self showAlertOk:@"알림" message:@"콘텐츠 정보를 불러올 수 없습니다"];
      return;
    }
    
    [[FPSDownloadManager sharedInstance] setContentsInfo:contentsInfo];
    
    // 다운로드 시작
    [[FPSDownloadManager sharedInstance] startDownloadContents:args
                                                    completion:^(NSError *error, NSMutableDictionary *result)
     {
       // 하나 성공할 때마다 호출되면서 화면의 다운로드 목록 갱신
       //[result objectForKey:@"cid"]  // 어떤 컨텐츠인지 확인하고자 할 때.
       NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
       [params setObject:[NSNumber numberWithBool:true] forKey:@"complete"];
       [params setObject:[NSNumber numberWithInt:0] forKey:@"progress"];
       if ( self->_hasListeners )
       {
         [self sendEventWithName : @"downloadState"
                            body : params];
       }
     }];
  }
}


- (void) deleteDownloadedContent : (NSDictionary *) args

{
    [[FPSDownloadManager sharedInstance] removeDownloadedContent : args
                                                      completion : ^(NSError *error, NSMutableDictionary *result)
                                                                   {}];
}

- (void) deleteDownloadedContents : (NSArray *) args
                         resolver : (RCTPromiseResolveBlock)resolve
                         rejecter : (RCTPromiseRejectBlock)reject
{
  [[FPSDownloadManager sharedInstance] removeDownloadedContents : args
                                                     completion : ^(NSError *error, NSMutableDictionary *result)
   {
     // 삭제 성공시 cid 를 리턴해준다.
     if (error == nil) {
       NSString *cid = result ? [result objectForKey:@"cid"] : @"";
       resolve(cid);
     }else{
       reject(nil,@"Delete Contents Error",error);
     }
   }];
}

- (void) selectDownloadedContent : (NSDictionary *) args
{
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  
    NSMutableArray *allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsAll];
  
    NSError *error;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject : allRecords
                                                       options : NSJSONWritingPrettyPrinted
                                                         error : &error];
    if ( !jsonData )
    {
        NSLog(@"  Json Parse Error : %@", error);
        [params setObject : @""
                   forKey : @"selectDatabase"];
    }
    else
    {
        NSString *jsonString = [[NSString alloc] initWithData : jsonData
                                                     encoding : NSUTF8StringEncoding];
        [params setObject : jsonString
                   forKey : @"selectDatabase"];
    }
  
    if ( _hasListeners )
    {
        [self sendEventWithName : @"selectDatabase"
                           body : params];
    }
}

- (void) selectDownloadedList : (NSDictionary *)option
                     resolver : (RCTPromiseResolveBlock)resolve
                     rejecter : (RCTPromiseRejectBlock)reject
{
  NSLog(@"  selectDownloadedList:resolver:rejecter:");
  
  // 다운로드 목록 띄울 때마다 파일과 DB 간 동기화를 수행하기 위해 추가(트랙킹 안되는 파일 삭제).
  [[FPSDownloadManager sharedInstance] synchronizeLocalFilesWithDB];
  
  NSMutableArray *allRecords;
  if(option){
    NSString* userId = [option objectForKey:@"userId"];
    NSString* cid = [option objectForKey:@"cid"];
    NSLog(@"selectDownloadedList - userId : %@, cid : %@",userId,cid);
    if(userId==nil || userId.length==0){
      NSLog(@"No UserId to Select!");
    }
    if (cid==nil || cid.length==0) {
      allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsAll];
    }else{
      allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsGroupKey:cid];
    }
  }else{
    allRecords = [[DatabaseManager sharedInstance] searchDownloadedContentsAll];
  }
  
  NSError *error;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject : allRecords
                                                     options : 0
                                                       error : &error];
  if ( !jsonData && error )
  {
    NSLog(@"  Json Parse Error : %@",error);
    reject(nil,@"Json Parse Error",error);
  }
  else
  {
    NSString *jsonString = [[NSString alloc] initWithData : jsonData
                                                 encoding : NSUTF8StringEncoding];
    NSLog(@"  Parsed jsonString : %@",jsonString);
    resolve(jsonString);
  }
}

- (void) tasDeviceCertPmsCustId : (NSDictionary *) args
{
  @try {
    if(args){
      NSLog(@"tasDeviceCertWithCustId args -> %@",args);
      NSString* userId = [args objectForKey:@"userId"];
      NSString* currentMembership = [args objectForKey:@"currentMembership"];
      
      NSMutableDictionary *dict = [NSMutableDictionary new];
      [dict setValue:userId forKey:@"custId"];
      [dict setValue:currentMembership forKey:@"currentMembership"];

      NSLog(@"tasDeviceCertWithCustId - userId : %@, currentMembership : %@",userId,currentMembership);
      if(userId==nil || userId.length==0){
        NSLog(@"No UserId to Select!");
      }
      
      //// 제일 간단한 방식이나 메뉴얼 상에 없고 단순히 토큰과 아이디를 매칭시키는 기능인걸로 보여 사용 안함.
      /*
      dispatch_async(dispatch_get_main_queue(), ^{
        [PMS setPushToken:[common getDeviceToken] UserData:dict CustId:userId];
      });
       */
      
      //// Login only
      /*
      dispatch_async(dispatch_get_main_queue(), ^{
        [PMS setPushToken : [common getDeviceToken]]; // 이 부분이 없으면 푸시 안됨.
        [PMS loginWithCustId:userId UserData:dict CompleteBlock:^(PMSResult *result) {
          if([result isSuccess]){
            NSMutableDictionary *dict = [NSMutableDictionary new];
            [dict setValue:userId forKey:@"custId"];
            [dict setValue:currentMembership forKey:@"currentMembership"];
            [TAS identifyUser:userId userProp:dict];
            NSLog(@"TAS Login Success with UserId %@",userId);
          }else{
            NSLog(@"TAS Login Fail %@ %@", result.code, result.msg);
          }
        }];
      });
       */
      
      // Device Certification + Login
      // 성공
      dispatch_async(dispatch_get_main_queue(), ^{
        [PMS setPushToken : [common getDeviceToken]]; // 이 부분이 없으면 푸시 안됨.
        [PMS deviceCertWithCustId:userId UserData:dict CompleteBlock:^(PMSResult *result) {
          if([result isSuccess]){
            NSLog(@"TAS DeviceCert and Login Success with UserId %@",userId);
          }else{
            NSLog(@"TAS Login Fail %@ %@", result.code, result.msg);
          }
        }];
      });
      
    }else{
      NSLog(@"tasDeviceCertWithCustId No args!");
    }
  }
  @catch (NSException *exception) {
    NSLog(@"tasDeviceCertWithCustId Exception -> %@",exception.description);
  }
}

- (void) tasLogoutPms
{
  [PMS logoutWithCompleteBlock:^(PMSResult *result) {
    if([result isSuccess]){
      NSLog(@"TAS logout Success");
    }else{
      NSLog(@"TAS logout Failed");
    }
  }];
}

- (void) tasSettingPms : (NSDictionary *) args
{
  @try {
    if(args){
      NSLog(@"tasSetting args -> %@",args);
      NSNumber* fcmFlag = [args objectForKey:@"fcmFlag"];
      
      NSLog(@"tasSetting - fcmFlag : %@",fcmFlag);  // 1 or 0
      
      BOOL notiFlag = NO;
      BOOL mktFlag = NO;
      BOOL msgFlag = NO;  // 알림(공지) 게시판이 없는 상태이므로 메시지 보관하지 않음
      
      // 수신동의 상태 설정(현재는 설정화면에 체크 항목이 하나뿐이므로 그 플래그 하나로 정보성푸시, 마케팅성푸시 동시에 적용함)
      if([fcmFlag isEqualToNumber:[NSNumber numberWithInt:1]]){
        notiFlag = YES;
        mktFlag = YES;
      }else{
        notiFlag = NO;
        mktFlag = NO;
      }
      
      dispatch_async(dispatch_get_main_queue(), ^{
        [PMS setConfigWithNotiFlag:notiFlag MsgFlag:msgFlag MktFlag:mktFlag CompleteBlock:^(PMSResult *result) {
          NSLog(@"switchValueChanged is complete %@ %@", result.code, result.msg);
          //// 최종 설정된 상태 확인을 위한 로깅
          // Push(정보성) 수신여부 확인
          if ( [PMS getNotiFlag] )
            NSLog(@"TAS getNotiFlag YES");
          else
            NSLog(@"TAS getNotiFlag YES");
          // 메시지함 적재여부 확인
          if ( [PMS getMsgFlag] )
            NSLog(@"TAS getMsgFlag YES");
          else
            NSLog(@"TAS getMsgFlag NO");
          // 마케팅 수신 동의여부 확인 (NotiFlag의 영향 받지 않음)
          if ( [PMS getMktFlag] )
            NSLog(@"TAS getMktFlag YES");
          else
            NSLog(@"TAS getMktFlag NO");
        }];
      });
    }else{
      NSLog(@"tasSetting No args!");
    }
  }
  @catch (NSException *exception) {
    NSLog(@"tasSetting Exception -> %@",exception.description);
  }
}

- (void) tasSendReadMsgEventPms : (NSDictionary *) args
{
  @try {
    if(args){
      NSLog(@"tasSendReadMsgEventPms args -> %@",args);
      NSString* msgId = [args objectForKey:@"msgId"];
      NSLog(@"tasSendReadMsgEventPms - msgId : %@",msgId);
      if(msgId==nil || msgId.length==0){
        NSLog(@"No msgId to Select!");
        return;
      }
      
      dispatch_async(dispatch_get_main_queue(), ^{
        // 메시지 읽음처리
        [PMS sendReadMsgEventWithMsgId : msgId
                         CompleteBlock : ^(PMSResult *result)
         {
           if ([result isSuccess])
             NSLog(@"  TAS sendReadMsgEventWithMsgId Complete: %@",msgId);
           else
             NSLog(@"  TAS sendReadMsgEventWithMsgId Fail: %@",msgId);
         }];
      });
      
    }else{
      NSLog(@"tasSendReadMsgEventPms No args!");
    }
  }
  @catch (NSException *exception) {
    NSLog(@"tasSendReadMsgEventPms Exception -> %@",exception.description);
  }
}

#pragma mark - Alert and Popup (TODO : 추후 한곳에 모아둘 필요 있음. 중복되는 부분들.)

- (void) showAlertOk : (NSString *) title message:(NSString *)msg
{
  UIAlertController *alert = [UIAlertController alertControllerWithTitle : title
                                                                 message : msg
                                                          preferredStyle : UIAlertControllerStyleAlert];
  
  UIAlertAction *ok = [UIAlertAction actionWithTitle : @"확인"
                                               style : UIAlertActionStyleDefault
                                             handler : ^(UIAlertAction * action)
                       {
                         [alert dismissViewControllerAnimated:YES completion:nil];
                       }];
  
  [alert addAction : ok];
  
  // root뷰컨트롤러를 덮고 있는 뷰가 있으면 그위에 팝업을 띄우기 위해 아래와 같이 처리. 무조건 rootViewController에 띄우면 안뜨는 경우 있으므로. 2018.11.7.
  UIViewController *frontViewController = [[UIApplication sharedApplication].keyWindow.rootViewController presentedViewController];
  if (!frontViewController) {
    frontViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
  }
  [frontViewController presentViewController : alert
                                    animated : YES
                                  completion : nil];
}


#pragma mark - RCT_EXPORT

RCT_EXPORT_METHOD( play : (NSDictionary *) argsFromReactNative )
{
    [self showMediaPlayer : argsFromReactNative];
}

RCT_EXPORT_METHOD( stop )
{
    [self stopMediaPlayer];
}

RCT_EXPORT_METHOD( setting : (NSDictionary *) argsFromReactNative )
{
    NSLog(@"  RNNativePlayer setting for RN : %@", argsFromReactNative);
    [self setPlayerPolicyFromRN : argsFromReactNative];
}

RCT_EXPORT_METHOD( download : (NSArray *) argsFromReactNative )
{
    [self downloadContents : argsFromReactNative];  // argsFromReactNative 가 Array 일 때(여러개의 Dictionary)
}

RCT_EXPORT_METHOD( deleteDownload : (NSArray *) argsFromReactNative
                         resolver : (RCTPromiseResolveBlock)resolve
                         rejecter : (RCTPromiseRejectBlock)reject )
{
  [self deleteDownloadedContents:argsFromReactNative resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD( selectDatabase : (NSDictionary *) argsFromReactNative )
{
    [self selectDownloadedContent : argsFromReactNative];
}

RCT_EXPORT_METHOD( getDownloadList : (RCTPromiseResolveBlock)resolve
                          rejecter : (RCTPromiseRejectBlock)reject )
{
  [self selectDownloadedList:nil resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD( getDownloadList : (NSDictionary *)option
                  resolver : (RCTPromiseResolveBlock)resolve
                  rejecter : (RCTPromiseRejectBlock)reject )
{
  [self selectDownloadedList:option resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD( tasDeviceCert : (NSDictionary *) argsFromReactNative )
{
  [self tasDeviceCertPmsCustId:argsFromReactNative];
}

RCT_EXPORT_METHOD( tasLogout )
{
  [self tasLogoutPms];
}

RCT_EXPORT_METHOD( tasSetting : (NSDictionary *) argsFromReactNative )
{
  [self tasSettingPms:argsFromReactNative];
}

RCT_EXPORT_METHOD( tasSendReadMsgEvent : (NSDictionary *) argsFromReactNative )
{
  [self tasSendReadMsgEventPms:argsFromReactNative];
}

@end
