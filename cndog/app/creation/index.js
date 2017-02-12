'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Config from '../common/config';
import Detail from './detail'

let cacheResults = {
  nextPage: 1,
  total: 0,
  items: [],
};

const width = Dimensions.get('window').width
const token = 'hello'

class RowItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      love: this.props.rowData.love
    }
    this._onLove = this._onLove.bind(this)
  }

  _onLove() {
    const that = this
    const newLove = !this.state.love
    const url = Config.api.love
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: this.props.rowData._id,
        token: token,
        love: newLove ? 'yes' : 'no'
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.success) {
        that.setState({ love: newLove })
      } else {
        AlertIOS.alert('点赞失败，稍后重试')
      }
    })
    .catch((err) => {
      console.log(err)
      AlertIOS.alert('点赞失败，稍后重试')
    })
  }

  render() {
    const rowData = this.props.rowData
    return (
      <TouchableHighlight onPress={this.props.onSelect} >
        <View style={styles.item}>
          <Text style={styles.title}>
            {rowData.title}
          </Text>
          <Image source={{uri: rowData.thumb}} style={styles.thumb}>
          <Icon name='ios-play' size={28} style={styles.play} />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon 
                name={this.state.love ? 'ios-heart' : 'ios-heart-outline'} 
                size={28} 
                style={[styles.upIcon, this.state.love ? styles.downIcon : null]}
                onPress={this._onLove} 
              />
              <Text style={styles.handleText} onPress={this._onLove}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon name='ios-chatboxes-outline' size={28} style={styles.commentIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

export default class List extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoading: false,
      isRefreshing: false,
    };

    this._fetchData = this._fetchData.bind(this);
    this._hasMore = this._hasMore.bind(this);
    this._fetchMoreData = this._fetchMoreData.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this._loadDetail = this._loadDetail.bind(this);
  }

  componentDidMount () {
    this._fetchData(1);
  }

  _fetchData(page) {
    this.setState(page === 0 ? { isRefreshing: true } : { isLoading: true })
    const url = `${Config.api.creation}?token=${token}&page=${page}`
    console.log('fetch list:' + url)
    fetch(url)
    .then((response) => response.json())
    .then((responseText) => {
      if (responseText.success) {
        let items = cacheResults.items.slice()
        let nextPage = cacheResults.nextPage
        if (page === 0) {
          items = responseText.data.concat(items)
        } else {
          items = items.concat(responseText.data)
          nextPage += 1
        }
        cacheResults.items = items
        cacheResults.total = responseText.total
        cacheResults.nextPage = nextPage
        console.log(cacheResults.items)
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(cacheResults.items) })
        this.setState(page === 0 ? { isRefreshing: false } : { isLoading: false })
      }
    })
    .catch((error) => {
      this.setState(page === 0 ? { isRefreshing: false } : { isLoading: false })
      console.warn(error)
    })
  }

  _hasMore() {
    return cacheResults.items.length < cacheResults.total;
  }

  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoading) {
      return
    }
    this._fetchData(cacheResults.nextPage)
  }

  _renderRow(rowData) {
    return (
      <RowItem 
        id={rowData._id} 
        onSelect={() => this._loadDetail(rowData)} 
        rowData={rowData} 
      />
    )
  }

  _renderFooter() {
    if (this._hasMore()) {
      return (
        <ActivityIndicator
          style={styles.loadingMore}
        />
      )
    } else if (cacheResults.items.length > 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>不要再扯了，已经到底了</Text>
        </View>
      )
    }
  }

  _onRefresh() {
    if (this.state.isRefreshing || !this._hasMore()) {
      return
    }
    this._fetchData(0)
  }

  _loadDetail(rowData) {
    this.props.navigator.push({
      name: 'detail',
      component: Detail,
      params: {
        data: rowData
      }
    })
  }

  render() { 
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff6600"
              title="拼命加载中..."
            />
          }
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333',
  },
  thumb: {
    width: width,
    height: width * 0.56,
    resizeMode: 'cover',
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
  },
  handleBox: {
    flexDirection: 'row',
    padding: 10,
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  upIcon: {
    fontSize: 22,
    color: '#333',
  },
  downIcon: {
    fontSize: 22,
    color: '#ed7b66',
  },
  commentIcon: {
    fontSize: 22,
    color: '#333',
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333',
  },
  loadingMore: {
    marginBottom: 30,
  },
  loadingText: {
    color: '#777',
    textAlign: 'center',
  }
});

