import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { observer } from 'mobx-react';
import CommonStyles from '../../styles/common';

const styles = StyleSheet.create({
  categoryContainer: {
    width: '100%',
    height: 40
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingLeft: 20,
    paddingRight: 20
  },
  categoryText: {
    color: '#A1A1A1',
    fontSize: 14
  }
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
      <View>
        <FlatList
          style={styles.categoryContainer}
          data={this.props.data}
          selectedCategory={this.props.selectedCategory}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          extraData={this.props.data}
          renderItem={({ item }) => {
            const categoryId = item.id;
            const selectedCategory = this.props.selectedCategory;
            let textStyle = {
              color: selectedCategory === categoryId ? '#444444' : '#A1A1A1'
            };
            let categoryItemStyle = {
              borderTopWidth: 0,
              borderRightWidth: 0,
              borderBottomWidth: selectedCategory === categoryId ? 3 : 0,
              borderLeftWidth: 0,
              borderColor: CommonStyles.COLOR_PRIMARY
            };

            if (selectedCategory === categoryId) {
              textStyle.color = '#444444';
            }

            return (
              <View style={[styles.categoryItem, categoryItemStyle]}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.select(item)}
                >
                  <Text style={[styles.categoryText, textStyle]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

export default PageCategory;
