
#import <CoreData/CoreData.h>

@interface DbContentVideoGroupItemModel : NSManagedObject

@property (nonatomic, strong) NSString *groupkey;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *teacherName;
@property (nonatomic, strong) NSString *playTime;
@property (nonatomic, strong) NSString *downloadTime;

@end

