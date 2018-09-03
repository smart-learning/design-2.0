
#import <UIKit/UIKit.h>
#import "common.h"

@class IFCollectionView;
@class IFReusableView;

@protocol IFCollectionViewDataSource < NSObject >
@required

- (NSInteger) customedCollectionView: (IFCollectionView *) collectionView
              numberOfItemsInSection: (NSInteger) section;

- (UICollectionViewCell *) customedCollectionView: (IFCollectionView *) collectionView
                           cellForItemAtIndexPath: (NSIndexPath *) indexPath;

@optional

- (NSInteger) numberOfSectionsIncustomedCollectionView: (IFCollectionView *) collectionView;

- (IFReusableView *) customedCollectionView: (IFCollectionView *) collectionView
                   backgroundViewForSection: (NSInteger) section;

@end

@protocol IFCollectionViewDelegate <NSObject>
@optional

- (void) customedCollectionView: (IFCollectionView *) collectionView
       didSelectItemAtIndexPath: (NSIndexPath *) indexPath;

- (void) customedCollectionView: (IFCollectionView *) collectionView
     didDeselectItemAtIndexPath: (NSIndexPath *) indexPath;

- (CGFloat) customedCollectionView: (IFCollectionView *) collectionView
                   heightOfSection:(NSInteger)section;

- (CGSize) customedCollectionView: (IFCollectionView *) collectionView
           sizeForItemAtIndexPath: (NSIndexPath *) indexPath;

- (UIEdgeInsets) customedCollectionView: (IFCollectionView *) collectionView
                 insetForSectionAtIndex: (NSInteger) section;

- (CGFloat)  customedCollectionView: (IFCollectionView *) collectionView
minimumLineSpacingForSectionAtIndex: (NSInteger) section;

- (CGFloat)       customedCollectionView: (IFCollectionView *) collectionView
minimumInteritemSpacingForSectionAtIndex: (NSInteger) section;

- (UIEdgeInsets) customedCollectionView: (IFCollectionView *) collectionView
    scrollContentInsetForSectionAtIndex: (NSInteger) section;

@end

@interface IFReusableView : UIView

@property (nonatomic, strong) NSString *reuseIdentifier;

- (id) initWithFrame: (CGRect) frame;

@end

@interface IFCollectionView : UIView

@property (nonatomic, strong) UITableView *contentView;
@property (nonatomic, weak) id <IFCollectionViewDataSource> dataSource;
@property (nonatomic, weak) id <IFCollectionViewDelegate> delegate;

- (void)     registerClass: (Class) cellClass
forCellWithReuseIdentifier: (NSString *) identifier;

- (void)                      registerClass: (Class) viewClass
forSectionBackgroundViewWithReuseIdentifier: (NSString *) identifier;

- (id) dequeueReusableCellWithReuseIdentifier: (NSString *) identifier
                                 forIndexPath: (NSIndexPath*) indexPath;

- (id) dequeueReusableViewWithReuseIdentifier: (NSString *) identifier;

@end
