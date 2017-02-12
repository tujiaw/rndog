'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
const width = Dimensions.get('window').width

export default class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rate: 1,
      muted: true,
      resizeMode: 'contain',
      repeat: false,
      videoReady: false,
    }
    this._back = this._back.bind(this)
    this._onLoadStart = this._onLoadStart.bind(this)
    this._onLoad = this._onLoad.bind(this)
    this._onProgress = this._onProgress.bind(this)
    this._onEnd = this._onEnd.bind(this)
    this._onError = this._onError.bind(this)
  }

  _back() {
    this.props.navigator.pop()
  }

  _onLoadStart() {
    console.log('start')
  }

  _onLoad() {
    console.log('load')
  }

  _onProgress(data) {
    if (!this.state.videoReady) {
      this.setState({videoReady: true})
    }
    console.log('progress:' + data)
  }

  _onEnd() {
    console.log('end')
  }

  _onError(err) {
    console.log('error:' + err)
  }

  render() {
    return (
      <View style={styles.container}>
        <Text onPress={this._back}>详情页面{this.props.data._id}</Text>
        <View style={styles.videoBox}>
          <Video
            ref='video'
            source={{uri: this.props.data.video}} 
            style={styles.video}
            volume={3}
            paused={false}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />
          {
            !this.state.videoReady && <ActivityIndicator color='#ee735c' style={styles.loading} />
          }
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  videoBox: {
    width: width,
    height: 360,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: 360,
    backgroundColor: '#000',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 140,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  }
});

