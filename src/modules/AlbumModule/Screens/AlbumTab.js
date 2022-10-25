/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, DeviceEventEmitter} from 'react-native';
import SegmentControl from '../../../components/external/SegmentedControlOval';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class CustomAlbumTopTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }
  startEmit() {
    DeviceEventEmitter.emit('showPlusModel', '123');
  }
  render() {
    const {theme} = this.props;

    return (
      <View style={{paddingLeft: 5, paddingRight: 5, marginTop: 5}}>
        {this.renderSegmentControl()}
      </View>
    );
  }

  renderSegmentControl() {
    const {theme} = this.props;
    return (
      <SegmentControl
        activeSegmentStyle={{
          flex: 1,
          zIndex: 1,
          borderRadius: 5,
          position: 'absolute',
          backgroundColor: theme.primaryColor,
        }}
        values={['Grid', 'List']}
        outerRadius={5}
        selectedIndex={0}
        onChange={this.onSegmentValueChange}
      />
    );
  }
  onSegmentValueChange = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        this.props.navigation.navigate('Grid');
        break;
      case 1:
        this.props.navigation.navigate('List');
        break;
    }
  };
}

export default withTheme(CustomAlbumTopTab);
