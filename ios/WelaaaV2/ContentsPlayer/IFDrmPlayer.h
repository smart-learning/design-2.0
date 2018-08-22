
#import <UIKit/UIKit.h>

//#import "AquaNManagerSDK.h"
#import "IFDrmPlayerUiView.h"
#import "IFDrmMiniPlayerUiView.h"
#import "DbManager.h"

@protocol IFDrmPlayerDelegate;

@interface IFDrmPlayer : UIView

@property (nonatomic, weak) id <IFDrmPlayerDelegate> delegate;
@property (nonatomic, assign) BOOL isMiniPlayer;

@property (nonatomic, strong) NSString *videoUrl;
@property (nonatomic, strong) NSString *audioUrl;
@property (nonatomic, assign) BOOL isDownloadFile;

@property (nonatomic, strong) NSString *gkey;
@property (nonatomic, strong) NSString *ckey;
@property (nonatomic, assign) BOOL isAuthor;

- (void) rotateLayoutSubview: (CGSize) size;

- (void) playWithUrl: (NSString *) url
         initialTime: (CGFloat) initialTime
         scirptArray: (NSArray *) scriptArray
      isAudioContent: (BOOL) isAudioContent;

- (void) setLectureTitle: (NSString *) lTitle
            contentTitle: (NSString *) cTitle
       audioBackImageUrl: (NSString *) audioBackImgUrl;

- (void) destroyPlayerView;
- (void) play;
- (void) pause;

//- (AquaPlayerPlaybackState) getPlayStatus;
- (CGFloat) getPlaybackTime;

- (void) changedPlayerMode: (BOOL) isMiniPlayer;

- (void) stopLogTimer;

@end

@protocol IFDrmPlayerDelegate <NSObject>
@optional
- (void) player: (IFDrmPlayer *) view
      closeView: (id) sender;

- (void) player: (IFDrmPlayer *) view
       openView: (id) sender;

- (void) player: (IFDrmPlayer *) view
didFinishedPlay: (id) sender;

- (void)    player: (IFDrmPlayer *) view
didChangedPlayTime: (CGFloat) sec;

- (NSString *) player: (IFDrmPlayer *) view
        getGroupTitle:(id)sender;

- (NSArray *) player: (IFDrmPlayer *) view
      getContentList:(id)sender;

- (NSInteger) player: (IFDrmPlayer *) view
     getCurrentIndex:(id)sender;

- (void)    player: (IFDrmPlayer *) view
selectedOtherIndex: (NSInteger) index;

- (void) player: (IFDrmPlayer *) view
 endMoviePlayer: (id) sender;

@end










