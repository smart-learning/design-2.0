
#import <UIKit/UIKit.h>
#import <CommonCrypto/CommonCryptor.h>
#import <CommonCrypto/CommonDigest.h>

@interface NSString (GC)

- (NSString *) trim;
- (NSString *) stringByInsertingComma;

- (long) indexOf: (NSString *) text;
- (long) indexOfBackwardSearch: (NSString *) text;
- (BOOL) compareToken: (NSString *) token;
- (NSMutableDictionary *) queryString;
- (NSString *) cutString: (NSString *) str
               delimiter: (NSString *) delimiter;
- (NSString *) makeHttpProtocol;
- (NSString *) removeHtmlTag;
- (NSString *) escape;
- (NSString *) decode;
- (NSString *) md5;

@end

@interface NSMutableAttributedString (color)

- (void) setColorForText: (NSString *) textToFind
               withColor: (UIColor *) color
                withFont: (UIFont *) font;

- (void) setColorForText: (NSString *) textToFind
               withColor: (UIColor *) color
                withFont: (UIFont *) font
          compareOptions: (NSStringCompareOptions) compareOption;

@end
