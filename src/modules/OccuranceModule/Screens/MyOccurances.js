/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  View,
  Alert,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {DrawerIcon, AddButton} from '../../../components/views/NavBar';
import {DrawerActions} from 'react-navigation-drawer';
import {flatListItemSpaceSeparator, NoRecordAvailableView} from '../../../components/utility/common';
import {GET_MY_OCCURRENCES} from '../Actions/type';
import {isPermissionAllowed} from '../../../network/APICall';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  myOccurrencesListSelector,
} from '../Actions/selectors';
import {getMyOccurrences} from '../Actions/OccuranceActions';
import CardView from 'react-native-cardview';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import BaseClass from '../../Base/BaseClass';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import SearchComponent from '../../../components/views/SearchComponent';

class MyOccurrences extends React.Component {
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
    this.callgetMyOccurrences();
  }

  callgetMyOccurrences(text) {
    var input = {
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      occId: '',
      page: this.state.page,
      search: text ? text : '',
      request: GET_MY_OCCURRENCES,
    };
    this.props.getMyOccurrences(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_MY_OCCURRENCES) {
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

    //get myOccurrences
    if (this.props.api === GET_MY_OCCURRENCES) {
      if (this.props.error !== null && this.props.api === GET_MY_OCCURRENCES) {
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

      if (!this.props.error && this.props.api === GET_MY_OCCURRENCES) {
        if (this.props.myOccurrences !== this.state.myOccurrences) {
          this.setState({
            myOccurrences: this.props.myOccurrences,
            refreshing: false,
            arrayholder: this.props.myOccurrences,
          });
          this.hideSpinner();
        }
      }
    }
  }

  render() {
    return (
      <BaseClass title={translate('occurrences')}>
        <ActivityIndicatorCustom
          isSpinner={this.state.isSpinner}
          style={{paddingTop: 20, height: 60}}
        />
        {/* <SearchComponent
          onChangeText={text => this.SearchFilterFunction(text)}
        /> */}
         <View style={{flex:1}}>
          
       
         {this.renderOccurrences()}
          </View>
        
      </BaseClass>
    );
  }
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    this.state.page = 1
    if (text == '') {
      this.setState({myOccurrences: this.state.arrayholder});
    } else {
      if (this.state.arrayholder) {
        const newData = this.callgetMyOccurrences(text);
        this.setState({
          //setting the filtered newData on datasource
          //After setting the data it will automatically re-render the view
          myOccurrences: newData,
          searchText: text,
        });
      }
    }
  }
  _onClear() {
    this.setState({searchText: ''});
  }

  renderOccurrences() {
    if (
      this.state.myOccurrences !== undefined &&
      this.state.myOccurrences.length === 0
    ) {
      return <NoRecordAvailableView />;
    }
    if (this.state.myOccurrences !== undefined) {
      return (
        <View style={{flex: 1, padding: 2}}>
          <FlatList
            data={this.state.myOccurrences}
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

  renderItem = ({item}) => {
    const {theme} = this.props;
    var type = '';
    switch (item.type) {
      case '1':
        type = 'change_in_marital_status';
        break;
      case '2':
        type = 'request_for_maternity_leave';
        break;
      case '3':
        type = 'request_for_extended_maternity_leave';
        break;
      case '4':
        type = 'request_for_paternity_leave';
        break;
      case '5':
        type = 'request_for_solo_parent';
        break;
      case '6':
        type = 'request_for_resign';
        break;
      case '7':
        type = 'request_for_victims';
        break;
    }
    var status = '';
    switch (item.status) {
      case '0':
        status = 'pending';
        break;
      case '1':
        status = 'approved';
        break;
      case '2':
        status = 'rejected';
        break;
    }
    return (
      <View style={{margin: 2, flex: 1}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <TouchableOpacity
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                padding: 5,
              },
            ]}
            onPress={() =>
              this.props.navigation.navigate('OccurrenceDetails', {item: item})
            }>
            <Text
              style={[
                theme.header,
                {textAlign: 'left', color: theme.primaryColor},
              ]}>
              {translate(type)}
            </Text>

            <Text
              style={[theme.detail, {textAlign: 'left', color: 'gray'}]}
              numberOfLines={1}>
              {translate(status)}
            </Text>
          </TouchableOpacity>
        </CardView>
      </View>
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

    this.callgetMyOccurrences();
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
      () => this.callgetMyOccurrences(),
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
          this.callgetMyOccurrences(this.state.searchText);
          this.onEndReachedCalledDuringMomentum = true;
        },
      );
    }
  };
}
const MyOccurrencesNew = withTheme(MyOccurrences);
MyOccurrencesNew.navigationOptions = ({navigation, screenProps, params}) => {
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
        action={() => navigation.navigate('AddOccurrence')}
        notiaction={() => navigation.navigate('Notification')}
        isBadgeShown={global.isBadgeShown}
      />
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.OccurrenceReducer),
    api: apiSelector(state.OccurrenceReducer),
    error: errorSelector(state.OccurrenceReducer),
    myOccurrences: myOccurrencesListSelector(state.OccurrenceReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyOccurrences: input => dispatch(getMyOccurrences(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyOccurrencesNew);
