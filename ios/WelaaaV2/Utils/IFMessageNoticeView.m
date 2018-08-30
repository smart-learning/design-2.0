
#import "IFMessageNoticeView.h"

@interface IFMessageNoticeView ()
{
    NSDictionary *_item;
}

@end

@implementation IFMessageNoticeView

- (id) initWithFrame: (CGRect) frame
                item: (NSDictionary *) item
               title: (NSString *) title
{
    if ( self = [super initWithFrame: frame] )
    {
        if ( item )
            _item = [[NSDictionary alloc] initWithDictionary: item];
        
        [self initLayoutWithTitle: title];
    }
    
    return self;
}

- (void) initLayoutWithTitle: (NSString *) title
{
    self.backgroundColor = UIColorFromRGB(0x000000, 0.3);
    
    CGFloat cornerRadius = 20.f;
    CGFloat marginWidth = 50;
    CGFloat marginHeight = 100;
    
    UIView *itemView = [[UIView alloc] initWithFrame: CGRectMake(marginWidth / 2, marginHeight / 2,
                                                                self.frame.size.width - marginWidth,
                                                                self.frame.size.height - marginHeight)];
    [self addSubview: itemView];
    
    itemView.clipsToBounds = YES;
    itemView.backgroundColor = [UIColor whiteColor];
    itemView.layer.borderWidth = 1;
    itemView.layer.borderColor = [UIColor whiteColor].CGColor;
    itemView.layer.cornerRadius = cornerRadius;
    
    UIView *titleView = [self makeTitleView: CGRectMake(0, 0, itemView.frame.size.width, 56)
                                      title: (!nullStr(title) ? title : @"내용")];
    [itemView addSubview:titleView];
    
    UIView *bottomView = [self makeBottomView: CGRectMake(0, itemView.frame.size.height - 50, itemView.frame.size.width, 50)];
    [itemView addSubview: bottomView];
    
    CGFloat contentHeight = itemView.frame.size.height - (CGRectGetHeight(titleView.frame) + CGRectGetHeight(bottomView.frame));
    UIView *contentView = [self makeContentView: CGRectMake(0, CGRectGetMaxY(titleView.frame),
                                                           itemView.frame.size.width,
                                                           contentHeight)];
    [itemView addSubview: contentView];
}

- (UIView *) makeTitleView: (CGRect) frame
                     title: (NSString *) title
{
    UIView *itemView = [[UIView alloc] initWithFrame: frame];
    itemView.backgroundColor = [UIColor whiteColor];
    
    UILabel *label = [[UILabel alloc] initWithFrame: CGRectMake(0, 0, itemView.frame.size.width, itemView.frame.size.height)];
    label.backgroundColor = [UIColor clearColor];
    label.textColor = UIColorFromRGB(0x111111, 1.f);
    label.font = [UIFont boldSystemFontOfSize: 19];
    label.textAlignment = NSTextAlignmentCenter;
    label.text = title;
    [itemView addSubview: label];
    
    UIView *line = [[UIView alloc] initWithFrame: CGRectMake(0, itemView.frame.size.height - 1, itemView.frame.size.width, 1)];
    line.backgroundColor = UIColorFromRGB(0x000000, 0.1);
    [itemView addSubview:line];
    
    return itemView;
}

- (UIView *) makeContentView: (CGRect) frame
{
    NSString *subject = (_item[@"subject"] ? _item[@"subject"] : @"");
    
    UIView *itemView = [[UIView alloc] initWithFrame: frame];
    
    UIScrollView *scrollView = [[UIScrollView alloc] initWithFrame: itemView.bounds];
    [itemView addSubview: scrollView];
    
    CGFloat offsetY = 19.f;
    
    //내용
    if ( !nullStr(subject) )
    {
        UILabel *subjectLabel = [[UILabel alloc] initWithFrame: CGRectMake(16, offsetY, scrollView.frame.size.width - 32, 0)];
        subjectLabel.backgroundColor = [UIColor clearColor];
        subjectLabel.textColor = UIColorFromRGB(0x333333, 1.f);
        subjectLabel.font = [UIFont systemFontOfSize:16.f];
        subjectLabel.text = subject;
        subjectLabel.numberOfLines = 999;
        [subjectLabel sizeToFit];
        [scrollView addSubview: subjectLabel];
        
        offsetY = CGRectGetMaxY(subjectLabel.frame) + 13.f;
    }
    
    scrollView.contentSize = CGSizeMake(scrollView.contentSize.width, offsetY);
    
    return itemView;
}

- (UIView *) makeBottomView: (CGRect) frame
{
    UIView *itemView = [[UIView alloc] initWithFrame: frame];
    
    UIView *line = [[UIView alloc] initWithFrame: CGRectMake(16, 0, itemView.frame.size.width - 32, 1)];
    line.backgroundColor = UIColorFromRGB(0xccccd0, 1.f);
    [itemView addSubview: line];
    
    UIButton *button = [UIButton buttonWithType: UIButtonTypeCustom];
    button.frame = CGRectMake(0, 1, itemView.frame.size.width, itemView.frame.size.height - 1);
    [button setTitle: @"닫 기"
            forState: UIControlStateNormal];
    [button setTitleColor: UIColorFromRGB(0x111111, 1.f)
                 forState: UIControlStateNormal];
    [button setTitleColor: UIColorFromRGB(0x4c5694, 1.f)
                 forState: UIControlStateHighlighted];
    [button.titleLabel setFont: [UIFont systemFontOfSize: 18]];
    [button addTarget: self
               action: @selector(pressedCloseButton:)
     forControlEvents: UIControlEventTouchUpInside];
    [itemView addSubview: button];
    
    return itemView;
}

#pragma mark - selector
- (void) pressedCloseButton: (id) sender
{
    [self removeFromSuperview];
}

@end
