
#import <UIKit/UIKit.h>

#import "UIImage+TintColor.h"
#import "IFPlayListPopupViewCell.h"
#import "ApiManager.h"

@protocol IFPlayListPopupViewDelegate;

@interface IFPlayListPopupView : UIView

@property (nonatomic, weak) id <IFPlayListPopupViewDelegate> delegate;
@property (nonatomic, strong) NSArray *playList;
@property (nonatomic, assign) BOOL isAudioContentType;
@property (nonatomic, assign) NSInteger currentPlayIndex;
@property (nonatomic, assign) BOOL isAuthor;

- (void) start;
- (void) setTitle: (NSString *) title;
- (void) reOrderSubviews;
@end

@protocol IFPlayListPopupViewDelegate <NSObject>
@optional

- (void) playListPopupView: (IFPlayListPopupView *) view
                 closeView: (id) sender;
- (void) playListPopupView: (IFPlayListPopupView *) view
        selectedOtherIndex: (NSInteger) index;

@end
