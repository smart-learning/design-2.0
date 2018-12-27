import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import numeral from 'numeral';
import deleteButton from '../../../images/icons/delete-button.png';

export class CartItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderTeacherAndClipCount() {
    const { clipCount, teacherName, type } = this.props;
    return (
      <View>
        <Text style={styles.descText}>{teacherName}</Text>
        {type === 'video-course' && clipCount > 0 ? (
          <Text style={styles.descText}>{`${clipCount}개 강의클립`}</Text>
        ) : (
          undefined
        )}
      </View>
    );
  }

  _renderPeriod() {
    const { type, rentPeriod } = this.props;
    return (
      <View>
        <Text style={styles.descText}>
          이용기간:{' '}
          {type === 'audiobook' ? '영구소장' : `구매후 ${rentPeriod}일`}
        </Text>
      </View>
    );
  }

  render() {
    const {
      cartItemId,
      origPrice,
      userPrice,
      title,
      type,
      thumbnail
    } = this.props;
    const typeText = type === 'video-course' ? '클래스' : '오디오북';

    return (
      <View>
        <View style={styles.cartItemContainer}>
          <View style={styles.iconWrap}>
            <ImageBackground
              source={{
                uri: thumbnail
              }}
              resizeMode="cover"
              style={styles.cartItemIcon}
            />
          </View>

          <View style={styles.cartItemInfo}>
            <View style={styles.titlewrapper}>
              <Text ellipsizeMode={'tail'} numberOfLines={1}>
                <Text style={styles.typeText}>[{typeText}]</Text>
                {' ' + title}
              </Text>
            </View>

            {this._renderTeacherAndClipCount()}
            {this._renderPeriod()}

            <View style={styles.deleteButtonWrap}>
              <TouchableOpacity
                onPress={() => {
                  this.props.removeFromCart(cartItemId);
                }}
              >
                <View style={{ padding: 4 }}>
                  <Image source={deleteButton} style={styles.deleteButton} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.priceTextWrap}>
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
                <Text style={styles.priceText}>
					{
						origPrice !== userPrice ? (
							<Text style={styles.origPriceText}>
								{numeral(origPrice).format('0,0')}
							</Text>
						) : undefined
					}
                  {' ' + numeral(userPrice).format('0,0')}
                  <Text style={styles.priceUnitText}>원</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

styles = StyleSheet.create({
  typeText: { color: '#43C57D' },
  descText: { color: '#999', fontSize: 12 },
  cartItemContainer: {
    flexDirection: 'row',
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    paddingHorizontal: 15,
    marginBottom: 10
  },
  iconWrap: {
    width: 65,
    height: 92,
    marginTop: 10,
    marginBottom: 15
  },
  titleWrapper: { marginBottom: 4 },
  cartItemIcon: { width: 65, height: 92 },
  cartItemInfo: {
    position: 'relative',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 10
  },
  deleteButtonWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    opacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: { width: 18, height: 18 },
  priceTextWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0
  },
  priceText: { color: '#FF4F72', fontSize: 18 },
  origPriceText: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through'
  },
  priceUnitText: { fontSize: 14 }
});
