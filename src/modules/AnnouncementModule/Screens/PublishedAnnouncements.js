/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Button,
  Image,
  View,
  Alert,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {NavSearchBar, DrawerIcon} from '../../../components/views/NavBar';
import {GET_ANNOUNCEMENTS_PUBLISHED} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  publishedAnnouncementsSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getPublishedAnnouncements} from '../Actions/AnnouncementActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator, NoRecordAvailableView} from '../../../components/utility/common';
import AnnouncementCell from './AnnouncementCell';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import SearchComponent from '../../../components/views/SearchComponent';

class PublishedAnnouncement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.publishedAnnouncements();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      this.props.error.request == GET_ANNOUNCEMENTS_PUBLISHED
    ) {
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
    }

    //get my dashboard
    if (this.props.api === GET_ANNOUNCEMENTS_PUBLISHED) {
      if (
        this.props.error !== null &&
        this.props.api === GET_ANNOUNCEMENTS_PUBLISHED
      ) {
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
        this.hideSpinner();
      }

      if (!this.props.error && this.props.api === GET_ANNOUNCEMENTS_PUBLISHED) {
        if (
          this.props.publishedAnnouncements !==
          this.state.publishedAnnouncements
        ) {
          this.setState({
            publishedAnnouncements: this.props.publishedAnnouncements,
            refreshing: false,
            arrayholder: this.props.publishedAnnouncements,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    return (
      <BaseClass title={translate('announcements')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        {/* <SearchComponent
          onChangeText={text => this.SearchFilterFunction(text)}
        /> */}
        {this.renderAnnouncements()}
      </BaseClass>
    );
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({publishedAnnouncements: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.publishedAnnouncements(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          publishedAnnouncements: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }
  renderAnnouncements() {
    if (
      this.state.publishedAnnouncements !== undefined &&
      this.state.publishedAnnouncements.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.publishedAnnouncements !== undefined) {
    return (
      <View style={{flex: 1, padding: 2}}>
        <FlatList
          data={this.state.publishedAnnouncements}
          renderItem={this.renderAnnouncementItem}
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

  

  renderAnnouncementItem = ({item}) => {
    return (
      <AnnouncementCell
        item={item}
        navigation={this.props.navigation}
        isUpcoming={false}
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

    this.publishedAnnouncements();
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
      () => this.publishedAnnouncements(),
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
          this.publishedAnnouncements(this.state.searchText);
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

  publishedAnnouncements(text) {
    var input = {
      companyId: this.props.user.userCompany,
      announcementId: '',
      type: 0,
      search: text ? text : '',
      userType: this.props.user.userType,
      page: this.state.page,
      request: GET_ANNOUNCEMENTS_PUBLISHED,
    };
    this.props.getPublishedAnnouncements(input);
  }
}
const PublishedAnnouncementNew = withTheme(PublishedAnnouncement);
PublishedAnnouncementNew.navigationOptions = ({
  navigation,
  screenProps,
  params,
}) => {
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
    isLoading: isLoadingSelector(state.AnnouncementReducer),
    api: apiSelector(state.AnnouncementReducer),
    error: errorSelector(state.AnnouncementReducer),
    publishedAnnouncements: publishedAnnouncementsSelector(
      state.AnnouncementReducer,
    ),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getPublishedAnnouncements: input =>
      dispatch(getPublishedAnnouncements(input)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublishedAnnouncementNew);
