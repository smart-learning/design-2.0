
#import "MediaController.h"
#import "AppDelegate.h"


@implementation MediaController

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;


-(void)showMediaPicker {
  if(self.mediaPicker == nil) {
    self.mediaPicker = [[MPMediaPickerController alloc] initWithMediaTypes:MPMediaTypeAnyAudio];
    
    [self.mediaPicker setDelegate:self];
    [self.mediaPicker setAllowsPickingMultipleItems:NO];
    [self.mediaPicker setShowsCloudItems:NO];
    self.mediaPicker.prompt = @"Select song";
  }
  
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [delegate.window.rootViewController presentViewController:self.mediaPicker animated:YES completion:nil];
}


-(void) mediaPicker:(MPMediaPickerController *)mediaPicker didPickMediaItems:(MPMediaItemCollection *)mediaItemCollection {
  MPMediaItem *mediaItem = mediaItemCollection.items[0];
  NSURL *assetURL = [mediaItem valueForProperty:MPMediaItemPropertyAssetURL];
  
  [self.bridge.eventDispatcher sendAppEventWithName:@"SongPlaying" body:[mediaItem valueForProperty:MPMediaItemPropertyTitle]];
  
  NSError *error;
  
  self.player = [[AVAudioPlayer alloc] initWithContentsOfURL:assetURL error:&error];
  [self.player setDelegate:self];
  
  if (error) {
    NSLog(@"%@", [error localizedDescription]);
  } else {
    [self.player play];
  }
  
  hideMediaPicker();
  
}

-(void) mediaPickerDidCancel:(MPMediaPickerController *)mediaPicker {
  hideMediaPicker();
}

#pragma mark RCT_EXPORT

RCT_EXPORT_METHOD(showSongs) {
  [self showMediaPicker];
}

#pragma mark private-methods

void hideMediaPicker() {
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  [delegate.window.rootViewController dismissViewControllerAnimated:YES completion:nil];
}
@end
