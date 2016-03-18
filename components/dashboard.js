import React, {
  Component,
  ListView,
  StyleSheet,
  Text,
  View,
  RecyclerViewBackedScrollView
} from 'react-native'

const OAuth = require('oauth-1.0a')
import _ from 'lodash'

import Post from './post'

const stringifyParams = o => `?${Object.keys(o).map(k => `${k}=${o[k]}`).join('&')}`

function getJson(url, params = {}) {
  const api = 'https://api.tumblr.com/v2/'
  params.api_key = 'vhzAcBnrmwBj8i8vs1ocFs0lcYNvgiIa2Iu76B6lqKAtNn8JYJ'

  return fetch(`${api}${url}${stringifyParams(params)}`).then(r => r.json())
}

export default class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      page: 0
    }

    this._isLoading = false
    this._posts = []
  }

  componentDidMount() {
    this.getPosts()

    // const oauth = OAuth({
    //   consumer: {
    //     public: 'vhzAcBnrmwBj8i8vs1ocFs0lcYNvgiIa2Iu76B6lqKAtNn8JYJ',
    //     secret: 'OkYBVtJegJyx9iM77sk9bLeURoRXglEzcWHcGVmSEPblHmvfhC'
    //   },
    //   signature_method: 'HMAC-SHA1'
    // })
    //
    // const request_data = {
    //   url: 'https://www.tumblr.com/oauth/request_token',
    //   method: 'POST',
    //   data: {
    //     oauth_callback: 'http://www.ddo.me'
    //   }
    // }
    //
    // const token = {
    //   public: 'YzLAgOC9Aii4wEN8COTEd5p0G8xLrnOx814Uar6zVJedlu3Qfb',
    //   secret: 'yvjAIYV3AD8mJAI23aQlSIlDpwsMNC11zdbT8ewmjZiUFgJsWz'
    // }
    //
    // fetch(request_data.url, {
    //   method: request_data.method,
    //   headers: oauth.toHeader(oauth.authorize(request_data, token))
    // }).then(res => console.log(res))
  }

  getPosts() {
    if (this._isLoading) return

    const { page, dataSource } = this.state
    const blog = 'artforadults.tumblr.com'
    this._isLoading = true

    getJson(`blog/${blog}/posts`, {
      type: 'photo',
      offset: page * 20
    }).then(data => {
      this._isLoading = false
      this._posts = _.uniqBy(this._posts.slice().concat(data.response.posts), 'id')

      console.log(data.response.posts)

      this.setState({
        loaded: true,
        dataSource: dataSource.cloneWithRows(this._posts),
        page: page + 1
      })
    })
  }

  render() {
    const { loaded, dataSource } = this.state

    if (!loaded) {
      return this.loading()
    }

    return (
      <ListView
        dataSource={dataSource}
        renderRow={post => <Post post={post} />}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderFooter={this.footer}
        onEndReached={this.getPosts.bind(this)}
        onEndReachedThreshold={1000}
        scrollRenderAheadDistance={1000}
        pageSize={20}
        style={styles.listView}
      />
    )
  }

  loading() {
    return (
      <View style={styles.container}>
        <Text>
          Loading posts...
        </Text>
      </View>
    )
  }

  footer() {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>Loading...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postHeader: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center'
  },
  year: {
    textAlign: 'center'
  },
  listView: {
    backgroundColor: '#36465d'
  },
  footer: {
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 40,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#2f3c50'
  },
  footerText: {
    fontSize: 28,
    color: '#fff'
  }
})
