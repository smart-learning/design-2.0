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

### View Debug

`react-devtools`를 npm global로 설치한다

```
(sudo) npm i -g react-devtools
```

실행

```
react-devtools
```