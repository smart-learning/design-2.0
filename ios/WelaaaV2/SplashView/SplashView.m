
#import "SplashView.h"

@interface SplashView ()
{
    AVPlayerLayer *_playerLayer;
    AVPlayer *_player;
    AVPlayerItem *_playerItem;
}

@end

@implementation SplashView

- (id) initWithFrame : (CGRect) frame
{
    if ( self = [super initWithFrame : frame] )
    {
        [self initSubviews];
    }
    
    return self;
}

- (void) initSubviews
{
    self.backgroundColor = [UIColor blackColor];
 
    _playerLayer = [[AVPlayerLayer alloc] init];
    [_playerLayer setHidden : YES];
    [_playerLayer setVideoGravity : AVLayerVideoGravityResizeAspect];
    [_playerLayer setFrame : CGRectZero];
    [self.layer addSublayer : _playerLayer];

    [self initPlayer];
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    if ( _playerLayer )
    {
        _playerLayer.frame = self.bounds;
    }
}

- (void) initPlayer
{
    NSString *url = [NSString stringWithFormat: @"http://welaaa.co.kr/splashmovie/welaaasplash_IOS.mp4"];

    _playerItem = [[AVPlayerItem alloc] initWithURL : [NSURL URLWithString : url]];
    
    [_playerItem addObserver : self
                  forKeyPath : @"status"
                     options : NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
                     context : MyStreamingMovieViewControllerPlayerItemStatusObserverContext];
    
    [[NSNotificationCenter defaultCenter] addObserver : self
                                             selector : @selector(playerItemDidReachEnd:)
                                                 name : AVPlayerItemDidPlayToEndTimeNotification
                                               object : _playerItem];

    _player = [[AVPlayer alloc] initWithPlayerItem : _playerItem];
    [_player addObserver : self
              forKeyPath : @"currentItem"
                 options : NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
                 context : MyStreamingMovieViewControllerCurrentItemObservationContext];
        
    [_player addObserver : self
              forKeyPath : @"currentItem.timedMetadata"
                 options : 0
                 context : MyStreamingMovieViewControllerTimedMetadataObserverContext];
    
    [_player addObserver : self
              forKeyPath : @"rate"
                 options : NSKeyValueObservingOptionInitial | NSKeyValueObservingOptionNew
                 context : MyStreamingMovieViewControllerRateObservationContext];
}

- (void) observeValueForKeyPath : (NSString *) path
                       ofObject : (id) object
                         change : (NSDictionary *) change
                        context : (void *) context
{
    /* AVPlayerItem "status" property value observer. */
    if ( context == MyStreamingMovieViewControllerPlayerItemStatusObserverContext )
    {
        AVPlayerStatus status = [[change objectForKey: NSKeyValueChangeNewKey] integerValue];
        
        switch ( status )
        {
            case AVPlayerStatusUnknown:
                NSLog(@"AVPlayerStatusUnknown");
                break;
                
            case AVPlayerStatusReadyToPlay:
                NSLog(@"AVPlayerStatusReadyToPlay");
                [_playerLayer setHidden:NO];
                [_player play];
                break;
                
            case AVPlayerStatusFailed:
                NSLog(@"AVPlayerStatusFailed");
                break;
        }
    }
    /* AVPlayer "rate" property value observer. */
    else if ( context == MyStreamingMovieViewControllerRateObservationContext )
    {
        if ( [_player rate] == 0.f )
        {
            [_player play];
        }
    }
    /* AVPlayer "currentItem" property observer.
     Called when the AVPlayer replaceCurrentItemWithPlayerItem:
     replacement will/did occur. */
    else if ( context == MyStreamingMovieViewControllerCurrentItemObservationContext )
    {
        AVPlayerItem *newPlayerItem = [change objectForKey: NSKeyValueChangeNewKey];
        
        /* New player item null? */
        if ( newPlayerItem == (id) [NSNull null] )
        {
        }
        else /* Replacement of player currentItem has occurred */
        {
            [_playerLayer setPlayer: _player];
            
            // Specifies that the player should preserve the video’s aspect ratio and fit the video within the layer’s bounds.
            _playerLayer.videoGravity = AVLayerVideoGravityResizeAspect;
        }
    }
    // Observe the AVPlayer "currentItem.timedMetadata" property to parse the media stream timed metadata.
    else if ( context == MyStreamingMovieViewControllerTimedMetadataObserverContext )
    {
        //메타데이터를 표현할 때..
        //NSArray* array = [[self.player currentItem] timedMetadata];
        //for (AVMetadataItem *metadataItem in array)
        //{
        //	apple sample code : stitchedStreamPlayer 참조할 것..
        //	[self handleTimedMetadata:metadataItem];
        //}
    }
    else
    {
        [super observeValueForKeyPath: path
                             ofObject: object
                               change: change
                              context: context];
    }
    
    return ;
}

- (void) playerItemDidReachEnd: (NSNotification *) aNotification
{
    [_player pause];
    
    [_playerItem removeObserver: self
                     forKeyPath: @"status"];
    
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: AVPlayerItemDidPlayToEndTimeNotification
                                                  object: _playerItem];
    
    [_player removeObserver: self
                 forKeyPath: @"currentItem"];
    [_player removeObserver: self
                 forKeyPath: @"currentItem.timedMetadata"];
    [_player removeObserver: self
                 forKeyPath: @"rate"];
    
    if ( _playerItem )
        _playerItem = nil;
    
    if ( _player )
        _player = nil;

    [UIView animateWithDuration: 0.3f
                          delay: 0
                        options: UIViewAnimationOptionAllowUserInteraction
                     animations: ^{
                                    self.alpha = 0.f;
                                 }
                     completion: ^(BOOL finished)
                                 {
                                     if ( [self.delegate respondsToSelector: @selector(splashView:didFinishedPlay:)] )
                                     {
                                         [self.delegate splashView: self
                                                   didFinishedPlay: nil];
                                     }
                                 }];
}

@end









