#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

#import <MediaPlayer/MediaPlayer.h>

@import AVFoundation;

@interface MediaController : NSObject<RCTBridgeModule,MPMediaPickerControllerDelegate, AVAudioPlayerDelegate>

@property (nonatomic, retain) AVAudioPlayer *player;
@property (nonatomic, retain) MPMediaPickerController *mediaPicker;

- (void) showMediaPicker;

@end
