import React, {
  Component,
  Image,
  StyleSheet,
  Text,
  View,
  PropTypes,
} from 'react-native'
import Dimensions from 'Dimensions'

import FadeInImage from './fade-in-imageasdf'

export default class Post extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props)

    this._dim = Dimensions.get('window')
  }

  resize({ width, height }) {
    if (width > this._dim.width) {
      height = height * (this._dim.width / width)
      width = this._dim.width
    }

    return { width, height }
  }

  render() {
    const { photos: [photo], blog_name } = this.props.post
    const img = photo.alt_sizes[1]

    Object.assign(img, this.resize(img))

    return (
      <View style={styles.container}>
        <View style={styles.postHeader}>
          <Image
            source={{
              uri: `http://api.tumblr.com/v2/blog/${blog_name}.tumblr.com/avatar/48`
            }}
            style={styles.avatar}
          />
          <Text>{blog_name}</Text>
        </View>
        <FadeInImage {...img} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  postHeader: {
    height: 54,
    alignItems: 'center',
    flexDirection: 'row'
  },
  avatar: {
    marginLeft: 5,
    marginRight: 5,
    width: 48,
    height: 48
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    marginBottom: 10
  },
})
