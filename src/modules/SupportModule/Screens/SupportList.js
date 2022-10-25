/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  View,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, AddButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import {SUPPORT_GET} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  supportListSelector,
} from '../Actions/selectors';
import {getSupports} from '../Actions/SupportActions';
import {PROJECT_KEY} from '../../../network/config';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import SupportListCell from './SupportListCell';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';

class SupportList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      selectedStatusName: 'All',
      selectedStatus: '',
    };
  }

  componentWillMount() {
    this.callGetSupport();
  }

  callGetSupport() {
    var input = {
      userId: this.props.user.userId,
      projectKey: PROJECT_KEY,
      page: this.state.page,
      flag: '0',
      platform: Platform.OS === 'ios' ? 2 : 1,
      email: this.props.user.email,
      status: this.state.selectedStatus,
      request: SUPPORT_GET,
    };
    this.props.getSupports(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == SUPPORT_GET) {
      if (
        this.props.error !== prevProps.error &&
        this.props.error.message !== ''
      ) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],

          {cancelable: false},
        );
      }
    }

    //get supportList
    if (this.props.api === SUPPORT_GET) {
      if (this.props.error !== null && this.props.api === SUPPORT_GET) {
        if (
          this.props.error !== prevProps.error &&
          this.props.error.message !== ''
        ) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === SUPPORT_GET) {
        if (this.props.supportList !== this.state.supportList) {
          this.setState({supportList: this.props.supportList});
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        <View style={{flex: 1}}>
          {this.renderFilterView()}
          <View style={{flex: 1, padding: 10}}>
            {this.state.supportList === undefined ? (
              <ActivityIndicatorCustom />
            ) : this.state.supportList.length === 0 ? (
              this.renderNoRecords()
            ) : (
              <View style={{flex: 1}}>
                <FlatList
                  data={this.state.supportList}
                  renderItem={this.renderSupportItem}
                  numColumns={1}
                  keyExtractor={this._keyExtractor}
                  extraData={this.props}
                  ItemSeparatorComponent={flatListItemSpaceSeparator}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  renderFilterView() {
    const {theme} = this.props;
    return (
      <View style={{padding: 10, height: 80}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1, height: 80, justifyContent: 'center'}}>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  marginBottom: 20,
                }}>
                <Text
                  style={[
                    theme.detail,
                    {color: theme.disableButtonColor, marginLeft: 5},
                  ]}>
                  {translate('displaying')}
                </Text>
                <Text
                  style={[
                    theme.header,
                    {color: theme.primaryColor, fontWeight: 'bold'},
                  ]}>
                  {this.state.selectedStatusName}
                </Text>
                <Text
                  style={[
                    theme.detail,
                    {
                      color: theme.disableButtonColor,
                      textTransform: 'lowercase',
                    },
                  ]}>
                  {' '}
                  {translate('tickets')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
              onPress={() =>
                this.props.navigation.navigate('SupportFilter', {
                  getSelectedValues: this.getSelectedValues.bind(this),
                })
              }>
              <Image
                source={require('../../../assets/filter.png')}
                resizeMode="stretch"
                style={[
                  styless.imageThumbnail,
                  {width: 30, height: 30, marginRight: 10},
                ]}
              />
            </TouchableOpacity>
          </View>
        </CardView>
      </View>
    );
  }

  getSelectedValues(status) {
    var selectedStatusName = this.getStatusName(status);
    if (selectedStatusName === 'All') {
      this.setState(
        {
          selectedStatus: '',
          selectedStatusName: selectedStatusName,
        },
        () => {
          this.callGetSupport();
        },
      );
    } else {
      this.setState(
        {
          selectedStatus: status.toString(),
          selectedStatusName: selectedStatusName,
        },
        () => {
          this.callGetSupport();
        },
      );
    }
  }
  getStatusName(status) {
    let statusName = 'All';
    switch (status[0]) {
      case '1':
        statusName = 'Open';
        break;
      case '2':
        statusName = 'Closed';
        break;
    }

    return statusName;
  }

  renderNoRecords() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
          }}>
          No Records Available
        </Text>
      </View>
    );
  }

  renderSupportItem = ({item}) => {
    return (
      <SupportListCell
        item={item}
        navigation={this.props.navigation}
        editSupportTapped={this.editSupportTapped}
        deleteSupportTapped={this.deleteSupportTapped}
      />
    );
  };
}
const SupportListNew = withTheme(SupportList);
SupportListNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
    headerLeft: (
      <DrawerIcon
        navigation={navigation}
        action={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
    headerRight: (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('SupportAdd')}
        notiaction={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.SupportReducer),
    api: apiSelector(state.SupportReducer),
    error: errorSelector(state.SupportReducer),
    supportList: supportListSelector(state.SupportReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getSupports: input => dispatch(getSupports(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SupportListNew);
