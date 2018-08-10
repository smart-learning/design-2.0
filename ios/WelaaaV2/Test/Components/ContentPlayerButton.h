
#import <UIKit/UIKit.h>
#import "common.h"

@protocol ContentPlayerButtonDelegate;

@interface ContentPlayerButton : UIView

- (id) initWithId : (NSString *) buttonId
      normalImage : (NSString *) normalImage
 highlightedImage : (NSString *) highlightedImage
   maxActiveCount : (NSInteger) maxActiveCount;

- (void) setStatus : (NSInteger) status;
- (void) setText : (NSString *) text;
- (void) setImage : (NSString *) Image;

@property (nonatomic, weak) id <ContentPlayerButtonDelegate> delegate;
@end

@protocol ContentPlayerButtonDelegate <NSObject>
@optional
- (void) pressedPlayerButtonWithId : (NSString *) buttonId
                            status : (NSInteger) status;
@end
