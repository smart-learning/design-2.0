/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import <CoreData/CoreData.h>

#import "common.h"
#import <Toast/UIView+Toast.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (nonatomic, strong) UIWindow *window;
@property (strong, nonatomic) UINavigationController *navigationController;
@property (readonly, strong) NSPersistentContainer *persistentContainer;
@property (nonatomic, assign) BOOL readyForPushMessage;

- (void) saveContext;
- (NSManagedObjectContext *) managedObjectContext;
- (void) showToast: (NSString *) text;

@end
