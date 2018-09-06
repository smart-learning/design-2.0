
#import <AFNetworking/AFHTTPSessionManager.h>
#import <AFNetworking/AFNetworkActivityIndicatorManager.h>
#import "NSError+LocalizedError.h"
#import "common.h"

typedef NS_ENUM(NSInteger, ApiManagerErrorCode)
{
    ApiManagerErrorCodeResponseNil = -1,
    ApiManagerErrorCodeMyPriceEmpty = -2,
    
    ApiManagerErrorCodePlanningNotStart = -500,
    ApiManagerErrorCodePlanningEnd = -501
};

typedef void (^kArrayCompleteBlock)(NSArray *objects);
typedef void (^kDictionaryCompleteBlock)(NSDictionary *object);
typedef void (^kErrorBlock)(NSError *error);

@interface ApiManager : AFHTTPSessionManager

+ (ApiManager *) sharedInstance;

@property (nonatomic, assign) BOOL canNetworking;

- (void) requestWithUrl : (NSString *) url
                 method : (NSString *) method
                  param : (NSDictionary *) param
              onSuccess : (kDictionaryCompleteBlock) onSuccess
              onFailure : (kErrorBlock) onFailure;

- (NSURLSessionDataTask *) downloadWithUrl : (NSString *) url
                                    params : (NSDictionary *) params
                            uploadProgress : (void (^)(NSProgress *uploadProgress)) uploadProgress
                          downloadProgress : (void (^)(NSProgress *downloadProgress)) downloadProgress
                                   success : (kDictionaryCompleteBlock) onSuccess
                                   failure : (kErrorBlock) onFailure;

+ (NSData *) sendSynchronousRequest : (NSURLRequest *) request
                  returningResponse : (NSURLResponse **) response
                              error : (NSError **) error;

+ (NSDictionary *) getContentsInfoWithCgid : (NSString *) contentGroupID
                             andHeaderInfo : (NSString *) authValue;
+ (NSDictionary *) getPlayDataWithCid : (NSString *) contentID
                        andHeaderInfo : (NSString *) authValue;
+ (void) sendPlaybackProgress : (NSString *) authValue;

- (void) setReachabilityStatusChangeBlock : (void (^)(NSInteger status)) block;
- (BOOL) isConnectionWifi;
- (BOOL) isConnectionCellular;
- (BOOL) isConnectedToInternet;

@end





