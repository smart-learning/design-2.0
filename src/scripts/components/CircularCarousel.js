
import React, { Component } from 'react';
import {
	View, Image, TouchableOpacity, Animated, TouchableNativeFeedback, TouchableWithoutFeedback, PanResponder, Platform,
	Dimensions, Text
} from 'react-native';
import Math from 'mathjs';
import store from '../commons/store';

const duration = (Platform.OS == "ios")? 1:0;
const elevationConstant = Math.cos(Math.pi/2.3);
const rotationRate = (Platform.OS == "ios")? 5 : 10;
const penRotationRate = 1;


export default class CircularCarousel extends Component {

	constructor(props){
		super(props);

		this.state = {
			/* TODO: 갯수가 너무 적으면 각도가 너무 듬성듬성 나눠지니 좀 곱해서 넣어주세요. */
			/* TODO: 지금은 jpg라 배경이 커질때만 보여서 좀 어색한데 png로 소스 제대로 대체되면 커질때 괜찮을것 같슴다. */
			dataSource : [
				{
					url: "https://pbs.twimg.com/media/DiHP4slU0AIOQZl.jpg",
					color: "#FE0404"},
				{
					url: "http://www.onlifezone.com/files/attach/images/6006007/343/246/017/53d7cea3e8447ee35e713048e2e2a59f.jpg",
					color: '#522A73'
				},
				{
					url: "https://www.cinra.net/uploads/img/interview/201612-kobayashitsukasa-nikaidou_l.jpg",
					color: "#008200"
				},
				{
					url: "http://image.news1.kr/system/photos/2018/5/9/3101989/article.jpg",
					color: "#034223"
				},
				{
					url: "http://www.liveen.co.kr/news/photo/201802/212163_256717_3859.jpg",
					color: "#015280"
				},




				{
					url: "https://pbs.twimg.com/media/DiHP4slU0AIOQZl.jpg",
					color: "#FE0404"},
				{
					url: "http://www.onlifezone.com/files/attach/images/6006007/343/246/017/53d7cea3e8447ee35e713048e2e2a59f.jpg",
					color: '#522A73'
				},
				{
					url: "https://www.cinra.net/uploads/img/interview/201612-kobayashitsukasa-nikaidou_l.jpg",
					color: "#008200"
				},
				{
					url: "http://image.news1.kr/system/photos/2018/5/9/3101989/article.jpg",
					color: "#034223"
				},
				{
					url: "http://www.liveen.co.kr/news/photo/201802/212163_256717_3859.jpg",
					color: "#015280"
				},


				// {
				// 	url: "https://pbs.twimg.com/media/DiHP4slU0AIOQZl.jpg",
				// 	color: "#FE0404"},
				// {
				// 	url: "http://www.onlifezone.com/files/attach/images/6006007/343/246/017/53d7cea3e8447ee35e713048e2e2a59f.jpg",
				// 	color: '#522A73'
				// },
				// {
				// 	url: "https://www.cinra.net/uploads/img/interview/201612-kobayashitsukasa-nikaidou_l.jpg",
				// 	color: "#008200"
				// },
				// {
				// 	url: "http://image.news1.kr/system/photos/2018/5/9/3101989/article.jpg",
				// 	color: "#034223"
				// },
				// {
				// 	url: "http://www.liveen.co.kr/news/photo/201802/212163_256717_3859.jpg",
				// 	color: "#015280"
				// },

			],
			radius: 60,
			itemWidth: 200,
			itemHeight: 300,
			containerWidth: Dimensions.get('window').width - 20,
			dragging: false,
			selectedIndex: -1,
		}


		this.fullScreenH = Dimensions.get('window').height - 110;

		this.setUpState();
	}


	// componentDidMount(){
	// 	Animated.spring( this.selectedH, {
	// 		toValue: 300,
	// 		duration: 0.1,
	// 	});
	// }

	initAnimateValue(){
		console.log( 'initAnimateValue' );
		this.selectedW = new Animated.Value( 200 );
		this.selectedH = new Animated.Value( 300 );
		this.selectedML = new Animated.Value( ( this.state.containerWidth - 200 ) * 0.5 );
		this.containerHeight = new Animated.Value( 300 ),

		this.setState({
			selectedIndex: -1,
		});
	}


	recoveryAnimateValue(){
		Animated.parallel([
			Animated.spring( this.containerHeight, {
				toValue: 300,
			}),
			Animated.spring( this.selectedH, {
				toValue: 300,
			}),
			Animated.spring( this.selectedW, {
				toValue: 200,
			}),
			Animated.spring( this.selectedML, {
				toValue: ( this.state.containerWidth - 200 ) * 0.5,
			})
		]).start(()=>{
			this.setState({
				selectedIndex: -1,
			});
		});
	}


	componentWillMount() {

		this.setUpConstants();
		this.arrangeItemsInCircle(0,0);
		this.addPenGesture();

		this.initAnimateValue();
	}

	itemPressed(index) {
		let activeItem = this.state.active;
		if (index == activeItem) {
			console.log( 'click' );

			this.setState({
				selectedIndex: index
			});

			this.props.onFullScreenToggle( true );

			Animated.parallel([
				Animated.spring( this.containerHeight, {
					toValue: this.fullScreenH,
				}),
				Animated.spring( this.selectedH, {
					toValue: this.fullScreenH,
				}),
				Animated.spring( this.selectedW, {
					toValue: this.state.containerWidth,
				}),
				Animated.spring( this.selectedML, {
					toValue: 0,
				})
			]).start(()=>{
				// TODO: Router 이동은 이곳에서 !!
				console.log( 'animated complete' );

				setTimeout(()=>{
					// 다음 동작을 위해 원복
					this.recoveryAnimateValue();
					this.props.onFullScreenToggle( false );
				}, 1000 );
			});

			return;
		}

		this.rotateCarousel(index);
	}

	renderItem(data, index, frontIndex ) {

		let item = this.state.items[index];

		// 거리에 따른 opacity적용
		let dis = Math.abs( frontIndex - index );
		if( dis > 0 && dis > 2) dis = this.state.items.length % dis;
		let alpha = 0;
		if( dis ===0 ) alpha = 1;
		if( dis === 1 ) alpha = 0.9;
		else if( dis === 2 ) alpha = 0.7;
		else if( dis > 2 ) alpha = 0;

		const imageStyle = {
			marginTop: item.Y,
			marginLeft: item.X,
			zIndex: item.zIndex,
			width: item.w,
			height: item.h,
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: data.color,
			opacity: alpha,//item.opacity,// - Math.abs( item.angle/180 ),
			position: 'absolute',
			borderRadius: 15,
			overflow: 'hidden',
		};


		// return <TouchableOpacity activeOpacity={1}
		// 						 style={imageStyle}
		// 	onPress={() => this.itemPressed(index)}
		// 	key= {index}
		// >
		// 		<Image
		// 			pointerEvents = 'none'
		// 			style={{
		// 				width: '100%',
		// 				height: '100%',
		// 			}}
		// 			source={{uri: data.url}}
		// 			resizeMode="cover"
		// 		/>
		// </TouchableOpacity>

		// let ss = [imageStyle];
		// if( index === this.state.selectedIndex ) {
		// 	ss.push( selectedStyle );
		// 	// imageStyle.width = imageStyle.width * 1.2;
		// 	// imageStyle.height = imageStyle.height * 1.2;
		// 	// imageStyle.marginLeft = imageStyle.marginLeft - imageStyle.width * 0.1;
		// }



		// For iOS
		if (Platform.OS == 'ios') {
			return (
				<TouchableWithoutFeedback
					onPress={() => this.itemPressed(index)}
					key= {index}
					activeOpacity={1}
				>
					<View style={imageStyle}>
						<Image
							pointerEvents = 'none'
							style={{
								width: '100%',
								height: '100%',
							}}
							source={{uri: data.url}}
							resizeMode="contain"
						/>
					</View>
				</TouchableWithoutFeedback>
			);
		}

		// For android
		return (
			<TouchableNativeFeedback
				onPress={() => this.itemPressed(index)}
				key= {index}
			>
				<View style={imageStyle}>
					<Image
						pointerEvents = 'none'
						style={{
							width: '100%',
							height: '100%',
						}}
						source={{uri: data.url}}
						resizeMode="contain"
					/>
					{/*<Text style={{ position: 'absolute', fontSize:20, color: '#FF0000' }}>*/}
						{/*{`${index}: ${dis}`}*/}
					{/*</Text>*/}
				</View>
			</TouchableNativeFeedback>
		);
	}

	render() {
		let fItem = this.getFrontItem();

		const selectedStyle = {
			width: this.selectedW,
			height: this.selectedH,
			marginLeft: this.selectedML,
			zIndex: 100,
		};

		const containerStyle = {
			height: this.containerHeight,
		};

		console.log( 'height:', this.containerHeight );

		// 가운데 클릭했을때 꽉 채울 이미지
		let fullViewItem = null;
		if( this.state.selectedIndex >= 0 ){
			const data = this.state.dataSource[this.state.selectedIndex];

			fullViewItem = <Animated.View style={[{
				position:'absolute',
				height: 300,
				flex: 1,
				alignItems:'center',
				justifyContent:'center',
				backgroundColor: data.color,
			},
				selectedStyle
			]}>
				<Image
					pointerEvents = 'none'
					style={{
						width: '100%',
						height: '100%',
					}}
					source={{uri: data.url }}
					resizeMode="contain"
				/>
			</Animated.View>
		}else{
			fullViewItem = null;
		}

		return (
			<Animated.View
				style={[Styles.containerStyle, containerStyle ]}
				{...this.panResponder.panHandlers}
			>

				{this.state.sortedItemsDepth.map((data, index) =>
					this.renderItem(this.state.dataSource[data.index], data.index, fItem ) //(fItem == data.index))
				)}

				{fullViewItem}

			</Animated.View>
		);
	}

	//----------------------- L O G I C ---------------------------//

	addPenGesture() {

		this.panResponder = PanResponder.create({
			onPanResponderTerminationRequest: () => false,
			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,

			onStartShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => (
				// Since we want to handle presses on individual items as well
				// Only start the pan responder when there is some movement
				( this.state.items.length > 1 && Math.abs(gestureState.dx) > 10)
			),

			onMoveShouldSetPanResponderCapture: (evt, gestureState) => false, // 캡쳐막기
			onPanResponderMove: (evt, gestureState) => {

				this.state.dragging = true;

				angle = (gestureState.moveX - gestureState.x0)*penRotationRate;
				this.arrangeItemsInCircle(angle, this.state.active)
			},

			onPanResponderRelease: (e, gestureState) => {

				this.state.dragging = false;
				this.rotateCarousel();

				// 적당히 가운데 클릭하면 클릭이벤트 보내
				if( gestureState.dx < 3 ){
					let dis = Math.abs( e.nativeEvent.pageX - (this.state.containerWidth + 20)/2 );
					if( dis < this.state.itemWidth/2) this.itemPressed( this.getFrontItem() );
				}
			},
		});
	}

	arrangeItemsInCircle(angle, item) {

		let r = this.state.radius;
		let n = this.state.items.length;
		let marginY = 0;//this.state.itemHeight/6;
		let marginX = this.state.containerWidth/2 - this.state.itemWidth/2;
		let i=0, k=0;


		while(i<n) {

			let q = ( (i*360/n + angle )%360);
			let alpha = q * (Math.PI / 180);

			// active된 놈하고 거리를 잴 용도로 체크
			let offset = q;
			if( q > 180 ) offset = q - 360;

			let sinalpha = Math.sin(alpha);
			let cosalpha = Math.cos(alpha);

			let x = r * sinalpha + marginX + (offset * 0.8);
			let y = cosalpha * elevationConstant + marginY + Math.abs( offset * 0.5 );

			this.state.items[item].X = x;
			this.state.items[item].Y = y;

			this.state.items[item].angle = q;
			// console.log( item, 'angle:', q,  '  sign:', sinalpha, '  offset:', offset );
			item = (item+1)%n;
			i++;
		}
		this.rearrangeItemsDimension();
		this.rearrangeItemsDepth();
		this.setState({ active: item });
	}

	rearrangeItemsDepth()
	{
		let arr = [];
		let n = this.state.items.length;

		for (let i=0; i<n; i++) {
			arr[i] = {
				index: i,
				depth: this.state.items[i].Y
			};
		}

		for (i=0; i<n; i++)
			for (j = 0; j < n-i-1; j++)
				if (arr[j].depth > arr[j+1].depth) {
					let tmp = arr[j];
					arr[j] = arr[j+1];
					arr[j+1]=tmp;
				}

		this.state.sortedItemsDepth = arr;
	}

	rotateCarousel(item) {

		let fItem = this.getFrontItem();
		let activeItem = (item != undefined) ? item: fItem;
		let fAngle = this.state.frontItemAngle;
		let cAngle = this.state.items[activeItem].angle;

		let rotationAngle = (fAngle - cAngle + 360)%360;

		if (rotationAngle > 180 )
			rotationAngle = rotationAngle - 360;    // make angle negative

		let rotateItems = (i) => {

			let ang = ( (rotationAngle < 0) ? -rotationRate : rotationRate ) * (i++);

			if ( Math.abs(ang) > Math.abs(rotationAngle)) {
				this.arrangeItemsInCircle(0,activeItem);
				return;
			}
			this.arrangeItemsInCircle(cAngle+ang,activeItem);

			setTimeout(() => {
				rotateItems(i);
			}, duration );
		};

		rotateItems(1);
	}

	getFrontItem() {
		let n = this.state.items.length;
		// y값으로 판별하던걸 ang값으로 판별하게 변경

		let frontIndex = 0;
		let prevAng = Math.abs(this.state.items[0].angle);
		for( let i=1; i<n; i++){
			let item = this.state.items[i];
			let ang = Math.abs(item.angle);

			if( ang < prevAng ){
				frontIndex = i;
				prevAng = ang;
			}
		}
		return frontIndex;
	}

	setUpConstants() {

		this.arrangeItemsInCircle(0,0);

		let n = this.state.items.length;
		this.state.frontItemAngle = this.state.items[0].angle;
		this.state.maxMarginX = this.state.items[0].X;
		this.state.maxMarginY = this.state.items[0].Y;
		this.state.minMarginX = this.state.items[n-1].X;
		this.state.minMarginY = this.state.items[n-1].Y;
	}

	rearrangeItemsDimension() {

		for (let i=0; i<this.state.items.length; i++) {
			let c = this.getItemScalingCoefficient(this.state.items[i]);

			let newWidth = this.state.itemWidth * c;
			let diff = this.state.itemWidth - newWidth;

			let x = this.state.items[i].X;
			this.state.items[i].X = x+diff/2;

			this.state.items[i].w = newWidth;
			this.state.items[i].h = this.state.itemHeight * c;
			this.state.items[i].zIndex = 100*c;
		}
	}

	getItemScalingCoefficient(item) {

		let yMax = this.state.maxMarginY;
		let y = item.Y;
		let d = (yMax - this.state.minMarginY)*9;
		if( d == 0)
			d = 1;
		let c = Math.abs( (1 - ( yMax - y)/d));
		return c;
	}

	setUpState() {
		let arr = [];
		for (let i=0; i<this.state.dataSource.length; i++)
			arr[i] = { X: 0, Y: 0, angle: 0, w: 0, h: 0, opacity: 1, zIndex : 100 }

		this.state = { ...this.state,
			active: 0,
			frontItemAngle: 290,
			maxMarginX: 0,
			maxMarginY: 0,
			minMarginX: 0,
			minMarginY: 0,
			items: arr,
			sortedItemsDepth: []
		};
	}
}

const Styles = {

	containerStyle: {
		backgroundColor: 'transparent',
		width: '100%',
		minHeight: 300,
		overflow:'visible'

	}

};
