
#import "ContentMiniPlayerView.h"


typedef NS_ENUM (NSInteger, ContentMiniPlayerViewMoveToPage)
{
    ContentMiniPlayerViewMoveToPageNone,
  ContentMiniPlayerViewMoveToPageClose
};

@interface ContentMiniPlayerView () < ContentPlayerTouchViewDelegate, UIScrollViewDelegate >
{
    UIView *_playerView;
  
    UIButton *_playBtn;
    UIButton *_pauseBtn;
  
    UILabel *_timeLabel;
    UILabel *_totalTimeLabel;
    UILabel *_titleLabel;
  
    UIView *_slider;
  
    CGFloat _currentTime;
    CGFloat _totalTime;
  
    ContentPlayerTouchView *_touchView;
  
    UIPanGestureRecognizer *_panGesture;
    BOOL _isGestureMoving;
    CGFloat _gestureOffset;
}

@end

@implementation ContentMiniPlayerView

- (instancetype) initWithFrame : (CGRect) frame
{
    if ( self = [super initWithFrame : frame] )
    {
      [self initSubviews];
    }
  
    return self;
}

- (void) reOrderSubviews
{
    _playerView.frame = CGRectMake(0, 0, self.bounds.size.width, self.bounds.size.height);
    _playBtn.frame = CGRectMake(10, 10, 20, 20);
    _pauseBtn.frame = CGRectMake(10, 10, 20, 20);
  
    _touchView.frame = CGRectMake(CGRectGetMaxX(_playBtn.frame) + 10, 0,
                                  CGRectGetWidth(_playerView.frame) - (CGRectGetMaxX(_playBtn.frame) + 10),
                                  _playerView.frame.size.height);
  
    [self resizeTimeLabel];
}

- (void) initSubviews
{
    self.backgroundColor = UIColorFromRGB(0x272230, 1.f);
  
    _playerView = [[UIView alloc] initWithFrame : CGRectMake(00, 0, self.bounds.size.width, self.bounds.size.height)];
    _playerView.backgroundColor = [UIColor clearColor];
    [self addSubview : _playerView];
  
    _playBtn = [UIButton buttonWithType : UIButtonTypeCustom];
    _playBtn.frame = CGRectMake(10, 10, 20, 20);
    [_playBtn addTarget : self
                 action : @selector(pressedPlayButton)
       forControlEvents : UIControlEventTouchUpInside];
  
    [_playerView addSubview : _playBtn];
  
    _pauseBtn = [UIButton buttonWithType : UIButtonTypeCustom];
    _pauseBtn.frame = CGRectMake(10, 10, 20, 20);
    [_pauseBtn addTarget : self
                  action : @selector(pressedPauseButton)
        forControlEvents : UIControlEventTouchUpInside];
  
    [_playerView addSubview : _pauseBtn];
  
    _timeLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _timeLabel.font = [UIFont systemFontOfSize : 13.f];
    _timeLabel.textColor = UIColorFromRGB(0x09b774, 1.f);
    _timeLabel.textAlignment = NSTextAlignmentCenter;
    _timeLabel.text = @"00:00";
    [_playerView addSubview : _timeLabel];
  
    _totalTimeLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _totalTimeLabel.font = [UIFont systemFontOfSize : 13.f];
    _totalTimeLabel.textColor = [UIColor whiteColor];
    _totalTimeLabel.textAlignment = NSTextAlignmentCenter;
    _totalTimeLabel.text = @"/ 00:00";
    [_playerView addSubview : _totalTimeLabel];
  
    _titleLabel = [[UILabel alloc] initWithFrame : CGRectZero];
    _titleLabel.backgroundColor = [UIColor clearColor];
    _titleLabel.font = [UIFont fontWithName:@"SpoqaHanSans" size:13];
    _titleLabel.textColor = [UIColor whiteColor];
    _titleLabel.textAlignment = NSTextAlignmentLeft;
    _titleLabel.numberOfLines = 1;
    _titleLabel.lineBreakMode = NSLineBreakByTruncatingTail;
    _titleLabel.adjustsFontSizeToFitWidth = NO;
    [_playerView addSubview : _titleLabel];
  
    _slider = [[UIView alloc] initWithFrame : CGRectMake(0, 0, 0, 2)];
    _slider.backgroundColor = UIColorFromRGB(0x26c281, 1.f);
    [_playerView addSubview : _slider];
  
    _touchView = [[ContentPlayerTouchView alloc] initWithFrame : CGRectMake(CGRectGetMaxX(_playBtn.frame) + 10,
                                                                            0,
                                                                            CGRectGetWidth(_playerView.frame) - (CGRectGetMaxX(_playBtn.frame) + 10),
                                                                            _playerView.frame.size.height)];
    _touchView.selectedColor = UIColorFromRGB(0x000000, 0.2f);
    _touchView.delegate = self;
    [_playerView addSubview : _touchView];
  
    _playBtn.hidden = NO;
    _pauseBtn.hidden = !_playBtn.hidden;
  
    [self setControllerColorWithAudioMode : NO];
    [self resizeTimeLabel];
  
    _panGesture = [[UIPanGestureRecognizer alloc] initWithTarget : self
                                                          action : @selector(handlePanGesture:)];
  
    [self addGestureRecognizer : _panGesture];
}

- (void) resizeTimeLabel
{
    if ( _totalTimeLabel && _timeLabel )
    {
        [_totalTimeLabel sizeToFit];
        _totalTimeLabel.frame = CGRectMake(_playerView.frame.size.width - 15.f - _totalTimeLabel.frame.size.width,
                                           (_playerView.frame.size.height - _totalTimeLabel.frame.size.height) / 2.f,
                                           _totalTimeLabel.frame.size.width,
                                           _totalTimeLabel.frame.size.height);
      
        [_timeLabel sizeToFit];
        _timeLabel.frame = CGRectMake(CGRectGetMinX(_totalTimeLabel.frame) - _timeLabel.frame.size.width - 3.f,
                                      (_playerView.frame.size.height - _timeLabel.frame.size.height) / 2.f,
                                      _timeLabel.frame.size.width,
                                      _timeLabel.frame.size.height);
    }
  
    if ( _titleLabel )
    {
        _titleLabel.frame = CGRectMake(CGRectGetMaxX(_playBtn.frame) + 10.f,
                                       0,
                                       (CGRectGetMinX(_timeLabel.frame) - 5.f) - (CGRectGetMaxX(_playBtn.frame) + 10.f),
                                       _playerView.frame.size.height);
    }
  
    if ( _slider && _totalTime > 0 )
    {
        CGFloat per = (_currentTime / _totalTime) * 100.f;
        CGFloat uiPer = _playerView.frame.size.width / 100.f;
        _slider.frame = CGRectMake(0, 0, per * uiPer, 2);
    }
}

#pragma mark - public methods

- (void) setControllerColorWithAudioMode : (BOOL) isAudioMode
{
    NSString *playImageName = isAudioMode ? @"icon_play_pink.png" : @"icon_play_green.png";
    NSString *pauseImageName = isAudioMode ? @"icon_pause_pink.png" : @"icon_pause_green.png";
  
    [_playBtn setImage : [UIImage imageNamed : playImageName]
              forState : UIControlStateNormal];
  
    [_pauseBtn setImage : [UIImage imageNamed : pauseImageName]
               forState : UIControlStateNormal];
  
    _timeLabel.textColor = isAudioMode ? UIColorFromRGB(0xff4f72, 1.f) : UIColorFromRGB(0x09b774, 1.f);
}

- (void) setTitleLabel01 : (NSString *) text
{
    _titleLabel.text = text;
  
    [self resizeTimeLabel];
}

- (void) setPreparedToPlayInfo : (NSDictionary *) info
{
    CGFloat currentTime = [info[@"currentTime"] floatValue];
    CGFloat totalTime = [info[@"totalTime"] floatValue];
    NSInteger audioContent = [info[@"isAudioContent"] integerValue];   // 미니플레이어에서의 미리보기컨텐츠의 시간세팅을 위한 기준 값. 171102 김태현
    // audioContentString 이 0이면 영상/ 1이면 오디오북
  
    if ( !self.isAuthor && 0 == audioContent )
    {
        totalTime = 90.f;   // 지식영상 미리보기만 90초임. 미리듣기의 경우는 90초가 아닌 원래 시간으로 세팅해야함. 171102 김태현
    }
  
    if ( _timeLabel )
    {
        _timeLabel.text = [common convertTimeToString : currentTime
                                               Minute : YES];
    }
  
    if ( _totalTimeLabel )
    {
        NSString *totalTimeStr = [@"/ " stringByAppendingString : [common convertTimeToString : totalTime
                                                                                       Minute : YES]];
        _totalTimeLabel.text = totalTimeStr;
    }
  
    _totalTime = totalTime;
    _currentTime = currentTime;
  
    [self resizeTimeLabel];
}

- (void) setPlayState : (BOOL) isPlay
{
    _pauseBtn.hidden = !isPlay;
    _playBtn.hidden = !_pauseBtn.hidden;
}

- (void) setSeekbarCurrentValue : (CGFloat) time
{
    if ( _timeLabel )
    {
        _timeLabel.text = [common convertTimeToString : time
                                               Minute : YES];
    }
  
    _currentTime = time;
  
    [self resizeTimeLabel];
}

#pragma mark - selectors

- (void) pressedPlayButton
{
    if ( [self.delegate respondsToSelector : @selector(miniPlayerUiView:setPlay:)] )
    {
        [self.delegate miniPlayerUiView : self
                                setPlay : YES];
    }
}

- (void) pressedPauseButton
{
    if ( [self.delegate respondsToSelector : @selector(miniPlayerUiView:setPlay:)] )
    {
        [self.delegate miniPlayerUiView : self
                                setPlay : NO];
    }
}

#pragma mark - IFTouchViewDelegate
- (void) puiTouchActionView : (ContentPlayerTouchView *) view
             didTouchAction : (id) sender
{
    if ( [self.delegate respondsToSelector : @selector(miniPlayerUiView:openView:)] )
    {
      [self.delegate miniPlayerUiView : self
                             openView : nil];
    }
}


- (void) handlePanGesture : (UIPanGestureRecognizer *) gestureRecognizer
{
    CGPoint touchPoint = [gestureRecognizer locationInView : self];
    _isGestureMoving = YES;
  
    if ( gestureRecognizer.state == UIGestureRecognizerStateBegan )
    {
        _gestureOffset = touchPoint.x;
    }
    else if ( gestureRecognizer.state == UIGestureRecognizerStateChanged )
    {
        CGFloat moveDistance = touchPoint.x - _gestureOffset;
      
        if ( moveDistance > 0 )
        {
            moveDistance = CGRectGetMinX(_playerView.frame) + fabs(moveDistance);
        }
        else
        {
            moveDistance = CGRectGetMinX(_playerView.frame) - fabs(moveDistance);
        }
      
        if ( moveDistance < 0 )
        {
            moveDistance = 0;
        }
      
        [self moveFrameInitialized : ContentMiniPlayerViewMoveToPageNone
                            offset : moveDistance
                          animated : NO];
      
        _gestureOffset = touchPoint.x;
    }
    else if ( gestureRecognizer.state == UIGestureRecognizerStateEnded )
    {
        CGFloat webOffset = CGRectGetMinX(_playerView.frame);
        ContentMiniPlayerViewMoveToPage status = ContentMiniPlayerViewMoveToPageNone;
        CGFloat moveDistance = 0.f;
      
        if ( webOffset > (CGRectGetWidth(_playerView.frame) / 3) )
        {
            // history Back
            status = ContentMiniPlayerViewMoveToPageClose;
            moveDistance = CGRectGetWidth(self.frame);
        }
      
        [self moveFrameInitialized : status
                            offset : moveDistance
                          animated : YES];
      
        _isGestureMoving = NO;
    }
    else if ( gestureRecognizer.state == UIGestureRecognizerStateCancelled )
    {
        _gestureOffset = 0.f;
      
        [self moveFrameInitialized : ContentMiniPlayerViewMoveToPageNone
                            offset : 0.f
                          animated : YES];
      
      _isGestureMoving = NO;
    }
    else if ( gestureRecognizer.state == UIGestureRecognizerStateFailed )
    {
        _gestureOffset = 0.f;
      
        [self moveFrameInitialized : ContentMiniPlayerViewMoveToPageNone
                            offset : 0.f
                          animated : YES];
      
        _isGestureMoving = NO;
    }
}

- (void) moveFrameInitialized : (ContentMiniPlayerViewMoveToPage) movePage
                       offset : (CGFloat) offset
                     animated : (BOOL) animated
{
    // 뷰 전체 영역 (웹뷰, 툴바, 히스토리 백뷰)
    CGRect frame = _playerView.frame;
    frame.origin = CGPointMake(offset, 0.f);
  
    if ( animated )
    {
        [UIView animateWithDuration : 0.3f
                         animations : ^{
                                          _playerView.frame = frame;
                                      }
                         completion : ^(BOOL finished)
                                      {
                                          if ( movePage == ContentMiniPlayerViewMoveToPageClose )
                                          {
                                              if ( [self.delegate respondsToSelector : @selector(miniPlayerUiView:closeView:)])
                                              {
                                                  [self.delegate miniPlayerUiView : self
                                                                        closeView : nil];
                                              }
                                          }
                                     }];
    }
    else
    {
        _playerView.frame = frame;
    }
}

@end


















