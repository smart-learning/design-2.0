# 아임포트 결제 샘플 실행법

## 개요

결제 샘플은 `Playground`에 있습니다. `Playground`는 현재 진입점이 없으므로 `App.js`에서 네비게이터를 변경해 확인할 수 있습니다.

## 진입점 수정

`App.js`에서

```js
const AppDrawer = createDrawerNavigator(
```

부분을 찾습니다.
표시상 페이지가 앱 로딩과 함께 표시되므로

```js
// Playground 를 HomeScreen 보다 먼저 배치합니다.
Playground: {
  screen: Playground,
},

HomeScreen: {
  screen: HOME_SCREEN
},
```

이제 앱을 실행하면 `Playground`화면과 결제 창을 볼 수 있습니다.

## 화면상의 위치 및 사이즈

기본 위치는 `relative` 입니다. 모든 요소보다 상위에 띄우기 위해 `absolute` 속성을 이용할 수도 있습니다.

자동 `height`가 없기 때문에 반드시 `height` 값을 지정해야 합니다. 기본값은 550입니다.
`flex` 속성등을 이용해 유동적으로 처리할 수도 있지만 삽입 위치에 따라 `flex`를 사용 불가한 경우도 있기 때문에 `height`를 지정하는 것을 기본 사양으로 채택했습니다.

## 결제 성공/실패에 대한 처리

```jsx
<PurchaseView
	onSuccess={this.onPurchaseSuccess}
	onError={this.onPurchaseError}
/>
```

`PurchaseView` 컴포넌트의 `onSuccess`, `onError` 이벤트를 통해 처리합니다.