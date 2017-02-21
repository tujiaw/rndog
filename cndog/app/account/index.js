'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  AsyncStorage,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';

var ImagePicker = require('react-native-image-picker');

const width = Dimensions.get('window').width

export default class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: this.props.user || {},
      modalVisible: false,
    }
    this._pickPhoto = this._pickPhoto.bind(this)
    this._userInfoChanged = this._userInfoChanged.bind(this)
    this._saveInfo = this._saveInfo.bind(this)
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

  _userInfoChanged(type, text) {
    let user = this.state.user
    user[type] = text
    this.setState({
      user: user
    })
  }

  _saveInfo() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>狗狗的账户</Text>
          <Text style={styles.toolbarEdit} onPress={() => this.setState({modalVisible: true})}>编辑</Text>
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
        <Modal
          animationType={'fade'}
          visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <Icon style={styles.closeIcon} name='ios-close-outline' onPress={() => this.setState({modalVisible: false})}/>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                style={styles.inputField}
                placeholder={'输入狗狗的昵称'}
                autoCapitalize={'none'}
                autocorrect={false}
                defaultValue={this.state.user.nickname}
                onChangeText={(text) => { this._userInfoChanged('nickname', text) }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>品种</Text>
              <TextInput
                style={styles.inputField}
                placeholder={'狗狗的品种'}
                autoCapitalize={'none'}
                autocorrect={false}
                defaultValue={this.state.user.breed}
                onChangeText={(text) => { this._userInfoChanged('breed', text) }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput
                style={styles.inputField}
                placeholder={'狗狗的年龄'}
                autoCapitalize={'none'}
                autocorrect={false}
                defaultValue={this.state.user.age}
                onChangeText={(text) => { this._userInfoChanged('age', text) }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <Icon.Button
                onPress={() => {
                  this._userInfoChanged('gender', 'male')
                }}
                style={[
                  styles.gender,
                  this.state.user.gender === 'male' && styles.genderChecked
                ]}
                name="ios-paw-outline">
                男
              </Icon.Button>
              <View style={styles.genderSpace}></View>
              <Icon.Button
                onPress={() => {
                  this._userInfoChanged('gender', 'female')
                }}
                style={[
                  styles.gender,
                  this.state.user.gender === 'female' && styles.genderChecked
                ]}
                name="ios-paw-outline">
                女
              </Icon.Button>
            </View>
            <Button style={styles.btn} onPress={this._saveInfo}>保存</Button>
          </View>
        </Modal>
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
  toolbarEdit: {
    color: '#fff',
    position: 'absolute',
    right: 10,
    top: 25,
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
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  closeIcon: {
    alignSelf: 'center',
    fontSize: 35,
    color: '#f00',
  },
  fieldItem: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  label: {
    paddingHorizontal: 10,
    color: '#ccc',
  },
  inputField: {
    flex: 1,
    color: '#666',
    fontSize: 14,
  },
  gender: {
    backgroundColor: '#ccc',
  },
  genderChecked: {
    backgroundColor: '#ee735c',
  },
  genderSpace: {
    width: 10,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#ed7b66',
    borderRadius: 2,
    color: '#ed7b66',
    margin: 20,
    padding: 10,
  },
});

