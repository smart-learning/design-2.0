
#import <UIKit/UIKit.h>

#import "UIImage+TintColor.h"
#import "ContentsListPopupViewCell.h"
#import "ApiManager.h"

@protocol ContentsListPopupViewDelegate;

@interface ContentsListPopupView : UIView

@property (nonatomic, weak) id <ContentsListPopupViewDelegate> delegate;
//@property (nonatomic, strong) NSArray *playList;
@property (nonatomic, strong) NSDictionary *contentsInfoDictionary;
@property (nonatomic, assign) BOOL isAudioContentType;
@property (nonatomic, assign) NSInteger currentPlayIndex;
@property (nonatomic, assign) BOOL isAuthor;

- (void) start;
- (void) setTitle : (NSString *) title;
- (void) reOrderSubviews;
@end

@protocol ContentsListPopupViewDelegate <NSObject>
@optional

- (void) playListPopupView : (ContentsListPopupView *) view
                 closeView : (id) sender;
- (void) playListPopupView : (ContentsListPopupView *) view
        selectedOtherIndex : (NSInteger) index;

@end
