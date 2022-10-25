/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  FlatList,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerActions} from 'react-navigation-drawer';
import {isPermissionAllowed} from '../../../network/APICall';
import {
  DrawerIcon,
  AddButton,
  NotificationButton,
} from '../../../components/views/NavBar';
import {userLoginSelector} from '../../FormsComponent/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getUserSelector,
} from '../Actions/selector';
import {connect} from 'react-redux';
import {getUsers} from '../Actions/MemberActions';
import {GET_USERS} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {
  flatListItemSeparator,
  flatListItemSpaceSeparator,
  NoRecordAvailableView,
} from '../../../components/utility/common';
import MemberCell from './MemberCell';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import CardView from 'react-native-cardview';
import {API_FAILURE} from '../../AuthModule/Actions/type';
import BaseClass from '../../Base/BaseClass';
import SearchComponent from '../../../components/views/SearchComponent';

class MemberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      isSpinner: true,
      selectedTypeName: 'All',
      selectedType: '1,2,3,4',
      arrayholder: [],
      searchText: '',
    };
  

  }

  componentWillMount() {
    this.callGetUsers();
  }
  refreshData = () => {
    this.fetchData()
  }
  componentDidMount() {

    this.props.navigation.setParams({
      refreshData : this.refreshData,
    });

    this.fetchData();

    const {navigation} = this.props;
    navigation.addListener('willFocus', () => {
          // Alert.alert('Refreshed');
          this.fetchData();
     }
   );
  }
  callGetUsers(text) {
    var input = {
      page: this.state.page.toString(),
      employeeId: '',
      search: text ? text : '',
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      employeeType: this.state.selectedType,
      request: GET_USERS,
    };
    this.props.getUsers(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      this.props.api === API_FAILURE &&
      this.props.error.code == '-1'
    ) {
      this.setState({refreshing: false});
      this.hideSpinner();
    }
    if (this.props.error && this.props.error.request == GET_USERS) {
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
        this.hideSpinner();
    }

    //get users
    if (this.props.api === GET_USERS) {
      if (this.props.error !== null && this.props.api === GET_USERS) {
        if (this.props.error !== prevProps.error) {
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
        this.hideSpinner();
      }

      if (!this.props.error && this.props.api === GET_USERS) {
        if (this.props.users !== prevProps.users) {
          this.setState({
            memberList: this.props.users, 
            refreshing: false,
            arrayholder: this.props.users,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {

    
    return (
      <BaseClass title={translate('Members')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
         <SearchComponent
            onChangeText={text => this.SearchFilterFunction(text)}
        />
        {this.state.memberList !== undefined &&

          this.renderFilterView()
         }
         <View style={{flex:1}}>
          
       
          {this.renderMemberList()}
          </View>
      </BaseClass>
    );

  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({memberList: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.callGetUsers(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          memberList: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }
  renderMemberList() {
    if (
      this.state.memberList !== undefined &&
      this.state.memberList.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    
    if (this.state.memberList !== undefined) {
      return (
      
          
        <View style={{flex: 1, padding: 2}}>
          <FlatList
            data={this.state.memberList}
            renderItem={this.renderItem}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={this.loadMore.bind(this)}
            onMomentumScrollBegin={() => {
              this.onEndReachedCalledDuringMomentum = false;
            }}
            onEndReachedThreshold={0.5}
            onRefresh={this.onRefresh.bind(this)}
            extraData={this.props}
            refreshing={
              this.state.refreshing !== undefined
                ? this.state.refreshing
                : false
            }
            ItemSeparatorComponent={flatListItemSpaceSeparator}
            onEndReachedThreshold={0.4}
            ListFooterComponent={this.renderFooter.bind(this)}
          />
        </View>
      );
    }
  }

  renderFilterView() {
    const {theme} = this.props;
    return (
      <View style={{padding: 10, height: 80}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor: 'white',
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  padding: 5,
                  flexDirection: 'row',
                  marginTop: 10,
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
                  {this.state.selectedTypeName}
                </Text>
                <Text
                  style={[
                    theme.detail,
                    {
                      color: theme.disableButtonColor,
                      textTransform: 'lowercase',
                    },
                  ]}>
                  {translate('members')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
              }}
              onPress={() =>
                this.props.navigation.navigate('MemberFilter', {
                  getSelectedValues: this.getSelectedValues.bind(this),
                })
              }>
              <Image
                source={require('../../../assets/filter.png')}
                resizeMode="stretch"
                style={[
                  styless.imageThumbnail,
                  {width: 30, height: 30, marginRight: 10, marginTop: 15},
                ]}
              />
            </TouchableOpacity>
          </View>
        </CardView>
      </View>
    );
  }

  renderItem = ({item}) => {
    return <MemberCell item={item} navigation={this.props.navigation} />;
  };

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

  getSelectedValues(status, type) {
    var selectedTypeName = this.getTypeName(status);
    this.setState(
      {
        selectedStatus: status.length === 1 ? '1,2,3,4' : status.toString(),
        selectedStatusName: status.length === 1 ? 'All' : selectedTypeName,
      },
      () => {
        this.callGetUsers();
      },
    );
  }

  getTypeName(status) {
    let statusName = 'All';
    status.map(item => {
      if (item === '1') {
        statusName = 'Admin,';
      } else if (item === '2') {
        statusName = statusName + 'HR,';
      } else if (item === '3') {
        statusName = statusName + 'Supervisor,';
      } else if (item === '4') {
        statusName = statusName + 'Employee';
      }
    });

    return statusName;
  }
  //MARK : - Event Handlers
  showSpinner() {
    this.setState({isSpinner: true});
  }

  hideSpinner() {
    if (this.state.isSpinner == true) {
      this.setState({isSpinner: false});
    }
  }
  fetchData() {
    //this.checkNetworkStatus()

    if (this.state.page == 1 && this.state.refreshing === false) {
      this.showSpinner();
    }
    // if (this.state.page !== this.state.lastPage) {

    this.callGetUsers();
    // }
  }
  onRefresh = () => {
    this.setState(
      {
        dataSource: [],
        isLoading: false,
        refreshing: true,
        seed: 1,
        page: 0,
      },
      () => this.callGetUsers(),
    );
  };

  loadMore = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      this.setState(
        {
          lastPage: this.state.page,
          isLoading: false,
          page: this.state.page + 1,
          refreshing: true,
        },
        () => {
          this.callGetUsers(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
  renderFooter = () => {
    const {theme} = this.props;
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (this.props.isLoading && this.state.page !== 1) {
      return (
        <ActivityIndicatorCustom
          isSpinner={true}
        />
      );
    } else {
      return null;
    }
  };
}
const MemberScreenNew = withTheme(MemberScreen);
MemberScreenNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    headerRight: isPermissionAllowed('Employee/add') ? (
      <AddButton
        navigation={navigation}
        action={() => navigation.navigate('AddMember')}
        notiaction={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ) : (
      <NotificationButton
        navigation={navigation}
        action={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.MemberReducer),
    api: apiSelector(state.MemberReducer),
    error: errorSelector(state.MemberReducer),
    users: getUserSelector(state.MemberReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getUsers: input => dispatch(getUsers(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MemberScreenNew);
