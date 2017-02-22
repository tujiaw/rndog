/**
 * Created by tujiaw on 2017/2/19.
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';

export default class CountDown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: this.props.time ? this.props.time : 60,
      disabled: true
    }
    this._countdown = this._countdown.bind(this)
    this._onPress = this._onPress.bind(this)
  }

  componentDidMount() {
    this._countdown();
  }

  componentWillUnmount() {
    clearTimeout(this.state.timeid)
  }

  _onPress(){
    if (this.state.disabled) {
      //nothing
    } else {
      this.setState({disabled: true});
      this._countdown();
      if(this.props.onPress){
        this.props.onPress();
      }
    }
  }

  _countdown(){
    var that = this
    var timer = function () {
      var time = that.state.time - 1;
      that.setState({time: time});
      if (time > 0) {
        that.setState({ timeid: setTimeout(timer, 1000) })
      } else {
        that.setState({disabled: false});
        that.setState({time: that.props.time ? that.props.time : 60});
      }
    };

    this.setState({ timeid: setTimeout(timer, 1000) })
  }

  render() {
    var style = [styles.text];
    var component;
    if (this.state.disabled) {
      component =
        <View style={styles.container}>
          <TouchableHighlight>
            <Text style={styles.disabledText}>{this.props.text}({this.state.time})</Text>
          </TouchableHighlight>
        </View>
    } else {
      component =
        <View>
          <TouchableHighlight
            style={styles.container}
            onPress={this._onPress.bind(this)}>
            <Text style={styles.enableText}>{this.props.endText || '重新获取'}</Text>
          </TouchableHighlight>
        </View>
    }
    return (
      component
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 100,
    height: 40,
    backgroundColor: '#ed7b66',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  disabledText: {
    color: '#fff',
  },
  enableText: {
    color: '#fff',
  }
});
