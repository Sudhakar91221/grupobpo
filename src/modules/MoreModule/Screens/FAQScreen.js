/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, Alert, ScrollView} from 'react-native';
import {
  isLoadingSelector,
  FAQListSelector,
  apiSelector,
  errorSelector,
} from '../Actions/selectors';
import {
  userLoginSelector,
  userLogoutSelector,
} from '../../AuthModule/Actions/selectors';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {getFAQ} from '../Actions/MoreActions';
import {FAQ_GET} from '../Actions/type';
import {connect} from 'react-redux';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import BaseClass from '../../Base/BaseClass';
import FAQCell from './FAQCell';
import {flatListItemSeparator} from '../../../components/utility/common';
import { translate } from '../../../../App';

class FAQScreen extends React.Component {
  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {FAQList: undefined};
    this.renderFAQList = this.renderFAQList.bind(this);
  }

  componentWillMount() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      request: FAQ_GET,
    };
    this.props.getFAQ(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == FAQ_GET) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: this.moveToLogin,
            },
          ],
          {cancelable: false},
        );
      }
    }

    if (this.props.error !== null && this.props.api === FAQ_GET) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
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

    if (!this.props.error && this.props.api === FAQ_GET) {
      if (this.props.FAQList !== this.state.FAQList) {
        this.setState({FAQList: this.props.FAQList});
      }
    }
  }

  render() {
    const {theme} = this.props;

    if (this.state.FAQList === undefined) {
      return <ActivityIndicatorCustom />;
    }

    return (
      <BaseClass>
        <View style={{flex: 1}}>
          <ScrollView
            style={{backgroundColor: 'white'}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-start',
            }}
            onContentSizeChange={this.onContentSizeChange}>
            <View style={{backgroundColor: 'white'}}>
              {this.renderFAQList()}
            </View>
          </ScrollView>
        </View>
      </BaseClass>
    );
  }

  renderFAQList() {
    if (this.state.FAQList !== undefined) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            style={{flex: 1}}
            data={this.state.FAQList}
            renderItem={this.renderFAQItem}
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
        </View>
      );
    }
  }

  renderFAQItem = ({item}) => {
    return <FAQCell item={item} />;
  };
}
//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    userEmpti: userLogoutSelector(state.FormReducer),
    FAQList: FAQListSelector(state.MoreReducer),
    isLoading: isLoadingSelector(state.MoreReducer),
    api: apiSelector(state.MoreReducer),
    error: errorSelector(state.MoreReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getFAQ: input => dispatch(getFAQ(input)),
    logoutUser: input => dispatch(logoutUser(input)),
  };
}

//MARK: - Navigation Header

const FAQScreenNew = withTheme(FAQScreen);

FAQScreenNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {state, setParams, navigate} = navigation;
  const {theme} = screenProps;
  return {
    title: translate('faq'),
    headerTitleStyle: {
      textAlign: 'left',
      alignSelf: 'flex-start',
      flex: 1,
      paddingRight: 0,
      paddingTop: 13,
      fontSize: 22,
      color: 'black',
      fontWeight: 'bold',
    },
    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(FAQScreenNew);
