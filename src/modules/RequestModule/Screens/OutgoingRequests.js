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
import {OUTGOING_REQUESTS} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  outgoingRequestSelector,
} from '../Actions/selector';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getOutgoingRequests} from '../Actions/RequestActions';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import StaffRequestCell from './StaffRequestCell';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import SearchComponent from '../../../components/views/SearchComponent';

class OutgoingRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outgoingRequests: undefined,
      page: 1,
      isSpinner: true,
      arrayholder: [],
      searchText: '',
    };
  }

  componentWillMount() {
    this.outgoingRequests();
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
    if (this.props.error && this.props.error.request == OUTGOING_REQUESTS) {
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

    //get outgoing requests
    if (this.props.api === OUTGOING_REQUESTS) {
      if (this.props.error !== null && this.props.api === OUTGOING_REQUESTS) {
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

      if (!this.props.error && this.props.api === OUTGOING_REQUESTS) {
        if (this.props.outgoingRequests !== prevProps.outgoingRequests) {
          this.setState({
            outgoingRequests: this.props.outgoingRequests,
            refreshing: false,
            arrayholder: this.props.outgoingRequests,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    return (
      <BaseClass title={translate('requests')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        <SearchComponent
            onChangeText={text => this.SearchFilterFunction(text)}
        />
        {this.renderOutgoingRequests()}
      </BaseClass>
    );
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({outgoingRequests: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.outgoingRequests(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          outgoingRequests: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderOutgoingRequests () {
    return (
      <View style={{flex: 1, padding: 2}}>
        <FlatList
          data={this.state.outgoingRequests}
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
    )
  }

  onRefresh = () => {
    this.setState(
      {
        dataSource: [],
        isLoading: false,
        refreshing: true,
        seed: 1,
        page: 1,
      },
      () => this.fetchData(),
    );
  };

  renderLeaveItem = ({item}) => {
    return (
      <StaffRequestCell
        item={item}
        navigation={this.props.navigation}
        isIncoming={false}
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

    this.outgoingRequests();
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
      () => this.outgoingRequests(),
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
          this.outgoingRequests(this.state.searchText);
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

  outgoingRequests(text) {
    var input = {
      userId: this.props.user.userId,
      companyId: this.props.user.userCompany,
      status: 0,
      page: 1,
      search: text ? text : '',
      request: OUTGOING_REQUESTS,
    };
    this.props.getOutgoingRequests(input);
  }
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.RequestReducer),
    api: apiSelector(state.RequestReducer),
    error: errorSelector(state.RequestReducer),
    outgoingRequests: outgoingRequestSelector(state.RequestReducer),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOutgoingRequests: input => dispatch(getOutgoingRequests(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OutgoingRequests);
