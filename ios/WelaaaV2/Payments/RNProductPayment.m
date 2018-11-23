
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
    paymentMode = @"sandbox";//
#else
    paymentMode = @"sandbox";//live
#endif
    NSLog(@"  [-buyProduct:] Current payment mode : %@", paymentMode);
  
    if ( nullStr(productCode) )
    {
        return [common presentAlertWithTitle:@"인앱결제" andMessage:@"상품 정보를 불러올 수 없습니다."];
    }
  
    if ( nullStr([args objectForKey:@"token"]) )
    {
        return [common presentAlertWithTitle:@"인앱결제" andMessage:@"로그인 후 구입하실 수 있습니다."];
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
                              
                                // 결재 완료 이벤트를 RN 으로 보내 화면을 갱신. 2018.11.5. ~
                                NSLog(@"RN 쪽에 결재 완료 이벤트 전달");
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
                        else if ( [rec[@"status"] integerValue] == 21000 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"App Store에서 사용자가 제공 한 JSON 객체를 읽을 수 없습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21002 && nil != rec[@"status"] )
                        {
                              [IAPShare sharedHelper].iap = nil;
                          
                              return [common presentAlertWithTitle:@"윌라" andMessage:@"영수증 데이터 속성의 데이터 형식이 잘못되었습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21003 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"영수증을 인증 할 수 없습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21004 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"입력 한 공유 암호가 사용자 계정의 파일에있는 공유 암호와 일치하지 않습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21005 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"영수증 서버를 현재 사용할 수 없습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21006 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"이 영수증은 유효하지만 구독이 만료되었습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21007 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"이 영수증은 샌드박스 영수증이지만 확인을 위해 프로덕션 서비스로 보냈습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21008 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"이 영수증은 실제 제품 영수증이지만 확인을 위해 샌드박스 서비스로 전송되었습니다."];
                        }
                        else if ( [rec[@"status"] integerValue] == 21010 && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"이 영수증을 승인 할 수 없습니다. 구매가 이루어지지 않은 경우와 동일하게 처리하십시오."];
                        }
                        else if ( [[rec[@"status"] stringValue] hasPrefix:@"211"] && nil != rec[@"status"] )
                        {
                            [IAPShare sharedHelper].iap = nil;
                          
                            return [common presentAlertWithTitle:@"윌라" andMessage:@"내부 데이터 액세스 오류입니다."];
                        }
                      // 계속 붙여야함.
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

// 토큰값을 세팅합니다.
- (void) setTokenToRefresh : (NSString *) authToken
{
    self.tokenStr = authToken;
    NSLog(@"  [setTokenToRefresh] : %@", self.tokenStr);
}
- (void) restoreProduct : (NSDictionary *) args
{
    NSLog(@"  [restoreProduct] : %@", args);
    [self setTokenToRefresh : [args objectForKey : @"token"]];
  
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
        [self sendReceiptToRestore:receiptBase64 AndToken:self.tokenStr];
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
                [self sendReceiptToRestore:receiptBase64 AndToken:self.tokenStr];
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
                     AndToken : (NSString *) authValue
{
    NSString *paymentMode;
#if DEBUG
    paymentMode = @"sandbox";
#else
    paymentMode = @"sandbox";//live
#endif
    NSLog(@"  [sendReceiptToRestore] Current payment mode : %@", paymentMode);
  
    NSString *apiVerifyReceipt = @"/api/v1.0/ios/restore";
    NSString *urlStr = [NSString stringWithFormat : @"%@%@", API_HOST, apiVerifyReceipt];
    NSURL *url = [NSURL URLWithString : urlStr];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL : url];
    NSString *headerValue = [@"Bearer " stringByAppendingString : authValue];
  
    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request addValue:@"application/json" forHTTPHeaderField:@"Accept"];
  
    [request setHTTPMethod : @"POST"];
    [request setValue:headerValue forHTTPHeaderField:@"authorization"];
  
    NSError *error;
    NSURLResponse *resp = nil;
  
    NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
    [dictionary setObject:receiptString forKey:@"receipt"];
    [dictionary setObject:paymentMode   forKey:@"mode"];
    [dictionary setObject:authValue     forKey:@"token"];
  
    NSData *postData = [NSJSONSerialization dataWithJSONObject : dictionary
                                                       options : 0
                                                         error : &error];
    [request setHTTPBody : postData];
  
    // 비동기방식이 아닌 동기방식으로 접속합니다.
    NSData *data = [ApiManager sendSynchronousRequest : request
                                    returningResponse : &resp
                                                error : &error];
  
    NSString *jsonData = [[NSString alloc] initWithData : data
                                               encoding : NSUTF8StringEncoding];
  
    NSDictionary *statusDataDics = [NSJSONSerialization JSONObjectWithData : [jsonData dataUsingEncoding : NSUTF8StringEncoding]
                                                                   options : NSJSONReadingAllowFragments
                                                                     error : &error];
  
    NSLog(@"  [checkReceipt] result : %@", statusDataDics);
    // ... Send a response back to the device ... //
    NSNumber *result = [statusDataDics objectForKey : @"status"];
  
    if ( result == nil )
    {
    }
    else
    {
        if ( [result intValue] == 0 )
        {
            NSLog(@"  [checkReceipt] Receipt Validation Success");
            //[self provideContent: transaction.payment.productIdentifier];
            // implement proper rewards..
          
        }
        else
        {
            // 결제는 성공했지만 영수증 확인에 문제가 발생되었습니다.
            NSLog(@"  [checkReceipt] Receipt Validation Failed T_T");
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
