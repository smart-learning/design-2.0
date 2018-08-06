
#import "CreateContact.h"
#import "AppDelegate.h"

@implementation CreateContact

RCT_EXPORT_MODULE(CreateContact);


RCT_EXPORT_METHOD(presentContact)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        ABNewPersonViewController *picker = [[ABNewPersonViewController alloc] init];
        picker.newPersonViewDelegate = self;
        UINavigationController *contactNavigator = [[UINavigationController alloc] initWithRootViewController : picker];
        AppDelegate *delegate = (AppDelegate *) [[UIApplication sharedApplication] delegate];
        [delegate.window.rootViewController presentViewController : contactNavigator
                                                         animated : NO
                                                       completion : nil];
    });
}

- (void) newPersonViewController : (ABNewPersonViewController *) newPersonViewController
        didCompleteWithNewPerson : (ABRecordRef) person
{
    [newPersonViewController dismissViewControllerAnimated : YES
                                                completion : nil];
}
@end
