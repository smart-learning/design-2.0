
#import "PlayerSleepTimerView.h"

@interface PlayerSleepTimerView () <PlayerSleepTimerButtonDelegate>
{
    UIView *_titleView;
    UIImageView *_titleIconView;
    UIButton *_titleButton;
    UILabel *_titleLabel;

    PlayerSleepTimerButton *_btn01;
    PlayerSleepTimerButton *_btn02;
    PlayerSleepTimerButton *_btn03;
    PlayerSleepTimerButton *_btn04;
}

@end

@implementation PlayerSleepTimerView

- (instancetype) initWithFrame : (CGRect) frame
{
    if ( self = [super initWithFrame : frame] )
    {
        [self initSubviews];
    }
    
    return self;
}

- (void) initSubviews
{
    self.backgroundColor = [UIColor grayColor];
    
    _titleView = [self makeTitleView : CGRectMake(0, 0, self.frame.size.width, 60.f)];
    [self addSubview : _titleView];
   
    _btn01 = [[PlayerSleepTimerButton alloc] initWithFrame : CGRectZero
                                                      time : @"15분"];
    _btn01.delegate = self;
    [self addSubview : _btn01];

    _btn02 = [[PlayerSleepTimerButton alloc] initWithFrame : CGRectZero
                                                      time : @"30분"];
    _btn02.delegate = self;
    [self addSubview : _btn02];

    _btn03 = [[PlayerSleepTimerButton alloc] initWithFrame : CGRectZero
                                                      time : @"45분"];
    _btn03.delegate = self;
    [self addSubview : _btn03];

    _btn04 = [[PlayerSleepTimerButton alloc] initWithFrame : CGRectZero
                                                      time : @"1시간"];
    _btn04.delegate = self;
    [self addSubview : _btn04];
}

- (void) layoutSubviews
{
    [super layoutSubviews];
 
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

    BOOL isLandscape = self.frame.size.height == (60 + (50 * 2));
    
    if ( isLandscape )
    {
        _btn01.frame = CGRectMake(0, CGRectGetMaxY(_titleView.frame), self.frame.size.width/2.f, 50.f);
        _btn02.frame = CGRectMake(self.frame.size.width/2.f, CGRectGetMaxY(_titleView.frame), self.frame.size.width/2.f, 50.f);
        _btn03.frame = CGRectMake(0, CGRectGetMaxY(_titleView.frame) + 50.f, self.frame.size.width/2.f, 50.f);
        _btn04.frame = CGRectMake(self.frame.size.width/2.f, CGRectGetMaxY(_titleView.frame) + 50.f, self.frame.size.width/2.f, 50.f);
    }
    else
    {
        _btn01.frame = CGRectMake(0, CGRectGetMaxY(_titleView.frame) + (0 * 50), self.frame.size.width, 50.f);
        _btn02.frame = CGRectMake(0, CGRectGetMaxY(_titleView.frame) + (1 * 50), self.frame.size.width, 50.f);
        _btn03.frame = CGRectMake(0, CGRectGetMaxY(_titleView.frame) + (2 * 50), self.frame.size.width, 50.f);
        _btn04.frame = CGRectMake(0, CGRectGetMaxY(_titleView.frame) + (3 * 50), self.frame.size.width, 50.f);
    }
}

- (UIView *) makeTitleView : (CGRect) frame
{
    UIView *itemView = [[UIView alloc] initWithFrame : frame];
    itemView.backgroundColor = UIColorFromRGB(0x43404b, 1.f);
    
    _titleIconView = [[UIImageView alloc] initWithFrame : CGRectMake(5, 5, 50, 50)];
    _titleIconView.image = [UIImage imageNamed : @"icon_timer"];
    [itemView addSubview : _titleIconView];
    
    _titleButton = [UIButton buttonWithType : UIButtonTypeCustom];
    _titleButton.frame = CGRectMake(itemView.frame.size.width-10-50, 5, 50, 50);
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
    labelFrame.origin.y = 0.f;
    labelFrame.size.width = CGRectGetMinX(_titleButton.frame) - CGRectGetMaxX(_titleIconView.frame);
    labelFrame.size.height = frame.size.height;
    
    _titleLabel = [[UILabel alloc] initWithFrame : labelFrame];
    _titleLabel.backgroundColor = [UIColor clearColor];
    _titleLabel.textColor = UIColorFromRGB(0xefefef, 1.f);
    _titleLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:13];
    _titleLabel.textAlignment = NSTextAlignmentLeft;
    [itemView addSubview: _titleLabel];

    _titleLabel.text = @"자동 재생 시간 설정";
    
    return itemView;
}

#pragma mark - selector
- (void) pressedCloseButton : (id) sender
{
    if ( [self.delegate respondsToSelector : @selector(playerSleepTimerView:closeView:)] )
    {
        [self.delegate playerSleepTimerView : self
                                  closeView : nil];
    }
}

#pragma mark - SleepTimerButtonDelegate
- (void) timerButton : (PlayerSleepTimerButton *) button
       didTouchTimer : (NSString *) timeStr
{
    if ( [self.delegate respondsToSelector : @selector(playerSleepTimerView:didSelectedTime:)] )
    {
        [self.delegate playerSleepTimerView : self
                            didSelectedTime : timeStr];
    }
    
    [self pressedCloseButton : nil];
}

@end
