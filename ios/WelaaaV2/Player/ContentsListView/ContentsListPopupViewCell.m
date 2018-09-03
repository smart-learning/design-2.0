
#import "ContentsListPopupViewCell.h"
#import "common.h"

@interface ContentsListPopupViewCell ()
{
    UILabel *_textLabel;
    UIView *_lectureBar;
    UILabel *_previewLabel;
    UILabel *_titleLabel;
    UILabel *_nameLabel;
    
    UIImageView *_iconView;
    UILabel *_timeLabel;
    
    UIView *_underLine;
    
    UIView *_selectionView;
}

@end

@implementation ContentsListPopupViewCell

- (id) initWithStyle : (UITableViewCellStyle) style
     reuseIdentifier : (NSString *) reuseIdentifier
{
    if ( self = [super initWithStyle:style reuseIdentifier:reuseIdentifier] )
    {
        
        self.backgroundColor = [UIColor whiteColor];
        self.contentView.backgroundColor = [UIColor whiteColor];
        
        [self initLayout];
    }
    
    return self;
}

- (void) initLayout
{
    self.backgroundColor = UIColorFromRGB(0x272230, 1.f);
    self.contentView.backgroundColor = UIColorFromRGB(0x272230, 1.f);
    
    _previewLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _previewLabel.backgroundColor = UIColorFromRGB(0x872f40, 1.f);
    _previewLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:12];
    _previewLabel.textColor = UIColorFromRGB(0xffffff, 1.f);
    _previewLabel.numberOfLines = 1;
    _previewLabel.text = @"미리보기";
    _previewLabel.textAlignment = NSTextAlignmentCenter;
    _previewLabel.layer.cornerRadius = 4.f;
    _previewLabel.clipsToBounds = YES;
    [self.contentView addSubview : _previewLabel];
    
    _textLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _textLabel.backgroundColor = [UIColor clearColor];
    _textLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:15];
    _textLabel.textColor = UIColorFromRGB(0xefefef, 1.f);
    _textLabel.numberOfLines = 2;
    _textLabel.textAlignment = NSTextAlignmentLeft;
    [self.contentView addSubview : _textLabel];
    
    _titleLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _titleLabel.backgroundColor = [UIColor clearColor];
    _titleLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:13];
    _titleLabel.textColor = UIColorFromRGB(0xbba69a, 1.f);
    _titleLabel.numberOfLines = 1;
    _titleLabel.adjustsFontSizeToFitWidth = YES;
    _titleLabel.textAlignment = NSTextAlignmentLeft;
    [self.contentView addSubview : _titleLabel];

    _nameLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _nameLabel.backgroundColor = [UIColor clearColor];
    _nameLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:13];
    _nameLabel.textColor = UIColorFromRGB(0x706d76, 1.f);
    _nameLabel.numberOfLines = 1;
    _nameLabel.adjustsFontSizeToFitWidth = YES;
    _nameLabel.textAlignment = NSTextAlignmentLeft;
    [self.contentView addSubview : _nameLabel];

    _iconView = [[UIImageView alloc] initWithFrame : CGRectZero];
    [self.contentView addSubview : _iconView];
    
    _timeLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _timeLabel.backgroundColor = [UIColor clearColor];
    _timeLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:13];
    _timeLabel.textColor = UIColorFromRGB(0x9b9b9b, 1.f);
    _timeLabel.numberOfLines = 1;
    _timeLabel.adjustsFontSizeToFitWidth = YES;
    _timeLabel.textAlignment = NSTextAlignmentLeft;
    [self.contentView addSubview : _timeLabel];

    
    _lectureBar = [[UIView alloc] initWithFrame : CGRectZero];
    _lectureBar.backgroundColor = UIColorFromRGB(0x706d76, 1.f);
    [self.contentView addSubview : _lectureBar];
    
    _underLine = [[UIView alloc] initWithFrame : CGRectZero];
    _underLine.backgroundColor = UIColorFromRGB(0x323138, 1.f);
    [self.contentView addSubview : _underLine];
    
    _selectionView = [[UIView alloc] initWithFrame : CGRectZero];
    _selectionView.backgroundColor = UIColorFromRGB(0xffffff, 0.3f);
    [self.contentView addSubview : _selectionView];
    
    _selectionView.alpha = 0.f;
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    CGRect clientRect = self.bounds;
 
    UIColor *selectedColor = self.isAudioContentType ? UIColorFromRGB(0xff4f72, 1.f) : UIColorFromRGB(0x09b774, 1.f);
    UIColor *textColor = self.isSelected ? selectedColor : UIColorFromRGB(0xefefef, 1.f);
    
    NSInteger depth = 0;
    
  //NSLog(@"  [PlayListPopupViewCell] Dictionary : %@", [_itemDict description]);
    
    if ( self.isAudioContentType )
    {
        depth = [[common forceStringValue : self.itemDict[@"depth"]] integerValue];
    }
    
    CGFloat textOffsetY = 20.f;
    NSString *text = self.itemDict[@"title"];
    
    if ( depth == 1 )
    {
        textOffsetY = clientRect.size.height - 30.f;
        textColor = selectedColor;
    }
    else if ( depth == 3 )
    {
        text = [@"    > " stringByAppendingString : text];
    }
    
    NSInteger numberOfLines = _isAudioContentType ? 1 : 2;
    CGFloat textHeight = GET_STRING_SIZE_N(text, [UIFont fontWithName:@"SpoqaHanSans" size:15], clientRect.size.width - 132, numberOfLines).height;
    
    if ( _isAudioContentType && depth != 1 )
    {
        textOffsetY = (clientRect.size.height - textHeight) / 2.f;
    }
    
    _textLabel.text = text;
    _textLabel.textColor = textColor;
    _textLabel.numberOfLines = numberOfLines;
    _textLabel.frame = CGRectMake(20, textOffsetY, clientRect.size.width - 132, textHeight);

    if ( !self.isAudioContentType )
    {
      //NSString *title = self.itemDict[@"grouptitle"];
        NSString *title = self.groupTitle;
        _titleLabel.text = title;
        _titleLabel.frame = CGRectMake(30, 75, clientRect.size.width - 142, 20);
        
      //NSString *name = self.itemDict[@"teachername"];
        NSString *name = self.teacherName;
        _nameLabel.text = name;
        _nameLabel.frame = CGRectMake(30, CGRectGetMaxY(_titleLabel.frame), clientRect.size.width - 142, 20);
        
        _lectureBar.frame = CGRectMake(20, 75, 2, 40.f);
        
        _titleLabel.hidden = NO;
        _nameLabel.hidden = NO;
        _lectureBar.hidden = NO;
    }
    else
    {
        _titleLabel.frame = CGRectZero;
        _nameLabel.frame = CGRectZero;
        _lectureBar.frame = CGRectZero;
        
        _titleLabel.hidden = YES;
        _nameLabel.hidden = YES;
        _lectureBar.hidden = YES;
        
    }
    
    if ( self.isPreviewMode )
    {
        _previewLabel.hidden = NO;

        CGRect textLabelFrame = _textLabel.frame;
        textLabelFrame.origin.x = textLabelFrame.origin.x + 60.f;
        textLabelFrame.size.width = textLabelFrame.size.width - 60.f;
        _textLabel.frame = textLabelFrame;
        
        _previewLabel.frame = CGRectMake(21, textOffsetY-2, 52, textHeight+4);
    }
    else
    {
        _previewLabel.hidden = YES;
    }
    
    CGFloat iconOffsetY = 22.f;
    CGFloat timeOffsetY = 22.f;
    
    if ( self.isAudioContentType )
    {
        iconOffsetY = (clientRect.size.height - 20.f) / 2.f;
        timeOffsetY = (clientRect.size.height - 20.f) / 2.f;
    }
    
    if ( ![self hasContent] )
    {
        _iconView.hidden = YES;
        _timeLabel.hidden = YES;
    }
    else
    {
        _iconView.frame = CGRectMake(clientRect.size.width-90, iconOffsetY, 20, 20);
        
        NSString *time = self.itemDict[@"play_time"];
        NSInteger timeNum = [common convertStringToTime : time];
        time = [common convertTimeToString : (float) timeNum
                                    Minute : YES];
        NSLog(@"  [PlayListPopupViewCell] time? %@", time);
        if ( [time isEqualToString : @"00:00"] )
        {
            time = @"";
        }
        
        NSString *playImageName = @"";
        NSInteger history_endTime = [self.itemDict[@"end_time"] integerValue];
        
        if ( history_endTime == 0 )
        {
            playImageName = !self.isAudioContentType ? @"icon_play_green" : @"icon_play_pink";
        }
        else if ( history_endTime < timeNum )
        {
            playImageName = !self.isAudioContentType ? @"icon_video_list_play_half_filled" : @"icon_audiobook_play_half_filled";
        }
        else
        {
            playImageName = !self.isAudioContentType ? @"icon_video_list_play_filled" : @"icon_audiobook_play_filled";
        }

        if ( !nullStr(playImageName) )
        {
            _iconView.image = [UIImage imageNamed : playImageName];
        }
        else
        {
            _iconView.image = nil;
        }
        
        if ( [time isEqualToString : @""] )
        {
            _iconView.image = nil;
        }
        
        _timeLabel.frame = CGRectMake(CGRectGetMaxX(_iconView.frame)+10, timeOffsetY, 0, 20);
        _timeLabel.text = time;
        [_timeLabel sizeToFit];
        
        CGRect timeFrame = _timeLabel.frame;
        timeFrame.size.height = 20.f;
        _timeLabel.frame = timeFrame;
        
        _iconView.hidden = NO;
        _timeLabel.hidden = NO;
    }
    
    _underLine.frame = CGRectMake(20, clientRect.size.height-1, clientRect.size.width-55.f, 1);
    _selectionView.frame = clientRect;
    
    _selectionView.hidden = ![self hasContent];
}

- (void) updateCell
{
    [self layoutSubviews];
}

- (BOOL) hasContent
{
  // 오디오북의 경우 'contentsInfoDics[@"data"][@"chapters"][i][@"play_seconds"]'의 값이 '0'이면 재생불가한 챕터 타이틀입니다.
  // 영상강의는 일단 YES를 리턴하거나 .m3u8 유무를 체크합니다.
  
  /*
    NSString *curl = self.itemDict[@"curl"];
    
    if ( !nullStr(curl) && [[curl lowercaseString] hasSuffix : @".m3u8"] )
    {
        return YES;
    }
    
    return NO;
  */
    // 일단 YES 로 세팅하였습니다.
    return YES;
}

#pragma mark - touch Methods..

- (void) touchesBegan : (NSSet *) touches
            withEvent : (UIEvent *) event
{
    [super touchesBegan : touches
              withEvent : event];
    
    _selectionView.alpha = 1.f;
}

- (void) touchesMoved : (NSSet *) touches
            withEvent : (UIEvent *) event
{
    [super touchesMoved : touches
              withEvent : event];
}

- (void) touchesEnded : (NSSet *) touches
            withEvent : (UIEvent *) event
{
    [super touchesEnded : touches
              withEvent : event];
    
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      _selectionView.alpha = 0.f;
                                  }
                     completion : ^(BOOL isComplete)
                                  {
                                      if ( [self hasContent] )
                                      {
                                          if ( [self.delegate respondsToSelector : @selector(playListPopupViewCell:selectedIndex:)] )
                                          {
                                              [self.delegate playListPopupViewCell : self
                                                                     selectedIndex : self.index];
                                          }
                                     }
                                 }];
}

- (void) touchesCancelled : (NSSet *) touches
                withEvent : (UIEvent *) event
{
    [super touchesCancelled : touches
                  withEvent : event];
    
    [UIView animateWithDuration : 0.3f
                          delay : 0
                        options : UIViewAnimationOptionAllowUserInteraction
                     animations : ^{
                                      _selectionView.alpha = 0.f;
                                  }
                     completion : ^(BOOL isComplete)
                                  { }];
}

@end



















