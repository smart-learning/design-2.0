# Welaaa App 2.0

## Install

```
yarn
# or
npm i
```

## Major Package
```
- react-navigation:  https://reactnavigation.org/
- react-native-video:

```

## 실행 전 세팅

참고: https://beomi.github.io/2016/11/15/ReactNative-Translation-01-getting-started/

```
yarn eject # ios/android 디렉토리 없을 경우에만
yarn link # 실행 후 제대로 연결됬는지 콘솔 메시지 확인
```

## 실행

실행을 위해서는 watchman이 필요하다.  
https://facebook.github.io/watchman/docs/install.html


```
yarn start
# start 한 후 에뮬레이터 실행
yarn android
# or
yarn ios

```

개발 환경은

`소스코드 <-> 메트로 번들러 <-> iOS 시뮬레이터 or 안드로이드 시뮬레이터`

의 구조로 이루어진다.

`yarn start` 명령은 메트로 번들러만을 실행시키고, 실제 에뮬레이터 구동은 별도로 수행해야 한다.
메트로 번들러는 8081 포트에서 실행되며 여러 디버그 도구들이 이 포트상에서 돌아가게 된다.

## 디버그

참조: https://facebook.github.io/react-native/docs/debugging.html

### JS Debug

`console.log`를 확인하기 위해서는 다음 순서대로 진행한다. iOS 기준.

1. http://localhost:8081/debugger-ui 페이지에 접근한다. 메트로 번들러가 실행중이어야 한다.
2. 시뮬레이터에서 `Cmd+D` 를 누른다.
3. `Remote JS Debugging` 메뉴를 선택
4. 앱을 새로고침(`Cmd+R`) 해보면 웹 인스펙터 내에서 로그를 확인할 수 있다.

### View Debugj

`react-devtools`를 npm global로 설치한다

```
(sudo) npm i -g react-devtools
```

실행

```
react-devtools
```



### Package Setting

##### Before Setting...
```
npm run link를 한번에 쓰지 마시고, 뒤에 패키지 명을 붙여서 한 모듈씩 테스트 부탁드립니다.
xcode는 세팅에 어려움이 덜한 편이니, android를 먼저 해보시는것을 추천합니다.
``` 


##### [Android Studio]

###### - Facebook Setting( https://github.com/facebook/react-native-fbsdk )
```
- gradle 업데이트하겠냐고 물어보면 무시해주세요. 
  build.gradle( project:WelaaaV2 )에 classpath 'com.android.tools.build:gradle:2.2.3' 기준으로 작업합니다. 

- https://github.com/facebook/react-native-fbsdk 의 0.29버전 이상의 세팅을 따릅니다.
  ( 이때 AppEventsLogger 작업은 필요 업습니다. )
  
- strings.xml 에 
  <string name="facebook_app_id">428306967643083</string> 
  추가

- AndroidManifest.xml 에
  <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
  추가

- build.graddle(Module:app) 세팅은
  compileSdkVersion 26, buildToolsVersion "27.0.3"
  minSdkVersion 16, targetSdkVersion 22 
  가 테스트할때의 기준입니다.
  
- 컴파일이 무사하게 되면,
  OS X 기준으로, 
  keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64

  다음 명령을 돌려서 나온 해시키와 페이스북 로그인용 이메일 계정을 앱 관리자에게 전달합니다.( 현재는, kyejune )
  관리자가 개발자로 등록하면, 본인 페이스북으로 알림이 가고 승인 후 로그인 가능합니다.
```


##### - Kakao Login
```
- 밑에 내용들로 해결이 안될때 하단 URL을 참고해주세요. react-native-kakao를 정식 지원하는게 아니라 에러가 발생할 수 있습니다.
  https://github.com/sunyrora/react-native-kakao-signin

- 다음에 내용들을 해당 파일에 추가합니다.

- AdnroidManifest.xml
  <meta-data android:name="com.kakao.sdk.AppKey" android:value="@string/kakao_app_key" />
  
- res/values/string.xml
  <resources>
  	<string name="kakao_app_key">6b9977f1c9a6be61e0980e40cf7eefe5</string>
  </resources>

- build.gradle( project:WelaaaV2 )
  allproject repositories 에
  maven { url 'http://devrepo.kakao.com:8088/nexus/content/groups/public/' }
  추가

- 컴파일시 KakaoLoginpackage.java에 override관련 에러가 나면 해당 메서드를 삭제합니다. 

- 페이스북때 생성한 해시키를 개발자페이지에서 추가 합니다.( 관리자에게 요청 )
   
```


#### [Xcode]

###### - Facebook, Kakao 각각의 SDK를 따로 다운받아 적당한곳에 위치해주세요. 
         BuildSetting->Framework search path 에 해당 경로를 추가 해줍니다.

###### - Facebook Setting( https://github.com/facebook/react-native-fbsdk )
###### - https://developers.facebook.com/docs/ios/getting-started/

```
 - https://developers.facebook.com/docs/ios/getting-started/ 2단계부터 5단계까지 작업합니다.
 - api key는 428306967643083 입니다 .
 - bundle identifier: org.reactjs.native.example.WelaaaV2 를 사용합니다.
 - RCTFBSDK.xcodeproj Frameworks에 파일들이 링크가 깨져서 들어오면 다운받은 SDK로 대체
```

##### - Kakao Login
```
 - https://github.com/sunyrora/react-native-kakao-signin 에 코드 주석부분만 참고해서 추가해주세요.
 - Build Setting > Other Linker Flags 에 -all_load 추가
 - https://developers.kakao.com/docs/ios#%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%84%B1 
   를 참고하여 '프로젝트에 내 앱 설정' 을 작업합니다. 
```



### iOS Http 허용
```
info.plist NSExceptionDomains에 추가합니다.

<key>ec2-contents-api.welaa.co.kr</key>
<dict>
	<key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
	<true/>
</dict>
<key>ec2-52-78-197-242.ap-northeast-2.compute.amazonaws.com</key>
<dict>
	<key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
	<true/>
</dict>
```