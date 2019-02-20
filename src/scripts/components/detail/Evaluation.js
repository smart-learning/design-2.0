import React from 'react';
import { Text, View, StyleSheet, Image, ImageBackground } from 'react-native';
import CommonStyles from '../../../styles/common';
import IcStarGrey from '../../../images/ic-star-grey2.png';
import BgStar from '../../../images/bg-star-grade.png';
import BgStar05 from '../../../images/bg-star-grade-active-05.png';
import BgStar10 from '../../../images/bg-star-grade-active-10.png';
import BgStar15 from '../../../images/bg-star-grade-active-15.png';
import BgStar20 from '../../../images/bg-star-grade-active-20.png';
import BgStar25 from '../../../images/bg-star-grade-active-25.png';
import BgStar30 from '../../../images/bg-star-grade-active-30.png';
import BgStar35 from '../../../images/bg-star-grade-active-35.png';
import BgStar40 from '../../../images/bg-star-grade-active-40.png';
import BgStar45 from '../../../images/bg-star-grade-active-45.png';
import BgStar50 from '../../../images/bg-star-grade-active-50.png';
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
    backgroundColor: CommonStyles.COLOR_PRIMARY,
  },
  starEvgImage: {
    width: 172,
    height: 26,
  },
  percentWrap: {
    width: 50,
  },
  percentAlign: {
    textAlign: 'right',
  },
});

export default class Evaluation extends React.Component {
  render() {
    let originData = this.props.store.itemEvaluationData?.all?.score;
    let itemData = [];
    let starData = [];
    let starSum = 0;
    let starAvg = this.props.store.itemEvaluationData ? this.props.store.itemEvaluationData?.all?.star_average : 0;

    if (originData) {
      _.map(originData, element => {
        itemData.push(element);
      });
      for (let i = 0; i < itemData.length; i++) {
        starSum += itemData[i];
      }
      _.each(itemData, element => {
        starData.push((element / starSum) * 100);
      });
    }

    return (
      <View>
        {originData && (
          <View style={styles.evaluation}>
            <View
              style={[
                CommonStyles.alignJustifyContentBetween,
                {
                  width: 250,
                  height: 26,
                  marginBottom: 25,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  alignItems: 'center',
                },
              ]}
            >
              <View style={{ width: 172 }}>
                {starAvg === 0 && (
                  <ImageBackground
                    source={BgStar}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {0 < starAvg && starAvg <= 0.5 && (
                  <ImageBackground
                    source={BgStar05}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {0.5 < starAvg && starAvg <= 1 && (
                  <ImageBackground
                    source={BgStar10}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {1 < starAvg && starAvg <= 1.5 && (
                  <ImageBackground
                    source={BgStar15}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {1.5 < starAvg && starAvg <= 2 && (
                  <ImageBackground
                    source={BgStar20}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {2 < starAvg && starAvg <= 2.5 && (
                  <ImageBackground
                    source={BgStar25}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {2.5 < starAvg && starAvg <= 3 && (
                  <ImageBackground
                    source={BgStar30}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {3 < starAvg && starAvg <= 3.5 && (
                  <ImageBackground
                    source={BgStar35}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {3.5 < starAvg && starAvg <= 4 && (
                  <ImageBackground
                    source={BgStar40}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {4 < starAvg && starAvg <= 4.5 && (
                  <ImageBackground
                    source={BgStar45}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
                {4.5 < starAvg && starAvg <= 5 && (
                  <ImageBackground
                    source={BgStar50}
                    resizeMode={'cover'}
                    style={styles.starEvgImage}
                  />
                )}
              </View>
              <View style={{ width: 65 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '200',
                    color: '#898989',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: CommonStyles.COLOR_PRIMARY,
                    }}
                  >
                    {numeral(starAvg).format('0.0')}{' '}
                  </Text>
                  / 5.0
                </Text>
              </View>
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
                  style={[
                    styles.evaluationProgress,
                    { width: starData[4] + '%' },
                  ]}
                />
              </View>
              <View style={styles.percentWrap}>
                <Text style={[styles.evaluationText, styles.percentAlign]}>
                  {numeral(starData[4]).format('0.0')}{' '}
                  <Text style={styles.evaluationTextBullet}>%</Text>
                </Text>
              </View>
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
                  style={[
                    styles.evaluationProgress,
                    { width: starData[3] + '%' },
                  ]}
                />
              </View>
              <View style={styles.percentWrap}>
                <Text style={[styles.evaluationText, styles.percentAlign]}>
                  {numeral(starData[3]).format('0.0')}{' '}
                  <Text style={styles.evaluationTextBullet}>%</Text>
                </Text>
              </View>
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
                  style={[
                    styles.evaluationProgress,
                    { width: starData[2] + '%' },
                  ]}
                />
              </View>
              <View style={styles.percentWrap}>
                <Text style={[styles.evaluationText, styles.percentAlign]}>
                  {numeral(starData[2]).format('0.0')}{' '}
                  <Text style={styles.evaluationTextBullet}>%</Text>
                </Text>
              </View>
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
                  style={[
                    styles.evaluationProgress,
                    { width: starData[1] + '%' },
                  ]}
                />
              </View>
              <View style={styles.percentWrap}>
                <Text style={[styles.evaluationText, styles.percentAlign]}>
                  {numeral(starData[1]).format('0.0')}{' '}
                  <Text style={styles.evaluationTextBullet}>%</Text>
                </Text>
              </View>
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
                  style={[
                    styles.evaluationProgress,
                    { width: starData[0] + '%' },
                  ]}
                />
              </View>
              <View style={styles.percentWrap}>
                <Text style={[styles.evaluationText, styles.percentAlign]}>
                  {numeral(starData[0]).format('0.0')}{' '}
                  <Text style={styles.evaluationTextBullet}>%</Text>
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
