
#import "PlayerSleepTimerButton.h"

@interface PlayerSleepTimerButton ()
{
    UILabel *_label;
    UIView *_underLine;
    UIButton *_button;
}

@end

@implementation PlayerSleepTimerButton

- (instancetype) initWithFrame : (CGRect) frame
                          time : (NSString *) time
{
    if ( self = [super initWithFrame : frame] )
    {
        [self initSubviews : time];
    }
    return self;
}

- (void) initSubviews : (NSString *) time
{
    self.backgroundColor = UIColorFromRGB(0x272230, 1.f);

    _underLine = [[UIView alloc] initWithFrame : CGRectZero];
    _underLine.backgroundColor = UIColorFromRGB(0xffffff, 0.1f);
    [self addSubview : _underLine];

    _label = [[UILabel alloc] initWithFrame : self.bounds];
    _label.backgroundColor = [UIColor clearColor];
    _label.textColor = UIColorFromRGB(0xefefef, 1.f);
    _label.font = [UIFont fontWithName:@"SpoqaHanSans" size:15];
    _label.textAlignment = NSTextAlignmentCenter;
    [self addSubview : _label];
    
    _label.text = time;
    
    _button = [UIButton buttonWithType : UIButtonTypeCustom];
    [_button addTarget : self
                action : @selector(pressedButton:)
      forControlEvents : UIControlEventTouchUpInside];
    [self addSubview : _button];
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    _label.frame = self.bounds;
    _underLine.frame = CGRectMake(17.f, self.bounds.size.height - 1, self.bounds.size.width - (17 * 2), 1);
    
    _button.frame = self.bounds;
    [_button setBackgroundImage : [common imageWithColor : UIColorFromRGB(0x000000, 0.3f)
                                                   width : _button.frame.size.width
                                                  height : _button.frame.size.height]
                       forState : UIControlStateHighlighted];
}

- (void) setSelected: (BOOL) isSelected
{
    self.backgroundColor = isSelected ? UIColorFromRGB(0x26c281, 1.f) : UIColorFromRGB(0x272230, 1.f);
}

- (void) pressedButton: (id) sender
{
    NSLog(@"  pressed some sleep timer Button 1 : 로그는 나옴..");
    if ( [self.delegate respondsToSelector : @selector(playerSleepTimerButton:didTouchTimer:)] )
    {
        NSLog(@"  pressed some sleep timer Button 2 : 현재 잘 안나옴...");
        [self.delegate playerSleepTimerButton : self
                                didTouchTimer : _label.text];
    }
}

@end
