
#import "common.h"

@implementation common

+ (NSDictionary *) infoPlist
{
    static NSDictionary *_infoPlist = nil;
    
    if ( !_infoPlist )
    {
        _infoPlist = [[NSBundle mainBundle] infoDictionary];
    }
    
    return _infoPlist;
}

+ (BOOL) isNullString: (NSString *) str
{
    if ( !str )
        return YES;
    
    if ( [str isEqual: [NSNull null]] )
        return YES;
    
    if ( [str length] == 0 )
        return YES;
    
    if ( [str isEqualToString: @""] )
        return YES;
    
    return NO;
}

+ (UIImage *) imageWithColor: (UIColor *) color
                       width: (CGFloat) widht
                      height: (CGFloat) height
{
    CGRect rect = CGRectMake(0.0f, 0.0f, widht, height);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context, [color CGColor]);
    CGContextFillRect(context, rect);
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return image;
}

+ (UIImage *) blurredImageWithImage: (UIImage *) sourceImage
{
    //  Create our blurred image
    CIContext *context = [CIContext contextWithOptions: nil];
    CIImage *inputImage = [CIImage imageWithCGImage: sourceImage.CGImage];
    
    //  Setting up Gaussian Blur
    CIFilter *filter = [CIFilter filterWithName: @"CIGaussianBlur"];
    [filter setValue: inputImage
              forKey: kCIInputImageKey];
    
    [filter setValue: [NSNumber numberWithFloat: 15.0f]
              forKey: @"inputRadius"];
    
    CIImage *result = [filter valueForKey: kCIOutputImageKey];
    
    // CIGaussianBlur has a tendency to shrink the image a little, this ensures it matches up exactly to the bounds of our original image
    CGImageRef cgImage = [context createCGImage: result
                                       fromRect: [inputImage extent]];
    
    UIImage *retVal = [UIImage imageWithCGImage: cgImage];
    
    return retVal;
}

+ (NSString *) convertTimeToString: (float) time
                            Minute: (BOOL) isMinute
{
    int p = (int) time;
    
    int Hour = 0;
    int Min = 0;
    int Sec = 0;
    
    //시간
    Hour = p / 3600;
    
    p = p - (Hour * 3600);
    
    //분
    Min = p / 60;
    
    p = p - (Min * 60);
    
    //초
    Sec = p;
    
    NSString *ptime = @"";
    
    if ( isMinute )
    {
        Min = Min + (Hour * 60);
        ptime = [NSString stringWithFormat: @"%02d:%02d", Min, Sec];
    }
    else
    {
        ptime = [NSString stringWithFormat: @"%02d:%02d:%02d", Hour, Min, Sec];
    }
    
    return ptime;
}

+ (NSInteger) convertStringToTime: (NSString *) timeString
{
    NSArray *array = [timeString componentsSeparatedByString:@":"];
    
    if ( array.count == 0 )
    {
        return 0;
    }

    NSInteger hour = 0;
    NSInteger min = 0;
    NSInteger sec = 0;
    
    if ( array.count == 3 )
    {
        hour = [array[0] integerValue];
        min = [array[1] integerValue];
        sec = [array[2] integerValue];
    }
    else if ( array.count == 2 )
    {
        min = [array[0] integerValue];
        sec = [array[1] integerValue];
    }
    else if ( array.count == 1 )
    {
        sec = [array[0] integerValue];
    }
    else
    {
        return 0;
    }
    
    return (hour * 3600) + (min * 60) + sec;
}

+ (NSInteger) getDistanceDateWithStartDate: (NSDate *) sDate
                                   EndDate: (NSDate *) eDate
{
    NSCalendar *gregorian = [[NSCalendar alloc] initWithCalendarIdentifier: NSCalendarIdentifierGregorian];
    NSUInteger unitFlags = NSCalendarUnitSecond;
    NSDateComponents *com = [gregorian components: unitFlags
                                         fromDate: sDate
                                           toDate: eDate
                                          options: 0];
    
    return [com second];
}

+ (NSString *) getDocumentsFolderPath
{
    return NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).lastObject;
}

+ (NSString *) getUUID
{
    return [self udidUsingCFUUID];
}

+ (NSString *) udidUsingCFUUID
{
    NSString *udid = [self uuidFromKeyChain];
    
    if ( !nullStr(udid) )
        return udid;
    
    CFUUIDRef uuid = CFUUIDCreate(NULL);
    udid = (__bridge_transfer NSString *) CFUUIDCreateString(NULL, uuid);
    CFRelease(uuid);
    
    if ( !nullStr(udid) )
    {
        [self saveUuidForKeyChain: udid];
        
        return udid;
    }
    
    return nil;
}

+ (NSString *) uuidFromKeyChain
{
    return [SAMKeychain passwordForService: @"com.influential.smartlearning"
                                   account: @"UUID"];
}

+ (void) saveUuidForKeyChain: (NSString *) udid
{
    NSError *error = nil;
    BOOL result = [SAMKeychain setPassword: udid
                                forService: @"com.influential.smartlearning"
                                   account: @"UUID"
                                     error: &error];
    
    if ( result == FALSE )
    {
        NSLog(@"  save UUID error = [ %@ ]", [error localizedDescription]);
    }
}

+ (id) getUserSettingValueWithKey: (NSString *) key
{
    return [[NSUserDefaults standardUserDefaults] objectForKey: key];
}

+ (void) setUserSettingValueWithKey: (NSString *) key
                              value: (id) value
{
    [[NSUserDefaults standardUserDefaults] setObject: value
                                              forKey: key];
    [[NSUserDefaults standardUserDefaults] synchronize];
}

+ (NSString *) forceStringValue: (id) value
{
    NSString *v = @"";
    
    if ( value == nil || value == (id)[NSNull null] || [value isKindOfClass: [NSDictionary class]] )
    {
        v = @"";
    }
    else if ( [value isKindOfClass: [NSNumber class]] )
    {
        v = [value stringValue];
    }
    else if ( [value isKindOfClass: [NSArray class]] )
    {
        v = @"";
    }
    else
    {
        v = value;
    }
    
    if ( !nullStr(v) && [v isKindOfClass: [NSString class]] )
    {
        v = [v trim];
    }
    
    return v;
}

+ (CGFloat) getRatioWidth: (CGSize) originSize
             screenHeight: (CGFloat) screenHeight
{
    if ( CGSizeEqualToSize(originSize, CGSizeZero) )
    {
        return 0.f;
    }
    
    CGSize imageSize = originSize;
    CGFloat viewHeight = screenHeight;
    CGFloat ratio = imageSize.height / viewHeight;
    CGFloat width = imageSize.width / ratio;
    
    return width;
}

+ (CGFloat) getRatioHeight: (CGSize) originSize
               screenWidth: (CGFloat) screenWidth
{
    if ( CGSizeEqualToSize(originSize, CGSizeZero) )
    {
        return 0.f;
    }
    
    CGSize imageSize = originSize;
    CGFloat viewWidth = screenWidth;
    CGFloat ratio = imageSize.width / viewWidth;
    CGFloat height = imageSize.height / ratio;
    
    return height;
}

+ (NSString *) timeStamp
{
    long long milliseconds = (long long) ([[NSDate date] timeIntervalSince1970] * 1000.0);
    
    return [NSString stringWithFormat: @"%lld", milliseconds];
}

+ (NSString *) checkRoot
{
    NSString *rooted = @"n";   // String value for debugging
    //루팅여부
    NSArray *jailbrokenPath = [NSArray arrayWithObjects:
                               @"/Applications/Cydia.app",      // Cydia 위치는 변경가능하기 때문에 해당 경로가 언제나 절대적인 것은 아니다.
                               @"/Applications/RockApp.app",    // bought by Cydia
                               @"/Applications/Icy.app",        // abandoned for far longer
                               @"/Applications/WinterBoard.app",
                               @"/Applications/SBSettings.app",
                               @"/Applications/MxTube.app",
                               @"/Applications/IntelliScreen.app",
                               @"/Applications/FakeCarrier.app",
                               @"/Applications/blackra1n.app",  // jailbreak for iPhone OS 3.1
                               
                               @"/Library/MobileSubstrate/DynamicLibraries/Veency.plist",
                               @"/Library/MobileSubstrate/DynamicLibraries/LiveClock.plist",
                               @"/Library/MobileSubstrate/MobileSubstrate.dylib",   // 171020 김태현
                               
                               @"/private/var/lib/apt",
                               @"/private/var/stash",
                               @"/private/var/lib/cydia",
                               @"/private/var/tmp/cydia.log",
                               @"/private/var/mobile/Library/SBSettings/Themes",
                               @"/Private/var/mobile/Library/AddressBook/AddressBook.sqlitedb",
                               
                               @"/System/Library/LaunchDaemons/com.ikey.bbot.plist",
                               @"/System/Library/LaunchDaemons/com.saurik.Cydia.Startup.plist",
                               
                               @"/usr/sbin/sshd",
                               @"/usr/bin/sshd",
                               @"/bin/bash",
                               @"/etc/apt",
                               @"/usr/libexec/sftp-server", nil];
    
    for ( NSString *string in jailbrokenPath )
    {
        if ( [[NSFileManager defaultManager] fileExistsAtPath: string] )
            return @"y";
    }
    
    /*
     mobile 사용자로 동작하는 애플리케이션은 /var/mobile/Applications 디렉터리로 이동하고 샌드박스 환경에서 동작한다.
     반면 root 사용자로 동작하는 애플리케이션(예를 들면, 사전에 설치된 Apple의 애플리케이션)은 /Applications 디렉터리로 이동하여 샌드박스 구조를 필요로 하지 않는다.
     탈옥된 디바이스를 사용하는 사용자는 /Applications 디렉터리에 애플리케이션을 설치하고 root 권한을 부여할 수 있다.
     그렇기 때문에, 애플리케이션이 샌드박스 규칙을 따르는지 확인하는 과정을 추가하면 탈옥 여부를 확인할 수 있다.
     이를 확인할 수 있는 가장 좋은 방법은 애플리케이션 번들 밖의 다른 위치에서 파일을 수정할 수 있는지 확인하는 것이다.
     */
    NSError *error;
    NSString *stringToBeWritten = @"This is a test.";
    [stringToBeWritten writeToFile: @"/private/jailbreak.txt"
                        atomically: YES
                          encoding: NSUTF8StringEncoding
                             error: &error];
    
    if ( error == nil )
    {
        //Device is jailbroken
        return @"y";
    }
    else
    {
        //Device is not jailbroken
        [[NSFileManager defaultManager] removeItemAtPath: @"/private/jailbreak.txt"
                                                   error: nil];
        rooted = @"n";
    }
    
    /*
     실력있는 해커는 애플리케이션의 위치를 바꿀 수 있다.
     하지만, 80% 이상의 탈옥된 디바이스에는 Cydia가 설치되어 있고, 해커가 Cydia 앱의 위치를 바꾼다 하더라도, Cydia 앱이 등록된 URL scheme을 바꾸진 않을 것이다.
     애플리케이션에서 Cydia의 URL scheme (cydia://)를 호출하여 성공한다면 디바이스는 탈옥되었다고 볼 수 있다.
     */
    UIApplication *application = [UIApplication sharedApplication];
    NSString *scheme = @"cydia://package/com.example.package";
    NSURL *URL = [NSURL URLWithString: scheme];
    
    if ( [application canOpenURL: URL] )
    {
        return @"y";
    }
    
    // 시뮬레이터 환경도 루트권한을 가지고 있다.
    if ( [[self getModel] isEqual: @"iOS simulator"] )
        return @"y";
    
    return rooted;
}

// 세부 모델 확인용
+ (NSString *) getModel
{
    size_t size;
    sysctlbyname("hw.machine", NULL, &size, NULL, 0);   // hw.machine
    char *model = malloc(size);
    sysctlbyname("hw.machine", model, &size, NULL, 0);  // hw.machine
    NSString *deviceModel = [NSString stringWithCString: model
                                               encoding: NSUTF8StringEncoding];
    free(model);
    
    // iPhone
    if ( [deviceModel hasPrefix: @"iPhone"] )
    {
        if ( [deviceModel isEqual: @"iPhone1,1"] )
            return @"iPhone";
        
        if ( [deviceModel isEqual: @"iPhone1,2"] )
            return @"iPhone 3G";
        
        if ( [deviceModel isEqual: @"iPhone2,1"] )
            return @"iPhone 3GS";
        
        if ( [deviceModel isEqual: @"iPhone3,1"] || [deviceModel isEqual: @"iPhone3,2"] || [deviceModel isEqual: @"iPhone3,3"] )
            return @"iPhone 4";     /* iPhone 4 (GSM) / iPhone 4 (GSM, 2012) / iPhone 4 (CDMA) */
        
        if ( [deviceModel isEqual: @"iPhone4,1"] )
            return @"iPhone 4s";
        
        if ( [deviceModel isEqual: @"iPhone5,1"] || [deviceModel isEqual: @"iPhone5,2"] )
            return @"iPhone 5";     /* iPhone 5 (GSM) / iPhone 5 (GSM + CDMA) */
        
        if ( [deviceModel isEqual: @"iPhone5,3"] || [deviceModel isEqual: @"iPhone5,4"] )
            return @"iPhone 5c";    /* iPhone 5c (GSM + CDMA) / iPhone 5c (CDMA) */
        
        if ( [deviceModel isEqual: @"iPhone6,1"] || [deviceModel isEqual: @"iPhone6,2"] )
            return @"iPhone 5s";    /* iPhone 5s (GSM) / iPhone 5s (GSM + CDMA) */
        
        if ( [deviceModel isEqual: @"iPhone7,1"] )
            return @"iPhone 6 Plus";
        
        if ( [deviceModel isEqual: @"iPhone7,2"] )
            return @"iPhone 6";
        
        if ( [deviceModel isEqual: @"iPhone8,1"] )
            return @"iPhone 6s";
        
        if ( [deviceModel isEqual: @"iPhone8,2"] )
            return @"iPhone 6s Plus";
        
        if ( [deviceModel isEqual: @"iPhone8,4"] )
            return @"iPhone SE";
        
        if ( [deviceModel isEqual: @"iPhone9,1"] || [deviceModel isEqual: @"iPhone9,3"] )
            return @"iPhone 7";
        
        if ( [deviceModel isEqual: @"iPhone9,2"] || [deviceModel isEqual: @"iPhone9,4"] )
            return @"iPhone 7 Plus";
        
        if ( [deviceModel isEqual: @"iPhone10,1"] || [deviceModel isEqual: @"iPhone10,4"] )
            return @"iPhone 8";
        
        if ( [deviceModel isEqual: @"iPhone10,2"] || [deviceModel isEqual: @"iPhone10,5"] )
            return @"iPhone 8 Plus";
        
        if ( [deviceModel isEqual: @"iPhone10,3"] || [deviceModel isEqual: @"iPhone10,6"] )
            return @"iPhone X";
      
        if ( [deviceModel isEqual: @"iPhone11,2"] )
            return @"iPhone XS";
      
        if ( [deviceModel isEqual: @"iPhone11,4"] || [deviceModel isEqual: @"iPhone11,6"] )
            return @"iPhone XS Max";
      
        if ( [deviceModel isEqual: @"iPhone11,8"] )
            return @"iPhone XR";
    }
    
    // iPad
    if ( [deviceModel hasPrefix: @"iPad"] )
    {
        if ( [deviceModel isEqual: @"iPad1,1"] )
            return @"iPad";
        
        if ( [deviceModel isEqual: @"iPad2,1"] )
            return @"iPad 2 (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad2,2"] )
            return @"iPad 2 (Wi-Fi + 3G GSM)";
        
        if ( [deviceModel isEqual: @"iPad2,3"] )
            return @"iPad 2 (Wi-Fi + 3G CDMA)";
        
        if ( [deviceModel isEqual: @"iPad2,4"] )
            return @"iPad 2 (Wi-Fi)";               // iPad 2 (Wi-Fi, 2012)
        
        if ( [deviceModel isEqual: @"iPad3,1"] )
            return @"iPad (3rd generation) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad3,2"] )
            return @"iPad (3rd generation) (Wi-Fi + Cellular Verizon)";
        
        if ( [deviceModel isEqual: @"iPad3,3"] )
            return @"iPad (3rd generation) (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad3,4"] )
            return @"iPad (4th generation) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad3,5"] )
            return @"iPad (4th generation) (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad3,6"] )
            return @"iPad (4th generation) (Wi-Fi + Cellular MM)";
        
        if ( [deviceModel isEqual: @"iPad4,1"] )
            return @"iPad Air (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad4,2"] )
            return @"iPad Air (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad4,3"] )
            return @"iPad Air (China)";
        
        if ( [deviceModel isEqual: @"iPad5,3"] )
            return @"iPad Air 2 (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad5,4"] )
            return @"iPad Air 2 (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad6,11"] )
            return @"iPad (5th generation) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad6,12"] )
            return @"iPad (5th generation) (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad7,5"] )
            return @"iPad (6th generation) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad7,6"] )
            return @"iPad (6th generation) (Wi-Fi + Cellular)";
        
        // iPad mini series
        if ( [deviceModel isEqual: @"iPad2,5"] )
            return @"iPad mini (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad2,6"] )
            return @"iPad mini (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad2,7"] )
            return @"iPad mini (Wi-Fi + Cellular MM)";
        
        if ( [deviceModel isEqual: @"iPad4,4"] )
            return @"iPad mini 2 (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad4,5"] )
            return @"iPad mini 2 (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad4,6"] )
            return @"iPad mini 2 (China)";
        
        if ( [deviceModel isEqual: @"iPad4,7"] )
            return @"iPad mini 3 (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad4,8"] )
            return @"iPad mini 3 (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad4,9"] )
            return @"iPad mini 3 (China)";
        
        if ( [deviceModel isEqual: @"iPad5,1"] )
            return @"iPad mini 4 (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad5,2"] )
            return @"iPad mini 4 (Wi-Fi + Cellular)";
        
        // iPad Pro series
        if ( [deviceModel isEqual: @"iPad6,7"] )
            return @"iPad Pro (12.9-inch) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad6,8"] )
            return @"iPad Pro (12.9-inch) (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad6,3"] )
            return @"iPad Pro (9.7-inch) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad6,4"] )
            return @"iPad Pro (9.7-inch) (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad7,3"] )
            return @"iPad Pro (10.5-inch) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad7,4"] )
            return @"iPad Pro (10.5-inch) (Wi-Fi + Cellular)";
        
        if ( [deviceModel isEqual: @"iPad7,1"] )
            return @"iPad Pro (12.9-inch) (2nd generation) (Wi-Fi)";
        
        if ( [deviceModel isEqual: @"iPad7,2"] )
            return @"iPad Pro (12.9-inch) (2nd generation) (Wi-Fi + Cellular)";
      
        if ( [deviceModel isEqual: @"iPad8,1"] || [deviceModel isEqual: @"iPad8,2"] )
            return @"iPad Pro (11-inch) (Wi-Fi)";
      
        if ( [deviceModel isEqual: @"iPad8,3"] || [deviceModel isEqual: @"iPad8,4"] )
            return @"iPad Pro (11-inch) (Wi-Fi + Cellular)";
      
        if ( [deviceModel isEqual: @"iPad8,5"] || [deviceModel isEqual: @"iPad8,6"] )
            return @"iPad Pro (12.9-inch) (3rd generation) (Wi-Fi)";
      
        if ( [deviceModel isEqual: @"iPad8,7"] || [deviceModel isEqual: @"iPad8,8"] )
            return @"iPad Pro (12.9-inch) (3rd generation) (Wi-Fi + Cellular)";
    }
    
    // iPod touch
    if ( [deviceModel hasPrefix: @"iPod"] )
    {
        if ( [deviceModel isEqual: @"iPod1,1"] )
            return @"iPod touch";
        
        if ( [deviceModel isEqual: @"iPod2,1"] )
            return @"iPod touch (2nd generation)";
        
        if ( [deviceModel isEqual: @"iPod3,1"] )
            return @"iPod touch (3rd generation)";
        
        if ( [deviceModel isEqual: @"iPod4,1"] )
            return @"iPod touch (4th generation)";
        
        if ( [deviceModel isEqual: @"iPod5,1"] )
            return @"iPod touch (5th generation)";
        
        if ( [deviceModel isEqual: @"iPod7,1"] )
            return @"iPod touch (6th generation)";
    }
    
    
    if ( [deviceModel isEqual: @"AppleTV2,1"] )
        return @"Apple TV (2nd generation)";
    
    if ( [deviceModel isEqual: @"AppleTV3,1"] || [deviceModel isEqual: @"AppleTV3,2"] )
        return @"Apple TV (3rd generation)";
    
    
    if ( [deviceModel isEqual: @"i386"] || [deviceModel isEqual: @"x86_64"] )
        return @"iOS simulator";
    
    //If none was found, send the original string
    return deviceModel;
}

+ (BOOL) hasNotch
{
    NSString *deviceModel = [self getModel];
  
    if ( [deviceModel isEqualToString : @"iPhone X"] )
        return true;
  
    if ( [deviceModel isEqualToString : @"iPhone XS"] )
        return true;
  
    if ( [deviceModel isEqualToString : @"iPhone XS Max"] )
        return true;
  
    if ( [deviceModel isEqualToString : @"iPhone XR"] )
        return true;
    
    return false;
}

+ (NSString *) getHostname
{
    char baseHostName[256];
    int success = gethostname(baseHostName, 255);
    
    if ( success != 0 )
        return @"NA";
    
    baseHostName[255] = '\0';
    
    return [NSString stringWithFormat: @"%s", baseHostName];
}

+ (BOOL) checkProxy
{
    NSDictionary *proxies = (__bridge NSDictionary *) CFNetworkCopySystemProxySettings();
    BOOL HTTPEnabled = [[proxies objectForKey: (NSString *) kCFNetworkProxiesHTTPEnable] boolValue];
    
    // iOS에서 프록시는 Wi-Fi상태일때만 세팅가능함.
    if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        if ( HTTPEnabled )
        {
            return true;
        }
    }
    
    return false;
}

+ (NSString *) getProxyInfo
{
    NSDictionary *proxies = (__bridge NSDictionary *) CFNetworkCopySystemProxySettings();
    BOOL HTTPEnabled = [[proxies objectForKey: (NSString *) kCFNetworkProxiesHTTPEnable] boolValue];
    
    NSMutableString *result = [NSMutableString string];
    NSString *HTTPHost = @"NA";
    NSNumber *HTTPPort = [NSNumber numberWithInt: 80];
    
    // iOS에서 프록시는 Wi-Fi상태일때만 세팅가능함.
    if ( [[ApiManager sharedInstance] isConnectionWifi] )
    {
        if ( HTTPEnabled )
        {
            HTTPHost = (NSString *) [proxies objectForKey: (NSString *) kCFNetworkProxiesHTTPProxy];
            HTTPPort = (NSNumber *) [proxies objectForKey: (NSString *) kCFNetworkProxiesHTTPPort];
            //kCFNetworkProxiesProxyAutoConfigEnable
            //kCFNetworkProxiesProxyAutoConfigURLString
            //kCFNetworkProxiesProxyAutoConfigJavaScript
            
            NSString *HTTPPortStr = [[NSString alloc] initWithFormat: @"%@", HTTPPort];    // 위 port번호를 NSString화
            
            [result appendFormat: @"%@:", HTTPHost];
            [result appendFormat: @"%@", HTTPPortStr];
            
            NSString *resultStr = result;
            
            /* Regular Expression */
            NSError *error = nil;
            // 알파벳 대문자, 소문자, 숫자 '.', ':', '-'만 필터링
            NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern: @"[^A-Za-z0-9.:-]"
                                                                                   options: NSRegularExpressionCaseInsensitive
                                                                                     error: &error];
            resultStr = [regex stringByReplacingMatchesInString: resultStr
                                                        options: 0
                                                          range: NSMakeRange(0, [resultStr length])
                                                   withTemplate: @"$2$1"];
            
            return resultStr;
        }
    }
    
    return @"NA";
}

+ (BOOL) checkVPN
{
    // ppp0, ipsec0
    NSString *ppp0IPAddress   = [self getIPAddress: @"ppp0"];
    NSString *ipsec0IPAddress = [self getIPAddress: @"ipsec0"];
    
    if ( [ppp0IPAddress isEqualToString: @"NA"] && [ipsec0IPAddress isEqualToString: @"NA"] )
        return false;
    
    return true;
}

+ (NSString *) getVPNIPAddress
{
    // ppp0, ipsec0
    NSString *ppp0IPAddress   = [self getIPAddress: @"ppp0"];
    NSString *ipsec0IPAddress = [self getIPAddress: @"ipsec0"];
    
    if ( ![ppp0IPAddress isEqualToString: @"NA"] )
        return ppp0IPAddress;
    else if ( ![ipsec0IPAddress isEqualToString: @"NA"] )
        return ipsec0IPAddress;
    
    return @"NA";
}

+ (NSString *) getIPAddress: (NSString *) interfaceName
{
    NSString *address = @"NA";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    
    // retrieve the current interfaces - returns 0 on success
    success = getifaddrs(&interfaces);
    
    if ( success == 0 )
    {
        // Loop through linked list of interfaces
        temp_addr = interfaces;
        
        while ( temp_addr != NULL )
        {
            if ( temp_addr->ifa_addr->sa_family == AF_INET )
            {
                // Check if interface is en0 which is the wifi connection on the iPhone
                if ( [[NSString stringWithUTF8String: temp_addr -> ifa_name] isEqualToString: interfaceName] )
                {
                    // Get NSString from C String
                    address = [NSString stringWithUTF8String: inet_ntoa(((struct sockaddr_in *) temp_addr -> ifa_addr) -> sin_addr)];
                }
            }
            
            temp_addr = temp_addr -> ifa_next;
        }
    }
    
    // Free memory
    freeifaddrs(interfaces);
    
    /* Regular Expression */
    NSError *error = nil;
    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern: @"[^A-Za-z0-9.:]"
                                                                           options: NSRegularExpressionCaseInsensitive
                                                                             error: &error];  // 알파벳 대문자, 소문자, 숫자 '.', ':'만 필터링
    address = [regex stringByReplacingMatchesInString: address
                                              options: 0
                                                range: NSMakeRange(0, [address length])
                                         withTemplate: @"$2$1"];
    
    if ( [address isEqualToString: @""] )
        return @"unknown";
    
    return address;
}

+ (NSString *) getExternalIPAddress
{
    // Get the external IP Address based on dynsns.org
    NSError *error = nil;
    NSString *rawHtmlString = [NSString stringWithContentsOfURL: [NSURL URLWithString: @"http://www.dyndns.org/cgi-bin/check_ip.cgi"]
                                                       encoding: NSUTF8StringEncoding
                                                          error: &error];
    if ( !error )
    {
        NSUInteger indexNumber;
        NSArray *itemsArray;
        NSString *externalIP;
        NSScanner *scanner;
        NSString *text = nil;
        
        scanner = [NSScanner scannerWithString: rawHtmlString];
        
        while ( [scanner isAtEnd] == NO )
        {
            // find start of tag
            [scanner scanUpToString:@"<" intoString:NULL];
            
            // find end of tag
            [scanner scanUpToString:@">" intoString:&text];
            
            // replace the found tag with a space (you can filter multi-spaces out later if you wish)
            rawHtmlString = [rawHtmlString stringByReplacingOccurrencesOfString: [NSString stringWithFormat: @"%@>", text]
                                                                     withString: @" "];
            itemsArray = [rawHtmlString componentsSeparatedByString: @" "];
            indexNumber = [itemsArray indexOfObject: @"Address:"];
            externalIP = [itemsArray objectAtIndex: ++indexNumber];
        }
        
        // Check that you get something back
        if ( externalIP == nil || externalIP.length <= 0 )
        {
            // Error, no address found
            return @"ERR_NO_ADDRESS";
        }
        
        return externalIP;
    }
    else
    {
        // Error, no address found
        return @"ERR_NO_ADDRESS";
    }
}

+ (NSString *) getCellularType
{
    CTTelephonyNetworkInfo *telephonyInfo = [CTTelephonyNetworkInfo new];
    NSString *technologyString = telephonyInfo.currentRadioAccessTechnology;
    
    if ( [technologyString isEqualToString: CTRadioAccessTechnologyLTE] )
    {
        return @"LTE";
    }
    else if ( [technologyString isEqualToString: CTRadioAccessTechnologyWCDMA] )
    {
        return @"3G";
    }
    else if ( [technologyString isEqualToString: CTRadioAccessTechnologyEdge] )
    {
        return @"EDGE (2G)";
    }
    
    return @"unknown_cellular";
}

+ (void) getNetInterfaceNames
{
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    
    // retrieve the current interfaces - returns 0 on success
    NSInteger success = getifaddrs(&interfaces);
    
    if ( success == 0 )
    {
        // Loop through linked list of interfaces
        temp_addr = interfaces;
        
        while ( temp_addr != NULL )
        {
            if ( temp_addr->ifa_addr->sa_family == AF_INET ) // internetwork only
            {
                NSString *name = [NSString stringWithUTF8String: temp_addr->ifa_name];
                NSString *address = [NSString stringWithUTF8String: inet_ntoa(((struct sockaddr_in *) temp_addr->ifa_addr)->sin_addr)];
                NSLog(@"  [getNetInterfaceNames] interface name: %@; address: %@", name, address);
            }
            
            temp_addr = temp_addr->ifa_next;
        }
    }
    
    // Free memory
    freeifaddrs(interfaces);
    
    // lo0 : 127.0.0.1
    // pdp_ip0 : 10.15.22.134   (LTE)
    // en0 : 192.168.0.119      (Wi-Fi)
    // en2 : 169.254.242.196    (USB)
    // ipsec0 : 10.8.0.61 (VPN)
}

+ (void) presentAlertWithTitle : (NSString *) title
                    andMessage : (NSString *) message
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIAlertController *alertController;
        alertController = [UIAlertController alertControllerWithTitle : title
                                                              message : message
                                                       preferredStyle : UIAlertControllerStyleAlert];
      
        [alertController addAction : [UIAlertAction actionWithTitle : @"확인"
                                                              style : UIAlertActionStyleDefault
                                                            handler : ^(UIAlertAction * _Nonnull action)
                                                                      {
                                                                        //
                                                                      }]];
      
        [[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController : alertController
                                                                                         animated : YES
                                                                                       completion : ^{ }];
    });
}

+ (void) hideStatusBar
{
    [[UIApplication sharedApplication] setStatusBarHidden:YES animated:YES];
}

+ (void) showStatusBar
{
    [[UIApplication sharedApplication] setStatusBarHidden:NO animated:YES];
}

+ (void) processCheckingUpdate
{
    if ( [[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleDisplayName"] isEqualToString:@"윌라어드민"] )
        return; // 검수용 앱은 버젼체크를 하지 않습니다.
  
    // Check available updates.
    NSString *currentVersionStr = [[common infoPlist] objectForKey : @"CFBundleShortVersionString"];
    NSDictionary *updateInfo = [ApiManager getUpdateData];
  
    if ( [updateInfo isKindOfClass : [NSDictionary class]] ) // API 서버에서 데이터를 제대로 받아왔는지 확인합니다.
    {
        if ( [updateInfo[@"version"] isKindOfClass : [NSDictionary class]] ) // version dictionary가 정상인지 확인합니다.
        {
            BOOL forceUpdate = [[updateInfo[@"force_update"] stringValue] isEqualToString : @"1"];
            BOOL isAvailableMinUpdate = [self compareBetweenCurrentVersion : currentVersionStr
                                                             andNewVersion : updateInfo[@"version"][@"min"]];
            BOOL isAvailableUpdate = [self compareBetweenCurrentVersion : currentVersionStr
                                                          andNewVersion : updateInfo[@"version"][@"current"]];
          
            // "force_update"가 true && 설치된 앱버젼 < updateInfo[@"version"]["min"] -> 강제업데이트 팝업(description + store_url)
            if ( forceUpdate && isAvailableMinUpdate )
            {
                UIAlertController *alert;
                UIAlertAction *ok;
              
                alert = [UIAlertController alertControllerWithTitle : @"업데이트"
                                                            message : @"필수 업데이트가 있습니다."//updateInfo[@"description"]
                                                     preferredStyle : UIAlertControllerStyleAlert];
              
                ok = [UIAlertAction actionWithTitle : @"앱스토어로 이동"
                                              style : UIAlertActionStyleDefault
                                            handler : ^(UIAlertAction * action)
                                                      {
                                                          [[UIApplication sharedApplication] openURL : [NSURL URLWithString : updateInfo[@"store_url"]]
                                                                                             options : @{}
                                                                                   completionHandler : ^(BOOL success) { exit(0); }];
                                                      }];
              
                [alert addAction : ok];
              
                UIWindow *topWindow = [[UIWindow alloc] initWithFrame : [UIScreen mainScreen].bounds];
                topWindow.rootViewController = [UIViewController new];
                topWindow.windowLevel = UIWindowLevelAlert + 1;
                [topWindow makeKeyAndVisible];
                [topWindow.rootViewController presentViewController:alert animated:YES completion:nil];
            }
            // 설치된 앱버젼 < updateInfo[@"version"]["current"] -> 업데이트 팝업(store_url)
            else if ( isAvailableUpdate )
            {
                UIAlertController *alert;
                UIAlertAction *ok;
                UIAlertAction *no;
              
                alert = [UIAlertController alertControllerWithTitle : @"업데이트"
                                                            message : @"최신 업데이트가 있습니다.\n업데이트하시겠습니까?"//updateInfo[@"description"]
                                                     preferredStyle : UIAlertControllerStyleAlert];
              
                ok = [UIAlertAction actionWithTitle : @"업데이트"
                                              style : UIAlertActionStyleDefault
                                            handler : ^(UIAlertAction * action)
                                                      {
                                                          [[UIApplication sharedApplication] openURL : [NSURL URLWithString:updateInfo[@"store_url"]]
                                                                                             options : @{}
                                                                                   completionHandler : ^(BOOL success) { exit(0); }];
                                                      }];
              
                no = [UIAlertAction actionWithTitle : @"나중에"
                                              style : UIAlertActionStyleDefault
                                            handler : ^(UIAlertAction * action)
                                                      {
                                                          [alert dismissViewControllerAnimated:YES completion:nil];
                                                      }];
                [alert addAction : ok];
                [alert addAction : no];
              
                UIWindow *topWindow = [[UIWindow alloc] initWithFrame : [UIScreen mainScreen].bounds];
                topWindow.rootViewController = [UIViewController new];
                topWindow.windowLevel = UIWindowLevelAlert + 1;
                [topWindow makeKeyAndVisible];
                [topWindow.rootViewController presentViewController:alert animated:YES completion:nil];
            }
        }
    }
}

+ (BOOL) compareBetweenCurrentVersion : (NSString *) currentVersion
                        andNewVersion : (NSString *) newVersion
{
    NSArray *versionNow = [currentVersion componentsSeparatedByString : @"."];
    NSArray *versionNew = [newVersion componentsSeparatedByString : @"."];
  
    if ( [versionNow[0] intValue] > [versionNew[0] intValue] )
        return false;
    else if ( [versionNow[0] intValue] < [versionNew[0] intValue] )
        return true;
  
    if ( [versionNow[1] intValue] > [versionNew[1] intValue] )
        return false;
    else if ( [versionNow[1] intValue] < [versionNew[1] intValue] )
        return true;
  
    if ( [versionNow[2] intValue] > [versionNew[2] intValue] )
        return false;
    else if ( [versionNow[2] intValue] < [versionNew[2] intValue] )
        return true;
  
    return false;
}

+ (id) getDeviceToken
{
  return [[NSUserDefaults standardUserDefaults] objectForKey: @"deviceToken"];
}

+ (void) setDeviceToken : (NSData *) deviceToken
{
  [[NSUserDefaults standardUserDefaults] setObject: deviceToken
                                            forKey: @"deviceToken"];
  [[NSUserDefaults standardUserDefaults] synchronize];
}

@end
