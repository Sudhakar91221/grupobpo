/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  FlatList,
  ScrollView,
  Alert,
  LayoutAnimation,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native-animatable';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import ApplicationListCell from './ApplicationListCell';
import {styless} from '../../../components/common/Styles';
import {NavSearchBar} from '../../../components/views/NavBar';
import SearchBar from 'react-native-dynamic-search-bar';
import {CustomLayoutSpring} from 'react-native-animation-layout';

import {
  isLoadingSelector,
  applicationsListSelector,
  apiSelector,
  errorSelector,
  // successSelector,
} from '../../FormsComponent/Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';

import {PRODUCT_ADD, PRODUCT_UPDATE, APPLICATION_GET} from '../../FormsComponent/Actions/type';

import {connect} from 'react-redux';
import {AddButton} from '../../../components/views/NavBar';

import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';
import {getApplications} from '../../FormsComponent/Actions/FormActions';
import FloatingButton from '../../../components/views/FloatingButton';
import Divider from '../../../components/views/Divider';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';

class ApplicationList extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      screenHeight: 0,
      toastMessageUpdated: false,
      applications: undefined,
    };
    this.renderJobFlatlist = this.renderJobFlatlist.bind(this);
  }

  //MARK: - View Lifecycle

  componentWillMount() {
    this.fetchData();
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === APPLICATION_GET) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (!this.props.error && this.props.api === APPLICATION_GET) {
      if (this.props.applications !== prevProps.applications) {
        this.setState({applications: this.props.applications});
      }
    }

    if (
      !this.props.isLoading &&
      (this.props.api === PRODUCT_ADD ||
        (this.props.api === PRODUCT_UPDATE &&
          this.state.toastMessageUpdated === false))
    ) {
      if (this.props.successMessage !== prevProps.successMessage) {
        this.setState(
          {
            showToastMessage: this.props.successMessage,
            toastMessageUpdated: true,
          },
          () => {
            setTimeout(() => {
              // this.props.successMessage = false
              this.setState({
                showToastMessage: undefined,
                toastMessageUpdated: true,
              });
            }, 1500);
          },
        );
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;

    if (this.state.applications === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <BaseClass>
        <View
          style={
            (styless.container,
            {
              paddingTop: this.state.showToastMessage !== undefined ? 30 : 20,
              flex: 1,
            })
          }>
          {/* <View style={{height: 50}}>
            <Divider height={2.0} />
            {this.renderApplicationListHeader()}
          </View> */}

          <ScrollView
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
            onContentSizeChange={this.onContentSizeChange}>
            <View style={{backgroundColor: 'white', flex: 1}}>
              {this.renderJobFlatlist()}
            </View>
          </ScrollView>
          <FloatingButton
            onFloatButtonTapped={this.onAddEApplicationFormButtonTapped}
          />
        </View>
      </BaseClass>
    );
  }

  //MARK : - Event Handlers
  onAddEApplicationFormButtonTapped = () => {
    // this.props.navigation.navigate('FormList');
    this.props.navigation.navigate('FormList');
  };
  fetchData() {
    this.callGetApplications();
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
    // this.fetchData();
  };

  loadMore = () => {
    this.setState({
      // refreshing: true,
      page: this.state.page + 1,
    });
    // this.fetchData();
  };
  onSegmentValueChange = index => {
    console.log('Selected Segment Index', index);
  };
  onContentSizeChange = (contentWidth, contentHeight) => {
    // Save the content height in state
    this.setState({screenHeight: contentHeight});
  };
  //MARK: - Render UI

  renderJobFlatlist() {
    if (this.state.applications.length === 0) {
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
    if (this.state.applications !== undefined) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            data={this.state.applications}
            renderItem={this.renderJobItem}
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
            ItemSeparatorComponent={flatListItemSpaceSeparator}
          />
        </View>
      );
    }
  }

  renderJobItem = ({item}) => {
    return (
      <ApplicationListCell item={item} navigation={this.props.navigation} />
    );
  };

  renderApplicationListHeader() {
    const {theme} = this.props;
    return (
      <View
        style={[
          styless.leftRight,
          {
            paddingLeft: 10,
            paddingRight: 10,
            height: 40,
            backgroundColor: 'white',
            alignItems: 'center',
          },
        ]}>
        <Text style={[theme.H2, {color: theme.detailColor}]}>
          {' '}
          {translate('Latest_Job_Offers')}{' '}
        </Text>
        <TouchableOpacity onPress={this.onViewMoreButtonTapped}>
          <Text style={[theme.themeText, {fontSize: 20}]}>
            {' '}
            {translate('Advertise')}{' '}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - API CALL

  callGetApplications() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      // page: '1',
    };
    this.props.getApplication(input);
  }
}
//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    applications: applicationsListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    // successMessage: successSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getApplication: input => dispatch(getApplications(input)),
  };
}

//MARK: - Navigation Header

const ApplicationListNew = withTheme(ApplicationList);

ApplicationListNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: translate('my_eApplications'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      paddingTop: 10,
      fontSize: 28,
      color: 'black',
      fontWeight: '500',
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    // headerTintColor: theme.primaryColor,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationListNew);
