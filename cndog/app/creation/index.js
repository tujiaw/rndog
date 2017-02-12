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
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Config from '../common/config';

let cacheResults = {
  nextPage: 1,
  total: 0,
  items: [],
};

const width = Dimensions.get('window').width;

export default class List extends Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoading: false,
    };

    this._fetchData = this._fetchData.bind(this);
    this._hasMore = this._hasMore.bind(this);
    this._fetchMoreData = this._fetchMoreData.bind(this);
    this._renderRow = this._renderRow.bind(this);
    this._renderFooter = this._renderFooter.bind(this);
  }

  componentDidMount () {
    this._fetchData(1);
  }

  _fetchData(page) {
    this.setState({
      isLoading: true
    })

    let that = this
    const params = `?page=${page}`
    fetch(Config.api.creation + params)
      .then((response) => response.json())
      .then((responseText) => {
        if (responseText.success) {
          console.log(responseText.data);
          setTimeout(() => {
            var items = cacheResults.items.slice()
            items = items.concat(responseText.data);
            cacheResults.items = items;
            cacheResults.total = responseText.total;
            that.setState({
              dataSource: this.state.dataSource.cloneWithRows(cacheResults.items),
              isLoading: false,
            })
          }, 2000);
          // this.setState({
          //   dataSource: this.state.dataSource.cloneWithRows(cacheResults.items),
          //   isLoading: false,
          // })
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        })
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
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.title}>
            {rowData.title}
          </Text>
          <Image source={{uri: rowData.thumb}} style={styles.thumb}>
           <Icon name='ios-play' size={28} style={styles.play} />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon name='ios-heart-outline' size={28} style={styles.upIcon} />
              <Text style={styles.handleText}>喜欢</Text>
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
          <Text style={styles.loadingText}>不要再扯了，已经没有了</Text>
        </View>
      )
    }
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
    marginBottom: 60,
  },
  loadingText: {
    color: '#777',
    textAlign: 'center',
  }
});

