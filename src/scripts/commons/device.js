import React from 'react';
import {NativeModules, I18n, Platform} from 'react-native';
import RNLocalizable from 'react-native-localizable';


export default {

	getLocale(){

		let locale = 'en';

		if ( Platform.OS === 'android') {
			locale = NativeModules.I18nManager.localeIdentifier;
		} else {
			locale = NativeModules.SettingsManager.settings.AppleLocale.replace(/_/, '-');
		}

		return locale.substr( 0, 2 );

	},

	getPlatformValue( name ){
		let value = RNLocalizable[name]||null;

		return value;
	}

}
