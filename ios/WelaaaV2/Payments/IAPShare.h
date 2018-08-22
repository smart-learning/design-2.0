
#import <Foundation/Foundation.h>
#import "IAPHelper.h"

@interface IAPShare : NSObject
@property (nonatomic,strong) IAPHelper *iap;

+ (IAPShare *) sharedHelper;

+ (id) toJSON: (NSString *) json;
@end
