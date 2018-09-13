
#import "RNProductPayment.h"

@implementation RNProductPayment

// To export a module named FPSManager
RCT_EXPORT_MODULE();

#pragma mark - Private Methods


#pragma mark - todo : 싱글쓰레드로 처리하든 화면 액션을 차단해야합니다.



- (void) buyProduct : (NSDictionary *) args
{
    NSLog(@"  [buyProduct] Product Code : %@", [args objectForKey : @"product_id"]);
    NSString *productCode = [args objectForKey : @"product_id"];
    NSString *paymentMode;
#if APPSTORE | ADHOC
    paymentMode = @"live";
#else
    paymentMode = @"sandbox";
#endif
    NSLog(@"  [buyProduct] Current payment mode : %@", paymentMode);
  
    if ( nullStr(productCode) )
    {
        return ;
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

                return DEFAULT_ALERT(@"윌라", @"곧 출시될 상품입니다.\n감사합니다.");
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
                    NSLog(@" [SKPaymentTransactionStatePurchased] transactionIdentifier: %@", transaction.originalTransaction.transactionIdentifier);
                  
                    // 구입 완료 상태이기 때문에 영수증 검증을 시작합니다. GCD를 사용해야 할 수도 있습니다.
                    [[IAPShare sharedHelper].iap checkReceipt : [NSData dataWithContentsOfURL : [[NSBundle mainBundle] appStoreReceiptURL]]
                                              AndSharedSecret : @"ShareSecret_is_in_the_server"     // from AppStoreConnect
                                               AndProductCode : productCode
                                             AndTransactionId : transaction.transactionIdentifier
                                                      AndMode : paymentMode
                                                     AndToken : [args objectForKey : @"token"]
                                                 onCompletion : ^(NSString *response, NSError *error)
                    {
                        // Convert JSON String to NSDictionary
                        NSDictionary *rec = [IAPShare toJSON : response];
                        NSLog(@"  [IAP checkReceipt] response from the server : %@", response);
                        NSLog(@"  [IAP checkReceipt] rec from the server : %@", rec[@"status"]);
               
                        // status가 0이면 정상결제 처리된 것임.
                        if ( [rec[@"status"] integerValue] == 0 && nil != rec[@"status"] )
                        {
                            [[IAPShare sharedHelper].iap provideContentWithTransaction : transaction];
                 
                            NSLog(@"  [IAP checkReceipt] SUCCESS IAP : %@", [IAPShare sharedHelper].iap.purchasedProducts);
                          
                            DEFAULT_ALERT(@"윌라", @"결제가 정상적으로 완료되었습니다.");
                        }
                        else
                        {
                            //DEFAULT_ALERT(@"결제확인", @"트랜잭션은 정상이었지만 영수증 확인이 제대로 이루어지지 않았습니다..");
                            // 해당 상태를 NSUserDefaults로 저장하여 다음 앱 구동시에 해당 값을 읽어서 서버로 receipt verification을 한번 더 시도해야 합니다.
                            NSLog(@"  [IAP checkReceipt] Transaction was well done, but receipt validation has problem..");
                        }
               
                        NSLog(@"  [IAP checkReceipt] 영수증 확인 후 다음 결제를 위해 PaymentQueue를 초기화합니다..");
                        [IAPShare sharedHelper].iap = nil;
                    }];
                    // 영수증 검증을 마쳤습니다. 위 과정은 비동기방식으로 구현되었기때문에 해당 과정을 GCD로 감싸는 것을 테스트해봐야 합니다.
                  
                    // checkReceipt는 비동기방식이라 영수증확인까지 기다리면 결제대기열을 초기화시키는데에 어려움이 있습니다.
                    // 따라서 아래와 같이 애플에서 사용자의 카드에서 결제가 성공하면 영수증확인과는 별도로 상품상세 페이지로의 이동 및 결제대기열을 초기화 시킵니다.
            
                    // 상품 구입 완료 후 RN에게 결제 결과를 전달해야 합니다.
                    if ( [productCode hasPrefix : @"audiobook_"] )
                    {
                        ;
                    }
                    else if ( [productCode hasPrefix : @"m_"] )
                    {
                        ;
                    }
            
                    [IAPShare sharedHelper].iap = nil;  // PaymentQueue를 완료시킵니다.
                }
                else if ( transaction.error.code == SKErrorPaymentCancelled )
                {
                    [IAPShare sharedHelper].iap = nil;
            
                    return DEFAULT_ALERT(@"윌라", @"결제가 취소되었습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorClientInvalid )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"현재 고객님의 결제를 수행할 수 었습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorPaymentInvalid )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"고객님의 지불수단이 App Store에서 인식되지 않았습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorPaymentNotAllowed )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"고객님의 결제는 승인되지 않았습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorStoreProductNotAvailable )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"요청하신 상품을 현재 App Store에서 사용할 수 없습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorCloudServicePermissionDenied )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"고객님께서 클라우드 서비스 정보에 대한 접근을 허용하지 않았습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorCloudServiceNetworkConnectionFailed )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"네트워크에 연결할 수 없습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorCloudServiceRevoked )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"고객님께서 클라우드 서비스 사용 권한을 취소했습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.error.code == SKErrorUnknown )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"예기치 않은 오류가 발생했습니다.\n다음에 다시 이용해 주십시오.");
                }
                else if ( transaction.transactionState == SKPaymentTransactionStateFailed )
                {
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"iTunes Store에 접속할 수 없어 결제가 정상적으로 처리되지 않았습니다.\nSKPaymentTransactionStateFailed.");
                }
                else if ( transaction.transactionState == SKPaymentTransactionStateRestored )
                {
                    // 구매복원이 완료되었습니다?
                  
                    [IAPShare sharedHelper].iap = nil;
                  
                    return DEFAULT_ALERT(@"윌라", @"멤버십 구매복원을 처리 중입니다.........");
                }
            }]; // end of buying a product
        }
    }];
}

- (void) restoreProduct : (NSDictionary *) args
{
  ;
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
