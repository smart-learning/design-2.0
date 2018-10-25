
#import "RNProductPayment.h"

@implementation RNProductPayment
{
  BOOL _hasListeners;
}

// To export a module named FPSManager
RCT_EXPORT_MODULE();

- (NSArray <NSString *> *) supportedEvents
{
  return @[@"buyResult"];
}

// Will be called when this module's first listener is added.
- (void) startObserving
{
  _hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
- (void) stopObserving
{
  _hasListeners = NO;
}

#pragma mark - Private Methods

#pragma mark - todo : 싱글쓰레드로 처리하든 화면 액션을 차단해야합니다.

- (void) buyProduct : (NSDictionary *) args
{
    NSLog(@"  [-buyProduct:] Product Type : %@", [args objectForKey : @"type"]);        // 'membership' or 'audio_book'.
    NSLog(@"  [-buyProduct:] Product Code : %@", [args objectForKey : @"product_id"]);  // AppStore Connect에 등록한 상품ID.
    NSLog(@"  [-buyProduct:] Access Token : %@", [args objectForKey : @"token"]);       // 윌라의 엑세스 토큰.
    NSString *productCode = [args objectForKey : @"product_id"];
    NSString *paymentMode;
#if DEBUG
    paymentMode = @"sandbox";
#else
    paymentMode = @"live";
#endif
    NSLog(@"  [-buyProduct:] Current payment mode : %@", paymentMode);
  
    if ( nullStr(productCode) )
    {
        return ;
    }
  
    if ( [productCode hasPrefix : @"campus"] )
    {
        productCode = @"m_01";
    }
    else if ( [productCode hasPrefix : @"bookclu"] )
    {
        productCode = @"m_04";
    }
    else if ( [productCode hasPrefix : @"premium"] )
    {
        productCode = @"m_02";
    }
  
    if ( ![IAPShare sharedHelper].iap )
    {
        NSSet *dataSet = [[NSSet alloc] initWithObjects : productCode, nil];
        [IAPShare sharedHelper].iap = [[IAPHelper alloc] initWithProductIdentifiers : dataSet];
    }
  
    [IAPShare sharedHelper].iap.production = NO;
  
    [[IAPShare sharedHelper].iap requestProductsWithCompletion : ^(SKProductsRequest *request, SKProductsResponse *response)
    {
        if ( response > 0 )
        {
            if ( [IAPShare sharedHelper].iap.products.count == 0 )
            {
                NSLog(@"  [buyProduct] No products available.");
                NSLog(@"  [buyProduct] The product code isn't registered on AppStore Connect.");
                // 인앱결제상품을 iTunes에서 조회실패하면 다음 상품결제에 영향을 끼치기때문에 PaymentQueue를 반드시 초기화해야 합니다.
                [IAPShare sharedHelper].iap = nil;

              //return DEFAULT_ALERT(@"윌라", @"곧 출시될 상품입니다.\n감사합니다.");
                return [common presentAlertWithTitle:@"윌라" andMessage:@"곧 출시될 상품입니다.\n감사합니다."];
            }

            SKProduct *product = [[IAPShare sharedHelper].iap.products objectAtIndex : 0];

            NSLog(@"  [buyProduct] Price : %@", [[IAPShare sharedHelper].iap getLocalePrice : product]);
            NSLog(@"  [buyProduct] Title : %@", product.localizedTitle);

            [[IAPShare sharedHelper].iap buyProduct : product
                                       onCompletion : ^(SKPaymentTransaction *transaction)
            {
                if ( transaction.transactionState == SKPaymentTransactionStatePurchased )
                {
                    NSLog(@" [SKPaymentTransactionStatePurchased] productIdentifier: %@", transaction.payment.productIdentifier);
                  
                    // 구입 완료 상태이기 때문에 영수증 검증을 시작합니다. GCD를 사용했지만 lldb에러가 발생하였습니다. IAPHelper에 GCD 또는 동기방식 통신을 사용해야할듯 합니다.
                    // API 통신을 비동기방식이 아닌 동기방식으로 진행합니다.
                    [[IAPShare sharedHelper].iap checkReceipt : [NSData dataWithContentsOfURL : [[NSBundle mainBundle] appStoreReceiptURL]]
                                              AndSharedSecret : @"ShareSecret_is_in_the_server"     // from AppStoreConnect
                                               AndProductCode : productCode
                                             AndTransactionId : transaction.transactionIdentifier
                                                      AndMode : paymentMode
                                                     AndToken : [args objectForKey : @"token"]
                                                 onCompletion : ^(NSString *response, NSError *error)
                    {
                      // 아래의 네비게이션 테스트를 위해 임시로 막아둠(response 콜백 보낼 때 적절한 json 값 셋팅 필요) 2018.10.24
                        // Convert JSON String to NSDictionary
                        NSDictionary *rec = [IAPShare toJSON : response];
                      //NSLog(@"  [IAP checkReceipt] response from the server : %@", response);
                        NSLog(@"  [IAP checkReceipt] rec from the server : %@", rec[@"status"]);
               
                        // status가 0이면 정상결제 처리된 것임.
                        if ( [rec[@"status"] integerValue] == 0 && nil != rec[@"status"] )
                        {
                            [[IAPShare sharedHelper].iap provideContentWithTransaction : transaction];  // 실효성이 있을까?
                            NSLog(@"  [IAP checkReceipt] SUCCESS IAP : %@", [IAPShare sharedHelper].iap.purchasedProducts);
                          
                            // 상품 구입 완료 후 RN에게 결제 결과를 전달해야 합니다.
                            if ( [productCode hasPrefix : @"audiobook_"] )
                            {
                                NSLog(@"  [IAP checkReceipt] Done buying audiobook.");
                              /*
                                NSLog(@"RN 쪽에 홈화면으로 이동 요청");
                                NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
                                [params setObject : [NSNumber numberWithBool:true]
                                           forKey : @"success"];
                                if ( self->_hasListeners )
                                {
                                    [self sendEventWithName : @"buyResult"
                                                       body : params];
                                }
                              */
                                [IAPShare sharedHelper].iap = nil;
                              
                                return ;
                            }
                            else if ( [productCode hasPrefix : @"m_"] )
                            {
                                NSLog(@"  [IAP checkReceipt] Done buying membership.");
                              
                                NSLog(@"RN 쪽에 홈화면으로 이동 요청");
                                NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
                                [params setObject : [NSNumber numberWithBool:true]
                                           forKey : @"success"];
                                if ( self->_hasListeners )
                                {
                                    [self sendEventWithName : @"buyResult"
                                                       body : params];
                                }
                              
                                [IAPShare sharedHelper].iap = nil;
                              
                                return ;
                            }
                        }
                        else
                        {
                            // 해당 상태를 NSUserDefaults로 저장하여 다음 앱 구동시에 해당 값을 읽어서 서버로 receipt verification을 한번 더 시도해야 합니다.
                            NSLog(@"  [IAP checkReceipt] Transaction was well done, but receipt validation has problem..");
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"상품 준비중에 문제가 발생되었습니다.\n1:1문의를 남겨주세요."];
                        }
               
                        NSLog(@"  [IAP checkReceipt] 영수증 확인 후 다음 결제를 위해 PaymentQueue를 초기화합니다..");
                        [IAPShare sharedHelper].iap = nil;
                    }];
                    // 영수증 검증을 마쳤습니다.
                  
                    [IAPShare sharedHelper].iap = nil;  // PaymentQueue를 완료시킵니다.
                }
                else if ( transaction.error.code == SKErrorPaymentCancelled )
                {
                    [IAPShare sharedHelper].iap = nil;
            
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"결제가 취소되었습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorClientInvalid )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"현재 고객님의 결제를 수행할 수 었습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorPaymentInvalid )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"고객님의 지불수단이 App Store에서 인식되지 않았습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorPaymentNotAllowed )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"고객님의 결제는 승인되지 않았습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorStoreProductNotAvailable )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"요청하신 상품을 현재 App Store에서 사용할 수 없습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorCloudServicePermissionDenied )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"고객님께서 클라우드 서비스 정보에 대한 접근을 허용하지 않았습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorCloudServiceNetworkConnectionFailed )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"네트워크에 연결할 수 없습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorCloudServiceRevoked )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"고객님께서 클라우드 서비스 사용 권한을 취소했습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.error.code == SKErrorUnknown )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"예기치 않은 오류가 발생했습니다.\n다음에 다시 이용해 주십시오."];
                }
                else if ( transaction.transactionState == SKPaymentTransactionStateFailed )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle : @"윌라"
                                              andMessage : @"App Store에 접속할 수 없어 결제가 정상적으로 처리되지 않았습니다.\nSKPaymentTransactionStateFailed."];
                }
                else if ( transaction.transactionState == SKPaymentTransactionStateRestored )
                {
                    // 구매복원이 완료되었습니다?
                  
                    [IAPShare sharedHelper].iap = nil;
                  
                    return [common presentAlertWithTitle:@"윌라" andMessage:@"멤버십 구매복원을 처리 중입니다........."];
                }
            }]; // end of buying a product
        }
    }];
}

- (void) restoreProduct : (NSDictionary *) args
{
    // 구매복원 구현 시작
    NSURL *receiptUrl = [[NSBundle mainBundle] appStoreReceiptURL];
    if ( [[NSFileManager defaultManager] fileExistsAtPath : [receiptUrl path]] )
    {
        NSData *receiptData = [NSData dataWithContentsOfURL : receiptUrl];
        NSString *receiptBase64 = [NSString base64StringFromData : receiptData
                                                          length : [receiptData length]];
        NSLog(@"  [restoreProduct] Base64 Encoded Payload : %@", receiptBase64);
      //DEFAULT_ALERT(@"구매복원", @"구매내역을 복원하여 서버로 전송 완료했습니다.");
        [common presentAlertWithTitle:@"구매복원" andMessage:@"구매내역을 복원하여 서버로 전송 완료했습니다."];
        [self sendReceiptToRestore : receiptBase64];
    }
    else
    {
        NSLog(@"  [restoreProduct] Receipt not found, refreshing...");
        // 인앱결제를 한 이력이 있는 Apple유저라도 앱을 지우고 새로 설치하면 로컬에 저장된 영수증을 가져올 수 없습니다.
        //DEFAULT_ALERT(@"구매복원", @"구매내역이 없습니다.");
        // 영수증을 refresh.
        SKReceiptRefreshRequest *refreshReceiptRequest = [[SKReceiptRefreshRequest alloc] initWithReceiptProperties:@{}];
        refreshReceiptRequest.delegate = self;
        [refreshReceiptRequest start];
    }
}
// 영수증 refresh
- (void) requestDidFinish : (SKRequest *) request
{
    if ( [request isKindOfClass : [SKReceiptRefreshRequest class]] )
    {
        //SKReceiptRefreshRequest
        NSURL *receiptUrl = [[NSBundle mainBundle] appStoreReceiptURL];
      
        if ( [[NSFileManager defaultManager] fileExistsAtPath : [receiptUrl path]] )
        {
            NSData *receiptData = [NSData dataWithContentsOfURL : receiptUrl];
          
            if ( !receiptData )
            {
                /* No local receipt -- handle the error. */
                // refresh를 했는데도 영수증이 없으면 아예 구매내역이 아예 없다고 봐야함.
                NSLog(@"  [requestDidFinish] Receipt request done but there is no receipt");
              //DEFAULT_ALERT(@"구매복원", @"welaaa 구매내역을 찾을 수 없습니다.");
                [common presentAlertWithTitle:@"구매복원" andMessage:@"welaaa 구매내역을 찾을 수 없습니다."];
            }
            else
            {
                /* ... Send the receipt data to your server ... */
                NSString *receiptBase64 = [NSString base64StringFromData : receiptData
                                                                  length : [receiptData length]];
                NSLog(@"  [requestDidFinish] Base64 Encoded Payload : %@", receiptBase64);
                [self sendReceiptToRestore: receiptBase64];
              //DEFAULT_ALERT(@"구매복원", @"구매내역을 다시 복원하여 서버로 전송 완료했습니다.");
                [common presentAlertWithTitle:@"구매복원" andMessage:@"구매내역을 다시 복원하여 서버로 전송 완료했습니다."];
            }
        }
        else
        {
            NSLog(@"  [requestDidFinish] This can happen if the user cancels the login screen for the store.");
            NSLog(@"  [requestDidFinish] If we get here it means there is no receipt and an attempt to get it failed because the user cancelled the login.");
          //DEFAULT_ALERT(@"구매복원", @"앱스토어에 접근할 수 없으므로 구매복원을 진행할 수 없습니다.");
            [common presentAlertWithTitle:@"구매복원" andMessage:@"앱스토어에 접근할 수 없으므로 구매복원을 진행할 수 없습니다."];
        }
    }
}

- (void) sendReceiptToRestore : (NSString *) receiptString
{
    NSString *paymentMode;
#if DEBUG
    paymentMode = @"sandbox";
#else
    paymentMode = @"live";
#endif
    NSLog(@"  [sendReceiptToRestore] Current payment mode : %@", paymentMode);
  
    NSString *receiptVerificatorUrl;
  
    if ( [paymentMode isEqualToString: @"live"] )
    {
        receiptVerificatorUrl = @"http://welaaa.co.kr/usingapp/receiptverify_restore.php";
    }
    else if ( [paymentMode isEqualToString: @"sandbox"] )
    {
        receiptVerificatorUrl = @"http://welearn.co.kr/usingapp/receiptverify_restore.php";
    }
    else
    {
        receiptVerificatorUrl = @"http://welaaa.co.kr/usingapp/receiptverify_restore.php";
    }
  
    NSString *webToken = [[NSUserDefaults standardUserDefaults] stringForKey: @"webToken"];
    if ( nil == webToken )
    {
        webToken = @"NO_F_TOKEN";
    }
  
    NSString *post;
    post = [NSString stringWithFormat: @"receipt=%@&item_id=RESTORE&rooting=n&transaction_id=RESTORE&mode=%@&f_token=%@", receiptString, paymentMode, webToken];
    NSData *postData = [post dataUsingEncoding: NSUTF8StringEncoding];
  
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL: [NSURL URLWithString: [NSString stringWithFormat: @"%@", receiptVerificatorUrl]]];
    [request setHTTPBody: postData];
    [request setHTTPMethod: @"POST"];
    NSError *error;
    NSURLResponse *resp = nil;
    // 비동기방식이 아닌 동기방식으로 접속한다.
    NSData *data = [NSURLConnection sendSynchronousRequest: request
                                         returningResponse: &resp
                                                     error: &error];
  
    NSString *jsonData = [[NSString alloc] initWithData: data
                                               encoding: NSUTF8StringEncoding];
  
    jsonData = [jsonData stringByReplacingOccurrencesOfString: @"'" withString: @"\""];   // ' -> " 작은 따옴표를 큰 따옴표로 변경
    NSDictionary *jsonResponse = [NSJSONSerialization JSONObjectWithData: [jsonData dataUsingEncoding: NSUTF8StringEncoding]
                                                                 options: NSJSONReadingAllowFragments
                                                                   error: &error];
    NSLog(@"  [sendReceiptToRestore] JSON Response : %@", jsonData);
  
    if ( !jsonResponse )
    { // ... Handle error ...//
        NSLog(@"  [sendReceiptToRestore] jsonResponse parsing error..");
    }
    // ... Send a response back to the device ... //
    NSNumber *result = [jsonResponse objectForKey: @"status"];
  
    if ( result == nil )
    {
        NSLog(@"  [sendReceiptToRestore] The result is NULL..");
    }
    else
    {
        if ( [result intValue] == 0 )
        {
            NSLog(@"  [sendReceiptToRestore] Receipt Validation Success");
        }
        else
        {
            // 결제는 성공했지만 영수증 확인에 문제가 발생되었습니다.
            NSLog(@"  [sendReceiptToRestore] Receipt Validation Failed T_T");
            NSLog(@"  [sendReceiptToRestore] welastatus : %@", [jsonResponse objectForKey: @"welastatus"]);
            NSLog(@"  [sendReceiptToRestore] welamsg : %@", [jsonResponse objectForKey: @"welamsg"]);
        }
    }
}


#pragma mark - RCT_EXPORT

RCT_EXPORT_METHOD( buy : (NSDictionary *) args )
{
    [self buyProduct : args];
}

RCT_EXPORT_METHOD( restore : (NSDictionary *) args )
{
    [self restoreProduct : args];
}

@end
