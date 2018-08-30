
#import "IFMediaPlayerScriptView.h"

@interface IFMediaPlayerScriptView () < UITableViewDelegate, UITableViewDataSource, IFScriptControlViewDelegate >
{
    UIView *_topLineView;
    
    NSArray *_array;
    NSInteger _prevIndex;
    
    IFPlayerScriptItemView *_scriptItemView;
    
    IFScriptControlView *_controlView;
    UITableView *_tableView;
    
    UILabel *_emptyLabel;
    
    CGFloat _fontSize;
}

@end

@implementation IFMediaPlayerScriptView

- (id) initWithFrame: (CGRect) frame
{
    if ( self = [super initWithFrame: frame] )
    {
        [self initSubviews];
    }
    
    return self;
}

- (void) initSubviews
{
    _status = IfMediaPlayerScriptViewModeNone;
    
    self.backgroundColor = UIColorFromRGB(0x272230, 0.7f);
    
    _fontSize = [[NSUserDefaults standardUserDefaults] floatForKey:@"script-fontsize"];
    
    if ( _fontSize == 0.f )
    {
        _fontSize = 15.f;
    }
    
    _emptyLabel = [[UILabel alloc] initWithFrame: CGRectZero];
    _emptyLabel.backgroundColor = [UIColor clearColor];
    _emptyLabel.font = [UIFont fontWithName: @"SpoqaHanSans"
                                       size: 12];
    _emptyLabel.textColor = UIColorFromRGB(0xffffff, 0.5f);
    _emptyLabel.textAlignment = NSTextAlignmentLeft;
    _emptyLabel.numberOfLines = 1;
    _emptyLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _emptyLabel.adjustsFontSizeToFitWidth = NO;
    _emptyLabel.text = @"자막이 없습니다.";
    [self addSubview:_emptyLabel];
    
    _scriptItemView = [[IFPlayerScriptItemView alloc] initWithFrame: CGRectZero];
    _scriptItemView.backgroundColor = [UIColor clearColor];
    [_scriptItemView setTextColor: UIColorFromRGB(0x09b774, 1.f)];
    [self addSubview: _scriptItemView];
    
    _controlView = [[IFScriptControlView alloc] initWithFrame: CGRectZero];
    _controlView.delegate = self;
    [self addSubview: _controlView];
    
    _tableView = [[UITableView alloc] initWithFrame: CGRectZero
                                              style: UITableViewStylePlain];
    _tableView.delegate = self;
    _tableView.dataSource = self;
    [_tableView setSeparatorStyle: UITableViewCellSeparatorStyleNone];
    [_tableView setBackgroundColor: [UIColor clearColor]];
    [_tableView setScrollsToTop: NO];
    [_tableView setShowsVerticalScrollIndicator: NO];
    [self addSubview:_tableView];
    
    _scriptItemView.hidden = YES;
    _tableView.hidden = YES;
    _emptyLabel.hidden = YES;

    _topLineView = [[UIView alloc] initWithFrame: CGRectZero];
    _topLineView.backgroundColor = UIColorFromRGB(0x292431, 1.f);
    [self addSubview:_topLineView];
    
    UITapGestureRecognizer *tapGestureList = [[UITapGestureRecognizer alloc] initWithTarget: self
                                                                                     action: @selector(pressedTabList)];
    [_tableView addGestureRecognizer: tapGestureList];
    
    UITapGestureRecognizer *tapGestureText = [[UITapGestureRecognizer alloc] initWithTarget: self
                                                                                     action: @selector(pressedTabText)];
    [_scriptItemView addGestureRecognizer: tapGestureText];
    
    if ( _tableView.hidden )
    {
        UITapGestureRecognizer *tapGestureList = [[UITapGestureRecognizer alloc] initWithTarget: self
                                                                                         action: @selector(pressedTabList)];
        [self addGestureRecognizer: tapGestureList];
    }
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    CGRect clientRect = self.bounds;
    
    if ( _topLineView )
    {
        _topLineView.frame = CGRectMake(0, 0, clientRect.size.width, 1);
    }
    
    if ( _scriptItemView )
    {
        _scriptItemView.frame = clientRect;
    }
    
    if ( _controlView )
    {
        _controlView.frame = CGRectMake(0, 0, clientRect.size.width, 70.f);
    }
    
    if ( _tableView )
    {
        _tableView.frame = CGRectMake(0, 70, clientRect.size.width, clientRect.size.height-70.f);
    }
    
    if ( _emptyLabel )
    {
        _emptyLabel.frame = CGRectMake(20.f, 20.f, clientRect.size.width-40.f, 0);
        [_emptyLabel sizeToFit];
    }
}

- (void) setStatus: (NSInteger) status
{
    if ( _array.count == 0 )
    {
        _scriptItemView.hidden = YES;
        _controlView.hidden = YES;
        _tableView.hidden = YES;
        _emptyLabel.hidden = NO;
    }
    else
    {
        _emptyLabel.hidden = YES;
        
        if ( _scriptItemView )
        {
            _scriptItemView.hidden = (status != IfMediaPlayerScriptViewModeText);
        }
        
        if ( _controlView )
        {
            _controlView.hidden = (status != IfMediaPlayerScriptViewModeList);
        }
        
        if ( _tableView )
        {
            _tableView.hidden = (status != IfMediaPlayerScriptViewModeList);
        }
    }
    
    _status = status;
}

- (void) setScript: (NSArray *) script
{
    if ( script.count > 0 )
    {
        NSMutableArray *tempArray = [[NSMutableArray alloc] initWithArray: script];;    // 자막처리 관련 171103 김태현
        [tempArray removeLastObject];                                                   // 자막처리 관련 171103 김태현
        _array = [[NSArray alloc] initWithArray: tempArray];                            // 자막처리 관련 171103 김태현
        
        //_array = [[NSArray alloc] initWithArray: script];     // 지식영상 자막 마지막에 </BODY></SAMI> 이 붙어서 삭제함. 171103 김태현
        if ( _tableView )
        {
            [_tableView reloadData];
        }
    }
    else
    {
        _array = nil;
    }
    
    _prevIndex = -1;
}

- (void) setCurrentTime: (NSTimeInterval) time
{
    [self scriptWithTime: time];
}

- (void) scriptWithTime: (NSTimeInterval) time
{
    if ( _array.count == 0 )
    {
        return ;
    }
    
    static NSInteger currentIndex = -1;
    
    for ( NSInteger i=0; i<_array.count; i++ )
    {
        CGFloat scriptStartTime = [_array[i][@"time"] floatValue];
        CGFloat scriptEndTime = (i+1 < _array.count ? [_array[i+1][@"time"] floatValue] : -1);
        
        int nStartTime = (int) scriptStartTime;
        int nEndTime = (int) scriptEndTime;
        int nCTime = (int) (time * 1000);

        if ( i == 0 && nStartTime > nCTime )
        {
            break;
        }
        
        currentIndex = i;
        
        if ( nStartTime <= nCTime && (nCTime < nEndTime || nEndTime == -1) )
        {
            break;
        }
    }
    
    if ( currentIndex > -1 && _array.count > currentIndex && currentIndex != _prevIndex )
    {
        
        NSDictionary *object = _array[currentIndex];
        NSString *memo = object[@"memo"];
        CGFloat startTime = [object[@"time"] floatValue] / 1000.f;
        
        if ( !nullStr(memo) && _scriptItemView )
        {
            [_scriptItemView setTime: [common convertTimeToString: startTime Minute: YES]
                              script: memo];
        }
        
        
        NSIndexPath *currentIndexPath = [NSIndexPath indexPathForRow: currentIndex
                                                           inSection: 0];
        NSIndexPath *prevIndexPath = [NSIndexPath indexPathForRow: _prevIndex
                                                        inSection: 0];
        IFPlayerScriptCell *prevCell = [_tableView cellForRowAtIndexPath: prevIndexPath];
        IFPlayerScriptCell *currentCell = [_tableView cellForRowAtIndexPath: currentIndexPath];
        
        if ( prevCell )
        {
            [prevCell setTextColor: UIColorFromRGB(0xffffff, 0.5f)];
        }
        
        if ( currentCell )
        {
            [currentCell setTextColor: UIColorFromRGB(0x09b774, 1.f)];
        }
        
        _prevIndex = currentIndex;
    }
}

#pragma mark - UITableViewDataSource & UITableViewDelegate

- (NSInteger) numberOfSectionsInTableView: (UITableView *) tableView
{
    return 1;
}

- (NSInteger) tableView: (UITableView *) tableView
  numberOfRowsInSection: (NSInteger) section
{
    return _array.count;
}

- (CGFloat)   tableView: (UITableView *) tableView
heightForRowAtIndexPath: (NSIndexPath *) indexPath
{
    NSDictionary *object = _array[indexPath.row];
    NSString *memo = object[@"memo"];
    CGFloat startTime = [object[@"time"] floatValue] / 1000.f;
    
    return [IFPlayerScriptCell heightWithTime: [common convertTimeToString: startTime Minute: YES]
                                         text: memo
                                  screenWidth: tableView.frame.size.width
                                     fontSize: _fontSize];
}

- (UITableViewCell *) tableView: (UITableView *) tableView
          cellForRowAtIndexPath: (NSIndexPath *) indexPath
{
    static NSString *cellIdentifier = @"scriptCell";
    
    IFPlayerScriptCell *cell = [tableView dequeueReusableCellWithIdentifier: cellIdentifier];
    
    if ( !cell )
    {
        cell = [[IFPlayerScriptCell alloc] initWithStyle: UITableViewCellStyleDefault
                                         reuseIdentifier: cellIdentifier];
    }
    
    cell.backgroundColor = [UIColor clearColor];
    cell.selectionStyle = UITableViewCellSelectionStyleNone;

    NSDictionary *object = _array[indexPath.row];
    NSString *memo = object[@"memo"];
    CGFloat startTime = [object[@"time"] floatValue] / 1000.f;

    [cell setTime: [common convertTimeToString: startTime Minute: YES]
           script: memo];
    
    if ( _prevIndex > -1 && _prevIndex == indexPath.row )
    {
        [cell setTextColor: UIColorFromRGB(0x09b774, 1.f)];
    }
    else
    {
        [cell setTextColor: UIColorFromRGB(0xffffff, 0.5f)];
    }
    
    return cell;
}

#pragma mark - selector
- (void) pressedTabList
{
    if ( [self.delegate respondsToSelector: @selector(mediaPlayerScriptView:statusChange:)] )
    {
        [self.delegate mediaPlayerScriptView: self
                                statusChange: IfMediaPlayerScriptViewModeText];
    }
}

- (void) pressedTabText
{
    if ( [self.delegate respondsToSelector:@selector(mediaPlayerScriptView:statusChange:)] )
    {
        [self.delegate mediaPlayerScriptView: self
                                statusChange: IfMediaPlayerScriptViewModeList];
    }
}

#pragma mark - IFScriptControlViewDelegate
- (void) scriptControlView: (IFScriptControlView *) view
           changedFontSize: (id) sender
{
    _fontSize = [[NSUserDefaults standardUserDefaults] floatForKey: @"script-fontsize"];
    
    if ( _fontSize == 0.f )
    {
        _fontSize = 15.f;
    }
    
    [_tableView reloadData];
    [_scriptItemView setFontSize];
}

@end









