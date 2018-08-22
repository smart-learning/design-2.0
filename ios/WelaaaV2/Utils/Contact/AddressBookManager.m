
#import "AddressBookManager.h"
#import "AppDelegate.h"

@interface AddressBookManager ()
{
    ABAddressBookRef addressBook;
}

@end

@implementation AddressBookManager

+ (AddressBookManager *) sharedInstance
{
    static dispatch_once_t onceToken;
    static AddressBookManager *sharedInstance = nil;
    
    dispatch_once(&onceToken, ^{
        sharedInstance = [[AddressBookManager alloc] init];
    });
    
    return sharedInstance;
}

- (id) init
{
    self = [super init];
    
    if ( self )
    {
        addressBook = ABAddressBookCreateWithOptions(NULL, NULL);
    }
    
    return self;
}

- (BOOL) isAllowed
{
    if (ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusNotDetermined || ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusAuthorized)
    {
        return YES;
    }
    else
    {
        return NO;
    }
}

- (void) allowPermission : (AddressBookManagerRequestType) requestType
             showMessage : (BOOL) showMessage
{
    //    CFErrorRef error = nil;
    if ( ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusNotDetermined )
    {
        ABAddressBookRequestAccessWithCompletion(addressBook, ^(bool granted, CFErrorRef error)
                                                              {
                                                                  if ( granted )
                                                                  {
                                                                      if (requestType == AddressBookManagerRequestFetchAddressBook)
                                                                      {
                                                                          [self fetchAddressBook];
                                                                      }
                                                                  }
                                                                  else
                                                                  {
                                                                      [self showPermissionError : showMessage];
                                                                  }
                                                              });
    }
    else if ( ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusAuthorized )
    {
        
        if ( requestType == AddressBookManagerRequestFetchAddressBook )
        {
            [self fetchAddressBook];
        }
    }
    else
    {
        [self showPermissionError : showMessage];
    }
}

- (void) showPermissionError : (BOOL) showMessage
{
    if ( showMessage )
    {
        AppDelegate *app = (AppDelegate *) [[UIApplication sharedApplication] delegate];
      /*
        [app showAlertWithTitle: @"알림"
                        message: @"설정 > 개인 정보 보호 > 연락처 정보를 활성화 해주세요."
              cancelButtonTitle: @"확인"
         destructiveButtonTitle: nil
              otherButtonTitles: @[ @"연락처 설정" ]
                       tapBlock: ^(UIAlertController * _Nonnull controller, UIAlertAction * _Nonnull action, NSInteger buttonIndex)
                                 {
                                     if ( [self.delegate respondsToSelector: @selector(fetchAddressBookPermissionError:)] )
                                     {
                                         [self.delegate fetchAddressBookPermissionError: buttonIndex != controller.cancelButtonIndex];
                                     }
                                 }];
        */
    }
    else
    {
        NSLog(@"친구 등록 실패: 권한이 없음");
    }
}

#pragma mark - Data Fecth Methods

- (NSMutableArray *) allOfAddressBookList
{
    NSMutableArray *addressBookList = [[NSMutableArray alloc] init];
    
    CFArrayRef allPeople = ABAddressBookCopyArrayOfAllPeople(addressBook);
    CFIndex countOfPeople = ABAddressBookGetPersonCount(addressBook);
    
    for ( int i = 0; i < countOfPeople; i++ )
    {
        ABRecordRef ref = CFArrayGetValueAtIndex(allPeople, i);
        
        NSString *firstName = (__bridge NSString *) ABRecordCopyValue(ref, kABPersonFirstNameProperty);
        NSString *lastName = (__bridge NSString *) ABRecordCopyValue(ref, kABPersonLastNameProperty);
        
        if ( firstName == nil )
        {
            firstName = @"";
        }
        
        if ( lastName == nil )
        {
            lastName = @"";
        }
        
        NSString *fullName = nil;
        
        if ( [lastName isEqualToString : @""] )
        {
            fullName = [NSString stringWithFormat : @"%@", firstName];
        }
        else
        {
            fullName = [NSString stringWithFormat : @"%@ %@", lastName, firstName];
        }
        
        // 사진 썸네일 추출
        UIImage *thumbnail = nil;
        
        if ( ABPersonHasImageData(ref) )
        {
            NSData *contactImageData = (__bridge NSData *) ABPersonCopyImageDataWithFormat(ref, kABPersonImageFormatThumbnail);
            thumbnail = [[UIImage alloc] initWithData : contactImageData];
        }
        
        NSString *phoneNumber = nil;
        ABMultiValueRef phones = ABRecordCopyValue(ref, kABPersonPhoneProperty);
        
        for ( CFIndex j = 0; j < ABMultiValueGetCount(phones); j++ )
        {
            CFStringRef tempRef = (CFStringRef) ABMultiValueCopyValueAtIndex(phones, j);
            NSString *label = (__bridge NSString *) ABMultiValueCopyLabelAtIndex(phones, j);
            
            if ( [label isEqualToString : (NSString *) kABPersonPhoneMobileLabel] )
            {
                if ( tempRef != nil )
                {
                    phoneNumber = [NSString stringWithFormat : @"%@", (__bridge NSString *) tempRef];
                }
            }
            else if ( [label isEqualToString : (NSString *) kABPersonPhoneIPhoneLabel] )
            {
                if ( tempRef != nil )
                {
                    phoneNumber = [NSString stringWithFormat : @"%@", (__bridge NSString *) tempRef];
                }
            }
            
            CFRelease(tempRef);
        }
        
        ABMultiValueRef emailMultiValue = ABRecordCopyValue(ref, kABPersonEmailProperty);
        NSArray *emailAddresses = (__bridge NSArray *) ABMultiValueCopyArrayOfAllValues(emailMultiValue);
        CFRelease(emailMultiValue);
        
        NSString *email = nil;
        
        if ( emailAddresses.count > 0 )
        {
            email = emailAddresses[0];
        }

        if ( !nullStr(email) )
        {
            AddressBookInfo *data = [[AddressBookInfo alloc] init];
            [data setName : fullName];
            [data setThumbnail : thumbnail];
            [data setPhoneNumber : phoneNumber];
            [data setEmail : email];
            
            [addressBookList addObject : data];
        }
    }
    
    CFRelease(allPeople);
    
    return addressBookList;
}

- (BOOL) isValidMobilePhoneNumber : (NSString *) number
{
    NSString *pattern = @"(010|011|016|017|018|019)-([0-9]{3,4})-([0-9]{4})";
    
    NSRange range = [number rangeOfString : pattern
                                  options : NSRegularExpressionSearch];
    
    if ( range.length > 0 )
    {
        return YES;
    }
    else
    {
        return NO;
    }
}

- (NSMutableArray *) internationalMobileNumberList
{
    NSMutableArray *mobileNumberList = [NSMutableArray array];
    
    return mobileNumberList;
}

- (void) fetchAddressBook
{
    __block NSArray *data = nil;
    
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        data = [self allOfAddressBookList];
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if ( [data count] > 0 )
            {
                if ( self.delegate && [self.delegate respondsToSelector : @selector(fetchAddressBookSuccess:)] )
                {
                    [self.delegate fetchAddressBookSuccess : data];
                }
            }
            else
            {
                if ( self.delegate && [self.delegate respondsToSelector : @selector(fetchAddressBookFailed:)] )
                {
                    [self.delegate fetchAddressBookFailed : nil];
                }
            }
        });
    });
}

- (void) dealloc
{
    CFRelease(addressBook);
}

@end



