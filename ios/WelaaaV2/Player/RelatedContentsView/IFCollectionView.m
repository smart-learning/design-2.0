
#import "IFCollectionView.h"
#import "InnerShadowView.h"

#pragma mark - IFTableViewCell (Interface + Implementation)
@interface IFTableViewCell : UITableViewCell

@property (nonatomic, strong) UICollectionView *collectionView;
@property (nonatomic, strong) IFReusableView *bgView;

- (id) initWithReuseIdentifier : (NSString *) reuseIdentifier
                      delegate : (id) delegate;

@end

@implementation IFTableViewCell

- (id) initWithReuseIdentifier : (NSString *) reuseIdentifier
                      delegate : delegate
{
    self = [super initWithStyle : UITableViewCellStyleDefault
                reuseIdentifier : reuseIdentifier];
    
    if ( self )
    {
        self.selectionStyle = UITableViewCellSelectionStyleNone;
        
        UICollectionViewFlowLayout *myFlowLayout = [[UICollectionViewFlowLayout alloc] init];
        myFlowLayout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
        myFlowLayout.minimumInteritemSpacing = 0;
        myFlowLayout.minimumLineSpacing = 0;
        _collectionView = [[UICollectionView alloc] initWithFrame : self.bounds
                                             collectionViewLayout : myFlowLayout];
        _collectionView.dataSource = delegate;
        _collectionView.delegate = delegate;
        _collectionView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
        [self addSubview : _collectionView];
        _collectionView.backgroundColor = [UIColor clearColor]; // flowable한 collectionView의 배경색
    }
    
    return self;
}

- (void) configBgView : (IFReusableView *) view
{
    if ( _bgView )
    {
        [_bgView removeFromSuperview];
    }
    
    view.frame = self.bounds;
    view.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    [self insertSubview : view
           belowSubview : _collectionView];
  //[self addSubview:view];
    [self bringSubviewToFront : _collectionView];
    self.bgView = view;
}

@end


#pragma mark - ReusableViewObject (Interface + Implementation)
@interface ReusableViewObject : NSObject

@property (nonatomic, assign) Class viewClass;
@property (nonatomic, strong) NSMutableArray *viewQueue;

@end

@implementation ReusableViewObject

- (id) init
{
    self = [super init];
    
    if ( self )
    {
        _viewQueue = [NSMutableArray array];
    }
    
    return self;
}

@end


#pragma mark - IFReusableView (Implementation)
@implementation IFReusableView

- (id) initWithFrame : (CGRect) frame
{
    self = [super initWithFrame : frame];
    
    if ( self ) {}
    
    return self;
}

@end


#pragma mark - IFCollectionView (Interface + Implementation)

//#import "HomeViewController.h"
#import "AppDelegate.h"

@interface IFCollectionView () < UITableViewDelegate, UITableViewDataSource, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout >
{    
    NSMutableDictionary *registeredCellClasses;
    NSMutableDictionary *managedReusableViews;
    NSMutableDictionary *managedCollectionViews;
    NSIndexPath *selectedIndexPath;
    NSMutableDictionary *savedContentOffset;
}

@end

@implementation IFCollectionView

- (id) initWithFrame : (CGRect) frame
{
    self = [super initWithFrame : frame];
    
    if ( self )
    {
        _contentView = [[UITableView alloc] init];
        _contentView.dataSource = self;
        _contentView.delegate = self;
        _contentView.frame = self.bounds;
        _contentView.backgroundColor = UIColorFromRGB(0x272230, 1.f);    // tableView의 배경색
        [self addSubview : _contentView];
        _contentView.separatorStyle = UITableViewCellSeparatorStyleNone;
        
        UIButton *closeButton = [UIButton buttonWithType : UIButtonTypeCustom];
        UIImage *btnImage = [UIImage imageNamed : @"btn_close_recommend"];
        [closeButton addTarget : self
                        action : @selector(closeView:)
              forControlEvents : UIControlEventTouchUpInside];
        [closeButton setImage : btnImage
                     forState : UIControlStateNormal];
        closeButton.frame = CGRectMake(self.frame.size.width-35.0f, 15.0f, 20, 20);
      //closeButton.backgroundColor = [UIColor yellowColor];
        [self addSubview : closeButton];
    }
    
    return self;
}

- (void) setFrame : (CGRect) frame
{
    [super setFrame : frame];
    [_contentView setFrame:(CGRect){.origin = CGPointZero, .size = frame.size}];
}

- (void)     registerClass : (Class) cellClass
forCellWithReuseIdentifier : (NSString *) identifier
{
    if ( registeredCellClasses == nil )
    {
        registeredCellClasses = [NSMutableDictionary dictionary];
    }
    
    [registeredCellClasses setValue : cellClass
                             forKey : identifier];
}

- (void)                      registerClass : (Class) viewClass
forSectionBackgroundViewWithReuseIdentifier : (NSString *) identifier
{
    if ( managedReusableViews == nil )
    {
        managedReusableViews = [NSMutableDictionary dictionary];
    }
    
    ReusableViewObject *reusableViewObject = [[ReusableViewObject alloc] init];
    reusableViewObject.viewClass = viewClass;   
    [managedReusableViews setObject : reusableViewObject
                             forKey : identifier];
}

- (id) dequeueReusableCellWithReuseIdentifier : (NSString *) identifier
                                 forIndexPath : (NSIndexPath *) indexPath
{
    UICollectionView *collectionView = [self getManagedCollectionViewForIndex : indexPath.section];
    
    return [collectionView dequeueReusableCellWithReuseIdentifier : identifier
                                                     forIndexPath : [NSIndexPath indexPathForItem : indexPath.item
                                                                                        inSection : 0]];
}

- (void) enqueueReusableView : (IFReusableView *) view
{
    if ( managedReusableViews == nil )
    {
        managedReusableViews = [NSMutableDictionary dictionary];
    }
    
    if ( ![view isKindOfClass : [IFReusableView class]] )
    {
        return ;
    }
    
    ReusableViewObject *reuseViewObject = [managedReusableViews objectForKey : view.reuseIdentifier];
    
    if ( reuseViewObject )
    {
        if ( [view isKindOfClass : reuseViewObject.viewClass] )
        {
            [reuseViewObject.viewQueue addObject : view];
        }
    }
}

- (id) dequeueReusableViewWithReuseIdentifier : (NSString *) identifier
{
    if ( managedReusableViews == nil )
    {
        return nil;
    }
    
    ReusableViewObject *reuseViewObject = [managedReusableViews objectForKey : identifier];
    
    if ( reuseViewObject )
    {
        if ( reuseViewObject.viewQueue.count > 0 )
        {
            IFReusableView *reusableView = reuseViewObject.viewQueue.lastObject;
            [reuseViewObject.viewQueue removeLastObject];
            
            return reusableView;
        }
        else
        {
            IFReusableView *newView = [[reuseViewObject.viewClass alloc] initWithFrame : CGRectZero];
            newView.reuseIdentifier = identifier;
            
            return newView;
        }
    }
    else
    {
        return nil;
    }
}

- (void) collectionView : (UICollectionView *) collectionView
    registerCellClasses : (NSDictionary *) classes
{
    for ( NSString *identifier in [classes allKeys] )
    {
        [collectionView registerClass : [classes valueForKey : identifier]
           forCellWithReuseIdentifier : identifier];
    }
}

//
// '닫기 버튼' 이벤트
//
- (void) closeView : (UIButton *) sender
{
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      self.frame = CGRectMake(0, self.superview.frame.size.height, self.superview.frame.size.width, 0);
                                  }
                     completion : ^(BOOL finished)
                                  {
                                     AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
                                   /*
                                     HomeViewController *homeViewController = [app getHomeViewController];
                                     
                                     if ( [homeViewController respondsToSelector: @selector(closePlayer)] )
                                     {
                                         [homeViewController closePlayer];
                                     }
                                    */
                                  }];
}

#pragma mark - customedCollectionView DataSource

- (NSInteger) customedCollectionView : (IFCollectionView *) collectionView
              numberOfItemsInSection : (NSInteger) section
{
    if ( [self.dataSource respondsToSelector : @selector(customedCollectionView:numberOfItemsInSection:)] )
    {
        return [self.dataSource customedCollectionView : collectionView
                                numberOfItemsInSection : section];
    }
    else
    {
        return 0;
    }
}

- (UICollectionViewCell *) customedCollectionView : (IFCollectionView *) collectionView
                           cellForItemAtIndexPath : (NSIndexPath *) indexPath
{
    if ( [self.dataSource respondsToSelector : @selector(customedCollectionView : cellForItemAtIndexPath:)] )
    {
        return [self.dataSource customedCollectionView : collectionView
                                cellForItemAtIndexPath : indexPath];
    }
    
    return nil;
}

- (NSInteger) numberOfSectionsIncustomedCollectionView : (IFCollectionView *) collectionView
{
    if ( [self.dataSource respondsToSelector : @selector(numberOfSectionsIncustomedCollectionView:)] )
    {
        return [self.dataSource numberOfSectionsIncustomedCollectionView : collectionView];
    }
    else
    {
        return 0;
    }
}

- (IFReusableView *) customedCollectionView : (IFCollectionView *) collectionView
                   backgroundViewForSection : (NSInteger) section
{
    if ( [self.dataSource respondsToSelector : @selector(customedCollectionView:backgroundViewForSection:)] )
    {
        return [self.dataSource customedCollectionView : collectionView
                              backgroundViewForSection : section];
    }
    else
    {
        return nil;
    }
}

#pragma mark - customedCollectionView Delegate

- (void) customedCollectionView : (IFCollectionView *) collectionView
       didSelectItemAtIndexPath : (NSIndexPath *) indexPath
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView:didSelectItemAtIndexPath:)] )
    {
        [self.delegate customedCollectionView : collectionView
                     didSelectItemAtIndexPath : indexPath];
    }
}

- (void) customedCollectionView : (IFCollectionView *) collectionView
     didDeselectItemAtIndexPath : (NSIndexPath *) indexPath
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView:didDeselectItemAtIndexPath:)] )
    {
        [self.delegate customedCollectionView : collectionView
                   didDeselectItemAtIndexPath : indexPath];
    }
}

- (CGFloat) customedCollectionView : (IFCollectionView *) collectionView
                   heightOfSection : (NSInteger) section
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView: heightOfSection:)] )
    {
        return [self.delegate customedCollectionView : collectionView
                                     heightOfSection : section];
    }
    else
    {
        return 50.0f;   // default : 44.0f
    }
}

- (CGSize) customedCollectionView : (IFCollectionView *) collectionView
           sizeForItemAtIndexPath : (NSIndexPath *) indexPath;
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView:sizeForItemAtIndexPath:)] )
    {
        return [self.delegate customedCollectionView : collectionView
                              sizeForItemAtIndexPath : indexPath];
    }
    else
    {
        return CGSizeZero;
    }
}

- (UIEdgeInsets) customedCollectionView : (IFCollectionView *) collectionView
                 insetForSectionAtIndex : (NSInteger) section;
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView:insetForSectionAtIndex:)] )
    {
        return [self.delegate customedCollectionView : collectionView
                              insetForSectionAtIndex : section];
    }
    else
    {
        return UIEdgeInsetsZero;
    }
}

- (CGFloat)  customedCollectionView : (IFCollectionView *) collectionView
minimumLineSpacingForSectionAtIndex : (NSInteger) section;
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView: minimumLineSpacingForSectionAtIndex:)] )
    {
        return [self.delegate customedCollectionView : collectionView
                 minimumLineSpacingForSectionAtIndex : section];
    }
    else
    {
        return 0;
    }
}

- (CGFloat)       customedCollectionView : (IFCollectionView *) collectionView
minimumInteritemSpacingForSectionAtIndex : (NSInteger) section;
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView: minimumInteritemSpacingForSectionAtIndex:)] )
    {
        return [self.delegate customedCollectionView : collectionView
            minimumInteritemSpacingForSectionAtIndex : section];
    }
    else
    {
        return 0;
    }
}

- (UIEdgeInsets) customedCollectionView : (IFCollectionView *) collectionView
    scrollContentInsetForSectionAtIndex : (NSInteger) section
{
    if ( [self.delegate respondsToSelector : @selector(customedCollectionView: scrollContentInsetForSectionAtIndex:)] )
    {
        return [self.delegate customedCollectionView : collectionView
                 scrollContentInsetForSectionAtIndex : section];
    }
    else
    {
        return UIEdgeInsetsZero;
    }
}

#pragma mark - UITableView DataSource

- (NSInteger) tableView : (UITableView *) tableView
  numberOfRowsInSection : (NSInteger) section
{
    return 1;
}

- (UITableViewCell *) tableView : (UITableView *) tableView
          cellForRowAtIndexPath : (NSIndexPath *) indexPath
{
    static NSString *CellIdentifier = @"Cell";
    IFTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier : CellIdentifier];
    
    if ( cell == nil )
    {
        cell = [[IFTableViewCell alloc] initWithReuseIdentifier : CellIdentifier
                                                       delegate : self];
        
        [self collectionView : cell.collectionView
         registerCellClasses : registeredCellClasses];
    }
    
    cell.collectionView.frame = UIEdgeInsetsInsetRect(cell.bounds, [self customedCollectionView : self
                                                            scrollContentInsetForSectionAtIndex : indexPath.section]);
    [self manageCollectionView : cell.collectionView
                      forIndex : indexPath.section];
    [cell.collectionView reloadData];
    [self restoreStateToCollectionView : cell.collectionView
                                forKey : [NSNumber numberWithInteger : indexPath.section]];
    
    IFReusableView *reusableBgView = [self customedCollectionView : self
                                         backgroundViewForSection : indexPath.section];
    [cell configBgView : reusableBgView];
    
    return cell;
}

- (NSInteger) numberOfSectionsInTableView : (UITableView *) tableView
{
    return [self numberOfSectionsIncustomedCollectionView : self];
}

#pragma mark - UITableView Delegate
// 헤더영역
- (UIView *) tableView : (UITableView *) tableView
viewForHeaderInSection : (NSInteger) section
{
    UIView *headerView = [[UIView alloc] initWithFrame : CGRectMake(0, 0, self.frame.size.width, 35.0f)];
    UILabel *headerLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    headerLabel.backgroundColor = [UIColor clearColor];
    headerLabel.opaque = NO;
    headerLabel.textColor = [UIColor whiteColor];
    headerLabel.highlightedTextColor = [UIColor whiteColor];
    headerLabel.font = [UIFont boldSystemFontOfSize : 18];
    headerLabel.frame = CGRectMake(25.0f, 40.0f, 300.0f, 30.0f);    // 60.0f, 40.0f, 300.0f, 30.0f
    
  //UIImageView *headerIcon = [[UIImageView alloc] initWithFrame : CGRectMake(25.0f, 40.0f, 30.0f, 30.0f)];  // 연관컨텐츠뷰 수정으로 주석처리하였습니다.
    
    if ( section == 0 )
    {
        headerLabel.text = [NSString stringWithFormat : @"같은 시리즈 강의"];
      //headerIcon.image = [UIImage imageNamed : @"icon_linked_series"];
    }
    else if ( section == 1 )
    {
        headerLabel.text = [NSString stringWithFormat : @"이 강의를 본 사람은 어떤 강의를 볼까?"];
      //headerIcon.image = [UIImage imageNamed : @"icon_linked_category"];
    }
    else if ( section == 2 )
    {
        headerLabel.text = [NSString stringWithFormat : @"이주의 종합 인기 강의"];
      //headerIcon.image = [UIImage imageNamed : @"icon_linked_heart"];
    }
    
    [headerView addSubview : headerLabel];
  //[headerView addSubview : headerIcon];
    
    return headerView;
}

- (CGFloat)    tableView : (UITableView *) tableView
heightForHeaderInSection : (NSInteger) section
{
    return 60;
}

- (CGFloat)   tableView : (UITableView *) tableView
heightForRowAtIndexPath : (NSIndexPath *) indexPath
{
    return [self customedCollectionView : self
                        heightOfSection : indexPath.section];
}

- (void)   tableView : (UITableView *) tableView
didEndDisplayingCell : (UITableViewCell *) cell
   forRowAtIndexPath : (NSIndexPath *) indexPath
{
//    NSLog(@"did end display cell for index path:%@",indexPath);
    if ( [cell isKindOfClass : [IFTableViewCell class]] && [[(IFTableViewCell *)cell bgView] isKindOfClass : [IFReusableView class]] )
    {
        [self enqueueReusableView : [(IFTableViewCell *) cell bgView]];
    }
}

#pragma mark - UICollectionView DataSource

- (NSInteger) collectionView : (UICollectionView *) collectionView
      numberOfItemsInSection : (NSInteger) section
{
    return [self customedCollectionView : self
                 numberOfItemsInSection : [self getManagedIndexOfCollectionView : collectionView]];
    
}

- (UICollectionViewCell *) collectionView : (UICollectionView *) collectionView
                   cellForItemAtIndexPath : (NSIndexPath *) indexPath
{
    return [self customedCollectionView : self
                 cellForItemAtIndexPath : [NSIndexPath indexPathForItem : indexPath.item
                                                              inSection : [self getManagedIndexOfCollectionView : collectionView]]];
}

#pragma mark - UICollectionView Delegate FlowLayout

- (void)  collectionView : (UICollectionView *) collectionView
didSelectItemAtIndexPath : (NSIndexPath *) indexPath
{
    NSIndexPath *correctedIndexPath = [NSIndexPath indexPathForItem : indexPath.item
                                                          inSection : [self getManagedIndexOfCollectionView : collectionView]];
    [self customedCollectionView : self
        didSelectItemAtIndexPath : correctedIndexPath];
    
    if ( selectedIndexPath.section == correctedIndexPath.section )
    {
        if ( selectedIndexPath.item == correctedIndexPath.item )
        {
            return ;
        }
        else
        {
            selectedIndexPath = correctedIndexPath;
        }
    }
    else
    {
        UICollectionView *selectedCollectionView = [self getManagedCollectionViewForIndex : selectedIndexPath.section];
        [selectedCollectionView deselectItemAtIndexPath : [NSIndexPath indexPathForItem : selectedIndexPath.item
                                                                              inSection : 0]
                                               animated : NO];
        [self customedCollectionView : self
          didDeselectItemAtIndexPath : selectedIndexPath];
        selectedIndexPath = correctedIndexPath;
    }
    
}

- (void)    collectionView : (UICollectionView *) collectionView
didDeselectItemAtIndexPath : (NSIndexPath *) indexPath
{
    [self customedCollectionView : self
      didDeselectItemAtIndexPath : [NSIndexPath indexPathForItem : indexPath.item
                                                       inSection : [self getManagedIndexOfCollectionView : collectionView]]];
}

- (CGSize) collectionView : (UICollectionView *) collectionView
                   layout : (UICollectionViewLayout*) collectionViewLayout
   sizeForItemAtIndexPath : (NSIndexPath *) indexPath
{
    return [self customedCollectionView : self
                 sizeForItemAtIndexPath : [NSIndexPath indexPathForItem : indexPath.item
                                                              inSection : [self getManagedIndexOfCollectionView : collectionView]]];
}

- (UIEdgeInsets) collectionView : (UICollectionView *) collectionView
                         layout : (UICollectionViewLayout*) collectionViewLayout
         insetForSectionAtIndex : (NSInteger) section
{
    return [self customedCollectionView : self
                 insetForSectionAtIndex : [self getManagedIndexOfCollectionView : collectionView]];
}

- (CGFloat)          collectionView : (UICollectionView *) collectionView
                             layout : (UICollectionViewLayout*) collectionViewLayout
minimumLineSpacingForSectionAtIndex : (NSInteger) section
{
    return [self customedCollectionView : self
    minimumLineSpacingForSectionAtIndex : [self getManagedIndexOfCollectionView : collectionView]];
}

- (CGFloat)               collectionView : (UICollectionView *) collectionView
                                  layout : (UICollectionViewLayout *) collectionViewLayout
minimumInteritemSpacingForSectionAtIndex : (NSInteger) section
{
    return [self  customedCollectionView : self
minimumInteritemSpacingForSectionAtIndex : [self getManagedIndexOfCollectionView : collectionView]];
}

#pragma mark - CollectionViews Management

- (void) manageCollectionView : (UICollectionView *) collectionView
                     forIndex : (NSInteger) index
{
    if ( managedCollectionViews == nil )
    {
        managedCollectionViews = [NSMutableDictionary dictionary];
    }
    
    if ( collectionView == nil )
    {
        return ;
    }
    
    if ( collectionView == [managedCollectionViews objectForKey : [NSNumber numberWithInteger : index]] )
    {
        return ;
    }
    
    NSArray *keyArray = [managedCollectionViews allKeysForObject : collectionView];
    
    if ( [keyArray count] )
    {
        [managedCollectionViews removeObjectsForKeys : keyArray];
        
        for ( id key in keyArray )
        {
            [self saveStateOfCollectionView : collectionView
                                     forKey : key];
        }
    }
    
    [managedCollectionViews setObject : collectionView
                               forKey : [NSNumber numberWithInteger : index]];
}

- (NSInteger) getManagedIndexOfCollectionView : (UICollectionView *) collectionView
{
    if ( managedCollectionViews == nil )
    {
        return NSNotFound;
    }

    NSArray *keyArray = [managedCollectionViews allKeysForObject : collectionView];
    
    if ( keyArray.count )
    {
        if ( keyArray.count > 1 )
        {
            NSLog(@"  Mutiple keys for same collectionView.");
            
            return NSNotFound;
        }
        else
        {
            NSNumber *key = [keyArray objectAtIndex : 0];
            
            return key.integerValue;
        }
        
    }
    else
    {
        return NSNotFound;
    }
}

- (UICollectionView *) getManagedCollectionViewForIndex : (NSInteger) index
{
    if ( managedCollectionViews == nil )
    {
        return nil;
    }
    
    return [managedCollectionViews objectForKey : [NSNumber numberWithInteger : index]];
}

- (void) saveStateOfCollectionView : (UICollectionView *) collectionView
                            forKey : (id) key
{
    if ( savedContentOffset == nil )
    {
        savedContentOffset = [NSMutableDictionary dictionary];
    }

    [savedContentOffset setObject : [NSValue valueWithCGPoint : collectionView.contentOffset]
                           forKey : key];
}

- (void) restoreStateToCollectionView : (UICollectionView *) collectionView
                               forKey : (id) key
{
    NSValue *offsetValue = [savedContentOffset objectForKey : key];
    
    if ( offsetValue )
    {
        collectionView.contentOffset = [offsetValue CGPointValue];
    }
    else
    {
        collectionView.contentOffset = CGPointZero;
    }
}

@end





















