
#import "IFRecommendViewController.h"

#import "IFCollectionView.h"
#import "CollectionViewCellBox.h"
#import "InnerShadowView.h"

#import "AppDelegate.h"
//#import "HomeViewController.h"

#pragma mark - CustomCollectionViewCell (Interface + Implementation)
@interface CustomCollectionViewCell : UICollectionViewCell
@end

@implementation CustomCollectionViewCell
{
    CollectionViewCellBox *selectorBox;
}

- (id) initWithFrame : (CGRect) frame
{
    self = [super initWithFrame : frame];
    
    if ( self )
    {
        [self.contentView setBackgroundColor : UIColorFromRGB(0xb2372c38, 1.f)];
        
        selectorBox = [[CollectionViewCellBox alloc] initWithFrame : self.contentView.bounds];
    }
    
    return self;
}

- (void) setSelected : (BOOL) selected
{
    [super setSelected :  selected];
    
    if ( selected )
    {
        selectorBox.frame = self.contentView.bounds;
        [self.contentView addSubview : selectorBox];
    }
    else
    {
        [selectorBox removeFromSuperview];
    }
}

@end




#pragma mark - CustomBackgroundView (Interface + Implementation)
@interface CustomBackgroundView : IFReusableView
{
    InnerShadowView *shadowView;
}

@end

@implementation CustomBackgroundView

- (void) setFrame : (CGRect) frame
{
    [super setFrame : frame];
    shadowView.frame = CGRectInset(self.bounds, 10, 10);
}

- (id) initWithFrame : (CGRect) frame
{
    self = [super initWithFrame : frame];
    
    if ( self )
    {
        shadowView = [[InnerShadowView alloc] initWithFrame : CGRectZero];
        //[self addSubview : shadowView];
    }
    
    return self;
}

@end



#pragma mark - ViewController (Interface + Implementation)
@interface IFRecommendViewController () < IFCollectionViewDataSource, IFCollectionViewDelegate >

@end

@implementation IFRecommendViewController

NSMutableArray *_dataArray;

- (void) viewDidLoad
{
    [super viewDidLoad];
    
    IFCollectionView *testView = [[IFCollectionView alloc] initWithFrame : self.view.bounds];
    testView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    testView.dataSource = self;
    testView.delegate = self;
    [testView registerClass : [CustomCollectionViewCell class] forCellWithReuseIdentifier : @"CollectionViewCell"];
    [testView registerClass : [CustomBackgroundView class] forSectionBackgroundViewWithReuseIdentifier : @"Cell"];
    [self.view addSubview : testView];
}

- (void) didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

// IFContentsPlayerView에서 리스트의 마지막 영상이 끝나면 ckey를 여기로 전달하여 세팅합니다.
- (void) setDataWithCurrentCgid : (NSString *) cgidFromPlayer
{
    NSString *playlistSuggestUrl = [NSString stringWithFormat : @"https://api-dev.welaaa.com/api/v1.0/contents/playlist-suggest/%@", cgidFromPlayer];
    NSLog(@"  URL : %@", playlistSuggestUrl);
  
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL : [NSURL URLWithString : [NSString stringWithFormat : @"%@", playlistSuggestUrl]]];
    [request setHTTPMethod : @"GET"];
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [ApiManager sendSynchronousRequest : request
                                    returningResponse : &resp
                                                error : &error];
    
    NSString *jsonDataStr = [[NSString alloc] initWithData : data
                                                  encoding : NSUTF8StringEncoding];

    NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData : [jsonDataStr dataUsingEncoding : NSUTF8StringEncoding]
                                                                 options : NSJSONReadingAllowFragments
                                                                   error : &error];
    _dataArray = [jsonResponse mutableCopy];
    NSLog(@"  추천영상0 : %@", _dataArray[0]);
    NSLog(@"  추천영상1 : %@", _dataArray[1]);
    NSLog(@"  추천영상2 : %@", _dataArray[2]);
}

#pragma mark - customedCollectionView DataSource

- (NSInteger) customedCollectionView : (IFCollectionView *) collectionView
              numberOfItemsInSection : (NSInteger) section
{
    if ( section == 0 )
    {
        NSLog(@"  _dataArray[0][items] count: %lu", [_dataArray[0][@"items"] count]);
        return [_dataArray[0][@"items"] count];
    }
    else if ( section == 1 )
    {
        NSLog(@"  _dataArray[1][items] count: %lu", [_dataArray[1][@"items"] count]);
        return [_dataArray[1][@"items"] count];
    }
    else if ( section == 2 )
    {
        NSLog(@"  _dataArray[2][items] count: %lu", [_dataArray[2][@"items"] count]);
        return [_dataArray[2][@"items"] count];
    }
    
    return 6;
}

#define TITLE_LABEL_TAG     100001
#define IMAGE_VIEW_TAG      130001
#define NUMBER_LABEL_TAG    140001

- (UICollectionViewCell *) customedCollectionView : (IFCollectionView *) collectionView
                           cellForItemAtIndexPath : (NSIndexPath *) indexPath
{
    CustomCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier : @"CollectionViewCell"
                                                                               forIndexPath : indexPath];
    
    UILabel *titleLabel = (UILabel *) [cell.contentView viewWithTag : TITLE_LABEL_TAG];
    UIImageView *chImage = (UIImageView *) [cell.contentView viewWithTag : IMAGE_VIEW_TAG];
    UILabel *numberLabel = (UILabel *) [cell.contentView viewWithTag : NUMBER_LABEL_TAG];
  
    // 강의 썸네일
    if ( !chImage )
    {
        chImage = [[UIImageView alloc] initWithFrame : CGRectMake(0, 0, 165, 110)];  // (15, 10, 64, 90)
        chImage.tag = IMAGE_VIEW_TAG;
        [cell.contentView addSubview : chImage];
    }
    
    // 강의 제목
    if ( !titleLabel )
    {
        titleLabel = [[UILabel alloc] initWithFrame : CGRectMake(10, 59, 150, 45)];
        [titleLabel setNumberOfLines : 2];   // 자동 레이아웃의 다중 행
        titleLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
        titleLabel.backgroundColor = [UIColor clearColor];
        titleLabel.font = [UIFont fontWithName : @"SpoqaHanSans-Bold" size : 10];
        titleLabel.shadowColor = [UIColor colorWithWhite:0 alpha:0.2];
        titleLabel.shadowOffset = CGSizeMake(0, 1);
        titleLabel.tag = TITLE_LABEL_TAG;
        [chImage addSubview : titleLabel];
    }
    
    // 셀 번호
    if ( !numberLabel )
    {
        numberLabel = [[UILabel alloc] initWithFrame : CGRectMake(10, 10, 20, 15)];
        numberLabel.textColor = [UIColor whiteColor];
        numberLabel.textAlignment = NSTextAlignmentLeft;
        numberLabel.backgroundColor = [UIColor clearColor]; //UIColorFromRGB(0x66000000, 0.6);
        numberLabel.font = [UIFont fontWithName : @"Montserrat-Bold" size : 10];
        numberLabel.shadowColor = [UIColor colorWithWhite:0 alpha:0.2];
        numberLabel.shadowOffset = CGSizeMake(0, 1);
        numberLabel.tag = NUMBER_LABEL_TAG;
        [chImage addSubview : numberLabel];
    }
    
  
    
    NSURL *imageUrl;
    UIImage *image;
    NSDictionary *tempData;
    
    if ( indexPath.section == 0 )
    {
        tempData = [_dataArray[0] mutableCopy];
    }
    else if ( indexPath.section == 1 )
    {
        tempData = [_dataArray[1] mutableCopy];
    }
    else if ( indexPath.section == 2 )
    {
        tempData = [_dataArray[2] mutableCopy];
    }
  
    titleLabel.text = tempData[@"items"][indexPath.row][@"title"];
    imageUrl = [NSURL URLWithString : tempData[@"items"][indexPath.row][@"images"][@"wide"]];
    numberLabel.text = [NSString stringWithFormat : @"%ld", indexPath.row+1];    // 0번부터 시작하므로 +1 처리하였습니다.
    
    image = [UIImage imageWithData : [NSData dataWithContentsOfURL : imageUrl]];
    chImage.image = image;
    
    // Cell Radius
    cell.contentView.layer.cornerRadius = 1.0f; // 10.0f
    cell.contentView.layer.borderWidth = 0.5f;  // 1.0f
    cell.contentView.layer.borderColor = UIColorFromRGB(0x2c282f, 1.f).CGColor;
    cell.contentView.layer.masksToBounds = YES;
  
    return cell;
}

// 섹션 갯수 리턴
- (NSInteger) numberOfSectionsIncustomedCollectionView : (IFCollectionView *) collectionView
{
    return 3;
}

// UITableView의 cell안에 포함되는 UICollectionView
- (IFReusableView *) customedCollectionView : (IFCollectionView *) collectionView
                   backgroundViewForSection : (NSInteger) section
{
    CustomBackgroundView *view = [collectionView dequeueReusableViewWithReuseIdentifier : @"Cell"];
    view.backgroundColor = UIColorFromRGB(0x272230, 1.f);   // CollectionView의 배경색, tableView의 배경색과 동일.
    
    return view;
}

#pragma mark - CollectionView Delegate
// 셀 선택시 리턴
- (void) customedCollectionView : (IFCollectionView *) collectionView
       didSelectItemAtIndexPath : (NSIndexPath *) indexPath
{
  //NSString *ckey;
  //NSString *gkey;
    
    if ( indexPath.section == 0 )
    {
        //ckey = [[[slaveDataArray0 objectAtIndex : indexPath.row] valueForKey : @"ckey"] stringValue];
        //gkey = [[[slaveDataArray0 objectAtIndex : indexPath.row] valueForKey : @"groupkey"] stringValue];
    }
    else if ( indexPath.section == 1 )
    {
        //ckey = [[[slaveDataArray1 objectAtIndex : indexPath.row] valueForKey : @"ckey"] stringValue];
        //gkey = [[[slaveDataArray1 objectAtIndex : indexPath.row] valueForKey : @"groupkey"] stringValue];
    }
    else if ( indexPath.section == 2 )
    {
        //ckey = [[[slaveDataArray2 objectAtIndex: indexPath.row] valueForKey: @"ckey"] stringValue];
        //gkey = [[[slaveDataArray2 objectAtIndex: indexPath.row] valueForKey: @"groupkey"] stringValue];
    }
    
  //AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
    /*
    HomeViewController *controller = [app getHomeViewController];
    
    if ( [controller respondsToSelector : @selector(runContentsPlayerWithGroupKey:cKey:)] )
    {
        [controller runContentsPlayerWithGroupKey : gkey
                                             cKey : ckey];
    }
    */
}

// 셀 선택 해제시 리턴
- (void) customedCollectionView : (IFCollectionView *) collectionView
     didDeselectItemAtIndexPath : (NSIndexPath *) indexPath
{
  //NSLog(@"did deselect item at index path : %@", indexPath);
}

// 셀 크기 리턴
- (CGSize) customedCollectionView : (IFCollectionView *) collectionView
           sizeForItemAtIndexPath : (NSIndexPath *) indexPath
{
    return CGSizeMake(165, 110);    // 연관컨텐츠뷰 개편으로 셀 사이즈를 수정하였습니다. (280, 110)
}


// 컬렉션뷰의 높이
- (CGFloat) customedCollectionView : (IFCollectionView *) collectionView
                   heightOfSection : (NSInteger) section
{
    return 150;     // 기본값 : 90
}

- (UIEdgeInsets) customedCollectionView : (IFCollectionView *) collectionView
                 insetForSectionAtIndex : (NSInteger) section
{
    return UIEdgeInsetsMake(0, 0, 0, 0);
}

// 셀과 셀 사이의 간격
- (CGFloat)  customedCollectionView : (IFCollectionView *) collectionView
minimumLineSpacingForSectionAtIndex : (NSInteger) section
{
    return 15;    // 기본값 : 5
}

- (CGFloat)       customedCollectionView : (IFCollectionView *) collectionView
minimumInteritemSpacingForSectionAtIndex : (NSInteger) section
{
    return 2;
}

- (UIEdgeInsets) customedCollectionView : (IFCollectionView *) collectionView
    scrollContentInsetForSectionAtIndex : (NSInteger) section
{
    return UIEdgeInsetsMake(0, 20, 0, 0);    // 11, 11, 11, 11
}

@end
