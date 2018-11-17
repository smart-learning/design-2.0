import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import CommonStyles from '../../../styles/common';
import Summary from '../video/Summary';

const styles = StyleSheet.create({
  classList: {
    marginBottom: 20
  },
  classItem: {
    position: 'relative',
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  classRank: {
    height: 22,
    marginBottom: 15,
    marginRight: 10
  },
  classRankText: {
    width: 20,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: CommonStyles.COLOR_PRIMARY
  },
  classRankHr: {
    width: 20,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderColor: CommonStyles.COLOR_PRIMARY
  },
  classTitle: {
    fontSize: 16,
    color: CommonStyles.COLOR_PRIMARY
  },
  classAuthor: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 15
  },
  classLabel: {
    height: 22,
    marginRight: 3,
    marginBottom: 10,
    paddingTop: 3,
    paddingRight: 10,
    paddingBottom: 3,
    paddingLeft: 10
  },
  classLabelText: {
    fontSize: 12,
    color: '#ffffff'
  },
  classLabelBlank: {
    borderColor: 'transparent',
    opacity: 0
  },
  classLabelNew: {
    backgroundColor: '#5f45b4'
  },
  classLabelFeatured: {
    backgroundColor: 'black'
  },
  classLabelExclusive: {
    backgroundColor: '#ff761b'
  },
  classLabelFree: {
    backgroundColor: '#00afba'
  }
});

class ClassListItem extends React.Component {
  gotoClassPage = () => {
    this.props.navigation.navigate('ClassDetail', {
      id: this.props.itemData.id,
      title: this.props.itemData.title
    });
  };

  render() {
    return (
      <View style={styles.classItem}>
        <TouchableOpacity activeOpacity={0.9} onPress={this.gotoClassPage}>
          <View>
            <View style={[CommonStyles.alignJustifyItemCenter]}>
              {this.props.classType === 'hot' && (
                <View style={styles.classRank}>
                  <Text style={styles.classRankText}>
                    {this.props.itemData.rankNumber}
                  </Text>
                  <View style={styles.classRankHr} />
                </View>
              )}
              <View>
                <View style={CommonStyles.alignJustifyFlex}>
                  {!!this.props.itemData.is_new && (
                    <View
                      style={[styles.classLabel, styles.classLabelNew]}
                      borderRadius={10}
                    >
                      <Text style={styles.classLabelText}>NEW</Text>
                    </View>
                  )}
                  {!!this.props.itemData.is_featured && (
                    <View
                      style={[styles.classLabel, styles.classLabelFeatured]}
                      borderRadius={10}
                    >
                      <Text style={styles.classLabelText}>추천</Text>
                    </View>
                  )}
                  {!!this.props.itemData.is_exclusive && (
                    <View
                      style={[styles.classLabel, styles.classLabelExclusive]}
                      borderRadius={10}
                    >
                      <Text style={styles.classLabelText}>독점</Text>
                    </View>
                  )}
                  {!!this.props.itemData.is_free && (
                    <View
                      style={[styles.classLabel, styles.classLabelFree]}
                      borderRadius={10}
                    >
                      <Text style={styles.classLabelText}>무료</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <Text style={styles.classTitle}>
              {this.props.itemData.headline}
            </Text>

            <Text style={styles.classAuthor}>
              {this.props.itemData.teacher.headline} {this.props.itemData.teacher.name}
            </Text>
          </View>
        </TouchableOpacity>
        <Summary
          type="course"
          classType={this.props.classType}
          {...this.props.itemData}
          onPress={this.gotoClassPage}
        />
      </View>
    );
  }
}

export default withNavigation(ClassListItem);
