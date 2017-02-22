'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import Config from '../common/config';
import CountDown from '../common/countDown';

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      codeSent: false,
      phoneNumber: '',
      verifyCode: '',
      countingDone: false,
    }

    this._submit = this._submit.bind(this)
    this._sendVerifyCode = this._sendVerifyCode.bind(this)
    this._showVerifyCode = this._showVerifyCode.bind(this)
  }

  componentWillUnmount() {

  }

  _submit() {
    const phoneNumber = this.state.phoneNumber
    const verifyCode = this.state.verifyCode
    if (!phoneNumber || !verifyCode) {
      return AlertIOS.alert('手机号或验证码不能为空！')
    }

    const that = this
    const url = Config.api.verify
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
        verifyCode: verifyCode,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.success) {
          console.log('login ok')
          this.props.afterLogin(json.data)
        } else {
          AlertIOS.alert('登录失败！')
        }
      })
      .catch((err) => {
        console.log(err)
        AlertIOS.alert('登录失败，请检查网络是否良好！')
      })
  }

  _sendVerifyCode() {
    const phoneNumber = this.state.phoneNumber
    if (!phoneNumber) {
      return AlertIOS.alert('手机号输入不正确！')
    }

    const that = this
    const verifyCode = ''
    const url = Config.api.signup
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: phoneNumber,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.success) {
          that._showVerifyCode()
        } else {
          AlertIOS.alert('获取验证码失败，请检查手机号是否正确！')
        }
      })
      .catch((err) => {
        console.log(err)
        AlertIOS.alert('获取验证码失败，请检查网络是否良好！')
      })
  }

  _showVerifyCode() {
    this.setState({
      codeSent: true,
    })
  }

  _countingDone() {
    this.setState({
      countingDone: true,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
        </View>
        <TextInput
          placeholder='输入手机号'
          autoCapitalize={'none'}
          autocorrect={false}
          keyboardType={'number-pad'}
          style={styles.inputField}
          onChangeText={(text) => {
            this.setState({ phoneNumber: text})
          }}
        />
        {
            this.state.codeSent
            ? <View style={styles.verifyCodeBox}>
                <TextInput
                  placeholder='输入验证码'
                  autoCapitalize={'none'}
                  autocorrect={false}
                  keyboardType={'number-pad'}
                  style={[styles.inputField, styles.inputVerifyCode]}
                  onChangeText={(text) => {
                    this.setState({ verifyCode: text})
                  }}
                />
                {
                    this.state.countingDone
                    ? <Button
                      style={styles.countBtn}
                      onPress={this._sendVerifyCode}>
                      获取验证码
                    </Button>
                    : <CountDown
                        onPress={this._sendVerifyCode}
                        text={'剩余秒数'}
                        endText={'重新获取'}
                        time={60}
                      />
                }
              </View>
            : null
        }
        {
          this.state.codeSent
            ? <Button style={styles.btn} onPress={this._submit}>登录</Button>
            : <Button style={styles.btn} onPress={this._sendVerifyCode}>获取验证码</Button>
        }
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  signupBox: {
    marginTop: 30,
  },
  title: {
    color: '#333',
    fontSize: 20,
    textAlign: 'center'
  },
  inputField: {
    height: 40,
    color: '#666',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
  },
  btn: {
    borderWidth: 1,
    borderColor: '#ed7b66',
    borderRadius: 2,
    color: '#ed7b66',
    margin: 10,
    padding: 10,
  },
  verifyCodeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputVerifyCode: {
    flex: 1,
  },
  countBtn: {
    width: 110,
    height: 40,
  }
});

