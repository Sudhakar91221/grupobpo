/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import {
  ScrollView,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { withTheme } from '../../../components/common/Theme/themeProvider';
import LinearGradient from 'react-native-linear-gradient';
import {
  CollapseBody,
  CollapseHeader,
  Collapse,
} from '../../../components/external/CollapsibleView';
import { ModuleList, members, myAccount } from './ModuleLIst';
import Icons from '../../../components/common/Icons';
import { styless } from '../../../components/common/Styles';
import { connect } from 'react-redux';
import AsyncImage from '../../../components/views/AsyncImage';
import { USER_IMAGE_DOWNLOAD_URL, API_KEY } from '../../../network/config';
import { DrawerIcon } from '../../../components/views/NavBar';
import {
  permissionListSelector,
  errorSelector,
  apiSelector,
} from '../../FormsComponent/Actions/selectors';
import Divider from '../../../components/views/Divider';
import { userLogoutSelector } from '../../FormsComponent/Actions/selectors';
import { USER_LOGOUT } from '../../FormsComponent/Actions/type';
import { logoutUser } from '../../FormsComponent/Actions/FormActions';
import SyncStorage from 'sync-storage';

var menuItems = [],
  memberItems = [],
  myItems = [],
  itemName = 'My Dashboard';

class DrawerScreen extends Component {
  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      updateLogin: false,
    };
    // global.theme = props.theme

    this.logout = this.logout.bind(this);
    this.canceledLogout = this.canceledLogout.bind(this);
    this.renderExpandable = this.renderExpandable.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  async componentDidMount() {

    this.state.permissions = await SyncStorage.get('permissions');

    this.getMenuItems(this.state.permissions);
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    const isDrawerOpen = this.props.navigation.state.isDrawerOpen;

    if (this.props.activeItemKey === 'Dashboard' && isDrawerOpen === false) {
      Alert.alert(
        'Exit App',
        'Do you really want to exit app ?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => BackHandler.exitApp(),
          },
        ],
        {
          cancelable: false,
        },
      );
      return true;
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == USER_LOGOUT) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                this.props.navigation.navigate('LoginStack');
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
    //logout user
    if (this.props.api === USER_LOGOUT) {
      if (this.props.error !== null && this.props.api === USER_LOGOUT) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('LoginStack');
                  }
                },
              },
            ],
            { cancelable: false },
          );
        }
      }

      if (!this.props.error && this.props.api === USER_LOGOUT) {
        if (this.props.isUserLogout !== this.state.isUserLogout) {
          this.setState({ isUserLogout: this.props.isUserLogout });
          SyncStorage.set('isFromLogout', true.toString());
          SyncStorage.remove('user');
          SyncStorage.remove('permissions');
          menuItems = [];
          myItems = [];
          memberItems = [];
          global.user = undefined;
          this.props.navigation.navigate('AuthStack');

          global.isLoggedIn = false;

          this.reset();

          this.setState({ updateLogin: true });
          //this.navigateToScreen('Login');

          // //this.navigateToScreen('LoginStack')
          // this.props.navigation.dispatch(DrawerActions.closeDrawer());

          // this.setState({updateLogin: true});
          // this.props.navigation.navigate('AuthStack');
        }
      }
    }
  }

  navigateToScreen = (route, theme) => () => {
    if (route === 'Logout') {
      this.logoutAlert();
    } else {
      const navigateAction = NavigationActions.navigate({
        routeName: route,
      });
      this.props.navigation.dispatch(DrawerActions.closeDrawer());
      this.props.navigation.dispatch(navigateAction);
    }
  };

  renderExpandable(item) {
    const { theme } = this.props;

    return <View style={styless.menuItem} />;
  }

  getMenuItems(permissions) {
    if (menuItems.length === 0) {
      //dashboard
      menuItems.push({ name: 'My Dashboard', routeName: 'Dashboard' });
      //company calender
      if (permissions.includes('Event')) {
        menuItems.push({ name: 'Company Calendar', routeName: 'CalendarScreen' });
      }

      //MEMBER MENU LOGIC
      //add submenu to member menu
      if (permissions.includes('Staff')) {
        memberItems.push({ name: 'Management', routeName: 'MemberScreen' });
      }
      if (permissions.includes('Staffleave')) {
        memberItems.push({ name: 'Leaves', routeName: 'StaffLeaves' });
      }
      if (permissions.includes('StaffTimesheets')) {
        memberItems.push({ name: 'Timesheets', routeName: 'StaffTimesheetList' });
      }
      if (permissions.includes('StaffRequests')) {
        memberItems.push({ name: 'Requests', routeName: 'StaffRequests' });
      }
      if (permissions.includes('OccuranceReport/getStaffOccurance')) {
        memberItems.push({ name: 'Occurrences', routeName: 'StaffOccurrences' });
      }
      if (permissions.includes('Salary/getStaffSalaries')) {
        memberItems.push({ name: 'Payslips', routeName: 'StaffPayslips' });
      }
      //check member permissions array , if present then only add members menu
      if (memberItems.length > 0) {
        menuItems.push({ name: 'Members' });
      }

      //MY ACCOUNT MENU LOGIC
      //add submenu to my account menu
      if (permissions.includes('Leave')) {
        myItems.push({ name: 'Leaves', routeName: 'MyLeaves' });
      }
      if (permissions.includes('Timesheet/get')) {
        myItems.push({ name: 'Timesheets', routeName: 'MyTimesheetList' });
      }
      if (permissions.includes('Requests')) {
        myItems.push({ name: 'Requests', routeName: 'MyRequests' });
      }
      if (permissions.includes('OccuranceReport')) {
        myItems.push({ name: 'Occurrences', routeName: 'Occurrences' });
      }
      if (permissions.includes('Salary/getMySalaries')) {
        myItems.push({ name: 'Payslips', routeName: 'MyPayslips' });
      }
      //check my account permissions array , if present then only add my account menu
      if (myItems.length > 0) {
        menuItems.push({ name: 'My Account' });
      }

      //directory
      if (permissions.includes('Directory')) {
        menuItems.push({ name: 'Directory', routeName: 'Directory' });
      }
      //announcement
      if (permissions.includes('Announcement')) {
        menuItems.push({ name: 'Announcements', routeName: 'Announcement' });
      }
      //holiday
      if (permissions.includes('Holiday')) {
        menuItems.push({ name: 'Holidays', routeName: 'Holidays' });
      }
      //album
      if (permissions.includes('Album')) {
        menuItems.push({ name: 'Albums', routeName: 'Album' });
      }
      //support
      if (permissions.includes('Feedback')) {
        menuItems.push({ name: 'Support', routeName: 'SupportList' });
      }
      //settings and logout
      menuItems.push({ name: 'Settings', routeName: 'SettingsScreen' });
      menuItems.push({ name: 'Logout', routeName: 'Logout' });

      console.log('menu size => ' + menuItems.length);
    }
  }

  renderMenu(item, pushTo) {
    const { theme } = this.props;

    if (item.name == 'Members' || item.name == 'My Account') {
      let submenu = myItems;
      if (item.name == 'Members') {
        submenu = memberItems;
      } else {
        submenu = myItems;
      }

      return (
        <Collapse
          style={{ flex: 1, height: '100%' }}
          onToggle={isCollapsed => this.setState({ collapsed: isCollapsed })}>
          <CollapseHeader style={{ height: 60 }}>



            <View style={{ flex: 1, height: '100%' }}>
              <View style={[styless.leftRight]}>
                {item.name == 'Members' ? (
                  <Image
                    source={require('../../../assets/members.png')}
                    tintColor={'white'}
                    style={{
                      width: 25,
                      height: 30,
                      marginRight: 10,
                      padding: 15,
                      tintColor: 'white',
                      alignSelf: 'center'

                    }}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/user.png')}
                    style={{
                      width: 25, height: 30, marginRight: 10, padding: 15, alignSelf: 'center'
                    }}
                  />
                )}

                <Text
                  style={{
                    color: theme.menuColor,
                    fontSize: 18,
                    fontWeight: '600',
                    height: 30,
                    width: '80%',
                    alignSelf: 'center'

                  }}>
                  {item.name}
                </Text>
                {this.state.collapsed == true ? (
                  <Icons.Ionicons
                    name="md-arrow-dropdown"
                    size={30}
                    color={theme.menuColor}
                    style={{
                      paddingRight: 10,
                      alignSelf: 'center',
                      height: 30
                    }}
                  />
                ) : (
                  <Icons.Ionicons
                    name="md-arrow-dropright"
                    size={30}
                    color={theme.menuColor}
                    style={{
                      paddingRight: 10,
                      alignSelf: 'flex-end',
                      height: 30,
                      alignSelf: 'center'
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 0.1, alignSelf: 'flex-end' }}>
                <Divider />
              </View>
            </View>

          </CollapseHeader>


          <CollapseBody style={{ flex: 1 }}>
            {submenu.map((submenuItem, index) =>
              this.renderSubmenu(submenuItem, pushTo),
            )}
          </CollapseBody>

        </Collapse>
      );
    } else {
      return this.renderMainMenu(item, pushTo);
    }
  }

  get iconImage() {
    switch (itemName) {
      case 'My Dashboard':
        return require('../../../assets/dashboard.png');
      case 'Company Calendar':
        return require('../../../assets/calender.png');
      case 'Directory':
        return require('../../../assets/directory.png');
      case 'Announcements':
        return require('../../../assets/announcement.png');
      case 'Holidays':
        return require('../../../assets/holiday.png');
      case 'Albums':
        return require('../../../assets/album.png');
      case 'Support':
        return require('../../../assets/support.png');
      case 'Settings':
        return require('../../../assets/settings.png');
      case 'Logout':
        return require('../../../assets/Logout.png');
      default:
        return require('../../../assets/dashboard.png');
    }
  }

  renderMainMenu(item, pushTo) {
    itemName = item.name;
    const { theme } = this.props;

    if (pushTo === undefined) {
      pushTo = item.routeName;
    }

    return (
      <View style={{ flex: 0.9 }}>
        <TouchableOpacity
          style={[styless.menuItem, { flexDirection: 'row', height: '100%', alignItems: 'center' }]}
          onPress={this.navigateToScreen(pushTo)}>
          <Image
            source={this.iconImage}
            tintColor={'white'}
            style={{
              width: 25,
              height: 30,
              marginRight: 10,
              padding: 15,
              tintColor: 'white',
            }}
          />
          <Text
            style={{
              color: theme.menuColor,
              fontSize: 18,
              fontWeight: '600',
            }}>
            {item.name}
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 0.1, width: '100%' }}>
          <Divider />
        </View>
      </View>
    );
  }

  renderSubmenu(item, pushTo) {
    const { theme } = this.props;

    if (pushTo === undefined) {
      pushTo = item.routeName;
    }
    return (
      <TouchableOpacity
        style={[styless.subMenuItem]}
        onPress={this.navigateToScreen(pushTo)}>
        <Text
          style={{
            color: theme.menuColor,
            fontSize: 18,
            fontWeight: '300',
            height: 30,
            marginLeft: 60,

          }}>
          {item.name}
        </Text>

      </TouchableOpacity>
    );
  }

  renderHeader() {
    //const {user} = this.props;
    const user = global.user;
    // const user = await  SyncStorage.get('user');
    let height = 80;
    let uri = `${user.photo}`;

    console.log(uri);

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          paddingTop: 40,
          paddingHorizontal: 10,
        }}
        onPress={this.navigateToScreen('Profile')}>
        {/* {this.renderEditDeletePopover()} */}

        {user !== undefined &&
          user.photo && uri !== undefined ? (
          <AsyncImage
            source={{
              uri: uri
            }}
            resizeMode="stretch"
            style={[
              styless.imageThumbnail,
              { width: 70, height: 70, borderRadius: 35 },
            ]}
            borderRadius={35}
            placeholderColor="gray"
            isUserImage={true}
          />
        ) : (
          <Image
            source={require('../../../assets/ic_profile.png')}
            resizeMode="stretch"
            style={[
              styless.imageThumbnail,
              { width: 70, height: 70, tintColor: 'white', borderRadius: 35 },
            ]}
            tintColor={'white'}
          />
        )}

        <View style={[styless.leftRight, { paddingTop: 5, marginLeft: 15 }]}>
          <View style={[styless.textVertical]}>
            <Text
              style={[
                styless.detail,
                { color: 'white', textTransform: 'capitalize' },
              ]}>
              {user.firstName} {user.lastName}
            </Text>
            <Text
              style={[
                styless.detail,
                { color: 'white', textTransform: 'capitalize' },
              ]}>
              {user.userDesignation}
            </Text>
            <Text
              style={[
                styless.detail,
                { color: 'white', textTransform: 'capitalize' },
              ]}>
              Emp No. :- {user.code}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { theme } = this.props;

    return (
      <LinearGradient
        colors={[theme.primaryColor, '#474F6A', '#9A6B58']}
        style={{ flex: 1 }}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        locations={[0.1, 0.2, 0.9]}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            backgroundColor: 'transparent',
            alignItems: 'flex-start',
            alignSelf: 'flex-start',
          }}
          automaticallyAdjustContentInsets={false}>
          <View style={[styless.textVertical, { flex: 1 }]}>
            {this.renderHeader()}
            <Divider />
            {menuItems.map((item, index) => this.renderMenu(item))}
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }

  logout = () => {
    //const deleted_element = clearAllData();
    var input = {
      userId: this.props.user.userId,
    };
    this.props.logoutUser(input);
  };

  canceledLogout = () => {
    console.log('The logout process is now cancelled');
  };

  logoutAlert = () => {
    const { theme } = this.props;
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    Alert.alert('Confirm', 'Are you sure that you want to logout?', [
      { text: 'Yes', onPress: this.logout },
      { text: 'Cancel', onPress: this.canceledLogout },
    ]);

  };

  async reset() {
    try {
      await Keychain.resetGenericPassword();
      this.setState({
        status: 'Credentials Reset!',
        username: '',
        password: '',
      });
    } catch (err) {
      this.setState({ status: 'Could not reset credentials, ' + err });
    }
  }
}

//MARK: - Data Management

let DrawerScreenNew = withTheme(DrawerScreen);

DrawerScreenNew.navigationOptions = ({ navigation, screenProps, params }) => {
  const { theme } = screenProps;
  return {
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      fontSize: 30,
      color: 'black',
    },
    defaultNavigationOptions: {
      gesturesEnabled: true,
    },

    headerStyle: { shadowColor: 'transparent', borderBottomWidth: 0 },
    headerTintColor: theme.primaryColor,
    headerLeft: (
      <DrawerIcon
        navigation={navigation}
        action={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: state.FormReducer.user,
    permissions: permissionListSelector(state.FormReducer),
    isUserLogout: userLogoutSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: input => dispatch(logoutUser(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerScreenNew);
