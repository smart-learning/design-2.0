
#import <CoreData/CoreData.h>

@interface DbContentAudioGroupItemModel : NSManagedObject

@property (nonatomic, strong) NSString *groupkey;
@property (nonatomic, strong) NSString *count;
@property (nonatomic, strong) NSString *imageUrl;
@property (nonatomic, strong) NSString *playTime;
@property (nonatomic, strong) NSString *teacherName;
@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *downloadCount;

@end
