import React, {
  Component,
  PropTypes,
  Animated
} from 'react-native'

export default class FadeInImage extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props)

    this.state = {
      fadeAnim: new Animated.Value(0)
    }
  }

  fadeIn() {
    Animated.timing(this.state.fadeAnim, { toValue: 1 }).start()
  }

  render() {
    const { url, width, height } = this.props

    return (
      <Animated.Image
        source={{ uri: url }}
        style={{
          opacity: this.state.fadeAnim,
          backgroundColor: '#ccc',
          width,
          height
        }}
        onLoad={this.fadeIn.bind(this)}
      />
    )
  }
}
