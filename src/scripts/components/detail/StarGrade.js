import React from 'react';
import { observer } from 'mobx-react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcStarPrimary from '../../../images/ic-star-primary.png';
import IcStarGrey from '../../../images/ic-star-grey2.png';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 30,
  },
  Paragraph: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  starIcons: {
    position: 'relative',
    width: 225,
    height: 32,
    marginTop: 20,
  },
  starIconContainer: {
    position: 'absolute',
  },
  starIconContainer1: {
    left: 0,
  },
  starIconContainer2: {
    left: 48,
  },
  starIconContainer3: {
    left: 96,
  },
  starIconContainer4: {
    left: 144,
  },
  starIconContainer5: {
    left: 192,
  },
  starIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 33,
    height: 32,
  },
});

@observer
class StarGrade extends React.Component {
  render() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.Paragraph}>
          {this.props.learnType === 'audioBook' && '오디오북 '}
          {this.props.learnType === 'class' && '강의 '} 내용은 어떠셨나요?
        </Text>
        <Text style={styles.Paragraph}>평점을 남겨주세요</Text>

        <View
          style={{
            width: '100%',
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={styles.starIcons}>
            <View style={[styles.starIconContainer, styles.starIconContainer1]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (this.props.store.reviewStar = 1)}
              >
                <Image
                  source={IcStarGrey}
                  style={
                    this.props.store.reviewStar === 0
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
                <Image
                  source={IcStarPrimary}
                  style={
                    this.props.store.reviewStar === 1 ||
                    this.props.store.reviewStar === 2 ||
                    this.props.store.reviewStar === 3 ||
                    this.props.store.reviewStar === 4 ||
                    this.props.store.reviewStar === 5
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.starIconContainer, styles.starIconContainer2]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (this.props.store.reviewStar = 2)}
              >
                <Image
                  source={IcStarGrey}
                  style={
                    this.props.store.reviewStar === 0 ||
                    this.props.store.reviewStar === 1
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
                <Image
                  source={IcStarPrimary}
                  style={
                    this.props.store.reviewStar === 2 ||
                    this.props.store.reviewStar === 3 ||
                    this.props.store.reviewStar === 4 ||
                    this.props.store.reviewStar === 5
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.starIconContainer, styles.starIconContainer3]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (this.props.store.reviewStar = 3)}
              >
                <Image
                  source={IcStarGrey}
                  style={
                    this.props.store.reviewStar === 0 ||
                    this.props.store.reviewStar === 1 ||
                    this.props.store.reviewStar === 2
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
                <Image
                  source={IcStarPrimary}
                  style={
                    this.props.store.reviewStar === 3 ||
                    this.props.store.reviewStar === 4 ||
                    this.props.store.reviewStar === 5
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.starIconContainer, styles.starIconContainer4]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (this.props.store.reviewStar = 4)}
              >
                <Image
                  source={IcStarGrey}
                  style={
                    this.props.store.reviewStar === 0 ||
                    this.props.store.reviewStar === 1 ||
                    this.props.store.reviewStar === 2 ||
                    this.props.store.reviewStar === 3
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
                <Image
                  source={IcStarPrimary}
                  style={
                    this.props.store.reviewStar === 4 ||
                    this.props.store.reviewStar === 5
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.starIconContainer, styles.starIconContainer5]}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => (this.props.store.reviewStar = 5)}
              >
                <Image
                  source={IcStarGrey}
                  style={
                    this.props.store.reviewStar === 0 ||
                    this.props.store.reviewStar === 1 ||
                    this.props.store.reviewStar === 2 ||
                    this.props.store.reviewStar === 3 ||
                    this.props.store.reviewStar === 4
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
                <Image
                  source={IcStarPrimary}
                  style={
                    this.props.store.reviewStar === 5
                      ? styles.starIcon
                      : { opacity: 0 }
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default StarGrade;
