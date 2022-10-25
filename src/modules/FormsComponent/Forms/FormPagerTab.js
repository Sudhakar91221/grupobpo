/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, DeviceEventEmitter} from 'react-native';
import SegmentControl from '../../../components/external/SegmentedControlOval';
import {translate} from '../../../../App';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ScreenWidth} from '../../../components/utility/Settings';
import ProgressBar from '../../../components/external/ProgressBar';

class CustomFormPagerTopTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      progress: 100 / 7.0,
    };
  }
  startEmit() {
    DeviceEventEmitter.emit('showPlusModel', '123');
  }
  render() {
    return (
      <View style={{paddingVertical: 0}}>
        {/* {this.renderSegmentControl()} */}
        {this.renderProgressBar()}
      </View>
    );
  }

  renderProgressBar() {
    const {theme} = this.props;
    const barWidth = ScreenWidth;

    // if (global.currentBlock === undefined) {
    //   global.currentBlock = 1;
    // }

    // this.state.progress = global.currentBlock * (100 / 7.0);
    return (
      <ProgressBar
        width={barWidth}
        value={this.props.progress}
        backgroundColor={theme.primaryColor}
        backgroundColorOnComplete={theme.primaryColor}
        underlyingColor={'lightgray'}
      />

      // onPress={this.increase.bind(this, 'progress', 20)}
    );
  }
  renderSegmentControl() {
    const {theme} = this.props;
    return (
      <SegmentControl
        activeSegmentStyle={{
          flex: 1,
          zIndex: 1,
          borderRadius: 45,
          position: 'absolute',
          backgroundColor: theme.primaryColor,
        }}
        values={[
          translate('requirement'),
          translate('basic_info'),
          translate('other_info'),
          translate('business_activty'),
          translate('summary'),
          translate('payment_method'),
          translate('success'),
        ]}
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
        this.props.navigation.navigate('InputForm');
        break;
      case 1:
        this.props.navigation.navigate('InputForm');
        break;
      case 2:
        this.props.navigation.navigate('InputForm');
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this.props.navigation.navigate('InputForm');
        break;
    }
  };
}

export default withTheme(CustomFormPagerTopTab);
