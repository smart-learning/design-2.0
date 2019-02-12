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
    height: 20,
    marginHorizontal: 3,
    // marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
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
        style={[
          CommonStyles.alignJustifyFlex,
          { width: '98%', flexWrap: 'wrap' },
        ]}
      >
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
                color: selectedCategory === categoryId ? '#ffffff' : '#9DA4A7',
              };
              let categoryItemStyle = {
                borderColor:
                  selectedCategory === categoryId
                    ? CommonStyles.COLOR_PRIMARY
                    : '#ffffff',
                backgroundColor:
                  selectedCategory === categoryId
                    ? CommonStyles.COLOR_PRIMARY
                    : '#ffffff',
              };

              if (selectedCategory === categoryId) {
                textStyle.color = '#ffffff';
              }

              return (
                <View style={CommonStyles.alignJustifyItemCenter}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => this.select(item)}
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
                  <Text style={{ top: 5, height: 30 }}>|</Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
}

export default PageCategory;
