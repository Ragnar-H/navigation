/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "NVSceneController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  
  self.bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation moduleProvider:nil launchOptions:launchOptions];  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

  NSString *title = @"North";
  NSString *appKey = @"medley";

  UIViewController *sceneController = [[NVSceneController alloc] init:0 tab:0 title:title appKey:appKey];
  UINavigationController *navigationController = [[UINavigationController alloc] initWithRootViewController:sceneController];

  self.window.rootViewController = navigationController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
