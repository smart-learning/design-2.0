import React from 'react';
import { observer } from 'mobx-react';
import {
  View,
  StyleSheet,
  Image,
} from 'react-native';
import IcStarPrimary from '../../../images/ic-star-primary.png';
import IcStarGrey from '../../../images/ic-star-grey2.png';

const styles = StyleSheet.create({
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
class StarGradeIconComponent extends React.Component {
  render() {
    return (
      <View style={styles.starIcons}>
        <View
          style={[styles.starIconContainer, styles.starIconContainer1]}
        >
          <Image
            source={IcStarGrey}
            style={
              this.props.reviewStar=== 0
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
          <Image
            source={IcStarPrimary}
            style={
              this.props.reviewStar=== 1 ||
              this.props.reviewStar=== 2 ||
              this.props.reviewStar=== 3 ||
              this.props.reviewStar=== 4 ||
              this.props.reviewStar=== 5
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
        </View>
        <View
          style={[styles.starIconContainer, styles.starIconContainer2]}
        >
          <Image
            source={IcStarGrey}
            style={
              this.props.reviewStar=== 0 ||
              this.props.reviewStar=== 1
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
          <Image
            source={IcStarPrimary}
            style={
              this.props.reviewStar=== 2 ||
              this.props.reviewStar=== 3 ||
              this.props.reviewStar=== 4 ||
              this.props.reviewStar=== 5
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
        </View>
        <View
          style={[styles.starIconContainer, styles.starIconContainer3]}
        >
          <Image
            source={IcStarGrey}
            style={
              this.props.reviewStar=== 0 ||
              this.props.reviewStar=== 1 ||
              this.props.reviewStar=== 2
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
          <Image
            source={IcStarPrimary}
            style={
              this.props.reviewStar=== 3 ||
              this.props.reviewStar=== 4 ||
              this.props.reviewStar=== 5
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
        </View>
        <View
          style={[styles.starIconContainer, styles.starIconContainer4]}
        >
          <Image
            source={IcStarGrey}
            style={
              this.props.reviewStar=== 0 ||
              this.props.reviewStar=== 1 ||
              this.props.reviewStar=== 2 ||
              this.props.reviewStar=== 3
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
          <Image
            source={IcStarPrimary}
            style={
              this.props.reviewStar=== 4 ||
              this.props.reviewStar=== 5
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
        </View>
        <View
          style={[styles.starIconContainer, styles.starIconContainer5]}
        >
          <Image
            source={IcStarGrey}
            style={
              this.props.reviewStar=== 0 ||
              this.props.reviewStar=== 1 ||
              this.props.reviewStar=== 2 ||
              this.props.reviewStar=== 3 ||
              this.props.reviewStar=== 4
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
          <Image
            source={IcStarPrimary}
            style={
              this.props.reviewStar=== 5
                ? styles.starIcon
                : { opacity: 0 }
            }
          />
        </View>
      </View>
    );
  }
}

export default StarGradeIconComponent;
