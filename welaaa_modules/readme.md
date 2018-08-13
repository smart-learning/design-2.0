# 세팅


## iOS

"info.plist"에 추가
```
<key>Fabric</key>
<dict>
	<key>APIKey</key>
	<string>34f42c07ec889a3a9e3fabb2c478cc9af1001fa6</string>
	<key>Kits</key>
	<array>
		<dict>
			<key>KitInfo</key>
			<dict/>
			<key>KitName</key>
			<string>Crashlytics</string>
		</dict>
	</array>
</dict>

```


"Podfile" 에 추가
```
pod 'Firebase/Core'
pod 'Firebase/Messaging'

# Fabric
pod 'Fabric'
pod 'Crashlytics'

# Video Player
pod 'PlayerKit'

```




## Android