/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <KakaoOpenSDK/KakaoOpenSDK.h>

#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

#import <AVFoundation/AVFoundation.h>

#import <AppsFlyerLib/AppsFlyerTracker.h>

#import <PMS/PMS.h>
#import <PMS/PMSConfig.h>

#import "common.h"

#import <UserNotifications/UserNotifications.h>

@import Firebase;

@interface AppDelegate : UIResponder <UIApplicationDelegate, UNUserNotificationCenterDelegate, FIRMessagingDelegate, UNUserNotificationCenterDelegate, AppsFlyerTrackerDelegate, PMSDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (strong, nonatomic) UINavigationController *navigationController;
@property (readonly, strong) NSPersistentContainer *persistentContainer;
@property (nonatomic, assign) BOOL readyForPushMessage;

- (void) saveContext;
- (NSManagedObjectContext *) managedObjectContext;

@end
