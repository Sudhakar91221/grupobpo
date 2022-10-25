/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, ScrollView, Alert, View} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {flatListItemSeparator} from '../../../components/utility/common';
import MoreListCell from './MoreListCell';
import {styless} from '../../../components/common/Styles';

import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
} from '../../AuthModule/Actions/selectors';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
// import {ImageRow} from '../../NewsModule/Screens/NewsFeedDetail';
import {ScreenWidth, ScreenHeight} from '../../../components/utility/Settings';
import {BottomButton} from '../../../components/views/Button';
import SyncStorage from 'sync-storage';
import {USER_LOGOUT} from '../../AuthModule/Actions/type';
// import {logoutUser} from '../../AuthModule/Actions/UserActions';
import {connect} from 'react-redux';
import {userLogoutSelector} from '../../FormsComponent/Actions/selectors';
import {logoutUser} from '../../FormsComponent/Actions/FormActions';
// import { logoutUser } from '../../AuthModule/Actions/UserActions';
import UrlComponent from '../../../components/views/UrlComponent';

class MoreList extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      screenHeight: 0,
      toastMessageUpdated: false,
      submitLoader: false,
    };
    this.renderMoreFlatlist = this.renderMoreFlatlist.bind(this);
    this.renderMoreItem = this.renderMoreItem.bind(this);
  }

  //MARK: - View Lifecycle

  componentWillMount() {
    this.fetchData();
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.error) {
    } else {
      if (this.props.error.request == USER_LOGOUT) {
        if (this.props.error !== prevProps.error) {
          // this.setState({submitLoader: false}, () => {
          //   Alert.alert(this.props.error.message);
          // });
          this.state.submitLoader = false;
          Alert.alert(this.props.error.message);
        }
      }
    }

    if (this.props.error !== null && this.props.api === USER_LOGOUT) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (this.props.isLoading === true && this.props.api === USER_LOGOUT) {
      this.state.submitLoader = true;
    }

    if (!this.props.error && this.props.api === USER_LOGOUT) {
      console.log('user => ' + this.props.user);
      // if (!this.props.user ) {
     
      this.onLogoutSuccess()
      // }
    }
  }

  onLogoutSuccess() {
    this.state.submitLoader = false;
    SyncStorage.set('isFromLogout', true.toString());
    SyncStorage.remove('user');
    this.props.navigation.navigate('AuthStack');
  }
  //MARK: - Main Render

  render() {
    const {theme} = this.props;

    return (
      <BaseClass title={translate('more')}>
        <View
          style={
            (styless.newContainer,
            {
              paddingTop: 10,
              flex: 1,
            })
          }>
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
            onContentSizeChange={this.onContentSizeChange}>
            {/* <ImageRow
              name={'default'}
              width={ScreenHeight * 0.12}
              height={ScreenHeight * 0.12}
            /> */}
            {/* <UrlComponent getValue={value => console.log(value)} /> */}
            <View style={{backgroundColor: 'white', paddingTop: 30}}>
              {this.renderMoreFlatlist()}
            </View>
          </ScrollView>
        </View>
      </BaseClass>
    );
  }

  //MARK : - Event Handlers

  fetchData() {
    this.callGetMores();
  }
  onRefresh = () => {
    this.setState({
      dataSource: [],
      isLoading: false,
      refreshing: true,
      seed: 1,
      page: 1,
    });
    // this.fetchData();
  };
  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    this.setState({screenHeight: contentHeight});
  };
  onLoginButtonTapped = () => {};
  //MARK: - Render UI

  renderMoreFlatlist() {
    if (this.state.moreList !== undefined) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            data={this.state.moreList}
            renderItem={this.renderMoreItem}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            extraData={this.props}
            onEndReached={this.loadMore}
            onRefresh={this.onRefresh}
            refreshing={
              this.state.refreshing !== undefined
                ? this.state.refreshing
                : false
            }
            // onEndReachedThreshold={0.9}
            // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            ItemSeparatorComponent={flatListItemSeparator}
          />
          {this.renderBottomButton()}
        </View>
      );
    }
  }

  renderMoreItem = ({item}) => {
    return <MoreListCell item={item} navigation={this.props.navigation} />;
  };

  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View style={{width: '80%', alignSelf: 'center', paddingVertical: 30}}>
        <BottomButton
          style={styless.bottomButton}
          title={translate('logout')}
          action={this.onLogoutButtonTapped}
          activeState={true}
          isLoader={this.state.submitLoader}
          isGray={false}
        />
      </View>
    );
  }

  onLogoutButtonTapped = () => {
    Alert.alert(
      translate('eCity'),
      translate('logout_hint'),
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.userLogout()},
      ],
      {cancelable: false},
    );
  };

  //MARK: - API CALL

  callGetMores() {
    const moreList = require('../Actions/More.json');
    this.setState({moreList: moreList.data});
  }

  userLogout() {
    this.setState({submitLoader: true});
    AsyncStorage.getItem('user').then(value => {
      const user = JSON.parse(value);

      const token = user.token;
      const userId = user.userId;

      var input = {
        token: token,
        userId: userId,
        request: USER_LOGOUT,
      };

      this.onLogoutSuccess()
      // this.props.logoutUser(input);
    });
  }
}
//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLogoutSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    // forms: formListSelector(state.MoreReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    logoutUser: input => dispatch(logoutUser(input)),
  };
}

//MARK: - Navigation Header

const MoreListNew = withTheme(MoreList);

MoreListNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    // title: translate('select_eApplications'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      fontSize: 30,
      color: 'black',
    },
    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme(MoreListNew));
