/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import CustomMultiPicker from '../../../components/external/CustomMultiPicker/index';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';

const status = {
  '0': 'All',
  '1': 'Open',
  '2': 'Closed',
};

class SupportFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStatus: 0,
    };
    this.onApplyButtonTapped = this.onApplyButtonTapped.bind(this);
    this.onClearButtonTapped = this.onClearButtonTapped.bind(this);
  }

  render() {
    const {theme} = this.props;

    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <Text
              style={[
                theme.header,
                {
                  color: theme.primaryColor,
                  fontWeight: 'bold',
                  paddingTop: 20,
                  paddingLeft: 20,
                },
              ]}
              numberOfLines={1}>
              Status
            </Text>
            <View style={{marginLeft: 20}}>
              <CustomMultiPicker
                options={status}
                search={false} // should show search bar?
                multiple={false} //
                placeholder={'Search'}
                placeholderTextColor={'#757575'}
                returnValue={'value'} // label or value
                callback={res => {
                  console.log(res);
                }} // callback, array of selected items
                rowBackgroundColor={'white'}
                rowHeight={40}
                rowRadius={5}
                iconColor={'#2E324C'}
                iconSize={30}
                selectedIconName={'ios-radio-button-on'}
                unselectedIconName={'ios-radio-button-off'}
                scrollViewHeight={200}
                // selected={
                //   this.state.selectedStatus ? this.state.selectedStatus : ['1']
                // } // list of options which are selected by default
                selected={this.state.selectedStatus}
                onSelectionChange={this.onSelectionChange}
                labelStyle={styless.headerSmall}
              />
            </View>
          </View>

          {this.renderButtons()}
        </View>
      </ScrollView>
    );
  }

  onSelectionChange = status => {
    this.setState({selectedStatus: status});
  };

  renderButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          position: 'absolute',
          bottom: 0,
        }}>
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('apply')}
          action={() => this.onApplyButtonTapped()}
        />
        <BottomButton
          style={{flex: 1, borderRadius: 50, margin: 10}}
          title={translate('clear')}
          action={() => this.onClearButtonTapped()}
        />
      </View>
    );
  }

  onApplyButtonTapped() {
    this.props.navigation.state.params.getSelectedValues(
      this.state.selectedStatus,
    );
    this.props.navigation.goBack();
  }

  onClearButtonTapped() {
    this.props.navigation.state.params.getSelectedValues(
      this.state.selectedStatus,
    );
    this.props.navigation.goBack();
  }
}
const SupportFilterNew = withTheme(SupportFilter);
SupportFilterNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
  };
};

export default SupportFilterNew;
