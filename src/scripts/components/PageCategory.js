import React from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { observer } from 'mobx-react';
import CommonStyles from '../../styles/common';

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginRight: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

@observer
class PageCategory extends React.Component {
  select = item => {
    if (this.props.onCategorySelect) {
      this.props.onCategorySelect(item);
    }
  };

  render() {
    if (!this.props.data) {
      return <View />;
    }
    return (
      <View
        style={[CommonStyles.alignJustifyFlex, { width: '98%', flexWrap: 'wrap' }]}
      >
        {this.props.data.map((item, key) => {
          const categoryId = item.id;
          const selectedCategory = this.props.selectedCategory;
          let textStyle = {
            color: selectedCategory === categoryId ? '#ffffff' : '#9DA4A7',
          };
          let categoryItemStyle = {
            borderColor:
              selectedCategory === categoryId
                ? CommonStyles.COLOR_PRIMARY
                : '#9DA4A7',
            backgroundColor:
              selectedCategory === categoryId
                ? CommonStyles.COLOR_PRIMARY
                : '#ffffff',
          };
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => this.select(item)}
              key={key}
            >
              <View
                style={[styles.categoryItem, categoryItemStyle]}
                borderRadius={15}
              >
                <Text style={[styles.categoryText, textStyle]}>
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

export default PageCategory;
