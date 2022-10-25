/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, AddButton} from '../../../components/views/NavBar';
import {GET_ALBUMS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  albumListSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {
  flatListItemSpaceSeparator,
  flatListItemSeparator,
  NoRecordAvailableView,
} from '../../../components/utility/common';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import SearchComponent from '../../../components/views/SearchComponent';
import AlbumCell from './AlbumCell';
import {getAlbums} from '../Actions/AlbumActions';
import {isPermissionAllowed} from '../../../network/APICall';
import {DrawerActions} from 'react-navigation-drawer';

class AlbumList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '', 
      page: 1,
      isSpinner: true,
    };
  }

  componentWillMount() {
    this.callgetAlbumList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_ALBUMS) {
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

    //get my albums
    if (this.props.api === GET_ALBUMS) {
      if (this.props.error !== null && this.props.api === GET_ALBUMS) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === GET_ALBUMS) {
        if (this.props.albumList !== this.state.albumList) {
          this.setState({
            albumList: this.props.albumList,
            refreshing: false,
            arrayholder: this.props.albumList,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    return (
      <BaseClass title={translate('album')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        <SearchComponent
          onChangeText={text => this.SearchFilterFunction(text)}
        />
        {this.renderAlbumList()}
      </BaseClass>
    );
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({albumList: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.callgetAlbumList(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          albumList: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderAlbumList() {
    if (
      this.state.albumList !== undefined &&
      this.state.albumList.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.albumList !== undefined) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            data={this.state.albumList}
            renderItem={this.renderAlbumItem}
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

  renderAlbumItem = ({item}) => {
    return (
      <AlbumCell
        item={item}
        navigation={this.props.navigation}
        isGrid={false}
      />
    );
  };

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

    this.callgetAlbumList();
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
      () => this.callgetAlbumList(),
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
          this.callgetAlbumList(this.state.searchText);
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

  callgetAlbumList(text) {
    var input = {
      companyId: this.props.user.userCompany,
      keyword: text ? text : '',
      userId: this.props.user.userId,
      page: this.state.page,
      request: GET_ALBUMS,
    };
    this.props.getAlbums(input);
  }
}

const AlbumListNew = withTheme(AlbumList);
AlbumListNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
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

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: 'white',
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
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.AlbumReducer),
    api: apiSelector(state.AlbumReducer),
    error: errorSelector(state.AlbumReducer),
    albumList: albumListSelector(state.AlbumReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getAlbums: input => dispatch(getAlbums(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumListNew);
