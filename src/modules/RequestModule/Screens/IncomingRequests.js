/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  FlatList,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {INCOMING_REQUESTS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  incomingRequestSelector,
} from '../Actions/selector';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getIncomingRequests} from '../Actions/RequestActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator, NoRecordAvailableView} from '../../../components/utility/common';
import StaffRequestCell from './StaffRequestCell';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import SearchComponent from '../../../components/views/SearchComponent';
class IncomingRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      incomingRequests: undefined,
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.incomingRequests();
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
  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == INCOMING_REQUESTS) {
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

    //get my requests
    if (this.props.api === INCOMING_REQUESTS) {
      if (this.props.error !== null && this.props.api === INCOMING_REQUESTS) {
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

      if (!this.props.error && this.props.api === INCOMING_REQUESTS) {
        if (this.props.incomingRequests !== prevProps.incomingRequests) {
          this.setState({
            incomingRequests: this.props.incomingRequests,
            refreshing: false,
            arrayholder: this.props.incomingRequests,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    if (this.state.incomingRequests === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <BaseClass title={translate('requests')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
         <SearchComponent
            onChangeText={text => this.SearchFilterFunction(text)}
        />
        {this.renderIncomingRequests()}
      </BaseClass>
    );
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({incomingRequests: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.incomingRequests(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          incomingRequests: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderIncomingRequests() {
    if (
      this.state.incomingRequests !== undefined &&
      this.state.incomingRequests.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.incomingRequests !== undefined) {
      return (
        <View style={{flex: 1, padding: 2}}>
          <FlatList
            data={this.state.incomingRequests}
            renderItem={this.renderLeaveItem}
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

  renderLeaveItem = ({item}) => {
    return (
      <StaffRequestCell
        item={item}
        navigation={this.props.navigation}
        isIncoming={true}
      />
    );
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

    this.incomingRequests();
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
      () => this.incomingRequests(),
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
          this.incomingRequests(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
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

  incomingRequests(text) {
    var input = {
      userId: this.props.user.userId,
      companyId: this.props.user.userCompany,
      status: 1,
      page: this.state.page,
      search: text ? text : '',
      request: INCOMING_REQUESTS,
    };
    this.props.getIncomingRequests(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.RequestReducer),
    api: apiSelector(state.RequestReducer),
    error: errorSelector(state.RequestReducer),
    incomingRequests: incomingRequestSelector(state.RequestReducer),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getIncomingRequests: input => dispatch(getIncomingRequests(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IncomingRequests);
