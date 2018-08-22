
#import "IFPlayerScriptCell.h"

@interface IFPlayerScriptCell ()
{
    IFPlayerScriptItemView *_itemView;
}

@end


@implementation IFPlayerScriptCell

+ (CGFloat) heightWithTime: (NSString *) time
                      text: (NSString *) text
               screenWidth: (CGFloat) screenWidth
                  fontSize: (CGFloat) fontsize
{
    UIFont *font = [UIFont fontWithName: @"SpoqaHanSans"
                                   size: fontsize];
    
    CGFloat timeWidth = GET_STRING_SIZE_N(time, font, screenWidth, 0).width;
    screenWidth = screenWidth - (timeWidth + 20.f + 20.f);
    
    CGFloat textHeight = GET_STRING_SIZE_N(text, font, screenWidth, 999).height;

    return textHeight + 20.f;
}

- (id) initWithStyle: (UITableViewCellStyle) style
     reuseIdentifier: (NSString *) reuseIdentifier
{
    if ( self = [super initWithStyle:style reuseIdentifier:reuseIdentifier] )
    {
        [self initSubviews];
    }
    
    return self;
}

- (void) initSubviews
{
    _itemView = [[IFPlayerScriptItemView alloc] initWithFrame: CGRectZero];
    _itemView.backgroundColor = [UIColor clearColor];
    [self.contentView addSubview: _itemView];
}

- (void) layoutSubviews
{
    [super layoutSubviews];
    
    if ( _itemView )
    {
        _itemView.frame = self.contentView.bounds;
    }
}

- (void) setTime: (NSString *) time
          script: (NSString *) script
{
    if ( _itemView )
    {
        [_itemView setTime: time
                    script: script];
    }
}

- (void) setTextColor: (UIColor *) color
{
    if ( _itemView )
    {
        [_itemView setTextColor: color];
    }
}

@end




















