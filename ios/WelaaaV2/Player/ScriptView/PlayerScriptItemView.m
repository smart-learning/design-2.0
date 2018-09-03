
#import "PlayerScriptItemView.h"

@interface PlayerScriptItemView ()
{
    UILabel *_timeLabel;
    UILabel *_textLabel;
}

@end

@implementation PlayerScriptItemView

- (id) initWithFrame : (CGRect) frame
{
    if ( self = [super initWithFrame : frame] )
    {
        [self initSubviews];
    }
    
    return self;
}

- (void) initSubviews
{
    _timeLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _timeLabel.backgroundColor = [UIColor clearColor];
    _timeLabel.textColor = UIColorFromRGB(0xffffff, 0.5f);
    _timeLabel.textAlignment = NSTextAlignmentLeft;
    _timeLabel.numberOfLines = 1;
    _timeLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _timeLabel.adjustsFontSizeToFitWidth = NO;
    [self addSubview : _timeLabel];

    _textLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _textLabel.backgroundColor = [UIColor clearColor];
    _textLabel.textColor = UIColorFromRGB(0xffffff, 0.5f);
    _textLabel.textAlignment = NSTextAlignmentLeft;
    _textLabel.numberOfLines = 4;
    _textLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _textLabel.adjustsFontSizeToFitWidth = NO;
    [self addSubview : _textLabel];
}

- (void) setFontSize
{
    CGFloat fontSize = [[NSUserDefaults standardUserDefaults] floatForKey : @"script-fontsize"];
    
    if ( fontSize == 0.f )
        fontSize = 15.f;
    
    _textLabel.font = [UIFont fontWithName : @"SpoqaHanSans"
                                      size : fontSize];
    _timeLabel.font = [UIFont fontWithName : @"SpoqaHanSans"
                                      size : fontSize];
}

- (void) layoutSubviews
{
    [self setFontSize];
    
    CGRect clientRect = self.bounds;
    
    if ( !nullStr(_timeLabel.text) && !nullStr(_textLabel.text) )
    {
        [_timeLabel sizeToFit];
        
        CGRect timeFrame = CGRectMake(20, 0, _timeLabel.frame.size.width, _timeLabel.frame.size.height);
        CGRect textFrame = CGRectMake(CGRectGetMaxX(timeFrame) + 20, 0, CGRectGetWidth(clientRect) - CGRectGetMaxX(timeFrame) - 40, 0);
        
        _textLabel.frame = textFrame;
        [_textLabel sizeToFit];

        CGFloat offsetY = (clientRect.size.height - _textLabel.frame.size.height) / 2.f;
        
        timeFrame.origin.y = offsetY;
        _timeLabel.frame = timeFrame;
        
        _textLabel.frame = CGRectMake(_textLabel.frame.origin.x,
                                      offsetY,
                                      _textLabel.frame.size.width,
                                      _textLabel.frame.size.height);
        
        _timeLabel.hidden = NO;
        _textLabel.hidden = NO;
    }
    else
    {
        _timeLabel.hidden = YES;
        _textLabel.hidden = YES;
    }
}

- (void) setTime : (NSString *) time
          script : (NSString *) script
{
    if ( _timeLabel )
    {
        _timeLabel.text = time;
    }
    
    if ( _textLabel )
    {
        _textLabel.text = script;
    }
    
    [self layoutSubviews];
}

- (void) setTextColor : (UIColor *) color
{
    _timeLabel.textColor = color;
    _textLabel.textColor = color;
}

@end
