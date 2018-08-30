/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <KakaoOpenSDK/KakaoOpenSDK.h>

#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

#import <AVFoundation/AVFoundation.h>

@import Firebase;

@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)          application : (UIApplication *) application
didFinishLaunchingWithOptions : (NSDictionary *) launchOptions
{
    // Background Playback Enabled
    // Allow the app sound to continue to play when the screen is locked.
    //https://stackoverflow.com/questions/4771105/how-do-i-get-my-avplayer-to-play-while-app-is-in-background
    [[AVAudioSession sharedInstance] setCategory : AVAudioSessionCategoryPlayback
                                           error : nil];
  
    NSURL *jsCodeLocation;
  
    jsCodeLocation = [ [RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot : @"index"
                                                                     fallbackResource : nil     ];
  
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
    [self.window makeKeyAndVisible];
  
    [ [FBSDKApplicationDelegate sharedInstance] application : application
                              didFinishLaunchingWithOptions : launchOptions ];
  
    [ Fabric with : @[[Crashlytics class]] ];
    
    // Use Firebase library to configure APIs
    [FIRApp configure];
  
    [FIRMessaging messaging].delegate = self;
    NSString *fcmToken = [FIRMessaging messaging].FCMToken;
    NSLog(@"  FCM registration token: %@", fcmToken);
  
    return YES;
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
                                      sourceApplication:(NSString *)sourceApplication
                                             annotation:(id)annotation {
  
  if ([KOSession isKakaoAccountLoginCallback:url]) {
    return [KOSession handleOpenURL:url];
  }
  
  return YES;
}


- (BOOL) application : (UIApplication *) application openURL : (NSURL *) url
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
    if ( [[common getModel] isEqualToString : @"iPhone X"] )
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
//
- (void) applicationDidBecomeActive : (UIApplication *) application
{
    // Remove Multitask App Switcher Image.
    UIView *colorView = [self.window viewWithTag : 9999];
    [colorView removeFromSuperview];
  
    [FBSDKAppEvents activateApp];
  
    [KOSession handleDidBecomeActive];
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









