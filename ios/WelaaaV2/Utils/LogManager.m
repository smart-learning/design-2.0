
#import "LogManager.h"

@interface LogManager ()
{
    NSMutableDictionary *_contentsItem;
    
    NSMutableArray *_logArray;
    BOOL _sendingLog;
}

@end

@implementation LogManager

+ (LogManager *) sharedInstance
{
    static LogManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[LogManager alloc] init];
    });
    
    return sharedInstance;
}

- (void) sendLogWithContentKey: (NSString *) cKey
                           sec: (NSInteger) sec
                         force: (BOOL) force
{
    if ( !_contentsItem )
    {
        _contentsItem = [[NSMutableDictionary alloc] init];
    }

    if ( force )
    {
        NSString *sendUrl = [NSString stringWithFormat: @"/usingapp/contents_view_history.php?ckey=%@&view_time=%ld", cKey, sec];
        [self sendLogWithUrl: sendUrl];
        
        return ;
    }
    
    NSInteger sendTime = -1;
    
    if ( sec > 0 )
    {
        if ( _contentsItem[cKey])
        {
            NSInteger prevSec = [_contentsItem[cKey] integerValue];

            if ( sec - prevSec >= 5 || prevSec - sec >= 5 )
            {
                _contentsItem[cKey] = @(sec);
                sendTime = sec;
            }
        }
        else
        {
            _contentsItem[cKey] = @(sec);
            sendTime = sec;
        }
    }
    
    if ( sendTime != -1 )
    {
        NSString *sendUrl = [NSString stringWithFormat: @"/usingapp/contents_view_history.php?ckey=%@&view_time=%ld", cKey, (long) sendTime];
        [self sendLogWithUrl: sendUrl];
    }
}

// 이용자의 컨텐츠 이용 내역 tracking을 위해 데이터를 서버로 전송합니다. 180227 김태현.
- (void) sendLogWithGroupKey: (NSString *) gKey
                  contentKey: (NSString *) cKey
                      status: (NSString *) contentStatus
                  downloaded: (BOOL) isDownloadFile
                startingTime: (NSInteger) startingTime
                  endingTime: (NSInteger) endingTime
{
    NSString *netStatus;
    if ( isDownloadFile )
    {
        netStatus = @"DOWNLOAD";
    }
    else if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        netStatus = @"Wi-FI";
    }
    else if ( [[ApiManager sharedInstance] isConnectionCellular] )
    {
        netStatus = @"LTE/3G";
    }
    
    if ( nil != [[NSUserDefaults standardUserDefaults] stringForKey: @"webToken"] )
    {
        NSMutableDictionary *param = [NSMutableDictionary dictionary];
        param[@"gkey"] = gKey;
        param[@"ckey"] = cKey;
        param[@"type"] = @"iphone";
        param[@"status"] = contentStatus;   // START / ING / END / FORWARD / BACK
        param[@"start_current_time"] = [NSString stringWithFormat: @"%tu", startingTime];   // msec
        param[@"end_current_time"] = [NSString stringWithFormat: @"%tu", endingTime];       // msec
        param[@"duration_time"] = [NSString stringWithFormat: @"%tu", endingTime - startingTime]; // end - start = msec
        param[@"net_status"] = netStatus;            // "DOWNLOAD" / "Wi-Fi" / "LTE/3G"
        param[@"f_token"] = [[NSUserDefaults standardUserDefaults] stringForKey: @"webToken"];
        NSLog(@"    [sendLogWithGroupKey] parameters : %@", [param description]);
        
        [[ApiManager sharedInstance] requestWithUrl: @"/usingapp/insert_view_time.php"
                                             method: @"GET"
                                              param: param
                                          onSuccess: ^(NSDictionary *object)
                                                     {
                                                         NSLog(@"  from insert_view_time.php : %@", object);
                                                     }
                                          onFailure: ^(NSError *error)
                                                     {
                                                         //DEFAULT_ALERT(@"전송 실패", @"일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                                                     }];
    }
    else
    {
        return ;
    }
}

- (void) sendLogWithUrl: (NSString *) url
{
    [self addLogItem: url];
}

- (void) addLogItem: (NSString *) url
{
    if ( nullStr(url) )
        return ;
    
    url = [url trim];
    
    if ( ![NSURL URLWithString: url] )
    {
        return ;
    }
    
    if ( !_logArray )
    {
        _logArray = [[NSMutableArray alloc] init];
    }
    
    [_logArray addObject: [url trim]];
    
    if ( !_sendingLog )
    {
        _sendingLog = YES;
        
        [self sendLogData];
    }
}

- (void) sendLogData
{
    if ( [_logArray count] == 0 )
    {
        _sendingLog = NO;
        
        return ;
    }
    
    NSString *url = [_logArray objectAtIndex: 0];
    
    if ( !nullStr(url) )
    {
        [[ApiManager sharedInstance] requestWithUrl: url
                                             method: @"GET"
                                              param: nil
                                          onSuccess: ^(NSDictionary *object)
                                                     {
                                                         [self sendNextLogData];
                                                         NSLog(@"   [sendLogData] result : %@", object);
                                                     }
                                          onFailure: ^(NSError *error)
                                                     {
                                                         [self sendNextLogData];
                                                     }];
    }
}

- (void) sendNextLogData
{
    if ( [_logArray count] > 0 )
    {
        [_logArray removeObjectAtIndex: 0];
        
        if ( [_logArray count] > 0 )
        {
            [self sendLogData];
        }
        else
        {
            _sendingLog = NO;
        }
    }
}

@end








