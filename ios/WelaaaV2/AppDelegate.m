/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

@implementation AppDelegate

NSString *const kGCMMessageIDKey = @"gcm.message_id";

- (BOOL)          application : (UIApplication *) application
didFinishLaunchingWithOptions : (NSDictionary *) launchOptions
{
    // Push notification badge reset. 앱이 완전히 재구동되어야 뱃지가 디카운팅이 됨. 백그라운드에서 돌아올때는 여기서 리셋되지는 않습니다.
    if ( [UIApplication sharedApplication].applicationIconBadgeNumber != 0 )
    {
        [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
        NSLog(@"  All push badges removed.");
    }
  
    // Background Playback Enabled
    // Allow the app sound to continue to play when the screen is locked.
    //https://stackoverflow.com/questions/4771105/how-do-i-get-my-avplayer-to-play-while-app-is-in-background
    [[AVAudioSession sharedInstance] setCategory : AVAudioSessionCategoryPlayback
                                           error : nil];
  
    NSURL *jsCodeLocation;
/*
#ifdef DEBUG
    jsCodeLocation = [ [RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot : @"index"
                                                                     fallbackResource : nil     ];
#else
    jsCodeLocation = [ [NSBundle mainBundle] URLForResource : @"main"
                                              withExtension : @"jsbundle" ];
#endif
*/
    jsCodeLocation = [ [NSBundle mainBundle] URLForResource : @"main"
                                              withExtension : @"jsbundle" ];
  
    RCTRootView *rootView = [ [RCTRootView alloc] initWithBundleURL : jsCodeLocation
                                                         moduleName : @"WelaaaV2"
                                                  initialProperties : nil
                                                      launchOptions : launchOptions ];
  
    rootView.backgroundColor = [ [UIColor alloc] initWithRed : 1.0f
                                                       green : 1.0f
                                                        blue : 1.0f
                                                       alpha : 1   ];
  
    self.window = [ [UIWindow alloc] initWithFrame : [UIScreen mainScreen].bounds ];
  
    UIViewController *rootViewController = [UIViewController new];
    rootViewController.view = rootView;
    self.window.rootViewController = rootViewController;
  /*
    // UINavigationView 방식을 다시 사용하려면 RNNativePlayer에서 pushViewController 부분을 주석해제하시기 바랍니다.
    UIViewController *rootViewController = [UIViewController new];
    UINavigationController *navigationController = [[UINavigationController alloc]initWithRootViewController:rootViewController];
    navigationController.navigationBarHidden = YES;
    rootViewController.view = rootView;
    self.window.rootViewController = navigationController;
  */
    [self.window makeKeyAndVisible];
  
    [ [FBSDKApplicationDelegate sharedInstance] application : application
                              didFinishLaunchingWithOptions : launchOptions ];
  
    [ Fabric with : @[[Crashlytics class]] ];
    
    // Use Firebase library to configure APIs
    [FIRApp configure];
  
    // Set messaging delegate
    [FIRMessaging messaging].delegate = self;
  
    // Register for remote notifications.
    // This shows a permission dialog on first run, to show the dialog at a more appropriate time move this registration accordingly.
    if ( [UNUserNotificationCenter class] != nil )
    {
        // iOS 10 or later
        // For iOS 10 display notification (sent via APNS)
        [UNUserNotificationCenter currentNotificationCenter].delegate = self;
        UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
        [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions : authOptions
                                                                            completionHandler : ^(BOOL granted, NSError * _Nullable error)
        {
          //[[UIApplication sharedApplication] registerForRemoteNotifications];
        }];
    }
    else
    {
      // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
      /*
      UIUserNotificationType allNotificationTypes = (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
      UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
      [application registerUserNotificationSettings:settings];
      */
    }
  
    [[UIApplication sharedApplication] registerForRemoteNotifications];
  
  
  
    NSString *fcmToken = [FIRMessaging messaging].FCMToken;
    NSLog(@"  FCM registration token: %@", fcmToken);
  
    NSLog(@"  [DeviceInfo] This model    :  %@", [common getModel]);     // 171025 김태현
    NSLog(@"  [DeviceInfo] idForVendor   :  %@", [[[UIDevice currentDevice] identifierForVendor] UUIDString]);  // 171025 김태현
    NSLog(@"  [DeviceInfo] Cellular Type :  %@", [common getCellularType]);
    NSLog(@"  [DeviceInfo] Device Name   :  %@", [[UIDevice currentDevice] name]);
    [common getNetInterfaceNames];
    
    return YES;
}

#pragma mark - Open URL
- (BOOL) application : (UIApplication *) application
             openURL : (NSURL *) url
   sourceApplication : (NSString *) sourceApplication
          annotation : (id) annotation
{
    if ( [KOSession isKakaoAccountLoginCallback : url] )
    {
      return [KOSession handleOpenURL : url];
    }
  
    return YES;
}

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
    {
        [imageView setImage : [UIImage imageNamed : @"iPhoneXBackgroundImage"]];
    }
    else
    {
        [imageView setImage : [UIImage imageNamed : @"iPhoneBackgroundImage"]];
    }
  
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
}

#pragma mark - Firebase Cloud Messaging
/*
 * https://github.com/firebase/quickstart-ios/blob/master/messaging/MessagingExample/ViewController.m
 * 정상적인 구현 및 테스트가 완료되면 불필요한 코드를 추후에 제거해야 합니다.
 */

//
// Start receive message
//
- (void)         application : (UIApplication *) application
didReceiveRemoteNotification : (NSDictionary *) userInfo
{
    // If you are receiving a notification message while your app is in the background,
    // this callback will not be fired till the user taps on the notification launching the application.
    // TODO: Handle data of notification
  
    // With swizzling disabled you must let Messaging know about the message, for Analytics
    // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
    // Print message ID.
    if ( userInfo[kGCMMessageIDKey] )
    {
        NSLog(@"  Message ID: %@", userInfo[kGCMMessageIDKey]);
    }
  
    // Print full message.
    NSLog(@"  %@", userInfo);
}
- (void)         application : (UIApplication *) application
didReceiveRemoteNotification : (NSDictionary *) userInfo
      fetchCompletionHandler : (void (^) (UIBackgroundFetchResult)) completionHandler
{
    // If you are receiving a notification message while your app is in the background,
    // this callback will not be fired till the user taps on the notification launching the application.
    // TODO: Handle data of notification
  
    // With swizzling disabled you must let Messaging know about the message, for Analytics
    // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
    // Print message ID.
    if ( userInfo[kGCMMessageIDKey] )
    {
      NSLog(@"  Message ID: %@", userInfo[kGCMMessageIDKey]);
    }
  
    // Print full message.
    NSLog(@"  %@", userInfo);
  
    completionHandler(UIBackgroundFetchResultNewData);
}

//
// START ios_10_message_handling
// Receive displayed notifications for iOS 10 devices.
// Handle incoming notification messages while app is in the foreground.
//
- (void) userNotificationCenter : (UNUserNotificationCenter *) center
        willPresentNotification : (UNNotification *) notification
          withCompletionHandler : (void (^) (UNNotificationPresentationOptions)) completionHandler
{
    NSDictionary *userInfo = notification.request.content.userInfo;
  
    // With swizzling disabled you must let Messaging know about the message, for Analytics
    // [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  
    // Print message ID.
    if ( userInfo[kGCMMessageIDKey] )
    {
        NSLog(@"  Message ID: %@", userInfo[kGCMMessageIDKey]);
    }
  
    // Print full message.
    NSLog(@"  %@", userInfo);
  
    // Change this to your preferred presentation option
    completionHandler(UNNotificationPresentationOptionNone);
}

// Handle notification messages after display notification is tapped by the user.
- (void) userNotificationCenter : (UNUserNotificationCenter *) center
 didReceiveNotificationResponse : (UNNotificationResponse *) response
          withCompletionHandler : (void(^) (void)) completionHandler
{
    NSDictionary *userInfo = response.notification.request.content.userInfo;
  
    if ( userInfo[kGCMMessageIDKey] )
    {
      NSLog(@"  Message ID: %@", userInfo[kGCMMessageIDKey]);
    }
  
    // Print full message.
    NSLog(@"  %@", userInfo);
  
    completionHandler();
}
// [END ios_10_message_handling]

//
// Refresh token
//
- (void)          messaging : (FIRMessaging *) messaging
didReceiveRegistrationToken : (NSString *) fcmToken
{
    NSLog(@"FCM registration token: %@", fcmToken);
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
    // [FIRMessaging messaging].APNSToken = deviceToken;
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

@end









