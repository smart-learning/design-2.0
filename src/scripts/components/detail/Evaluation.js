import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import CommonStyles from '../../../styles/common';
import IcStarGrey from '../../../images/ic-star-grey2.png';
import IcStarPrimary from '../../../images/ic-star-primary.png';
import numeral from 'numeral';
import _ from 'underscore';

const styles = StyleSheet.create({
  evaluation: {},
  starCount: {
    fontSize: 16,
    color: '#898989',
    fontWeight: '400',
  },
  starCountMy: {
    color: CommonStyles.COLOR_PRIMARY,
    fontWeight: 'bold',
  },
  evaluationItem: {
    alignItems: 'center',
    marginTop: 10,
  },
  evaluationIcon: {
    position: 'relative',
    top: 1,
    width: 14,
    height: 13,
    marginRight: 5,
  },
  evaluationIconMy: {
    position: 'relative',
    top: 1,
    width: 26,
    height: 25,
  },
  evaluationText: {
    fontSize: 13,
    color: '#888888',
  },
  evaluationTextBullet: {
    fontSize: 12,
    color: '#888888',
  },
  evaluationBar: {
    position: 'relative',
    width: 230,
    height: 13,
    backgroundColor: '#eaeaea',
  },
  evaluationProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 13,
    backgroundColor: '#838d92',
  },
});

export default class Evaluation extends React.Component {
  render() {
    let starData = [];
    let starAvg = this.props.itemData.star_avg;
    let starSetAll = this.props.itemData.star_set.all;

    _.each(this.props.itemData.star_set, element => {
      starData.push((element / starSetAll) * 100);
    });

    return (
      <View style={styles.evaluation}>
        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            { width: 240, marginLeft: 'auto', marginRight: 'auto' },
          ]}
        >
          <View>
            <View
              style={[
                CommonStyles.alignJustifyContentBetween,
                { width: 160, marginBottom: 20 },
              ]}
            >
              <Image source={IcStarGrey} style={styles.evaluationIconMy} />
              <Image source={IcStarGrey} style={styles.evaluationIconMy} />
              <Image source={IcStarGrey} style={styles.evaluationIconMy} />
              <Image source={IcStarGrey} style={styles.evaluationIconMy} />
              <Image source={IcStarGrey} style={styles.evaluationIconMy} />
            </View>
          </View>
          <Text style={styles.starCount}>
            <Text style={styles.starCountMy}>
              {numeral(starAvg).format('0.0')}
            </Text>{' '}
            / 5.0
          </Text>
        </View>

        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            styles.evaluationItem,
          ]}
        >
          <View>
            <View style={CommonStyles.alignJustifyFlex}>
              <Image source={IcStarGrey} style={styles.evaluationIcon} />
              <Text style={styles.evaluationText}>5</Text>
            </View>
          </View>
          <View style={styles.evaluationBar}>
            <View
              style={[styles.evaluationProgress, { width: starData[4] + '%' }]}
            />
          </View>
          <Text style={styles.evaluationText}>
            {numeral(starData[4]).format('0.0')}{' '}
            <Text style={styles.evaluationTextBullet}>%</Text>
          </Text>
        </View>

        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            styles.evaluationItem,
          ]}
        >
          <View>
            <View style={CommonStyles.alignJustifyFlex}>
              <Image source={IcStarGrey} style={styles.evaluationIcon} />
              <Text style={styles.evaluationText}>4</Text>
            </View>
          </View>
          <View style={styles.evaluationBar}>
            <View
              style={[styles.evaluationProgress, { width: starData[3] + '%' }]}
            />
          </View>
          <Text style={styles.evaluationText}>
            {numeral(starData[3]).format('0.0')}{' '}
            <Text style={styles.evaluationTextBullet}>%</Text>
          </Text>
        </View>

        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            styles.evaluationItem,
          ]}
        >
          <View>
            <View style={CommonStyles.alignJustifyFlex}>
              <Image source={IcStarGrey} style={styles.evaluationIcon} />
              <Text style={styles.evaluationText}>3</Text>
            </View>
          </View>
          <View style={styles.evaluationBar}>
            <View
              style={[styles.evaluationProgress, { width: starData[2] + '%' }]}
            />
          </View>
          <Text style={styles.evaluationText}>
            {numeral(starData[2]).format('0.0')}{' '}
            <Text style={styles.evaluationTextBullet}>%</Text>
          </Text>
        </View>

        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            styles.evaluationItem,
          ]}
        >
          <View>
            <View style={CommonStyles.alignJustifyFlex}>
              <Image source={IcStarGrey} style={styles.evaluationIcon} />
              <Text style={styles.evaluationText}>2</Text>
            </View>
          </View>
          <View style={styles.evaluationBar}>
            <View
              style={[styles.evaluationProgress, { width: starData[1] + '%' }]}
            />
          </View>
          <Text style={styles.evaluationText}>
            {numeral(starData[1]).format('0.0')}{' '}
            <Text style={styles.evaluationTextBullet}>%</Text>
          </Text>
        </View>

        <View
          style={[
            CommonStyles.alignJustifyContentBetween,
            styles.evaluationItem,
          ]}
        >
          <View>
            <View style={CommonStyles.alignJustifyFlex}>
              <Image source={IcStarGrey} style={styles.evaluationIcon} />
              <Text style={styles.evaluationText}>1</Text>
            </View>
          </View>
          <View style={styles.evaluationBar}>
            <View
              style={[styles.evaluationProgress, { width: starData[0] + '%' }]}
            />
          </View>
          <Text style={styles.evaluationText}>
            {numeral(starData[0]).format('0.0')}{' '}
            <Text style={styles.evaluationTextBullet}>%</Text>
          </Text>
        </View>
      </View>
    );
  }
}
