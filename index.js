import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
import bgMessaging from './src/scripts/bgMessaging';

// TODO: 크롬 개발자 도구에서 Network 모니터링을 활성화 하기 위해 추가. 향후 삭제 필요.
XMLHttpRequest = GLOBAL.originalXMLHttpRequest
  ? GLOBAL.originalXMLHttpRequest
  : GLOBAL.XMLHttpRequest;

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
  'Class RCTCxxModule',
  'Class RCTAsyncLocalStorage',
  'Class RCTDevMenu',
]);
AppRegistry.registerComponent('WelaaaV2', () => App);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => bgMessaging,
);
