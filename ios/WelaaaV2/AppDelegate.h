/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>

#import "common.h"

@import Firebase;

@interface AppDelegate : UIResponder <UIApplicationDelegate, FIRMessagingDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (strong, nonatomic) UINavigationController *navigationController;
@property (readonly, strong) NSPersistentContainer *persistentContainer;
@property (nonatomic, assign) BOOL readyForPushMessage;

- (void) saveContext;
- (NSManagedObjectContext *) managedObjectContext;

@end
