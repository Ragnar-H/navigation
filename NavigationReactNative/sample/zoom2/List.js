import React from 'react';
import {StyleSheet, View, ListView, Image, Text, TouchableWithoutFeedback, Dimensions, Animated} from 'react-native';
import {SharedElement} from 'navigation-react-native';
import ZoomShared from './ZoomShared';

export default class List extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._rowAnimations = {};
    this.onNavigate = this.onNavigate.bind(this);
    this.url = props.stateNavigator.stateContext.url;
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(props.places),
      selectedId: 0,
    };
  }
  shouldComponentUpdate(props) {
    return this.url === props.stateNavigator.stateContext.url;
  }
  componentDidMount() {
    this.props.stateNavigator.onNavigate(this.onNavigate);
  }
  componentWillUnmount() {
    this.props.stateNavigator.offNavigate(this.onNavigate);
  }
  onNavigate(oldState, state, {rowId}) {
    const inverse = this.url !== this.props.stateNavigator.stateContext.oldUrl;
    const animations = [];
    const rowInt = parseInt(rowId, 10);
    for (let i = rowInt - 2; i <= rowInt + 2; i++) {
      if (i === rowInt) {
        continue;
      }
      const anim = this._rowAnimations[i];
      if (anim) {
        animations.push(
          Animated.timing(anim, {
            toValue: inverse ? 0 : i < rowInt ? -1 : 1,
            duration: 500,
            useNativeDriver: true,
          })
        );
      }
    }
    Animated.parallel(animations).start();    
  }
  _renderRow = (rowData, sectionId, rowId) => {
    this._rowAnimations[rowId] = new Animated.Value(0);
    const rowStyle = {
      transform: [
        {
          translateY: this._rowAnimations[rowId].interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-200, 0, 200],
          }),
        },
      ],
    };
    return (
      <TouchableWithoutFeedback
        key={sectionId + rowId}
        onPress={this._onListItemPress.bind(this, rowData, sectionId, rowId)}>
        <Animated.View style={[styles.listItem, rowStyle]}>
          <View style={styles.listImage}>
            <Image
              source={rowData.image}
              style={{ flex: 1 }}
            />
          </View>
          <View style={styles.priceLabel}>
            <Text style={styles.priceLabelText}>
              ${rowData.price}
            </Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };
  _onListItemPress = (rowData, sectionId, rowId) => {
    const {stateNavigator} = this.props;
    if (this.url === stateNavigator.stateContext.url) {
      stateNavigator.navigate('detail', {rowId});
    }
  };
  render() {
    const {places, stateNavigator} = this.props;
    return (
      <View style={styles.container}>
        <ListView
          contentContainerStyle={styles.contentContainer}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 40,
  },
  listItem: {
    paddingBottom: 15,
    alignSelf: 'center',
  },
  listItemBorder: {
    width: Dimensions.get('window').width - 30,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, .25)',
    alignSelf: 'center',
    marginBottom: 15,
  },
  listImage: {
    width: Dimensions.get('window').width - 30,
    height: 201,
  },
  priceLabel: {
    position: 'absolute',
    left: 0,
    bottom: 25,
    backgroundColor: 'rgba(0, 0, 0, .75)',
    paddingVertical: 7.5,
    paddingHorizontal: 10,
  },
  priceLabelText: {
    fontSize: 19,
    textAlign: 'right',
    color: 'white',
  },
});
