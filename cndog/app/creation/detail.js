'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
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
      videoProgress: 0.0,
      videoTotal: 0,
      currentTime: 0,
      paused: false,
      videoError: false,
    }
    this._back = this._back.bind(this)
    this._onLoadStart = this._onLoadStart.bind(this)
    this._onLoad = this._onLoad.bind(this)
    this._onProgress = this._onProgress.bind(this)
    this._onEnd = this._onEnd.bind(this)
    this._onError = this._onError.bind(this)
    this._replay = this._replay.bind(this)
    this._pause = this._pause.bind(this)
    this._resume = this._resume.bind(this)
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
    console.log(data)
    if (!this.state.videoReady) {
      this.setState({videoReady: true})
    }
    const duration = data.playableDuration
    const currentTime = data.currentTime
    const percent = Number((currentTime / duration).toFixed(2))
    this.setState({
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent,
    })
  }

  _onEnd() {
    console.log('end')
    this.setState({
      videoProgress: 1,
    })
  }

  _onError(err) {
    console.log('error:' + err)
    this.setState({
      videoError: true
    })
  }

  _replay() {
    this.refs.video.seek(0)
  }

  _pause() {
    !this.state.paused && this.setState({ paused: true })
  }

  _resume() {
    this.state.paused && this.setState({ paused: false })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBox} onPress={this._back}>
            <Icon name='ios-arrow-back' style={styles.backIcon}/>
            <Text style={styles.backText}>返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>视频播放</Text>
        </View>
        <View style={styles.videoBox}>
          <Video
            ref='video'
            source={{uri: this.props.data.video}} 
            style={styles.video}
            volume={3}
            paused={this.state.paused}
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
            // 视频出错了
            this.state.videoError && <Text style={styles.errorText}>视频出错了，很抱歉!</Text>
          }
          {
            // 载入
            !this.state.videoReady && <ActivityIndicator color='#ee735c' style={styles.loading} />
          }
          {
            // 重新播放按钮
            this.state.videoReady && this.state.currentTime >= this.state.videoTotal 
            ? <Icon onPress={this._replay} name='ios-play' style={styles.playIcon} size={40}/> : null
          }
          {
            // 暂停播放
            this.state.videoReady && this.state.videoProgress > 0
            ? <TouchableOpacity onPress={this._pause} style={styles.pauseBtn} >
              { this.state.paused 
                ? <Icon onPress={this._resume} name='ios-play' style={styles.playIcon} size={40}/> 
                : <Text></Text>}
              </TouchableOpacity>
            : null
          }
          <View style={styles.progressBox}></View>
            <View style={[ styles.progressBar, { width: width * this.state.videoProgress }]}>
            </View>
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
    top: 160,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc',
  },
  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600',
  },
  playIcon: {
    position: 'absolute',
    top: 140,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66',
  },
  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: 360,
  },
  errorText: {
    position: 'absolute',
    left: 0,
    top: 180,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  backBox: {
    position: 'absolute',
    left: 12,
    top: 32,
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    width: width - 120,
    textAlign: 'center',
  }, 
  backIcon: {
    color: '#999',
    fontSize: 20,
    marginRight: 5,
    marginTop: 2,
  },
  backText: {
    color: '#999',
  }
});

