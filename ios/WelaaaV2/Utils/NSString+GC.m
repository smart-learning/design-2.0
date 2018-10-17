
#import "NSString+GC.h"

@implementation NSString (GC)

- (NSString *) stringByInsertingComma
{
    if ( self.length > 3 )
    {
        NSNumberFormatter *numberFormatter = [[NSNumberFormatter alloc] init];
      
        [numberFormatter setNumberStyle : NSNumberFormatterDecimalStyle];
      
        NSString *numberAsString = [numberFormatter stringFromNumber : [NSNumber numberWithInteger : self.integerValue]];
      
        return numberAsString;
    }
	
    return [NSString stringWithFormat : @"%@", self];
}

- (NSString *) trim
{
    return [self stringByTrimmingCharactersInSet : [NSCharacterSet whitespaceAndNewlineCharacterSet]];
}

- (long) indexOf : (NSString *) text
{
    NSRange range = [self rangeOfString : text];

    if ( range.length > 0 )
        return range.location;

    return -1;
}

- (long) indexOfBackwardSearch : (NSString *) text
{
    NSRange range = [self rangeOfString:text options:NSBackwardsSearch];
  
    if ( range.length > 0 )
        return range.location;
  
    return -1;
}

//문자열 비교
- (BOOL) compareToken : (NSString *) token
{
    NSRange pRange = [self rangeOfString : token];
  
    if ( pRange.location != NSNotFound )
        return YES;
  
    return NO;
}

- (NSMutableDictionary *) queryString
{
    NSMutableDictionary *parameters = [[NSMutableDictionary alloc] init];
    NSArray *components = [self componentsSeparatedByString : @"&"];
    
    for ( NSString *component in components )
    {
        NSArray *subcomponents = [component componentsSeparatedByString : @"="];
        [parameters setObject : [[subcomponents objectAtIndex : 1] stringByRemovingPercentEncoding]
                       forKey : [[subcomponents objectAtIndex : 0] stringByRemovingPercentEncoding]];
    }
    
    return parameters;
}

- (NSString *) cutString : (NSString *) str
               delimiter : (NSString *) delimiter
{
    int nToken = (int) [str indexOf : delimiter];
    
    if ( nToken != -1 )
    {
        return [str substringWithRange : NSMakeRange(0, nToken)];
    }
    
    return @"errorCutString";
}

- (NSString *) makeHttpProtocol
{
    NSString *token = @"";
    
    //http 검사
    token = @"http://";
    BOOL isHttp = NO;
    
    if ( [self length] > [token length] )
    {
        NSString *compareStr = [self substringWithRange : NSMakeRange(0, [token length])];
        
        if ( [[compareStr lowercaseString] isEqualToString : token] )
        {
            isHttp = YES;
        }
    }
    
    //https 검사
    token = @"https://";
    BOOL isHttps = NO;
    
    if ( [self length] > [token length] )
    {
        NSString *compareStr = [self substringWithRange : NSMakeRange(0, [token length])];
        
        if ( [[compareStr lowercaseString] isEqualToString : token] )
        {
            isHttps = YES;
        }
    }
    
    if ( isHttp || isHttps )
        return self;

    return [NSString stringWithFormat : @"http://%@", self];
}

- (NSString *) removeHtmlTag
{
    NSString *temp = [NSString stringWithString : self];
    
    while ( 1 )
    {
        long firstToken = [temp indexOf : @"<"];
        long lastToken = [temp indexOf : @">"];
        
        //둘중 하나의 태그라도 없으면 브레이크.
        if ( firstToken == -1 || lastToken == -1 )
        {
            break;
        }
        
        //firstToken의 숫자가 크면 데이터가 꺠져있다는 소리.
        if ( firstToken > lastToken )
        {
            break;
        }
        
        //토큰 범위를 삭제한다.
        temp = [temp stringByReplacingCharactersInRange : NSMakeRange(firstToken, (lastToken+1)-firstToken)
                                             withString : @""];
    }
    
    temp = [temp stringByReplacingOccurrencesOfString:@"&nbsp;" withString:@""];
    
    return temp;
}

- (NSString *) escape
{
    NSString *encodedString = (NSString *) CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(NULL,
                                                                                                     (CFStringRef) self,
                                                                                                     NULL,
                                                                                                     (CFStringRef) @"!*'();:@&=+$,/?%#[]",
                                                                                                     kCFStringEncodingUTF8 ));
    return encodedString;
}

- (NSString *) decode
{
    NSString *decodeUrl = [self stringByRemovingPercentEncoding];
  
    return decodeUrl;
}

- (NSString *) md5
{
    if ( [self length] == 0 )
        return nil;
    
    NSMutableString *outputString = [[NSMutableString alloc] initWithCapacity:CC_MD5_DIGEST_LENGTH * 2];
    
    const char *value = [self UTF8String];
    unsigned char outputBuffer[CC_MD5_DIGEST_LENGTH];
    
    CC_MD5(value, (unsigned int)strlen(value), outputBuffer);
    
    for ( NSInteger count = 0; count < CC_MD5_DIGEST_LENGTH; count++ )
        [outputString appendFormat : @"%02x", outputBuffer[count]];
    
    return outputString;
}

@end


@implementation NSMutableAttributedString (color)

- (void) setColorForText : (NSString *) textToFind
               withColor : (UIColor *) color
                withFont : (UIFont *) font
{
    NSRange range = [self.mutableString rangeOfString:textToFind options:NSCaseInsensitiveSearch];
    
    if ( range.location != NSNotFound )
    {
        [self addAttribute : NSForegroundColorAttributeName
                     value : color
                     range : range];
        
        [self addAttribute : NSFontAttributeName
                     value : font
                     range : range];
    }
}

- (void) setColorForText : (NSString *) textToFind
               withColor : (UIColor *) color
                withFont : (UIFont *) font
          compareOptions : (NSStringCompareOptions) compareOption
{
    NSRange range = [self.mutableString rangeOfString:textToFind options:compareOption];
    
    if ( range.location != NSNotFound )
    {
        [self addAttribute : NSForegroundColorAttributeName
                     value : color
                     range : range];
        
        [self addAttribute : NSFontAttributeName
                     value : font
                     range : range];
    }
}

@end


