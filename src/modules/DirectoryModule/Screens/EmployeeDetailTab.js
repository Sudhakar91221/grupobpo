/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  DeviceEventEmitter,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SegmentControl from '../../../components/external/SegmentedControlOval';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {isPermissionAllowed} from '../../../network/APICall';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import {USER_IMAGE_DOWNLOAD_URL, API_KEY} from '../../../network/config';
import AsyncImage from '../../../components/views/AsyncImage';

class EmployeeDetailTopTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.onSegmentValueChange = this.onSegmentValueChange.bind(this);
  }
  startEmit() {
    DeviceEventEmitter.emit('showPlusModel', '123');
  }
  render() {
    return (
      <View style={{paddingLeft: 5, paddingRight: 5, marginTop: 5}}>
        {this.renderEmployeeDetail()}
        {this.renderSegmentControl()}
      </View>
    );
  }

  renderEmployeeDetail() {
    const {theme} = this.props;
    let item = this.props.navigation.state.params.item;
    let height = 80;
    let uri = `${this.props.photo}`;
    return (
      <View
        style={{
          height: 200,
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', flex: 0.3}}>
          {this.props.photo !== undefined && this.props.photo !== null ? (
            <AsyncImage
              source={{
                uri: uri,
                // method: 'GET',
                // headers: {
                //   'x-api-key': API_KEY,
                //   'Content-Type': 'multipart/form-data',
                // },
              }}
              resizeMode="contain"
              style={[
                styless.imageThumbnail,
                {width: 120, height: 120, borderRadius: 20},
              ]}
              borderRadius={20}
              placeholderColor="gray"
            />
          ) : (
            <AsyncImage
              source={require('../../../assets/ic_profile.png')}
              resizeMode="contain"
              style={[styless.imageThumbnail, {width: 120, height: 120}]}
            />
          )}
        </View>
        <View style={{flex: 1, marginTop: 100}}>
          <Text
            style={[
              theme.header,
              {
                textAlign: 'center',
                color: theme.primaryColor,
              },
            ]}
            numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                textAlign: 'center',
                color: theme.disableButtonColor,
                fontSize: 16,
              },
            ]}
            numberOfLines={1}>
            {item.designation === '' ? 'Not Available' : item.designation}
          </Text>
        </View>
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
        values={['About', 'Timesheets']}
        outerRadius={5}
        selectedIndex={0}
        onChange={this.onSegmentValueChange}
      />
    );
  }

  onSegmentValueChange = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        this.props.navigation.navigate('About', {
          item: this.props.navigation.state.params.item,
        });
        break;
      case 1:
        this.props.navigation.navigate('Timesheets', {
          item: this.props.navigation.state.params.item,
        });
        break;
    }
  };
}

export default withTheme(EmployeeDetailTopTab);
