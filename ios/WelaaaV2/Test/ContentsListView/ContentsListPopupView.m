
#import "ContentsListPopupView.h"

@interface ContentsListPopupView () < UITableViewDelegate, UITableViewDataSource, ContentsListPopupViewCellDelegate >
{
    UIView *contentView;
    
    UIView *_titleView;
    UIImageView *_titleIconView;
    UIButton *_titleButton;
    UILabel *_titleLabel;
    
    UIView *_scrollingLine;
    
    UITableView *_tableView;
}

@end

@implementation ContentsListPopupView

- (void) layoutSubviews
{
    [super layoutSubviews];
}

- (void) reOrderSubviews
{
    CGRect frame = self.bounds;

    contentView.frame = frame;
    _titleView.frame = CGRectMake(0, 0, self.frame.size.width, 60.f);
    {
        _titleIconView.frame = CGRectMake(5, 5, 50, 50);
        _titleButton.frame = CGRectMake(_titleView.frame.size.width-10-50, 5, 50, 50);
        
        CGRect labelFrame;
        labelFrame.origin.x = CGRectGetMaxX(_titleIconView.frame);
        labelFrame.origin.y = 0.f;
        labelFrame.size.width = CGRectGetMinX(_titleButton.frame) - CGRectGetMaxX(_titleIconView.frame);
        labelFrame.size.height = _titleView.frame.size.height;
        
        _titleLabel.frame = labelFrame;
    }
    
    _scrollingLine.frame = CGRectMake(0, CGRectGetHeight(_titleView.frame)-2, 0.f, _titleView.frame.size.height);
    _tableView.frame = CGRectMake(0, CGRectGetMaxY(_titleView.frame), self.frame.size.width, self.frame.size.height - CGRectGetMaxY(_titleView.frame));
}

- (void) start
{
    self.clipsToBounds = YES;
    
    [self initSubviews];
    
    [self popupWithCompletion : ^(BOOL finished) {}];
}

- (void) initSubviews
{
    CGRect frame = self.bounds;
    frame.origin.y = CGRectGetMaxY(frame);
    
    contentView = [[UIView alloc] initWithFrame : frame];
    contentView.backgroundColor = UIColorFromRGB(0x43404b, 1.f);
    [self addSubview : contentView];
    
    _titleView = [self makeTitleView : CGRectMake(0, 0, self.frame.size.width, 60.f)];
    [contentView addSubview : _titleView];
    
    UIColor *barColor = self.isAudioContentType ? UIColorFromRGB(0xff4f72, 1.f) : UIColorFromRGB(0x09b774, 1.f);
    _scrollingLine = [[UIView alloc] initWithFrame : CGRectMake(0, CGRectGetHeight(_titleView.frame)-2, 0.f, _titleView.frame.size.height)];
    _scrollingLine.backgroundColor = barColor;
    [_titleView addSubview : _scrollingLine];
    
    _tableView = [[UITableView alloc] initWithFrame : CGRectMake(0, CGRectGetMaxY(_titleView.frame),
                                                                self.frame.size.width,
                                                                self.frame.size.height - CGRectGetMaxY(_titleView.frame))];
    _tableView.backgroundColor = UIColorFromRGB(0x272230, 1.f);
    _tableView.dataSource = self;
    _tableView.delegate = self;
    _tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [contentView addSubview : _tableView];
    
    _tableView.hidden = YES;
    
    [self requestHistory];
}

- (UIView *) makeTitleView : (CGRect) frame
{
    UIView *itemView = [[UIView alloc] initWithFrame : frame];
    itemView.backgroundColor = UIColorFromRGB(0x43404b, 1.f);
    if ( [[common getModel] isEqualToString : @"iPhone X"] )
    {
        _titleIconView = [[UIImageView alloc] initWithFrame : CGRectMake(5, 15, 50, 50)];
    }
    else
    {
        _titleIconView = [[UIImageView alloc] initWithFrame : CGRectMake(5, 5, 50, 50)];
    }
    _titleIconView.image = [UIImage imageNamed : @"icon_list"];
    [itemView addSubview : _titleIconView];
    
    _titleButton = [UIButton buttonWithType : UIButtonTypeCustom];
    if ( [[common getModel] isEqualToString : @"iPhone X"] )
    {
        _titleButton.frame = CGRectMake(itemView.frame.size.width-10-50, 15, 50, 50);
    }
    else
    {
        _titleButton.frame = CGRectMake(itemView.frame.size.width-10-50, 5, 50, 50);
    }
    [_titleButton setImage : [UIImage imageNamed : @"icon_player_close_2"]
                  forState : UIControlStateNormal];
    [_titleButton setImage : [[UIImage imageNamed : @"icon_player_close_2"] tintImageWithColor : UIColorFromRGB(0x000000, 0.3f)]
                  forState : UIControlStateHighlighted];
    [_titleButton addTarget : self
                     action : @selector(pressedCloseButton:)
           forControlEvents : UIControlEventTouchUpInside];
    [itemView addSubview : _titleButton];

    CGRect labelFrame;
    labelFrame.origin.x = CGRectGetMaxX(_titleIconView.frame);
    if ( [[common getModel] isEqualToString : @"iPhone X"] )
    {
        labelFrame.origin.y = 15.f;
    }
    else
    {
        labelFrame.origin.y = 0.f;
    }
    labelFrame.size.width = CGRectGetMinX(_titleButton.frame) - CGRectGetMaxX(_titleIconView.frame);
    labelFrame.size.height = frame.size.height;
    
    _titleLabel = [[UILabel alloc] initWithFrame : labelFrame];
    _titleLabel.backgroundColor = [UIColor clearColor];
    _titleLabel.textColor = UIColorFromRGB(0xefefef, 1.f);
    _titleLabel.font = [UIFont fontWithName : @"SpoqaHanSans"
                                       size : 13];
    _titleLabel.textAlignment = NSTextAlignmentCenter;
    [itemView addSubview : _titleLabel];
    
    if ( !self.isAudioContentType )
    {
        _titleLabel.text = @"최근 재생 강의클립 리스트";
    }
    
    return itemView;
}

- (void) setTitle : (NSString *) title
{
    for ( UIView *subview in _titleView.subviews )
    {
        if ( [subview isKindOfClass : [UILabel class]] )
        {
            [(UILabel *) subview setText : title];
        }
    }
}

- (void) popupWithCompletion : (void (^ __nullable)(BOOL finished)) completion
{
    CGRect moveFrame = self.bounds;
    
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      contentView.frame = moveFrame;
                                  }
                     completion : completion];
}

- (void) popdownWithCompletion : (void (^ __nullable)(BOOL finished)) completion
{
    CGRect moveFrame = self.bounds;
    moveFrame.origin.y = CGRectGetMaxY(self.bounds);
    
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      contentView.frame = moveFrame;
                                  }
                     completion : completion];
}

#pragma mark - request

- (void) requestHistory
{
  /*
    NSMutableArray *cids = [NSMutableArray array];
    
  //for ( NSDictionary *item in self.playList )
    for ( NSDictionary *item in self.contentsInfoDictionary[@"data"][@"clips"] )
    {
        NSString *cid = item[@"cid"];
        NSLog(@"  [requestHistory] cid : %@", cid);
        
        if ( !nullStr(cid) )
        {
            [cids addObject : cid];
        }
    }
    
    if ( cids.count == 0 )
    {
        _tableView.hidden = NO;
        
        return ;
    }
    
    NSOrderedSet *orderSet = [NSOrderedSet orderedSetWithArray : cids];
    NSArray *uArray = [orderSet array];
    
    
    NSMutableDictionary *param = [NSMutableDictionary dictionary];
    param[@"ckeys"] = [uArray componentsJoinedByString : @","];
  
    NSArray *playList = _contentsInfoDictionary[@"data"][@"clips"];
  
    [[ApiManager sharedInstance] requestWithUrl : @"/usingapp/history_check.php"
                                         method : @"GET"
                                          param : param
                                      onSuccess : ^(NSDictionary *object)
                                                  {
                                                      NSLog(@"   object from history_check.php : %@", object);
                                                      NSArray *historyInfo = object[@"historyinfo"];
                                                    
                                                      NSString *historyInfoArrayString = [historyInfo description];  // 171030 김태현
                                                    
                                                      if ( [historyInfoArrayString isEqualToString : @""] )
                                                     //if ( historyInfo.count == 0 )        // 171030 김태현
                                                      {
                                                          NSLog(@"   history.count가 제대로 세팅되지 않아 count를 그냥 할 경우 크래시가 남.");
                                                          NSLog(@"   history.count in NULL!!");
                                                          _tableView.hidden = NO;
                                                        
                                                          return ;
                                                      }
                                                    
                                                      NSMutableDictionary *historyDict = [NSMutableDictionary dictionary];
                                                    
                                                      for ( NSInteger i=0; i<historyInfo.count; i++ )
                                                      {
                                                          NSDictionary *hItem = historyInfo[i];
                                                        
                                                          NSString *tKey = [common forceStringValue : hItem[@"ckey"]];
                                                          historyDict[tKey] = [common forceStringValue : hItem[@"history_endtime"]];
                                                      }
                                                    
                                                      NSMutableArray *newPlayItems = [NSMutableArray array];
                                                    
                                                      for ( NSInteger i=0; i<playList.count; i++ )
                                                      {
                                                          NSMutableDictionary *tempDict = [playList[i] mutableCopy];
                                                        
                                                          NSString *tKey = [common forceStringValue : tempDict[@"ckey"]];
                                                        
                                                          if ( !nullStr(historyDict[tKey]) )
                                                          {
                                                              tempDict[@"end_time"] = historyDict[tKey];
                                                          }
                                                        
                                                          [newPlayItems addObject : tempDict];
                                                      }
                                                    
                                                      playList = newPlayItems;
                                                      [_tableView reloadData];
                                                      [_tableView setHidden:NO];
                                                  }
                                      onFailure : ^(NSError *error)
                                                  {
                                                      _tableView.hidden = NO;
                                                  }];
  */
  _tableView.hidden = NO;
}

#pragma mark - selector
- (void) pressedCloseButton : (id) sender
{
    [self popdownWithCompletion : ^(BOOL finished)
                                  {
                                      if ( [self.delegate respondsToSelector : @selector (playListPopupView:closeView:)] )
                                      {
                                          [self.delegate playListPopupView : self
                                                                 closeView : nil];
                                      }
                                  }];
}

#pragma mark - tableViewDelegate Methods..
- (NSInteger) numberOfSectionsInTableView : (UITableView *) tableView
{
    return 1;
}

- (NSInteger) tableView : (UITableView *) tableView
  numberOfRowsInSection : (NSInteger) section
{
    NSArray *playList;
  
    if ( [_contentsInfoDictionary[@"type"] hasPrefix : @"video"] )
    {
        playList = _contentsInfoDictionary[@"data"][@"clips"];
    }
    else if ( [_contentsInfoDictionary[@"type"] hasPrefix : @"audio"] )
    {
        playList = _contentsInfoDictionary[@"data"][@"chapters"];
    }
  
    return playList.count;
}

- (CGFloat)   tableView : (UITableView *) tableView
heightForRowAtIndexPath : (NSIndexPath *) indexPath
{
    CGFloat height = 123.f;
    
    if ( self.isAudioContentType )
    {
        NSArray *playList = _contentsInfoDictionary[@"data"][@"chapters"];
      
        if ( playList.count > indexPath.row )
        {
            NSDictionary *item = playList[indexPath.row];
     
            NSString *depth = [common forceStringValue : item[@"depth"]];
            
            if ( [@"1" isEqualToString : depth] )
                height = 66.f;
            else
                height = 49.f;
        }
    }
    
    return height;
}

- (UITableViewCell *) tableView : (UITableView *) tableView
          cellForRowAtIndexPath : (NSIndexPath *) indexPath
{
    NSString *identifier = @"listCell";
    
    ContentsListPopupViewCell *cell;
    cell = [tableView dequeueReusableCellWithIdentifier : identifier];
    
    if ( cell == nil )
    {
        cell = [[ContentsListPopupViewCell alloc] initWithStyle : UITableViewCellStyleDefault
                                                reuseIdentifier : identifier];
    }
    
    cell.delegate = self;
    cell.selectionStyle = UITableViewCellSelectionStyleNone;
  
    NSArray *playList;
  
    if ( [_contentsInfoDictionary[@"type"] hasPrefix : @"video"] )
    {
        playList = _contentsInfoDictionary[@"data"][@"clips"];
    }
    else if ( [_contentsInfoDictionary[@"type"] hasPrefix : @"audio"] )
    {
        playList = _contentsInfoDictionary[@"data"][@"chapters"];
    }
  
    if ( playList.count > indexPath.row )
    {
        cell.itemDict = playList[indexPath.row];
        cell.teacherName = _contentsInfoDictionary[@"data"][@"teacher"][@"name"];
        cell.groupTitle = _contentsInfoDictionary[@"data"][@"title"];
    }
    else
    {
        cell.itemDict = nil;
    }
    
    cell.isSelected = (indexPath.row == self.currentPlayIndex);
    cell.index = indexPath.row;
    cell.isAudioContentType = self.isAudioContentType;
    cell.isPreviewMode = (self.isAudioContentType && !self.isAuthor && cell.isSelected);
    
    [cell updateCell];
    
    return cell;
}

- (void)      tableView : (UITableView *) tableView
didSelectRowAtIndexPath : (NSIndexPath *) indexPath
{
}

- (void) scrollViewDidScroll : (UIScrollView *) scrollView
{
    if ( _scrollingLine )
    {
        CGFloat percentWidth = scrollView.frame.size.width * 0.01;
        CGFloat percent = (scrollView.contentOffset.y / (scrollView.contentSize.height-scrollView.frame.size.height)) * 100.f;

        if ( percent < 0 )
            percent = 0.f;
        
        if ( percent > 100 )
            percent = 100.f;
        
        CGRect frame = _scrollingLine.frame;
        frame.size.width = percent * percentWidth;
        
        _scrollingLine.frame = frame;
    }
}

#pragma mark - ContentsListPopupViewCellDelegate
- (void) playListPopupViewCell : (ContentsListPopupView *) cell
                 selectedIndex : (NSInteger) index
{
    if ( self.currentPlayIndex == index )
        return ;
    
    self.currentPlayIndex = index;
    
    NSArray *cells = _tableView.visibleCells;
    
    for ( ContentsListPopupViewCell *cell in cells )
    {
        cell.isSelected = (cell.index == index);
        [cell updateCell];
    }
    
    if ( [self.delegate respondsToSelector : @selector(playListPopupView:selectedOtherIndex:)] )
    {
        [self.delegate playListPopupView : self
                      selectedOtherIndex : index];
    }
}

@end









