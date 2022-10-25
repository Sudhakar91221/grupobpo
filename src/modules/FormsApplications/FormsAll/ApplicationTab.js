/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, DeviceEventEmitter} from 'react-native';
import SegmentControl from '../../../components/external/SegmentedControlOval';
import {translate} from '../../../../App';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class CustomApplicationTopTab extends Component {
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
    return (
      <View style={{paddingTop: 10, paddingHorizontal: 15}}>
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
        values={[
          translate('processing'),
          translate('forclaiming'),
          translate('completed'),
        ]}
        outerRadius={5}
        selectedIndex={0}
        onChange={this.onSegmentValueChange}
      />
    );
  }
  onSegmentValueChange = selectedIndex => {
    // this.props.navigationState.routes.map((route, index) => {
    //   this.props.navigation.navigate(route.routeName);
    // });

    switch (selectedIndex) {
      case 0:
        this.props.navigation.navigate('Application');
        break;
      case 1:
        this.props.navigation.navigate('Application');
        break;
      case 2:
        this.props.navigation.navigate('Application');
    }
  };
}

export default withTheme(CustomApplicationTopTab);
