
#import <AddressBook/AddressBook.h>

#import "AddressBookInfo.h"
#import "common.h"

typedef NS_ENUM(NSUInteger, AddressBookManagerRequestType)
{
    AddressBookManagerRequestPermission = 0,
    AddressBookManagerRequestFetchAddressBook,
    AddressBookManagerRequestAutoInsertFriends
};

@protocol AddressBookManagerDelegate;

@interface AddressBookManager : NSObject

@property (nonatomic, weak) id<AddressBookManagerDelegate> delegate;

+ (AddressBookManager *) sharedInstance;
- (BOOL) isAllowed;
- (void) allowPermission : (AddressBookManagerRequestType) requestType
             showMessage : (BOOL) showMessage;

@end

@protocol AddressBookManagerDelegate <NSObject>
@optional

- (void) fetchAddressBookSuccess : (NSArray *) data;
- (void) fetchAddressBookFailed : (NSError *) error;
- (void) fetchAddressBookPermissionError : (BOOL) goSetup;

@end
