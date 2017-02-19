'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
  Navigator,
  AsyncStorage,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import List from './app/creation/index'
import Account from './app/account/index'
import Login from './app/account/login'
import Edit from './app/edit/index'

var TabBarExample = React.createClass({
  statics: {
    title: '<TabBarIOS>',
    description: 'Tab-based navigation.',
  },

  displayName: 'TabBarExample',

  getInitialState: function() {
    return {
      selectedTab: 'list',
      logined: false,
    };
  },

  componentDidMount: function() {
    this._asyncAppStatus()
  },

  _asyncAppStatus: function() {
    AsyncStorage.getItem('user')
      .then((data) => {
        if (data) {
          const user = JSON.parse(data)
          if (user && user.token) {
            this.setState({
              user: user,
              logined: true,
            })
          } else {
            this.setState({
              logined: false,
            })
          }
        }
      })
  },

  _renderContent: function(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  },

  _afterLogin: function(user) {
    const that = this
    user = JSON.stringify(user)
    AsyncStorage.setItem('user', user)
      .then(() => {
        that.setState({
          logined: true,
          user: user
        })
      })
  },

  render: function() {
    if (!this.state.logined) {
      return <Login afterLogin={this._afterLogin}/>
    }

    return (
      <TabBarIOS
        tintColor="#ee735c">
        <Icon.TabBarItem
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <Navigator
            initialRoute={{
              name: 'list',
              component: List
            }}
            configureScene={(route) => {
              return Navigator.SceneConfigs.FloatFromRight
            }}
            renderScene={(route, navigator) => {
              var Component = route.component
              return <Component {...route.params} navigator={navigator} />
            }}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
            });
          }}>
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'account',
            });
          }}>
          <Account />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  },
});

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
  },
});

AppRegistry.registerComponent('cndog', () => TabBarExample);
