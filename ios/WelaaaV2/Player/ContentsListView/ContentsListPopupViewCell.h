
#import <UIKit/UIKit.h>

@protocol ContentsListPopupViewCellDelegate;

@interface ContentsListPopupViewCell : UITableViewCell
@property (nonatomic, weak) id <ContentsListPopupViewCellDelegate> delegate;
@property (nonatomic, strong) NSDictionary *itemDict;
@property (nonatomic, assign) NSInteger index;
@property (nonatomic, assign) NSString *teacherName;
@property (nonatomic, assign) NSString *groupTitle;
@property (nonatomic, assign) BOOL isSelected;
@property (nonatomic, assign) BOOL isAudioContentType;
@property (nonatomic, assign) BOOL isPreviewMode;

- (void)updateCell;

@end

@protocol ContentsListPopupViewCellDelegate <NSObject>
@optional
- (void) playListPopupViewCell : (ContentsListPopupViewCell *) cell
                 selectedIndex : (NSInteger) index;
@end
