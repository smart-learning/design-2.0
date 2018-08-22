
#import "DbManager.h"

#import "AppDelegate.h"

@interface DbManager ()
{
    AppDelegate *_appDelegate;
}

@end

@implementation DbManager

+ (DbManager *) sharedInstance
{
    static DbManager *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[DbManager alloc] init];
    });
    
    return sharedInstance;
}

- (instancetype) init
{
    if ( self = [super init] )
    {
        _appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    }
    
    return self;
}

#pragma mark - download Item

- (void) insertItem: (NSDictionary *) item
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    DbContentDownloadItemModel *insertData = [NSEntityDescription insertNewObjectForEntityForName: @"DownloadContentItem"
                                                                           inManagedObjectContext: managedObjectContext];
    [insertData setCkey: item[@"ckey"]];
    [insertData setCmemo: item[@"cmemo"]];
    [insertData setCname: item[@"cname"]];
    [insertData setCplay_time: item[@"cplay_time"]];
    [insertData setCurl: item[@"curl"]];
    [insertData setGroup_teachername: item[@"group_teachername"]];
    [insertData setGroup_title: item[@"group_title"]];
    [insertData setGroupkey: item[@"groupkey"]];
    [insertData setCon_class: item[@"con_class"]];
    [insertData setPath: item[@"path"]];
    [insertData setGroup_image: item[@"group_image"]];
    [insertData setDownloadTime: [common timeStamp]];
    
    @try {
        NSError *error = nil;
        [managedObjectContext save: &error];
    }
    @catch (NSException *exception) {
        //
    }
    @finally {
        //
    }
}

- (NSArray *) getDownloadContents
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;

    NSFetchRequest *request = [NSFetchRequest fetchRequestWithEntityName: @"DownloadContentItem"];
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    if ( datas.count == 0 )
    {
        return nil;
    }
    
    return [self convertItemsFromModels: datas];
}

- (NSArray *) getDownloadContentWithGroupKey: (NSString *) groupkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"DownloadContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"groupkey=%@", groupkey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    if ( datas.count == 0 )
    {
        return nil;
    }
    
    return [self convertItemsFromModels: datas];
}

- (NSDictionary *) getDownloadContentWithGroupKey: (NSString *) groupkey
                                             cKey: (NSString *) ckey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"DownloadContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"groupkey=%@ and ckey=%@", groupkey, ckey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];

    if ( datas.count == 0 )
    {
        return nil;
    }
    
    NSManagedObject *object = datas[0];
    
    return [self convertItemWithModel: object];
}

- (NSArray *) getDownloadContentWithClass: (NSString *) con_class
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"DownloadContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"con_class=%@", con_class];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    if ( datas.count == 0 )
    {
        return nil;
    }
    
    return [self convertItemsFromModels: datas];
}

- (NSArray *) convertItemsFromModels: (NSArray *) models
{
    NSMutableArray *items = [NSMutableArray array];
    
    for ( NSManagedObject *object in models )
    {
        [items addObject: [self convertItemWithModel: object]];
    }

    return items.count == 0 ? nil : items;
}

- (NSDictionary *) convertItemWithModel: (NSManagedObject *) object
{
    NSMutableDictionary *item = [NSMutableDictionary dictionary];
    
    item[@"ckey"]               = [object valueForKey: @"ckey"];
    item[@"cmemo"]              = [object valueForKey: @"cmemo"];
    item[@"cname"]              = [object valueForKey: @"cname"];
    item[@"cplay_time"]         = [object valueForKey: @"cplay_time"];
    item[@"group_teachername"]  = [object valueForKey: @"group_teachername"];
    item[@"group_title"]        = [object valueForKey: @"group_title"];
    item[@"groupkey"]           = [object valueForKey: @"groupkey"];
    item[@"path"]               = [object valueForKey: @"path"];
    item[@"curl"]               = [object valueForKey: @"curl"];
    item[@"con_class"]          = [object valueForKey: @"con_class"];
    item[@"group_image"]        = [object valueForKey: @"group_image"];
    item[@"downloadTime"]       = [object valueForKey: @"downloadTime"];

    return item;
}

- (BOOL) hasContentWithCKey: (NSString *) ckey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"DownloadContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"ckey=%@", ckey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    return (datas.count == 0 ? NO : YES);
}

- (void) removeDownloadContentWithGroupKey: (NSString *) groupkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"DownloadContentItem"
                                              inManagedObjectContext: managedObjectContext];

    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"groupkey=%@", groupkey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];

    for ( id basket in datas )
    {
        [managedObjectContext deleteObject: basket];
    }
}

- (void) removeDownloadContentWithCKey: (NSString *) ckey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"DownloadContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"ckey=%@", ckey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    for ( id basket in datas )
    {
        [managedObjectContext deleteObject: basket];
    }
}

#pragma mark - audio group Items

- (void) insertAudioGroupItem: (NSDictionary *) item
                     groupKey: (NSString *) groupkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    DbContentAudioGroupItemModel *insertData = [NSEntityDescription insertNewObjectForEntityForName: @"AudioGroupContentItem"
                                                                             inManagedObjectContext: managedObjectContext];
    
    NSString *groupImage = item[@"group_img"];
    
    if ( -1 == [groupImage.lowercaseString indexOf: @"http://"] && -1 == [groupImage.lowercaseString indexOf: @"https://"] )
    {
        groupImage = [@"http://" stringByAppendingString: groupImage];
    }
        
    [insertData setGroupkey: groupkey];
    [insertData setTitle: item[@"group_title"]];
    [insertData setImageUrl: groupImage];
    [insertData setTeacherName: item[@"group_teachername"]];
    [insertData setCount: item[@"contentscnt"]];
    [insertData setPlayTime: item[@"allplay_time"]];
    [insertData setDownloadCount: [common forceStringValue: item[@"downloadcnt"]]];
    
    @try {
        NSError *error = nil;
        [managedObjectContext save:&error];
    }
    @catch (NSException *exception) {
        NSLog(@"  Error: %@, %@", [exception name], [exception reason]);
    }
    @finally {
      //NSLog(@"Finally executes no matter what");
    }
}

- (BOOL) hasAudioGroupItemWithGroupKey: (NSString *) gkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"AudioGroupContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"groupkey=%@", gkey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    return (datas.count == 0 ? NO : YES);
}

- (NSArray *) getAllAudioGroupItem
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    
    NSFetchRequest *request = [NSFetchRequest fetchRequestWithEntityName: @"AudioGroupContentItem"];
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    if ( datas.count == 0 )
    {
        return nil;
    }
    
    return [self convertAudioGroupItemsFromModels: datas];
}

- (NSArray *) convertAudioGroupItemsFromModels: (NSArray *) models
{
    NSMutableArray *items = [NSMutableArray array];
    
    for ( NSManagedObject *object in models )
    {
        [items addObject: [self convertAudioGroupItemWithModel: object]];
    }
    
    return items.count == 0 ? nil : items;
}

- (NSDictionary *) convertAudioGroupItemWithModel: (NSManagedObject *) object
{
    NSMutableDictionary *item = [NSMutableDictionary dictionary];
    
    item[@"groupkey"]    = [object valueForKey: @"groupkey"];
    item[@"title"]       = [object valueForKey: @"title"];
    item[@"imageUrl"]    = [object valueForKey: @"imageUrl"];
    item[@"teacherName"] = [object valueForKey: @"teacherName"];
    item[@"count"]       = [object valueForKey: @"count"];
    item[@"playTime"]    = [object valueForKey: @"playTime"];
    item[@"totalCount"]  = [object valueForKey: @"downloadCount"];
    
    return item;
}

- (void) removeAudioGroupItemWithGroupKey: (NSString *) gkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"AudioGroupContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"groupkey=%@", gkey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    for ( id basket in datas )
    {
        [managedObjectContext deleteObject: basket];
    }
}


#pragma mark - video group Items

- (void) insertVideoGroupItem: (NSDictionary *) item
                     groupKey: (NSString *) groupkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    DbContentVideoGroupItemModel *insertData = [NSEntityDescription insertNewObjectForEntityForName: @"VideoGroupContentItem"
                                                                             inManagedObjectContext: managedObjectContext];
    
    [insertData setGroupkey: groupkey];
    [insertData setTitle: item[@"group_title"]];
    [insertData setTeacherName: item[@"group_teachername"]];
    
    @try {
        NSError *error = nil;
        [managedObjectContext save:&error];
    }
    @catch (NSException *exception) {
        //
    }
    @finally {
        //
    }
}

- (BOOL) hasVideoGroupItemWithGroupKey: (NSString *) gkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"VideoGroupContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"groupkey=%@", gkey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    return (datas.count == 0 ? NO : YES);
}

- (void) removeVideoGroupItemWithGroupKey: (NSString *) groupkey
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    NSEntityDescription *entity = [NSEntityDescription entityForName: @"VideoGroupContentItem"
                                              inManagedObjectContext: managedObjectContext];
    
    NSPredicate *predicate = [NSPredicate predicateWithFormat: @"groupkey=%@", groupkey];
    NSFetchRequest *request = [[NSFetchRequest alloc] init];
    
    [request setEntity: entity];
    [request setPredicate: predicate];
    
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    for ( id basket in datas )
    {
        [managedObjectContext deleteObject: basket];
    }
}

- (NSArray *) getAllVideoGroupItem
{
    NSManagedObjectContext *managedObjectContext = [_appDelegate managedObjectContext];
    
    NSError *error;
    
    NSFetchRequest *request = [NSFetchRequest fetchRequestWithEntityName: @"VideoGroupContentItem"];
    NSArray *datas = [managedObjectContext executeFetchRequest: request
                                                         error: &error];
    
    if ( datas.count == 0 )
    {
        return nil;
    }
    
    return [self convertVideoGroupItemsFromModels: datas];
}

- (NSArray *) convertVideoGroupItemsFromModels: (NSArray *) models
{
    NSMutableArray *items = [NSMutableArray array];
    
    for ( NSManagedObject *object in models )
    {
        [items addObject: [self convertVideoGroupItemWithModel: object]];
    }
    
    return items.count == 0 ? nil : items;
}

- (NSDictionary *) convertVideoGroupItemWithModel: (NSManagedObject *) object
{
    NSMutableDictionary *item = [NSMutableDictionary dictionary];
    
    item[@"groupkey"] = [object valueForKey: @"groupkey"];
    item[@"title"] = [object valueForKey: @"title"];
    item[@"playTime"] = [object valueForKey: @"playTime"];
    item[@"teacherName"] = [object valueForKey: @"teacherName"];
    
    return item;
}

@end
