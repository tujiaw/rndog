'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var ImagePicker = require('react-native-image-picker');

const width = Dimensions.get('window').width

export default class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.user || {}
    }
    this._pickPhoto = this._pickPhoto.bind(this)
  }

  componentDidMount() {
    const that = this
    AsyncStorage.getItem('user')
      .then((data) => {
        console.log(data)
        if (data) {
          const user = JSON.parse(data)
          if (user && user.token) {
            that.setState({ user: user })
          }
        }
      })
  }

  _pickPhoto() {
    const that = this

    var options = {
      title: '选择头像',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择相册',
      quality: 0.6,
      allowEditing: true,
      noData: false,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response)
      if (response.didCancel) {
        return
      }

      if (response.error) {
        console.log('ImagePicker Error: ', response.error)
        return
      }

      let source = { uri: response.uri }
      let avatarData = 'data:image/jpeg;base64,' + response.data
      let user = that.state.user
      user.avatar = avatarData
      that.setState({ user: user })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
        </View>
        {
          this.state.user.avatar
            ? <TouchableOpacity onPress={this._pickPhoto}>
                <Image source={{uri: this.state.user.avatar}} style={styles.avatarContainer}>
                  <View style={styles.avatarBox}>
                    <Image source={{uri: this.state.user.avatar}} style={styles.avatar} />
                  </View>
                  <Text style={styles.avatarTip}>点这里换头像</Text>
                </Image>
              </TouchableOpacity>
            : <View style={styles.avatarContainer}>
                <Text style={styles.avatarTip}>添加狗狗头像</Text>
                <TouchableOpacity style={styles.avatarBox}>
                  <Icon name="ios-cloud-upload-outline" style={styles.plusIcon}/>
                </TouchableOpacity>
              </View>

        }
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#ee735c',
    paddingTop: 25,
    paddingBottom: 12,
  },
  toolbarTitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  avatarContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 140,
    backgroundColor: '#666',
  },
  avatarTip: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#fff',
  },
  avatarBox: {
    marginTop: 15,
  },
  plusIcon: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    color: '#999',
    fontSize: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    resizeMode: 'cover',
    marginBottom: 15,
  },
});

