'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Detail extends Component {
  constructor(props) {
    super(props)
    this._back = this._back.bind(this)
  }

  _back() {
    this.props.navigator.pop()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this._back}>详情页面{this.props.data._id}</Text>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5fcff',
  }
});

