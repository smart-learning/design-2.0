import React from 'react';
import { observer } from 'mobx-react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import CommonStyles from '../../../styles/common';
import IcStarPrimary from '../../../images/ic-star-primary.png';
import IcStarGrey from '../../../images/ic-star-grey2.png';
import StarGradeIconComponent from './StarGradeIconComponent';
import StarGradeButtonComponent from './StarGradeButtonComponent';
import net from '../../commons/net';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  Paragraph: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#353A3C',
  },
  editModeContainer: {
    position: 'relative',
    width: 225,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modeButtonContainer: {
    position: 'absolute',
    top: 29,
    right: -60,
  },
  modeButton: {
    width: 40,
    height: 18,
    borderWidth: 1,
    borderColor: CommonStyles.COLOR_PRIMARY,
    backgroundColor: CommonStyles.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#ffffff',
  },
});

@observer
class StarGrade extends React.Component {
  changeMyStarGrade = async () => {
    try {
      let result = await net.putStarCount(
        this.props.store.itemEvaluationData.my.id,
        this.props.store.reviewStar,
      );

      this.props.store.isStarEditMode = false;

      if (result) {
        // 별점 다시 로드
        const evaluation = await net.getItemEvaluation(this.props.store.cid);
        this.props.store.itemEvaluationData = evaluation;
      } else {
        Alert.alert('오류', '별점 등록 중 오류가 발생하였습니다');
        this.props.store.isStarEditMode = false;
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', error.message);
    }
  };

  render() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.Paragraph}>
          {this.props.typeText + ' 내용은 어떠셨나요?'}
        </Text>
        <Text style={styles.Paragraph}>별점을 남겨주세요</Text>

        <View
          style={{
            width: '100%',
            height: 32,
            marginTop: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {this.props.store.itemEvaluationData.my?.score > 0 ? (
            <View>
              {!this.props.store.isStarEditMode ? (
                <View style={styles.editModeContainer}>
                  <StarGradeIconComponent
                    reviewStar={this.props.store.reviewStar}
                  />
                  <View style={styles.modeButtonContainer}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        this.props.store.isStarEditMode = true;
                      }}
                    >
                      <View style={styles.modeButton}>
                        <Text style={styles.modeButtonText}>수정</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.editModeContainer}>
                  <StarGradeButtonComponent store={this.props.store} />
                  <View style={styles.modeButtonContainer}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={this.changeMyStarGrade}
                    >
                      <View style={styles.modeButton}>
                        <Text style={styles.modeButtonText}>등록</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <StarGradeButtonComponent store={this.props.store} />
          )}
        </View>
      </View>
    );
  }
}

export default StarGrade;
