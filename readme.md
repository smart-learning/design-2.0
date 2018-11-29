# Welaaa App 2.0

## 실행 전 세팅

참고: https://beomi.github.io/2016/11/15/ReactNative-Translation-01-getting-started/

```
$ brew install node
$ brew install watchman
$ npm install -g react-native-cli
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



### Package Setting

#### [Android]
>in '~/.bash_profile
```
...
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
...
```



#### [Xcode]

```
$ cd welaaa2
$ npm i
$ cd ios
$ make bootstrap # CocoaPods을 자동으로 세팅하여 Pods/ 을 구성합니다.
$ open WelaaaV2.xcworkspace
```

###### PallyConFPSSDK
```
경로 : ~/Documents/PallyCon-FairPlay-iOS-SDK/PallyConFPSSDK.framework
# in Xcode
General - Embedded Binaries에 '+'로 추가.
프로젝트 TARGETS의 Build Settings 탭에 Enable Bitcode를 No로 설정
Build Options에서 "Always Embed Swift Standard Libraries"를 YES
```

##### react-native-localizable
https://github.com/fabriciovergara/react-native-localizable
```
프로젝트별 변수를 가져오기 위해서 설치합니다.
설치는 공식 문서를 참고합니다만, 필요한 파일은 전부 올라가 있습니다.
- npm run link react-native-localizable 실행 필요합니다.
- ios/WelaaaV2/Localizable.strings 파일을 xcode 프로젝트 패널(Xcode 좌측 프로젝트 네비게이터 창에서 'Add Files to' 실행)에 추가해주세요. 
```




### iOS Http 허용
```
info.plist NSExceptionDomains에 추가합니다.
```


### Error Case

#### Development cannot be enabled while your device is locked.

USB 연결을 해제한 후 다시 연결한다.  
증상이 반복되면 아이폰 설정 > 일반 > 재설정 > 위치 및 개인정보 재설정 후 USB를 재연결한다.


### 카카오 로그인 화면에서 버튼에 텍스트가 안나오는 문제
이슈 #335 참고해서 라이브러리 파일을 수정한다.


## Native Environment Settings

### android
- Gradle version >= **4.4**
- Android plugin for Gradle version = **3.1.3**
- compileSdkVersion = **27**
- buildToolsVersion = **"27.0.3"**
- supportLibVersion = **"27.1.1"**
- minSdkVersion = **19**
- targetSdkVersion = **26**
- exoplayer2 = **2.8.2**

### iOS
