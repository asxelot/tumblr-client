/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {
  AppRegistry,
  Component,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  WebView,
} from 'react-native';
import Dimensions from 'Dimensions';

function getJson(url, o = {}) {
  const api = 'https://api.tumblr.com/v2/'
  const api_key = 'vhzAcBnrmwBj8i8vs1ocFs0lcYNvgiIa2Iu76B6lqKAtNn8JYJ';

  o.api_key = api_key;
  const params = o => '?' + Object.keys(o).map(k => `${k}=${o[k]}`).join('&');
  console.log('get', `${api}${url}` + params(o));
  return fetch(`${api}${url}` + params(o)).then(r=>r.json());
}

class tumblrClient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      posts: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      page: 0
    };
    this.dim = Dimensions.get('window');
    this._isLoading = false;
    this._posts = [];
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    if (this._isLoading) return;
    const { page, posts } = this.state;
    const blog = 'deadgirls.tumblr.com';
    this._isLoading = true;

    getJson(`blog/${blog}/posts`, {
      type: 'photo',
      offset: page * 20
    }).then(data => {
      this._isLoading = false;
      this._posts = this._posts.slice().concat(data.response.posts);
      console.log(this._posts);
      this.setState({
        loaded: true,
        posts: posts.cloneWithRows(this._posts),
        page: page + 1
      });
    })
  }

  render() {
    const { loaded, posts } = this.state;

    if (!loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={posts}
        renderRow={this.renderPost.bind(this)}
        scrollRenderAheadDistance={500}
        onEndReached={this.getPosts.bind(this)}
        style={styles.listView}
      />
    )
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading posts...
        </Text>
      </View>
    )
  }

  resize({ width, height }) {
    if (width > this.dim.width) {
      height = height * (this.dim.width / width);
      width = this.dim.width;
    }

    return { width, height };
  }

  renderPost(post, sectionId, rowId) {
    const { photos: [photo] } = post;
    const img = photo.alt_sizes[1];

    const { width, height } = this.resize(img);

    return (
      <View style={styles.container}>
        <Image
          source={{ uri: img.url }}
          width={width}
          height={height}
          style={styles.img} />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  img: {
    marginBottom: 10
  }
});

AppRegistry.registerComponent('tumblrClient', () => tumblrClient);
