
#import "ScriptControlView.h"

@implementation ScriptControlView

- (instancetype) initWithFrame : (CGRect) frame
{
    if ( self = [super initWithFrame: frame] )
    {
        [self initSubviews];
    }
    return self;
}

- (void) initSubviews
{
    for ( NSInteger i=0; i<3; i++ )
    {
        UIButton *button = [UIButton buttonWithType : UIButtonTypeCustom];
        button.tag = i;
        [button addTarget : self
                   action : @selector(pressedButton:)
         forControlEvents : UIControlEventTouchUpInside];
        [self addSubview : button];
    }
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    CGFloat saveFontSize = [[NSUserDefaults standardUserDefaults] floatForKey : @"script-fontsize"];
    
    if (saveFontSize == 0.f)
        saveFontSize = 15.f;

    for ( UIView *subview in self.subviews )
    {
        if ( [subview isKindOfClass : [UIButton class]] )
        {
            UIButton *button = (UIButton *) subview;
            
            NSInteger tag = subview.tag;
            CGFloat buttonSize = 40.f;
            
            CGFloat offsetX = self.frame.size.width - (buttonSize * 3) - 50;
            CGFloat offsetY = 20.f;
            CGFloat fontsize = 13.f;
            
            BOOL isHighlighted = (fontsize + (tag * 2) == saveFontSize);
            
            subview.frame = CGRectMake(offsetX + (tag * (buttonSize + 10)), offsetY, buttonSize, buttonSize);
            UIColor *titleColor = UIColorFromRGB(0x706d76, 1.f);
            UIColor *normalColor = isHighlighted ? UIColorFromRGB(0x000000, 1.f) : UIColorFromRGB(0x000000, 0.f);
            
            [button setTitle : @"가"
                    forState : UIControlStateNormal];
            
            [button setTitleColor : titleColor
                         forState : UIControlStateNormal];
            
            [button.titleLabel setFont : [UIFont fontWithName : @"SpoqaHanSans"
                                                         size : fontsize + (tag * 2)]];
            
            [button setBackgroundImage : [common imageWithColor : normalColor
                                                          width : buttonSize
                                                         height : buttonSize]
                              forState : UIControlStateNormal];
            
            [button setBackgroundImage : [common imageWithColor : UIColorFromRGB(0x09b774, 1.f)
                                                          width : buttonSize
                                                         height : buttonSize]
                              forState : UIControlStateHighlighted];
            
            
            button.layer.borderWidth = 1.f;
            button.layer.borderColor = UIColorFromRGB(0x000000, 1.f).CGColor;
        }
    }
}

- (void) pressedButton : (id) sender
{
    UIButton *button = (UIButton *) sender;
    
    NSInteger tag = button.tag;
    CGFloat fontSize = 15.f;
    
    if ( tag == 0 )
    {
        fontSize = 13.f;
    }
    else if ( tag == 1 )
    {
        fontSize = 15.f;
    }
    else if ( tag == 2 )
    {
        fontSize = 17.f;
    }
    
    CGFloat saveFontSize = [[NSUserDefaults standardUserDefaults] floatForKey : @"script-fontsize"];
    
    if ( saveFontSize == 0.f )
        saveFontSize = 15.f;

    if ( saveFontSize != fontSize )
    {
        [[NSUserDefaults standardUserDefaults] setFloat : fontSize
                                                 forKey : @"script-fontsize"];
        [[NSUserDefaults standardUserDefaults] synchronize];
        
        if ( [self.delegate respondsToSelector : @selector(scriptControlView:changedFontSize:)] )
        {
            [self.delegate scriptControlView : self
                             changedFontSize : nil];
        }
        
        [self layoutSubviews];
    }
}

@end


















