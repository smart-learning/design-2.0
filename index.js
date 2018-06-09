import { AppRegistry, YellowBox } from 'react-native';
import App from './App';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTCxxModule', 'Class RCTAsyncLocalStorage', 'Class RCTDevMenu']);
AppRegistry.registerComponent('WelaaaV2', () => App);