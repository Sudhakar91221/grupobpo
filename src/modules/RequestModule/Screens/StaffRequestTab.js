/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, DeviceEventEmitter} from 'react-native';
import SegmentControl from '../../../components/external/SegmentedControlOval';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class CustomTopTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selectedIndex: 0,
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
        values={['Incoming', 'Outgoing']}
        outerRadius={5}
        selectedIndex={this.state.selectedIndex}
        onChange={this.onSegmentValueChange}
      />
    );
  }
  onSegmentValueChange = selectedIndex => {
    this.setState({
      ...this.state,
      selectedIndex: selectedIndex,
    });
    switch (selectedIndex) {
      case 0:
        this.props.navigation.navigate('Incoming');
        break;
      case 1:
        this.props.navigation.navigate('Outgoing');
        break;
    }
  };
}

export default withTheme(CustomTopTab);
