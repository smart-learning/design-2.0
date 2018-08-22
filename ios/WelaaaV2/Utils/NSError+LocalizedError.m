
#import "NSError+LocalizedError.h"

@implementation NSError (SHLocalizedError)

+ (NSError *) localizedErrorCode: (NSInteger) code
                  andDescription: (NSString *) description
{
    NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
    
    return [NSError errorWithDomain: bundleIdentifier
                               code: code
                           userInfo: @{NSLocalizedDescriptionKey : description}];
}

@end
