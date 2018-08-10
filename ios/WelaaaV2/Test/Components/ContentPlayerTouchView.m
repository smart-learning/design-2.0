
#import "ContentPlayerTouchView.h"

@implementation ContentPlayerTouchView

- (void) setTouchEffect: (BOOL) isTouch
{
    if ( isTouch )
    {
        if ( _selectedColor )
        {
            self.backgroundColor = _selectedColor;
        }
        else
        {
            self.backgroundColor = UIColorFromRGB(0x000000, 0.3);
        }
    }
    else
    {
        self.backgroundColor = [UIColor clearColor];
    }
}

- (void) onTouchAction
{
    if ( [self.delegate respondsToSelector:@selector(puiTouchActionView:didTouchAction:)] )
    {
        [self.delegate puiTouchActionView: self
                           didTouchAction: nil];
    }
}

#pragma touch event
- (void) touchesBegan: (NSSet *) touches
            withEvent: (UIEvent *) event
{
    [self setTouchEffect: YES];
}

- (void) touchesMoved: (NSSet *) touches
            withEvent: (UIEvent *) event
{
    return ;
}

- (void) touchesEnded: (NSSet *) touches
            withEvent: (UIEvent *) event
{
    [self setTouchEffect: NO];
    [self onTouchAction];
}

- (void) touchesCancelled: (NSSet *) touches
                withEvent: (UIEvent *) event
{
    [self setTouchEffect: NO];
}

@end








