/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, DeviceEventEmitter, Text, TouchableOpacity} from 'react-native';
import SegmentControl from '../Components/SegmentedControlOval';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {isPermissionAllowed} from '../../../network/APICall';

class CustomMemberTopTab extends Component {
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
        <View style={{width: '100%', height: 1.5, backgroundColor: 'gray'}} />
      </View>
    );
  }

  renderSegmentControl() {
    const {theme} = this.props;
    return (
      <SegmentControl
        activeSegmentStyle={{
          flex: 1,
          //zIndex: 1,
          borderRadius: 5,
          //position: 'absolute',
          // backgroundColor: theme.primaryColor,
        }}
        values={[
          'Personal',
          'Address',
          'Job',
          'Salary',
          'Bank',
          'Family',
          'Leave',
          'Engagement Requirements',
        ]}
        outerRadius={5}
        selectedIndex={0}
        onChange={this.onSegmentValueChange}
      />
    );
  }
  onSegmentValueChange = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        this.props.navigation.navigate('Personal');
        break;
      case 1:
        this.props.navigation.navigate('Address');
        break;
      case 2:
        this.props.navigation.navigate('Job');
        break;
      case 3:
        this.props.navigation.navigate('Salary');
        break;
      case 4:
        this.props.navigation.navigate('Bank');
        break;
      case 5:
        this.props.navigation.navigate('Family');
        break;
      case 6:
        this.props.navigation.navigate('Leave');
        break;
      case 7:
        this.props.navigation.navigate('Documents');
        break;
    }
  };
}

export default withTheme(CustomMemberTopTab);
