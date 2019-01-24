
#import "AppDelegate.h"

@implementation AppDelegate

NSString *const kGCMMessageIDKey = @"gcm.message_id";

// Called when a notification is delivered to a foreground app.
- (void) userNotificationCenter : (UNUserNotificationCenter *) center
        willPresentNotification : (UNNotification *) notification
          withCompletionHandler : (void (^)(UNNotificationPresentationOptions options)) completionHandler
{
    NSLog(@"User Info : %@",notification.request.content.userInfo);
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
  
    [self handleRemoteNotification:[UIApplication sharedApplication] userInfo:notification.request.content.userInfo];
}

// Called to let your app know which action was selected by the user for a given notification.
- (void) userNotificationCenter : (UNUserNotificationCenter *) center
 didReceiveNotificationResponse : (UNNotificationResponse *) response
          withCompletionHandler : (void(^)(void)) completionHandler
{
    NSLog(@"  User Info : %@", response.notification.request.content.userInfo);
    completionHandler();
  
    [self handleRemoteNotification:[UIApplication sharedApplication] userInfo:response.notification.request.content.userInfo];
}

- (void) handleRemoteNotification : (UIApplication *) application
                         userInfo : (NSDictionary *) remoteNotif
{
    NSLog(@"  handleRemoteNotification");
    NSLog(@"  Handle Remote Notification Dictionary: %@", remoteNotif);
  
    [PMS receivePush:remoteNotif tagString:@"didReceive"]; // TAS
  
    // Handle Click of the Push Notification From Here...
    // You can write a code to redirect user to specific screen of the app here.
}

- (BOOL)          application : (UIApplication *) application
didFinishLaunchingWithOptions : (NSDictionary *) launchOptions
{
    // Push notification badge reset. 앱이 완전히 재구동되어야 뱃지가 디카운팅이 됨. 백그라운드에서 돌아올때는 여기서 리셋되지는 않습니다.
    if ( [UIApplication sharedApplication].applicationIconBadgeNumber != 0 )
    {
        [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
        NSLog(@"  All push badges removed.");
    }
  
    [common processCheckingUpdate];
  
    // Background Playback Enabled
    // Allow the app sound to continue to play when the screen is locked.
    //https://stackoverflow.com/questions/4771105/how-do-i-get-my-avplayer-to-play-while-app-is-in-background
    [[AVAudioSession sharedInstance] setCategory : AVAudioSessionCategoryPlayback
                                           error : nil];

    /** TAS **/
    [PMS setDelegate : self];
    [PMSConfig logEnable : YES];
    [PMSConfig apiLogEnable : YES];
  
    // noToken인 사용자를 수집하지 않을때 아래 함수 사용
    //    [PMSConfig noTokenBlocking:YES];
    if ( SYSTEM_VERSION_GREATERTHAN_OR_EQUALTO(@"10.0") )
    {
        UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
        center.delegate = self;
        [center requestAuthorizationWithOptions : (UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge)
                              completionHandler : ^(BOOL granted, NSError * _Nullable error)
                                                  {
                                                      if ( !error )
                                                      {
                                                          [[UIApplication sharedApplication] registerForRemoteNotifications];
                                                          NSLog(@"  Push registration success greater than or equals to 10.0");
                                                      }
                                                      else
                                                      {
                                                          NSLog(@"  Push registration FAILED");
                                                          NSLog(@"  ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );
                                                          NSLog(@"  SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );
                                                      }
                                                  }];
    }
    else
    {
        if ( [[UIApplication sharedApplication] respondsToSelector : @selector(registerForRemoteNotifications)] )
        {
            // Xcode5.x 이하에서 빌드 안됨
            UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert |
                                                            UIUserNotificationTypeBadge |
                                                            UIUserNotificationTypeSound);
            UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes : userNotificationTypes
                                                                                     categories : nil];
            [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
            [[UIApplication sharedApplication] registerForRemoteNotifications];
            NSLog(@"  Push registration success less than 10.0");
        
            if ( [UIApplication sharedApplication].currentUserNotificationSettings.types == UIUserNotificationTypeNone )
            {
                // 시스템 알림 설정 == OFF
            }
        }
        else
        {
            [[UIApplication sharedApplication] registerForRemoteNotificationTypes : (UIRemoteNotificationTypeAlert |
                                                                                     UIRemoteNotificationTypeBadge |
                                                                                     UIRemoteNotificationTypeSound)];
        
            if ( [UIApplication sharedApplication].enabledRemoteNotificationTypes == UIRemoteNotificationTypeNone )
            {
                // 시스템 알림 설정 == OFF
            }
        }
    }
  
    // 푸시에 의해 앱이 구동
    if ( launchOptions && [launchOptions objectForKey : UIApplicationLaunchOptionsRemoteNotificationKey] )
    {
        NSLog(@"  App has launched by Push");
        [PMS receivePush:launchOptions tagString:@"didFinish"];
    }
    /** TAS **/
  
    NSURL *jsCodeLocation;

#ifdef DEBUG
    jsCodeLocation = [ [RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot : @"index"
                                                                     fallbackResource : nil     ];
#else
    jsCodeLocation = [ [NSBundle mainBundle] URLForResource : @"main"
                                              withExtension : @"jsbundle" ];
#endif

    RCTRootView *rootView = [ [RCTRootView alloc] initWithBundleURL : jsCodeLocation
                                                         moduleName : @"WelaaaV2"
                                                  initialProperties : nil
                                                      launchOptions : launchOptions ];
  
    self.window = [ [UIWindow alloc] initWithFrame : [UIScreen mainScreen].bounds ];
  
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
  
    [self.window makeKeyAndVisible];
  
    [ [FBSDKApplicationDelegate sharedInstance] application : application
                              didFinishLaunchingWithOptions : launchOptions ];
  
    [ Fabric with : @[[Crashlytics class]] ];
    
    // Use Firebase library to configure APIs
    [FIRApp configure];
  
    // Set messaging delegate
    [FIRMessaging messaging].delegate = self;
  
    NSString *fcmToken = [FIRMessaging messaging].FCMToken;
    NSLog(@"  FCM registration token: %@", fcmToken);
  
    NSLog(@"  [DeviceInfo] This model    :  %@", [common getModel]);     // 171025 김태현
    NSLog(@"  [DeviceInfo] idForVendor   :  %@", [[[UIDevice currentDevice] identifierForVendor] UUIDString]);  // 171025 김태현
    NSLog(@"  [DeviceInfo] Cellular Type :  %@", [common getCellularType]);
    NSLog(@"  [DeviceInfo] Device Name   :  %@", [[UIDevice currentDevice] name]);
    [common getNetInterfaceNames];
  
    /** APPSFLYER INIT **/
    [AppsFlyerTracker sharedTracker].appsFlyerDevKey = @"SPtkhKkwYTZZsqUwQUjBMV";
    [AppsFlyerTracker sharedTracker].appleAppID = @"1250319483";
  
    [AppsFlyerTracker sharedTracker].delegate = self;
    /* Set isDebug to true to see AppsFlyer debug logs */
    [AppsFlyerTracker sharedTracker].isDebug = true;
  
    // APMS 트래킹 시작
    [TAS serviceStart]; // TAS 자동 수집 및 이벤트 수집 기능 사용(관련 함수 호출 필요-가이드 참고).

    return YES;
}

#pragma mark - Open URL

- (BOOL) application : (UIApplication *) application
             openURL : (NSURL *) url
             options : (NSDictionary<UIApplicationOpenURLOptionsKey, id> *) options
{
    BOOL handled = [ [FBSDKApplicationDelegate sharedInstance] application : application
                                                                   openURL : url
                                                         sourceApplication : options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                                annotation : options[UIApplicationOpenURLOptionsAnnotationKey]      ];
  
    if ( [KOSession isKakaoAccountLoginCallback : url] )
    {
        return [KOSession handleOpenURL : url];
    }
  
    // Reports app open from deep link for iOS 10
    [[AppsFlyerTracker sharedTracker] handleOpenUrl:url options:options];
  
    // Add any custom logic here.
    return handled;
}

//
// 홈버튼 두번 눌렀을때, 인앱구매할때, 화면 쓸어내릴때, 화면 쓸어올릴때 등등.
//
- (void) applicationWillResignActive : (UIApplication *) application
{
    // Load Multitask App Switcher Image.
    UIImageView *imageView = [[UIImageView alloc] initWithFrame : [self.window frame]];
    imageView.tag = 9999;
    // // iPhone X일 경우 다른 사이즈의 이미지파일로 교체하도록 분기처리 해야합니다.
    if ( [common hasNotch] )
        [imageView setImage : [UIImage imageNamed : @"iPhoneXBackgroundImage"]];
    else
        [imageView setImage : [UIImage imageNamed : @"iPhoneBackgroundImage"]];
  
    [self.window addSubview : imageView];
}

//
// 앱 활성화 로깅
// 일시적으로 Springboard에서 pause상태에서 다시 active상태로 돌아올때 호출됩니다.
//
- (void) applicationDidBecomeActive : (UIApplication *) application
{
    // Remove Multitask App Switcher Image.
    UIView *colorView = [self.window viewWithTag : 9999];
    [colorView removeFromSuperview];
  
    // Push notification badge reset. 백그라운드에서 돌아올 때 리셋됩니다.
    if ( [UIApplication sharedApplication].applicationIconBadgeNumber != 0 )
    {
        [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
        NSLog(@"  All push badges removed.");
    }
  
    [FBSDKAppEvents activateApp];
  
    [KOSession handleDidBecomeActive];
    //[self connectToFcm];
  
    // Track Installs, updates & sessions(app opens) (You must include this API to enable tracking)
    [[AppsFlyerTracker sharedTracker] trackAppLaunch];
}

#pragma mark - Firebase Cloud Messaging

- (void)         application : (UIApplication *) application
didReceiveRemoteNotification : (NSDictionary *) userInfo
      fetchCompletionHandler : (void (^) (UIBackgroundFetchResult)) completionHandler
{
    // If you are receiving a notification message while your app is in the background,
    // this callback will not be fired till the user taps on the notification launching the application.
    // TODO: Handle data of notification
  
    // With swizzling disabled you must let Messaging know about the message, for Analytics
    // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
    NSLog(@"userInfo : %@",userInfo);

    // Print message ID.
    if ( userInfo[kGCMMessageIDKey] )
    {
        NSLog(@"  Message ID: %@", userInfo[kGCMMessageIDKey]);
    }
  
    // iOS 10 will handle notifications through other methods
    if ( SYSTEM_VERSION_GREATERTHAN_OR_EQUALTO(@"10.0") )
    {
        NSLog(@"  iOS version >= 10. Let NotificationCenter handle this one.");
        // set a member variable to tell the new delegate that this is background
        return ;
    }
  
    NSLog(@"  HANDLE PUSH, didReceiveRemoteNotification: %@", userInfo);
  
    [PMS receivePush:userInfo tagString:@"didReceive"]; // TAS
  
    // custom code to handle notification content
  
    if ( [UIApplication sharedApplication].applicationState == UIApplicationStateInactive )
    {
        NSLog(@"  INACTIVE");
        completionHandler( UIBackgroundFetchResultNewData );
    }
    else if ( [UIApplication sharedApplication].applicationState == UIApplicationStateBackground )
    {
        NSLog(@"  BACKGROUND");
        completionHandler( UIBackgroundFetchResultNewData );
    }
    else
    {
        NSLog(@"  FOREGROUND");
        completionHandler( UIBackgroundFetchResultNewData );
    }
}

//
// Refresh token
//
- (void)          messaging : (FIRMessaging *) messaging
didReceiveRegistrationToken : (NSString *) fcmToken
{
    NSLog(@"  FCM registration token: %@", fcmToken);
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject : fcmToken
                                                         forKey : @"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName : @"FCMToken"
                                                        object : nil
                                                      userInfo : dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
}

//
// iOS 10 data message
// Receive data messages on iOS 10+ directly from FCM (bypassing APNs) when the app is in the foreground.
// To enable direct data messages, you can set [Messaging messaging].shouldEstablishDirectChannel to YES.
//
- (void) messaging : (FIRMessaging *) messaging
 didReceiveMessage : (FIRMessagingRemoteMessage *) remoteMessage
{
    NSLog(@"  Received data message: %@", remoteMessage.appData);
}

- (void)                             application : (UIApplication *) application
didFailToRegisterForRemoteNotificationsWithError : (NSError *) error
{
    NSLog(@"  Unable to register for remote notifications: %@", error);
  
    [PMS deviceCert]; //  TAS
}

//
// This function is added here only for debugging purposes, and can be removed if swizzling is enabled.
// If swizzling is disabled then this function must be implemented so that the APNs device token can be paired to the FCM registration token.
//
- (void)                             application : (UIApplication *) application
didRegisterForRemoteNotificationsWithDeviceToken : (NSData *) deviceToken
{
    NSLog(@"  APNs device token retrieved: %@", deviceToken);
  
    // With swizzling disabled you must set the APNs device token here.
    //[FIRMessaging messaging].APNSToken = deviceToken;
  
    // [PMS setPushToken : deviceToken]; // TAS
    //  비로그인 상태일 때는 아예 푸시 발송 대상에서 제외시키기 위해 토큰 등록하지 않는걸로 결론.
    //  앱 설치만 한 경우 아직 사용자의 약관 동의 등을 받지 않은 상태이기 때문에. 2019.1.24.
}

#pragma mark - Core Data stack

@synthesize persistentContainer = _persistentContainer;

- (NSPersistentContainer *) persistentContainer
{
    // The persistent container for the application.
    // This implementation creates and returns a container, having loaded the store for the application to it.
    @synchronized (self)
    {
        if ( _persistentContainer == nil )
        {
            _persistentContainer = [[NSPersistentContainer alloc] initWithName : @"influential_learning"];
          
            [_persistentContainer loadPersistentStoresWithCompletionHandler : ^(NSPersistentStoreDescription *storeDescription, NSError *error)
             {
               if ( error != nil )
               {
                   // Replace this implementation with code to handle the error appropriately.
                   // abort() causes the application to generate a crash log and terminate.
                   // You should not use this function in a shipping application, although it may be useful during development.
                 
                   /*
                    Typical reasons for an error here include:
                    * The parent directory does not exist, cannot be created, or disallows writing.
                    * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                    * The device is out of space.
                    * The store could not be migrated to the current model version.
                    Check the error message to determine what the actual problem was.
                    */
                   NSLog(@"  Unresolved error : %@\ninfo : %@", error, error.userInfo);
                   abort();
               }
             }];
        }
    }
  
    return _persistentContainer;
}

#pragma mark - Core Data Saving support

- (void) saveContext
{
    NSManagedObjectContext *context = self.persistentContainer.viewContext;
    NSError *error = nil;
    
    if ( [context hasChanges] && ![context save: &error] )
    {
        // Replace this implementation with code to handle the error appropriately.
        // abort() causes the application to generate a crash log and terminate.
        // You should not use this function in a shipping application, although it may be useful during development.
        NSLog(@"  Unresolved error : %@\ninfo : %@", error, error.userInfo);
        abort();
    }
}

- (NSManagedObjectContext *) managedObjectContext
{
    return self.persistentContainer.viewContext;
}

#pragma mark - AppsFlyer: Tracking Deep Linking

- (void) onConversionDataReceived : (NSDictionary *) installData
{
    //Handle Conversion Data (Deferred Deep Link)
}

- (void) onConversionDataRequestFailure : (NSError *) error
{
    NSLog(@"  AppsFlyer onConversionDataRequestFailure : %@", error);
}


- (void) onAppOpenAttribution : (NSDictionary *) attributionData
{
    //Handle Deep Link
    NSLog(@"  AppsFlyer onAppOpenAttribution : %@", attributionData);
}

- (void) onAppOpenAttributionFailure : (NSError *) error
{
    NSLog(@"  AppsFlyer onAppOpenAttributionFailure : %@", error);
}

// Reports app open from a Universal Link for iOS 9 or above
- (BOOL) application : (UIApplication *) application
continueUserActivity : (NSUserActivity *) userActivity
  restorationHandler : (void (^)(NSArray<id<UIUserActivityRestoring>> *restorableObjects)) restorationHandler
{
    [[AppsFlyerTracker sharedTracker] continueUserActivity : userActivity
                                        restorationHandler : restorationHandler];
  
    return YES;
}

#pragma mark - PMS Delegate implements

- (void) pmsDidReceivePush : (PMSModelMessage *) resultModel
                   Payload : (NSDictionary *) payload
                       Tag : (NSString *) tag
{
    // 이 함수는 호출되지 않을 수도 있다고 한다. 그래도 푸시 메시지는 나타난다고. 결국 Firebase 에서 보내주는 거기 때문에.(TAS 업체측의 설명)
    NSLog(@"  pmsDidReceivePush : %@ %@", resultModel, tag);
    NSLog(@"  payload : %@", payload);
  
    if ( resultModel && [resultModel isSuccess] )
    {
        // 메시지 읽음처리
        [PMS sendReadMsgEventWithMsgId : resultModel.msgId
                         CompleteBlock : ^(PMSResult *result)
                                         {
                                            if ( [result isSuccess] )
                                                NSLog(@"  sendReadMsgEventWithMsgId Complete: %@",resultModel.msgId);
                                            else
                                                NSLog(@"  sendReadMsgEventWithMsgId Fail: %@",resultModel.msgId);
                                         }];
    }
    else
    {
        // 메시지 읽음처리
        NSString *msgId = [NSString stringWithFormat : @"%@", [payload objectForKey : @"i"]];
        [PMS sendReadMsgEventWithMsgId : msgId
                         CompleteBlock : ^(PMSResult *result)
                                         {
                                            if ( [result isSuccess] )
                                                NSLog(@"  sendReadMsgEventWithMsgId Complete %@", msgId);
                                            else
                                                NSLog(@"  sendReadMsgEventWithMsgId Fail %@", msgId);
                                         }];
    }
}

- (void) pmsSetPushTokenComplete : (PMSResult *) result
{
    NSLog(@"  pmsSetPushTokenComplete : %@", result);
}

- (void) pmsSendClickMsgComplete : (PMSResult *) result
{
    NSLog(@"  pmsSendClickMsgComplete : %@", result);
}

- (void) pmsSendReadMsgComplete : (PMSResult *) result
{
    NSLog(@"  pmsSendReadMsgComplete : %@", result);
}

@end
