/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  View,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {
  flatListItemSpaceSeparator,
  flatListItemSeparator,
  NoRecordAvailableView,
} from '../../../components/utility/common';
import {GET_DIRECTORY} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  getDirectorySelector,
} from '../Actions/selectors';
import {getDirectory} from '../Actions/DirectoryActions';
import DirectoryCell from './DirectoryCell';
import {DrawerIcon, NotificationButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import SearchComponent from '../../../components/views/SearchComponent';

class DirectoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //search: '',
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentDidMount() {
    this.callGetDirectory();
  }

  callGetDirectory(text) {
    var input = {
      company: this.props.user.userCompany,
      userId: this.props.user.userId,
      userType: this.props.user.userType,
      page: this.state.page,
      search: text ? text : '',
      request: GET_DIRECTORY,
    };
    this.props.getDirectory(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_DIRECTORY) {
      if (this.props.error !== prevProps.error) {
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

    //get directory
    if (this.props.api === GET_DIRECTORY) {
      if (this.props.error !== null && this.props.api === GET_DIRECTORY) {
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
      }

      if (!this.props.error && this.props.api === GET_DIRECTORY) {
        if (this.props.directoryData !== prevProps.directoryData) {
          this.setState({directoryData: this.props.directoryData});
          if (this.props.directoryData.length !== 0) {
            let sortedList = this.props.directoryData.sort(function(a, b) {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });
  
            //create new list containing header and users
            let newList = [];
            let currentPrefix = sortedList[0].name.substring(0, 1).toUpperCase();
            let obj = {name: currentPrefix, isHeader: true};
            newList.push(obj);
            sortedList.map(userData => {
              if (currentPrefix === userData.name.substring(0, 1).toUpperCase()) {
                newList.push(userData);
              } else {
                currentPrefix = userData.name.substring(0, 1).toUpperCase();
                let obj = {name: currentPrefix, isHeader: true};
                newList.push(obj);
                newList.push(userData);
              }
            });
  
            this.setState({
              directoryData: newList,
              refreshing: false,
              arrayholder: newList,
            });
            this.hideSpinner();
          }
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    return (
      <BaseClass title={translate('directory')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        <SearchComponent
          onChangeText={text => this.SearchFilterFunction(text)}
        />
        {this.renderDirectory()}
      </BaseClass>
    );
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({directoryData: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.callGetDirectory(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          directoryData: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderDirectory() {
    if (
      this.state.directoryData !== undefined &&
      this.state.directoryData.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.directoryData !== undefined) {
    return (
      <View style={{flex: 1, padding: 2}}>
        <FlatList
          data={this.state.directoryData}
          renderItem={this.renderDirectoryItem}
          numColumns={1}
          keyExtractor={this._keyExtractor}
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

    this.callGetDirectory();
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
      () => this.callGetDirectory(),
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
          this.callGetDirectory(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
  renderFooter = () => {

    const {theme} = this.props
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (this.props.isLoading && this.state.page !== 1) {
          return <ActivityIndicatorCustom isSpinner={true} style={{paddingTop:20,height:80}}/>
        }else {
          return null;
        }
   
  };

  renderDirectoryItem = ({item}) => {
    return <DirectoryCell item={item} navigation={this.props.navigation} />;
  };
}
const DirectoryScreenNew = withTheme(DirectoryScreen);
DirectoryScreenNew.navigationOptions = ({navigation, screenProps, params}) => {
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
    isLoading: isLoadingSelector(state.DirectoryReducer),
    api: apiSelector(state.DirectoryReducer),
    error: errorSelector(state.DirectoryReducer),
    directoryData: getDirectorySelector(state.DirectoryReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getDirectory: input => dispatch(getDirectory(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DirectoryScreenNew);
