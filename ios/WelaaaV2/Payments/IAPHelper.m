
#import "IAPHelper.h"

#if ! __has_feature(objc_arc)
#error You need to either convert your project to ARC or add the -fobjc-arc compiler flag to IAPHelper.m.
#endif


@interface IAPHelper()
@property (nonatomic, copy) IAPProductsResponseBlock requestProductsBlock;
@property (nonatomic, copy) IAPbuyProductCompleteResponseBlock buyProductCompleteBlock;
@property (nonatomic, copy) resoreProductsCompleteResponseBlock restoreCompletedBlock;
@property (nonatomic, copy) checkReceiptCompleteResponseBlock checkReceiptCompleteBlock;

@property (nonatomic, strong) NSMutableData *receiptRequestData;
@end

@implementation IAPHelper

- (id) initWithProductIdentifiers : (NSSet *) productIdentifiers
{
    if ( (self = [super init]) )
    {
        // Store product identifiers
        _productIdentifiers = productIdentifiers;
        
        // Check for previously purchased products
        NSMutableSet *purchasedProducts = [NSMutableSet set];
        
        for ( NSString *productIdentifier in _productIdentifiers )
        {
            BOOL productPurchased = NO;
            
            NSString *password = [SFHFKeychainUtils getPasswordForUsername : productIdentifier
                                                            andServiceName : @"IAPHelper"
                                                                     error : nil];
            
            if ( [password isEqualToString: @"YES"] )
            {
                productPurchased = YES;
            }
            
            if ( productPurchased )
            {
                [purchasedProducts addObject: productIdentifier];
            }
        }
        
        if ( [SKPaymentQueue defaultQueue] )
        {
            // Product 결제 진행에 필요한 딜리게이트 등록
            [[SKPaymentQueue defaultQueue] addTransactionObserver: self];
            
            self.purchasedProducts = purchasedProducts;
        }
    }
    
    return self;
}

- (void) dealloc
{
    if ( [SKPaymentQueue defaultQueue] )
    {
        [[SKPaymentQueue defaultQueue] removeTransactionObserver: self];
    }
}

//
// 구입한 상품인지 확인하는 메서드입니다. 키체인에 저장해서 꺼내오는 방식인데 쓰이는지는 잘 모르겠습니다. 쓰이지 않는다면 삭제되어야 합니다.
// 윌라는 AppleID를 알수 없고 오로지 회원정보와 연동된 구매데이터를 서버에 가지고 있기 때문입니다.
//
- (BOOL) isPurchasedProductsIdentifier: (NSString *) productID
{
    BOOL productPurchased = NO;
    
    NSString *password = [SFHFKeychainUtils getPasswordForUsername: productID
                                                    andServiceName: @"IAPHelper"
                                                             error: nil];
    
    if ( [password isEqualToString: @"YES"] )
    {
        productPurchased = YES;
    }

    return productPurchased;
}

- (void) requestProductsWithCompletion : (IAPProductsResponseBlock) completion
{
    self.request = [[SKProductsRequest alloc] initWithProductIdentifiers : _productIdentifiers];
    _request.delegate = self;
    self.requestProductsBlock = completion;
    NSLog(@"  [requestProductsWithCompletion] Requesting for 'ProductIdentifiers'...");
    [_request start];
}

//
// 아이템 정보 요청 결과 callback 메서드입니다.
//
- (void) productsRequest : (SKProductsRequest *) request
      didReceiveResponse : (SKProductsResponse *) response
{
    NSLog(@"  [productsRequest] ProductInfo request result callback -> If the inquiry is normal, make a purchase request.");
    
    self.products = response.products;
    self.request = nil;

    if ( _requestProductsBlock )
    {
        _requestProductsBlock (request, response);
    }
}

- (void) provideContentWithTransaction : (SKPaymentTransaction *) transaction
{
    NSString *productIdentifier = @"";
    
    if ( transaction.originalTransaction )
    {
        productIdentifier = transaction.originalTransaction.payment.productIdentifier;
    }
    else
    {
        productIdentifier = transaction.payment.productIdentifier;
    }
    
    // check productIdentifier exist or not
    // it can be possible nil
    if ( productIdentifier )
    {
        [SFHFKeychainUtils storeUsername: productIdentifier
                             andPassword: @"YES"
                          forServiceName: @"IAPHelper"
                          updateExisting: YES
                                   error: nil];
        
        [_purchasedProducts addObject: productIdentifier];
    }
}

- (void) provideContent: (NSString *) productIdentifier
{
    [SFHFKeychainUtils storeUsername: productIdentifier
                         andPassword: @"YES"
                      forServiceName: @"IAPHelper"
                      updateExisting: YES
                               error: nil];
    
    [_purchasedProducts addObject: productIdentifier];
}

- (void) clearSavedPurchasedProducts
{
    for ( NSString *productIdentifier in _productIdentifiers )
    {
        [self clearSavedPurchasedProductByID: productIdentifier];
    }
}

- (void) clearSavedPurchasedProductByID: (NSString *) productIdentifier
{
    [SFHFKeychainUtils deleteItemForUsername: productIdentifier
                              andServiceName: @"IAPHelper"
                                       error: nil];
    
    [_purchasedProducts removeObject: productIdentifier];
}

//
// 결제가 종료되면 호출됩니다.
//
- (void) completeTransaction : (SKPaymentTransaction *) transaction
{
    NSLog(@"  [completeTransaction] Transaction Identifier : %@", transaction.transactionIdentifier );
    NSLog(@"  [completeTransaction] Transaction Date : %@",       transaction.transactionDate);
  
    // 구매 완료 후 아이템 인벤등 앱UI쪽 후 처리 진행
    [[SKPaymentQueue defaultQueue] finishTransaction : transaction];  // 결제 관련 대기열을 종료시킵니다.
  
    if ( [SKPaymentQueue defaultQueue] )
    {
        [[SKPaymentQueue defaultQueue] finishTransaction : transaction];
    }
    
    if ( _buyProductCompleteBlock )
    {
        _buyProductCompleteBlock(transaction);
    }
    
}

- (void) restoreTransaction : (SKPaymentTransaction *) transaction
{
    NSLog(@"  [restoreTransaction] JUST LOGGING PURPOSE.");
    [self provideContentWithTransaction: transaction];
    
    if ( [SKPaymentQueue defaultQueue] )
    {
        [[SKPaymentQueue defaultQueue] finishTransaction : transaction];
        
        if ( _buyProductCompleteBlock != nil )
        {
            _buyProductCompleteBlock(transaction);
        }
    }
}

//
// 거래 실패 또는 취소 등과 같은 상황에 호출됩니다.
//
- (void) failedTransaction : (SKPaymentTransaction *) transaction
{
    if ( transaction.error.code == SKErrorPaymentCancelled )
    {
        NSLog(@"  [failedTransaction] The user cancelled a payment request.");
        // 사용자가 지불 요청을 취소했습니다.
    }
    else if ( transaction.error.code == SKErrorClientInvalid )
    {
        NSLog(@"  [failedTransaction] The client is not allowed to perform the attempted action.");
        // 클라이언트가 의도한 조치를 수행 할 수 없습니다.
    }
    else if ( transaction.error.code == SKErrorPaymentInvalid )
    {
        NSLog(@"  [failedTransaction] One of the payment parameters was not recognized by the App Store.");
        //지불 매개변수 중 하나가 App Store에서 인식되지 않았습니다.
    }
    else if ( transaction.error.code == SKErrorPaymentNotAllowed )
    {
        NSLog(@"  [failedTransaction] The user is not allowed to authorize payments.");
        // 사용자는 결제를 승인 할 수 없습니다.
    }
    else if ( transaction.error.code == SKErrorStoreProductNotAvailable )
    {
        NSLog(@"  [failedTransaction] The requested product is not available in the store.");
        // 요청한 제품을 상점에서 사용할 수 없습니다.
    }
    else if ( transaction.error.code == SKErrorCloudServicePermissionDenied )
    {
        NSLog(@"  [failedTransaction] The user has not allowed access to Cloud service information.");
        // 사용자가 클라우드 서비스 정보에 대한 액세스를 허용하지 않았습니다.
    }
    else if ( transaction.error.code == SKErrorCloudServiceNetworkConnectionFailed )
    {
        NSLog(@"  [failedTransaction] The device could not connect to the network.");
        // 장치를 네트워크에 연결할 수 없습니다.
    }
    else if ( transaction.error.code == SKErrorCloudServiceRevoked )
    {
        NSLog(@"  [failedTransaction] The user has revoked permission to use this cloud service.");
        // 사용자가 본 클라우드 서비스 사용 권한을 취소했습니다.
    }
    else if ( transaction.error.code == SKErrorUnknown )
    {
        NSLog(@"  [failedTransaction] An unknown or unexpected error occurred.");
        // 알 수 없거나 예기치 않은 오류가 발생했습니다.
    }
    
    if ( [SKPaymentQueue defaultQueue] )
    {
        [[SKPaymentQueue defaultQueue] finishTransaction : transaction];
        
        if ( _buyProductCompleteBlock )
        {
            // HomeView의 결제 block으로 이동.
            _buyProductCompleteBlock(transaction);
        }
    }
}

//
// 새로운 거래가 발생하거나 갱신될 때 호출됩니다.
//
- (void) paymentQueue : (SKPaymentQueue *) queue
  updatedTransactions : (NSArray *) transactions
{
    for ( SKPaymentTransaction *transaction in transactions )
    {
        switch ( transaction.transactionState )
        {
            // 서버에 거래 처리중
            case SKPaymentTransactionStatePurchasing:
                NSLog(@"  [paymentQueue] Processing transaction on server");
                break;
                
            // 구매 완료
            case SKPaymentTransactionStatePurchased:
                // Load the receipt from the app bundle.
                NSLog(@"  [paymentQueue] Purchase complete");
                [self completeTransaction: transaction];
                break;
                
            // 거래 실패 또는 취소
            case SKPaymentTransactionStateFailed:
                NSLog(@"  [paymentQueue] Transaction failed or canceled");
                [self failedTransaction: transaction];
                break;
                
            // 구매복원
            case SKPaymentTransactionStateRestored:
                NSLog(@"  [paymentQueue] Restore Purchase");
                [self restoreTransaction: transaction];
                
            default:
                // For debugging
                NSLog(@"  [paymentQueue] Unexpected transaction state : %ld", (long)transaction.transactionState);
                break;
        }
    }
}

//
// 구매 요청
//
- (void) buyProduct : (SKProduct *) productIdentifier
       onCompletion : (IAPbuyProductCompleteResponseBlock) completion
{
    self.buyProductCompleteBlock = completion;
    
    self.restoreCompletedBlock = nil;
    NSLog(@"  [buyProduct] Purchase request");
    SKPayment *payment = [SKPayment paymentWithProduct : productIdentifier];

    if ( [SKPaymentQueue defaultQueue] )
    {
        [[SKPaymentQueue defaultQueue] addPayment : payment];
        NSLog(@"  [buyProduct] You should now see the Apple Payments UI.");
        NSLog(@"  [buyProduct] Implement SKPaymentTransactionObserver to do the appropriate processing.");
        NSLog(@"  [buyProduct] When you log in to the iTunes Store or have already logged in, bypass the next step.");
        // iTunes Store에 로그인
        
        // 멤버십 중복 구매시 여기에서 크래시가 발생됩니다. 180517.
        // 영수증 체크가 가능하다면 미리 구매한 상품이 있는 경우 필터링이 가능할지도 염두해두어야 할듯..
    }

}

- (void) restoreProductsWithCompletion : (resoreProductsCompleteResponseBlock) completion
{
    NSLog(@"  [restoreProductsWithCompletion] JUST LOGGING PURPOSE.");
    //clear it
    self.buyProductCompleteBlock = nil;
    
    self.restoreCompletedBlock = completion;
    
    if ( [SKPaymentQueue defaultQueue] )
    {
        [[SKPaymentQueue defaultQueue] restoreCompletedTransactions];
    }
    else
    {
        NSLog(@"  [restoreProductsWithCompletion] Cannot get the default Queue");
    }
}

- (void)                       paymentQueue : (SKPaymentQueue *) queue
restoreCompletedTransactionsFailedWithError : (NSError *) error
{
    NSLog(@"  [IAPHelper] TRANSACTION ERROR: %@ / ERR_CODE : %ld", error.localizedDescription, (long) error.code);
    
    if ( _restoreCompletedBlock )
    {
        _restoreCompletedBlock(queue,error);
    }
}

- (void) paymentQueueRestoreCompletedTransactionsFinished : (SKPaymentQueue *) queue
{
    NSLog(@"  [paymentQueueRestoreCompletedTransactionsFinished] payment queue : %@", queue);
    NSLog(@"  [paymentQueueRestoreCompletedTransactionsFinished] Restored Transactions are once again in Queue for purchasing %@", [queue transactions]);
    
  //NSMutableArray *purchasedItemIDs = [[NSMutableArray alloc] init];
  
    NSLog(@"  [paymentQueueRestoreCompletedTransactionsFinished] received restored transactions: %lu", (unsigned long) queue.transactions.count);
    
    //결재 기록이 없을때 alert 뛰우기
    if ( queue.transactions.count == 0 )
    {
        [common presentAlertWithTitle:@"Failed" andMessage:@"구매 기록이 없습니다."];
    }
    
    for ( SKPaymentTransaction *transaction in queue.transactions )
    {
        switch ( transaction.transactionState )
        {
            case SKPaymentTransactionStateRestored:
            {
                [self provideContentWithTransaction: transaction];
            }
                
            default:
                break;
        }
    }
    
    if ( _restoreCompletedBlock )
    {
        _restoreCompletedBlock(queue, nil);
    }

}

- (void) checkReceipt : (NSData *) receiptData
      AndSharedSecret : (NSString *) secretKey
       AndProductCode : (NSString *) productCode
     AndTransactionId : (NSString *) transactionId
              AndMode : (NSString *) paymentMode
             AndToken : (NSString *) authValue
         onCompletion : (checkReceiptCompleteResponseBlock) completion
{
    self.checkReceiptCompleteBlock = completion;
  
    NSString *apiVerifyReceipt = @"/api/v1.0/payment/ios/receipts";
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
  
    NSString *receiptBase64 = [NSString base64StringFromData : receiptData
                                                      length : [receiptData length]];
  
    NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];
    [dictionary setObject:receiptBase64 forKey:@"receipt"];
    [dictionary setObject:productCode   forKey:@"item_id"];
    [dictionary setObject:@"n"          forKey:@"rooting"];
    [dictionary setObject:transactionId forKey:@"transaction_id"];
    [dictionary setObject:paymentMode   forKey:@"mode"];
    [dictionary setObject:authValue     forKey:@"token"];
    NSLog(@"  [checkReceipt] item_id : %@", dictionary[@"item_id"]);
    NSLog(@"  [checkReceipt] transaction_id : %@", dictionary[@"transaction_id"]);
    NSLog(@"  [checkReceipt] mode : %@", dictionary[@"mode"]);
    NSLog(@"  [checkReceipt] token : %@", dictionary[@"token"]);
  
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
      //completion(nil, nil);
        return [common presentAlertWithTitle:@"영수증 검증" andMessage:@"STATUS값이 NULL입니다."];
    }
    else
    {
        if ( [result intValue] == 0 )
        {
            NSLog(@"  [checkReceipt] Receipt Validation Success");
            //[self provideContent: transaction.payment.productIdentifier];
            // implement proper rewards..
          
            completion(jsonData, nil);
        }
        else
        {
            // 결제는 성공했지만 영수증 확인에 문제가 발생되었습니다.
            NSLog(@"  [checkReceipt] Receipt Validation Failed T_T");
            completion(nil, nil);
        }
        // 21000 : App Store에서 사용자가 제공 한 JSON 객체를 읽을 수 없습니다.
        // 21002 : 영수증 데이터 속성의 데이터 형식이 잘못되었습니다.
        //         Client 측에서 Server php로 payload를 보낼 때 해당 값을 url encode를 해줬는지 확인한다.
        // 21003 : 영수증을 인증 할 수 없습니다.
        // 21004 : 입력 한 공유 암호가 사용자 계정의 파일에있는 공유 암호와 일치하지 않습니다.
        // 21005 : 영수증 서버를 현재 사용할 수 없습니다.
        // 21006 : 이 영수증은 유효하지만 구독이 만료되었습니다.
        //         이 상태 코드가 서버로 반환되면 수신 데이터도 디코딩되어 응답의 일부로 반환됩니다.
        // 21007 : 이 영수증은 샌드 박스 영수증이지만 확인을 위해 프로덕션 서비스로 보냈습니다.
        //         테스트용 영수증을 실 서비스 VERIFY_URL로 보냈는지 확인한다.
        // 21008 : 이 영수증은 실제 제품 영수증이지만 확인을 위해 샌드 박스 서비스로 전송되었습니다.
        //         실제 서비스 영수증을 테스트 VERIFY_URL로 보냈는지 확인한다.
    }
  
    return ;
}

# pragma mark - Utils
//
// 각국가별 통화단위로 상품금액을 출력합니다. 현재 로그용으로만 쓰입니다.
//
- (NSString *) getLocalePrice : (SKProduct *) product
{
    if ( product )
    {
        NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
        [formatter setFormatterBehavior : NSNumberFormatterBehavior10_4];
        [formatter setNumberStyle : NSNumberFormatterCurrencyStyle];
        [formatter setLocale : product.priceLocale];
        
        return [formatter stringFromNumber : product.price];
    }
    
    return @"";
}

@end


