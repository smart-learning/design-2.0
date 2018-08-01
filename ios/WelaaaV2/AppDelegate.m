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

@import Firebase;

@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)          application : (UIApplication *) application
didFinishLaunchingWithOptions : (NSDictionary *) launchOptions
{
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

// 홈버튼 두번 눌렀을때, 인앱구매할때, 화면 쓸어내릴때, 화면 쓸어올릴때 등등.
- (void) applicationWillResignActive : (UIApplication *) application
{
    UIView *colorView = [ [UIView alloc] initWithFrame : [self.window frame] ];
    colorView.tag = 9999;
    CGFloat hue = ( arc4random() % 256 / 256.0 );  //  0.0 to 1.0
    CGFloat saturation = ( arc4random() % 128 / 256.0 ) + 0.5;  //  0.5 to 1.0, away from white
    CGFloat brightness = ( arc4random() % 128 / 256.0 ) + 0.5;  //  0.5 to 1.0, away from black
    UIColor *color = [UIColor colorWithHue : hue
                                saturation : saturation
                                brightness : brightness
                                     alpha : 1        ];
    colorView.backgroundColor = color;
    [self.window addSubview : colorView];
    [self.window bringSubviewToFront : colorView];
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

@end
