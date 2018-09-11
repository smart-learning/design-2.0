
#import <Foundation/Foundation.h>

@interface NSError (SHLocalizedError)

/**
 Utility method to create a localized NSError with the given error-code and description text.
 */
+ (NSError *) localizedErrorCode: (NSInteger) code
                  andDescription: (NSString *) description;

@end
