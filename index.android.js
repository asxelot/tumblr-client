import React, {
  AppRegistry,
  Component,
  Navigator
} from 'react-native'

import Dashboard from './components/dashboard'

class tumblrClient extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{ name: 'Dashboard', index: 0 }}
        renderScene={(route, navigator) => <Dashboard />}
      />
    )
  }
}

AppRegistry.registerComponent('tumblrClient', () => tumblrClient)
