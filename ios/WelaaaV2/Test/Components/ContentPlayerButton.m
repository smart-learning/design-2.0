
#import "ContentPlayerButton.h"

@interface ContentPlayerButton ()
{
    NSString *_buttonId;
    NSInteger _maxActiveCount;
    NSUInteger _status;
    UIImage *_normalImage;
    UIImage *_highlightedImage;
    
    UIImageView *_imageView;
    UILabel *_textLabel;
    UIButton *_button;
}

@end

@implementation ContentPlayerButton

- (id) initWithId : (NSString *) buttonId
      normalImage : (NSString *) normalImage
 highlightedImage : (NSString *) highlightedImage
   maxActiveCount : (NSInteger) maxActiveCount
{
    if ( self = [super initWithFrame : CGRectZero] )
    {
        _maxActiveCount = maxActiveCount;
        _status = 0;
        
        if ( !nullStr(normalImage) )
        {
            _normalImage = [UIImage imageNamed : normalImage];
        }
        
        if ( !nullStr(highlightedImage) )
        {
            _highlightedImage = [UIImage imageNamed : highlightedImage];
        }

        if ( !nullStr(buttonId) )
        {
            _buttonId = [[NSString alloc] initWithString : buttonId];
        }

        [self initSubviews];
    }
    
    return self;
}

- (void) initSubviews
{
    _imageView = [[UIImageView alloc] initWithFrame : CGRectZero];
    [self addSubview : _imageView];
    
    _textLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _textLabel.backgroundColor = [UIColor clearColor];
    _textLabel.font = [UIFont systemFontOfSize : 10];
    _textLabel.textAlignment = NSTextAlignmentCenter;
    _textLabel.textColor = UIColorFromRGB(0xffffff, 0.6f);
    [self addSubview :_textLabel];
    
    _textLabel.hidden = YES;
    
    _button = [UIButton buttonWithType : UIButtonTypeCustom];
    _button.frame = CGRectZero;
    [_button addTarget : self
                action : @selector(pressedButton:)
      forControlEvents : UIControlEventTouchUpInside];
    [self addSubview : _button];
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    CGRect clientFrame = self.frame;
    
    if ( _imageView )
    {
        CGFloat width = 50.f;
        CGFloat height = 50.f;
        CGFloat offsetX = (clientFrame.size.width - width) / 2.f;
        CGFloat offsetY = 0;
        _imageView.frame = CGRectMake(offsetX, offsetY, width, height);
        _imageView.image = _status == 0 ? _normalImage : _highlightedImage;;
    }
    
    if ( _textLabel )
    {
        _textLabel.frame = CGRectMake(0, 30, clientFrame.size.width, 20);
    }
    
    if ( _button )
    {
        _button.frame = _imageView.frame;
        [_button setImage : [common imageWithColor : UIColorFromRGB(0x000000, 0.3f)
                                             width : _button.frame.size.width
                                            height : _button.frame.size.height]
                 forState : UIControlStateHighlighted];
    }
}

- (void) setStatus: (NSInteger) status
{
    _status = status;
    [self layoutSubviews];
}

- (void) setText: (NSString *) text
{
    _textLabel.text = text;
    _textLabel.hidden = nullStr(text);
}

- (void) setImage: (NSString *) Image
{
    if ( !nullStr(Image) )
    {
        _normalImage = [UIImage imageNamed: Image];
        _highlightedImage = [UIImage imageNamed: Image];
        
        _imageView.image = _normalImage;
    }
}

- (void) pressedButton: (id) sender
{
    if ( _maxActiveCount > 1 )
    {
        [self setStatus: ((_status + 1) >= _maxActiveCount ? 0 : _status + 1)];
    }

    if ( [self.delegate respondsToSelector: @selector(pressedPlayerButtonWithId:status:)] )
    {
        [self.delegate pressedPlayerButtonWithId: _buttonId
                                          status: _status];
    }
}

@end

















