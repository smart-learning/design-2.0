
#import <UIKit/UIKit.h>

@protocol IFPlayListPopupViewCellDelegate;

@interface IFPlayListPopupViewCell : UITableViewCell
@property (nonatomic, weak) id <IFPlayListPopupViewCellDelegate> delegate;
@property (nonatomic, strong) NSDictionary *itemDict;
@property (nonatomic, assign) NSInteger index;
@property (nonatomic, assign) BOOL isSelected;
@property (nonatomic, assign) BOOL isAudioContentType;
@property (nonatomic, assign) BOOL isPreviewMode;

- (void)updateCell;

@end

@protocol IFPlayListPopupViewCellDelegate <NSObject>
@optional
- (void) playListPopupViewCell: (IFPlayListPopupViewCell *) cell
                 selectedIndex: (NSInteger) index;
@end
