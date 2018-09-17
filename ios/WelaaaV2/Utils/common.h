
#import <UIKit/UIKit.h>

#import "ApiManager.h"
#import "NSString+GC.h"

#include <sys/sysctl.h>     // to get model names by sysctl
#include <CFNetwork/CFProxySupport.h>   // 프록시 관련
#include <ifaddrs.h>    // IP address
#include <arpa/inet.h>  // IP address
#import <net/if.h>      // For IFF_LOOPBACK
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <SAMKeychain/SAMKeychain.h>

#define SYSTEM_VERSION  [[UIDevice currentDevice] systemVersion]

#define BASE_DOMAIN   [[NSUserDefaults standardUserDefaults] objectForKey:@"domain"] ?: @"welaaa.co.kr"
#define TEST_DOMAIN   [[NSUserDefaults standardUserDefaults] objectForKey:@"domain"] ?: @"welaaa.co.kr"  //  @"welearn.co.kr" 에서 재생 테스트가 안되서 임시로..

#define API_HOST          @"https://8xwgb17lt1.execute-api.ap-northeast-2.amazonaws.com"
#define PALLYCON_SITE_ID  @"O8LD"
#define PALLYCON_SITE_KEY @"YxIe3SrPPWWH6hHPkJdG1pUewkB1T6Y9"


#define nullStr(str) (str==nil || [str isEqualToString:@""])
#define STATUSBAR_OFFSETY      20

#define UIColorFromRGB(rgbValue,a) [UIColor colorWithRed:((float)((rgbValue & 0xFF0000) >> 16))/255.0 green:((float)((rgbValue & 0xFF00) >> 8))/255.0 blue:((float)(rgbValue & 0xFF))/255.0 alpha:a]
#define DEFAULT_ALERT(TITLE,MSG)                    [[[UIAlertView alloc] initWithTitle:(TITLE) message:(MSG) delegate:nil cancelButtonTitle:@"확인" otherButtonTitles:nil] show]

#define GET_STRING_SIZE(source, font, width) [source boundingRectWithSize:CGSizeMake(width, CGFLOAT_MAX) options:(NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading) attributes:@{NSFontAttributeName:font} context:nil]

#define GET_STRING_SIZE_N(source, font, width, numberOfLines) \
    (!source || ![source isKindOfClass:[NSString class]] || ((NSString *)source).length == 0 ? CGSizeZero : \
    [source boundingRectWithSize:CGSizeMake((numberOfLines != 1 ? width : CGFLOAT_MAX), CGFLOAT_MAX) \
    options:(NSStringDrawingUsesLineFragmentOrigin | NSStringDrawingUsesFontLeading) \
    attributes:@{NSFontAttributeName : font} \
    context:nil].size) \

@interface common : NSObject

+ (NSDictionary *) infoPlist;

+ (BOOL) isNullString: (NSString *) str;

+ (UIImage *) imageWithColor : (UIColor *) color
                       width : (CGFloat) widht
                      height : (CGFloat) height;

+ (UIImage *) blurredImageWithImage : (UIImage *) sourceImage;

+ (NSString *) convertTimeToString : (float) time
                            Minute : (BOOL) isMinute;

+ (NSInteger) convertStringToTime : (NSString *) timeString;

+ (NSInteger) getDistanceDateWithStartDate : (NSDate *) sDate
                                   EndDate : (NSDate *) eDate;

+ (NSString *) getDocumentsFolderPath;

+ (BOOL) checkAquaSdkLicense;

+ (NSString *) getUUID;

+ (NSString *) udidUsingCFUUID;

+ (NSString *) uuidFromKeyChain;

+ (void) saveUuidForKeyChain : (NSString *) udid;


+ (id) getUserSettingValueWithKey : (NSString *) key;

+ (void) setUserSettingValueWithKey : (NSString *) key
                              value : (id) value;

+ (NSString *) forceStringValue : (id) value;

+ (CGFloat) getRatioWidth : (CGSize) originSize
             screenHeight : (CGFloat) screenHeight;

+ (CGFloat) getRatioHeight : (CGSize) originSize
               screenWidth : (CGFloat) screenWidth;

+ (NSString *) timeStamp;

+ (NSString *) checkRoot;

+ (NSString *) getModel;

+ (BOOL) hasNotch;

+ (NSString *) getHostname;

+ (BOOL) checkProxy;

+ (NSString *) getProxyInfo;

+ (BOOL) checkVPN;

+ (NSString *) getVPNIPAddress;

+ (NSString *) getIPAddress : (NSString *) interfaceName;

+ (NSString *) getExternalIPAddress;

+ (NSString *) getCellularType;

+ (void) getNetInterfaceNames;

@end


