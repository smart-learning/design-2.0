
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

- (id) initWithFrame: (CGRect) frame
{
    self = [super initWithFrame: frame];
    
    if ( self )
    {
        [self.contentView setBackgroundColor: UIColorFromRGB(0xb2372c38, 1.f)];
        
        selectorBox = [[CollectionViewCellBox alloc] initWithFrame: self.contentView.bounds];
    }
    
    return self;
}

- (void) setSelected: (BOOL) selected
{
    [super setSelected: selected];
    
    if ( selected )
    {
        selectorBox.frame = self.contentView.bounds;
        [self.contentView addSubview: selectorBox];
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

- (void) setFrame: (CGRect) frame
{
    [super setFrame: frame];
    shadowView.frame = CGRectInset(self.bounds, 10, 10);
}

- (id) initWithFrame: (CGRect) frame
{
    self = [super initWithFrame: frame];
    
    if ( self )
    {
        shadowView = [[InnerShadowView alloc] initWithFrame: CGRectZero];
        //[self addSubview: shadowView];
    }
    
    return self;
}

@end




#pragma mark - ViewController (Interface + Implementation)
@interface IFRecommendViewController () < IFCollectionViewDataSource, IFCollectionViewDelegate >

@end

@implementation IFRecommendViewController

NSMutableArray *masterDataArray;
NSMutableArray *slaveDataArray0;
NSMutableArray *slaveDataArray1;
NSMutableArray *slaveDataArray2;
NSString *currentCkey;

- (void) viewDidLoad
{
    [super viewDidLoad];
    
    IFCollectionView *testView = [[IFCollectionView alloc] initWithFrame: self.view.bounds];
    testView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    testView.dataSource = self;
    testView.delegate = self;
    [testView registerClass: [CustomCollectionViewCell class] forCellWithReuseIdentifier: @"CollectionViewCell"];
    [testView registerClass: [CustomBackgroundView class] forSectionBackgroundViewWithReuseIdentifier: @"Cell"];
    [self.view addSubview: testView];
}

- (void) didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

// IFContentsPlayerView에서 리스트의 마지막 영상이 끝나면 ckey를 여기로 전달하여 세팅합니다.
- (void) setDataWithCurrentCkey: (NSString *) ckeyFromPlayer
{
    currentCkey = ckeyFromPlayer;
#if APPSTORE | ADHOC
    NSString *playlistSuggestUrl = [NSString stringWithFormat: @"http://%@/usingapp/playlist_suggest.php", BASE_DOMAIN];
#else
    NSString *playlistSuggestUrl = [NSString stringWithFormat: @"http://%@/usingapp/playlist_suggest.php", TEST_DOMAIN];
#endif
    NSString *post = [NSString stringWithFormat: @"ckey=%@", ckeyFromPlayer];
    NSData *postData = [post dataUsingEncoding: NSUTF8StringEncoding];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL: [NSURL URLWithString: [NSString stringWithFormat: @"%@", playlistSuggestUrl]]];
    [request setHTTPBody: postData];
    [request setHTTPMethod: @"POST"];
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [NSURLConnection sendSynchronousRequest: request
                                         returningResponse: &resp
                                                     error: &error];
    
    NSString *jsonDataStr = [[NSString alloc] initWithData: data
                                                  encoding: NSUTF8StringEncoding];
    
    NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData: [jsonDataStr dataUsingEncoding: NSUTF8StringEncoding]
                                                                 options: NSJSONReadingAllowFragments
                                                                   error: &error];
    
    NSDictionary *statusDictionary = jsonResponse[@"status"];
    NSDictionary *dataDictionary = jsonResponse[@"data"];
    
    // status가 200이면 정상이므로 뷰를 그려야하고, 아니라면 연관 컨텐츠 뷰를 뿌릴 일 없이 pass시켜야 합니다.
    if ( [[statusDictionary description] isEqualToString: @"200"] )
    {
        masterDataArray = [dataDictionary mutableCopy];   // dataDictionary는 'array of dictionaries'구조이므로 통째로 배열로 copy하였습니다.
      //NSLog(@"아래 3개의 타이틀은 연관 컨텐츠 뷰에서 3개의 CollectionView상단의 header에 넣을 제목입니다.");
        for ( int i = 0; i < [masterDataArray count]; i++ )
        {
          //NSLog(@"  title [%d] = %@", i, [[masterDataArray objectAtIndex: i] valueForKey: @"title"]);
        }
        
        NSMutableDictionary *tempDict;
        tempDict = [[[masterDataArray objectAtIndex: 0] valueForKey: @"data"] mutableCopy];
        slaveDataArray0 = [tempDict mutableCopy];
        tempDict = [[[masterDataArray objectAtIndex: 1] valueForKey: @"data"] mutableCopy];
        slaveDataArray1 = [tempDict mutableCopy];
        tempDict = [[[masterDataArray objectAtIndex: 2] valueForKey: @"data"] mutableCopy];
        slaveDataArray2 = [tempDict mutableCopy];
    }
}

#pragma mark - customedCollectionView DataSource

- (NSInteger) customedCollectionView: (IFCollectionView *) collectionView
              numberOfItemsInSection: (NSInteger) section
{
    if ( section == 0 )
    {
        return [slaveDataArray0 count];
    }
    else if ( section == 1 )
    {
        return [slaveDataArray1 count];
    }
    else if ( section == 2 )
    {
        return [slaveDataArray2 count];
    }
    
    return 6;
}

#define TITLE_LABEL_TAG     100001
//#define TUTOR_LABEL_TAG     110001
//#define TIME_LABEL_TAG      120001
#define IMAGE_VIEW_TAG      130001
#define NUMBER_LABEL_TAG    140001
//#define HIT_LABEL_TAG       150001
//#define STAR_LABEL_TAG      160001
//#define REVIEW_LABEL_TAG    170001

- (UICollectionViewCell *) customedCollectionView: (IFCollectionView *) collectionView
                           cellForItemAtIndexPath: (NSIndexPath *) indexPath
{
    CustomCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier: @"CollectionViewCell"
                                                                               forIndexPath: indexPath];
    
    UILabel *titleLabel = (UILabel *) [cell.contentView viewWithTag: TITLE_LABEL_TAG];
  //UILabel *tutorLabel = (UILabel *) [cell.contentView viewWithTag: TUTOR_LABEL_TAG];
  //UILabel *timeLabel = (UILabel *) [cell.contentView viewWithTag: TIME_LABEL_TAG];
    UIImageView *chImage = (UIImageView *) [cell.contentView viewWithTag: IMAGE_VIEW_TAG];
    UILabel *numberLabel = (UILabel *) [cell.contentView viewWithTag: NUMBER_LABEL_TAG];
  //UILabel *footerLabel;
  //UILabel *hitCountLabel = (UILabel *) [cell.contentView viewWithTag: HIT_LABEL_TAG];
  //UILabel *starCountLabel = (UILabel *) [cell.contentView viewWithTag: STAR_LABEL_TAG];
  //UILabel *reviewCountLabel = (UILabel *) [cell.contentView viewWithTag: REVIEW_LABEL_TAG];
  //UIImageView *viewIcon;
  //UIImageView *starIcon;
  //UIImageView *reviewIcon;
    
    // 강사 이름
    /*
    if ( !tutorLabel )
    {
        tutorLabel = [[UILabel alloc] initWithFrame: CGRectMake(87, 54, 162, 14)];
        tutorLabel.textColor = UIColorFromRGB(0xffffff, 0.5);
        tutorLabel.backgroundColor = [UIColor clearColor];
        tutorLabel.font = [UIFont fontWithName: @"SpoqaHanSans-Regular" size: 12];
        tutorLabel.tag = TUTOR_LABEL_TAG;
        [cell.contentView addSubview: tutorLabel];
    }
    */
    
    // 강의 썸네일
    if ( !chImage )
    {
        chImage = [[UIImageView alloc] initWithFrame: CGRectMake(0, 0, 165, 110)];  // (15, 10, 64, 90)
        chImage.tag = IMAGE_VIEW_TAG;
        [cell.contentView addSubview: chImage];
    }
    
    // 강의 제목
    if ( !titleLabel )
    {
        titleLabel = [[UILabel alloc] initWithFrame: CGRectMake(10, 59, 150, 45)];
        [titleLabel setNumberOfLines: 2];   // 자동 레이아웃의 다중 행
        titleLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
        titleLabel.backgroundColor = [UIColor clearColor];
        titleLabel.font = [UIFont fontWithName: @"SpoqaHanSans-Bold" size: 10];
        titleLabel.shadowColor = [UIColor colorWithWhite:0 alpha:0.2];
        titleLabel.shadowOffset = CGSizeMake(0, 1);
        titleLabel.tag = TITLE_LABEL_TAG;
        [chImage addSubview: titleLabel];
    }
    
    // 셀 번호
    if ( !numberLabel )
    {
        numberLabel = [[UILabel alloc] initWithFrame: CGRectMake(10, 10, 20, 15)];
        numberLabel.textColor = [UIColor whiteColor];
        numberLabel.textAlignment = NSTextAlignmentLeft;
        numberLabel.backgroundColor = [UIColor clearColor]; //UIColorFromRGB(0x66000000, 0.6);
        numberLabel.font = [UIFont fontWithName: @"Montserrat-Bold" size: 10];
        numberLabel.shadowColor = [UIColor colorWithWhite:0 alpha:0.2];
        numberLabel.shadowOffset = CGSizeMake(0, 1);
        numberLabel.tag = NUMBER_LABEL_TAG;
        [chImage addSubview: numberLabel];
    }
    
    /*
    // 강의 시간
    if ( !timeLabel )
    {
        timeLabel = [[UILabel alloc] initWithFrame: CGRectMake(0, 65, 64, 25)];
        timeLabel.textColor = [UIColor whiteColor];
        timeLabel.textAlignment = NSTextAlignmentCenter;    // 텍스트 중앙 정렬
        timeLabel.backgroundColor = UIColorFromRGB(0x66000000, 0.3);
        timeLabel.font = [UIFont fontWithName: @"Montserrat-Regular" size: 8];
        timeLabel.tag = TIME_LABEL_TAG;
        [chImage addSubview: timeLabel];
    }
    
    // 썸네일 하단 footer bar
    {
        footerLabel = [[UILabel alloc] initWithFrame: CGRectMake(0, 88, 64, 2)];
        footerLabel.backgroundColor = UIColorFromRGB(0x32c183, 1.f);
        [chImage addSubview: footerLabel];
    }
    
    // 컨텐츠 조회수 아이콘
    {
        viewIcon = [[UIImageView alloc] initWithFrame: CGRectMake(85, 81, 17, 11)];
        viewIcon.image = [UIImage imageNamed: @"icon_view_white"];
        [cell.contentView addSubview: viewIcon];
    }
    
    // 컨텐츠 별점수 아이콘
    {
        starIcon = [[UIImageView alloc] initWithFrame: CGRectMake(142, 80, 11, 11)];
        starIcon.image = [UIImage imageNamed: @"icon_star_green_small"];
        [cell.contentView addSubview: starIcon];
    }
    
    // 컨텐츠 리뷰수 아이콘
    {
        reviewIcon = [[UIImageView alloc] initWithFrame: CGRectMake(182, 81, 12, 10)];
        reviewIcon.image = [UIImage imageNamed: @"icon_review"];
        [cell.contentView addSubview: reviewIcon];
    }
    
    // Contents Hit Count (컨텐츠 조회수)
    if ( !hitCountLabel )
    {
        hitCountLabel = [[UILabel alloc] initWithFrame: CGRectMake(106, 80, 30, 13)];
        hitCountLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
        hitCountLabel.backgroundColor = [UIColor clearColor];
        hitCountLabel.font = [UIFont fontWithName: @"SpoqaHanSans-Regular" size: 11];
        hitCountLabel.tag = HIT_LABEL_TAG;
        [cell.contentView addSubview: hitCountLabel];
    }
    
    // Contents Star Count (컨텐츠 별점수)
    if ( !starCountLabel )
    {
        starCountLabel = [[UILabel alloc] initWithFrame: CGRectMake(156, 80, 25, 13)];
        starCountLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
        starCountLabel.backgroundColor = [UIColor clearColor];
        starCountLabel.font = [UIFont fontWithName: @"SpoqaHanSans-Regular" size: 11];
        starCountLabel.tag = STAR_LABEL_TAG;
        [cell.contentView addSubview: starCountLabel];
    }
    
    // Contents Review Count (컨텐츠 리뷰수)
    if ( !reviewCountLabel )
    {
        reviewCountLabel = [[UILabel alloc] initWithFrame: CGRectMake(198, 80, 25, 13)];
        reviewCountLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
        reviewCountLabel.backgroundColor = [UIColor clearColor];
        reviewCountLabel.font = [UIFont fontWithName: @"SpoqaHanSans-Regular" size: 11];
        reviewCountLabel.tag = REVIEW_LABEL_TAG;
        [cell.contentView addSubview: reviewCountLabel];
    }
    */
    
    NSURL *imageUrl;
  //NSString *timeStr;
    UIImage *image;
    NSMutableArray *tempArray;
    
    if ( indexPath.section == 0 )
    {
        tempArray = [slaveDataArray0 mutableCopy];
    }
    else if ( indexPath.section == 1 )
    {
        tempArray = [slaveDataArray1 mutableCopy];
    }
    else if ( indexPath.section == 2 )
    {
        tempArray = [slaveDataArray2 mutableCopy];
    }
    
    titleLabel.text = [[tempArray objectAtIndex: indexPath.row] valueForKey: @"cname"];
  //tutorLabel.text = [[tempArray objectAtIndex: indexPath.row] valueForKey: @"teachername"];
    imageUrl = [NSURL URLWithString: [[tempArray objectAtIndex: indexPath.row] valueForKey: @"clist_img"]];
    numberLabel.text = [NSString stringWithFormat: @"%ld", indexPath.row+1];    // 0번부터 시작하므로 +1 처리하였습니다.
  //timeStr = [[tempArray objectAtIndex: indexPath.row] valueForKey: @"cplay_time"];
  //hitCountLabel.text = [[[tempArray objectAtIndex: indexPath.row] valueForKey: @"chitcnt"] stringValue];
  //starCountLabel.text = [[[tempArray objectAtIndex: indexPath.row] valueForKey: @"cstarcnt"] stringValue];
  //reviewCountLabel.text = [[[tempArray objectAtIndex: indexPath.row] valueForKey: @"creviewcnt"] stringValue];
    
    image = [UIImage imageWithData: [NSData dataWithContentsOfURL: imageUrl]];
    chImage.image = image;
    
    /*
    if ([timeStr hasPrefix: @"00:"])
    {
        timeStr = [timeStr stringByReplacingOccurrencesOfString: @"00:" withString: @""];   // NSString데이터에서 '00:'를 제거
    }
    timeLabel.text = timeStr;
    */
    
    // Cell Radius
    cell.contentView.layer.cornerRadius = 1.0f; // 10.0f
    cell.contentView.layer.borderWidth = 0.5f;  // 1.0f
    cell.contentView.layer.borderColor = UIColorFromRGB(0x2c282f, 1.f).CGColor;
    cell.contentView.layer.masksToBounds = YES;
    
    /*
    // Cell Shadow
    cell.layer.shadowColor = UIColorFromRGB(0x4c000000, 1.f).CGColor;
    cell.layer.shadowOffset = CGSizeMake(0, 1.0f);
    cell.layer.shadowRadius = 2.0f;
    cell.layer.shadowOpacity = 0.5f;
    cell.layer.masksToBounds = NO;
    cell.layer.shadowPath = [UIBezierPath bezierPathWithRoundedRect: cell.bounds
                                                       cornerRadius: cell.contentView.layer.cornerRadius].CGPath;
    */
    return cell;
}

// 섹션 갯수 리턴
- (NSInteger) numberOfSectionsIncustomedCollectionView: (IFCollectionView *) collectionView
{
    return 3;
}

// UITableView의 cell안에 포함되는 UICollectionView
- (IFReusableView *) customedCollectionView: (IFCollectionView *) collectionView
                   backgroundViewForSection: (NSInteger) section
{
    CustomBackgroundView *view = [collectionView dequeueReusableViewWithReuseIdentifier: @"Cell"];
    view.backgroundColor = UIColorFromRGB(0x272230, 1.f);   // CollectionView의 배경색, tableView의 배경색과 동일.
    
    return view;
}

#pragma mark - CollectionView Delegate
// 셀 선택시 리턴
- (void) customedCollectionView: (IFCollectionView *) collectionView
       didSelectItemAtIndexPath: (NSIndexPath *) indexPath
{
    NSString *ckey;
    NSString *gkey;
    
    if ( indexPath.section == 0 )
    {
        ckey = [[[slaveDataArray0 objectAtIndex: indexPath.row] valueForKey: @"ckey"] stringValue];
        gkey = [[[slaveDataArray0 objectAtIndex: indexPath.row] valueForKey: @"groupkey"] stringValue];
    }
    else if ( indexPath.section == 1 )
    {
        ckey = [[[slaveDataArray1 objectAtIndex: indexPath.row] valueForKey: @"ckey"] stringValue];
        gkey = [[[slaveDataArray1 objectAtIndex: indexPath.row] valueForKey: @"groupkey"] stringValue];
    }
    else if ( indexPath.section == 2 )
    {
        ckey = [[[slaveDataArray2 objectAtIndex: indexPath.row] valueForKey: @"ckey"] stringValue];
        gkey = [[[slaveDataArray2 objectAtIndex: indexPath.row] valueForKey: @"groupkey"] stringValue];
    }
    
    AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
    /*
    HomeViewController *controller = [app getHomeViewController];
    
    if ( [controller respondsToSelector: @selector(runContentsPlayerWithGroupKey:cKey:)] )
    {
        [controller runContentsPlayerWithGroupKey: gkey
                                             cKey: ckey];
    }
    */
}

// 셀 선택 해제시 리턴
- (void) customedCollectionView: (IFCollectionView *) collectionView
     didDeselectItemAtIndexPath: (NSIndexPath *) indexPath
{
  //NSLog(@"did deselect item at index path: %@", indexPath);
}

// 셀 크기 리턴
- (CGSize) customedCollectionView: (IFCollectionView *) collectionView
           sizeForItemAtIndexPath: (NSIndexPath *) indexPath
{
    return CGSizeMake(165, 110);    // 연관컨텐츠뷰 개편으로 셀 사이즈를 수정하였습니다. (280, 110)
}


// 컬렉션뷰의 높이
- (CGFloat) customedCollectionView: (IFCollectionView *) collectionView
                   heightOfSection: (NSInteger) section
{
    return 150;     // 기본값 : 90
}

- (UIEdgeInsets) customedCollectionView: (IFCollectionView *) collectionView
                 insetForSectionAtIndex: (NSInteger) section
{
    return UIEdgeInsetsMake(0, 0, 0, 0);
}

// 셀과 셀 사이의 간격
- (CGFloat)  customedCollectionView: (IFCollectionView *) collectionView
minimumLineSpacingForSectionAtIndex: (NSInteger) section
{
    return 15;    // 기본값 : 5
}

- (CGFloat)       customedCollectionView: (IFCollectionView *) collectionView
minimumInteritemSpacingForSectionAtIndex: (NSInteger) section
{
    return 2;
}

- (UIEdgeInsets) customedCollectionView: (IFCollectionView *) collectionView
    scrollContentInsetForSectionAtIndex: (NSInteger) section
{
    return UIEdgeInsetsMake(0, 20, 0, 0);    // 11, 11, 11, 11
}

@end