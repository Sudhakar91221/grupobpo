/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  FlatList,
  ScrollView,
  Alert,
  LayoutAnimation,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {View} from 'react-native-animatable';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import {styless} from '../../../components/common/Styles';
import {CustomLayoutSpring} from 'react-native-animation-layout';
import SegmentControl from '../../../components/external/SegmentedControlOval';

import {
  isLoadingSelector,
  getMyAdsSelector,
  apiSelector,
  errorSelector,
  successSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getMyAds} from '../Actions/MoreActions';
import {GET_MY_ADS} from '../Actions/type';
import {connect} from 'react-redux';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import AdListCell from './AdListCell';

import Divider from '../../../components/views/Divider';
import {Dropdown} from 'react-native-material-dropdown';

class NewsFeedAds extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      screenHeight: 0,
      toastMessageUpdated: false,
      myAdsList: [],
      status: 3,
    };
    this.renderMyAdsList = this.renderMyAdsList.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  //MARK: - View Lifecycle

  componentWillMount() {
    this.fetchData();
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_MY_ADS) {
      if (this.props.error !== prevProps.error) {
        this.setState({submitLoader: false}, () => {
          Alert.alert(this.props.error.message);
        });
      }
    }

    if (this.props.error !== null && this.props.api === GET_MY_ADS) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (!this.props.error && this.props.api === GET_MY_ADS) {
      if (this.props.myAdsList !== this.state.myAdsList) {
        this.setState({myAdsList: this.props.myAdsList, refreshing: false});
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const data = [
      {value: 'In-Review'},
      {value: 'Approved'},
      {value: 'Active'},
      {value: 'Rejected'},
      {value: 'Expired'},
      {value: 'All'},
    ];

    return (
      <BaseClass>
        <View
          style={
            (styless.container,
            {
              paddingTop: this.state.showToastMessage !== undefined ? 30 : 0,
              flex: 1,
            })
          }>
          <View style={{marginLeft: 20, marginRight: 20}}>
            <Dropdown
              label="Status"
              data={data}
              value={'Active'}
              textColor={theme.headerColor}
              baseColor={'gray'}
              fontSize={18}
              tintColor={theme.centerColor}
              onChangeText={this.changeText}
              animationDuration={0}
            />
          </View>

          <Divider borderColor="#C8C8C8" height={1} dashed={false} />
          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
            onContentSizeChange={this.onContentSizeChange}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <View style={{backgroundColor: 'white', flex: 1}}>
              {this.renderMyAdsList()}
            </View>
          </ScrollView>
          {/* {this.renderSegmentControl()} */}
        </View>
      </BaseClass>
    );
  }

  changeText(text) {
    this.setState({status: text});
    console.log('value changed => ' + text);
  }

  //MARK : - Event Handlers

  fetchData() {
    this.callGetmyAdsList();
  }
  filterList = text => {
    var newData = this.state.dataBackup;
    newData = this.state.dataBackup.filter(item => {
      const itemData = item.name.toLowerCase();
      const textData = text.toLowerCase();
      return itemData.indexOf(textData) > -1;
    });
    LayoutAnimation.configureNext(CustomLayoutSpring(null, null, 'scaleXY'));
    this.setState({
      query: text,
      dataSource: newData,
    });
  };

  onRefresh = () => {
    this.setState({
      dataSource: [],
      isLoading: false,
      refreshing: true,
      seed: 1,
      page: 1,
    });
    this.fetchData();
  };

  loadMore = () => {
    this.setState({
      // refreshing: true,
      page: this.state.page + 1,
    });
    // this.fetchData();
  };
  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    this.setState({screenHeight: contentHeight});
  };
  //MARK: - Render UI

  renderMyAdsList() {
    if (this.state.myAdsList.length === 0) {
      return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 24,
            }}>
            No Records Available
          </Text>
        </View>
      );
    }
    if (this.state.myAdsList !== undefined) {
      return (
        <View style={{flex: 1, marginTop: 10}}>
          <FlatList
            data={this.state.myAdsList}
            renderItem={this.renderAdItem}
            numColumns={1}
            keyExtractor={this._keyExtractor}
            extraData={this.props}
            onEndReached={this.loadMore}
            // onEndReachedThreshold={0.9}
            // onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
            ItemSeparatorComponent={flatListItemSpaceSeparator}
          />
        </View>
      );
    }
  }

  renderAdItem = ({item}) => {
    return (
      <View style={{paddingRight: 10, paddingLeft: 10}}>
        <AdListCell item={item} navigation={this.props.navigation} />
      </View>
    );
  };

  //MARK: - API CALL

  callGetmyAdsList() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      status: 1,
      advertisementType: 3,
      request: GET_MY_ADS,
    };
    this.props.getMyAds(input);
  }
}
//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    myAdsList: getMyAdsSelector(state.MoreReducer),
    isLoading: isLoadingSelector(state.MoreReducer),
    api: apiSelector(state.MoreReducer),
    error: errorSelector(state.MoreReducer),
    successMessage: successSelector(state.MoreReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMyAds: input => dispatch(getMyAds(input)),
  };
}

//MARK: - Navigation Header

const NewsFeedAdsNew = withTheme(NewsFeedAds);

NewsFeedAdsNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    // title: translate('my_eApplications'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      fontSize: 30,
      color: 'black',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    // headerTintColor: theme.primaryColor,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedAdsNew);
