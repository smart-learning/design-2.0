# Welaaa App 2.0

## 실행 전 세팅

참고: https://beomi.github.io/2016/11/15/ReactNative-Translation-01-getting-started/

```
$ brew install node
$ brew install watchman
$ npm install -g react-native-cli
```

## Install

```
$ cd welaaa2
$ npm i
$ cd ios
$ make bootstrap # CocoaPods을 자동으로 세팅하여 Pods/ 을 구성합니다.
$ open WelaaaV2.xcworkspace
```

## Major Package
```
- react-navigation:  https://reactnavigation.org/
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

###### Facebook Login

```
https://developers.facebook.com/docs/ios/getting-started/advanced?locale=ko_KR
iOS는 CocoaPods으로 세팅하였습니다.
```

###### - Kakao Login

```
iOS는 CocoaPods으로 세팅하였습니다.
```

###### PallyConFPSSDK
```
경로 : ~/Documents/PallyCon-FairPlay-iOS-SDK/PallyConFPSSDK.framework
# in Xcode
General - Embedded Binaries에 '+'로 추가.
프로젝트 TARGETS의 Build Settings 탭에 Enable Bitcode를 No로 설정
Build Options에서 "Always Embed Swift Standard Libraries"를 YES
```

### iOS Http 허용
```
info.plist NSExceptionDomains에 추가합니다.
```

## Native Environment Settings
### android
- Gradle version >= **4.4**
- Android plugin for Gradle version = **3.1.3**
- compileSdkVersion = **26**
- buildToolsVersion = **"27.0.3"**
- supportLibVersion = **"27.1.1"**
- minSdkVersion = **19**
- targetSdkVersion = **22**

### iOS