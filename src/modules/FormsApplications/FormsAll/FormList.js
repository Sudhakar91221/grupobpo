/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, ScrollView, Alert, View} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {flatListItemSeparator} from '../../../components/utility/common';
import FormListCell from './FormListCell';
import {styless} from '../../../components/common/Styles';

import {
  isLoadingSelector,
  formListSelector,
  apiSelector,
  errorSelector,
} from '../../FormsComponent/Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {getForms} from '../../FormsComponent/Actions/FormActions';
import {FORMS_GET} from '../../FormsComponent/Actions/type';
import {connect} from 'react-redux';
import BaseClass from '../../Base/BaseClass';
import {translate} from '../../../../App';

class FormList extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);

    // this._subscription = null;
    this.state = {
      screenHeight: 0,
      toastMessageUpdated: false,
      forms: [],
    };
    this.renderFormFlatlist = this.renderFormFlatlist.bind(this);
  }

  //MARK: - View Lifecycle

  componentWillMount() {
    this.fetchData();
  }
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === FORMS_GET) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (!this.props.error && this.props.api === FORMS_GET) {
      if (this.props.forms !== this.state.forms) {
        this.setState({forms: this.props.forms});
      }
    }
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;

    return (
      <BaseClass
        style={styless.baseclassContainer}
        title={translate('select_eApplications')}>
        <View
          style={
            (styless.newContainer,
            {
              paddingTop: this.state.showToastMessage !== undefined ? 30 : 0,
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
            <View style={{backgroundColor: 'white', paddingTop: 30}}>
              {this.renderFormFlatlist()}
            </View>
          </ScrollView>
        </View>
      </BaseClass>
    );
  }

  //MARK : - Event Handlers

  fetchData() {
    this.callGetForms();
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
  //MARK: - Render UI

  renderFormFlatlist() {
    if (this.state.forms !== undefined) {
      return (
        <View style={{flex: 1}}>
          <View style={{height: 1, backgroundColor: 'gray'}} />
          <FlatList
            data={this.state.forms}
            renderItem={this.renderFormItem}
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
          <View style={{height: 1, backgroundColor: 'gray'}} />
        </View>
      );
    }
  }

  renderFormItem = ({item}) => {
    return <FormListCell item={item} navigation={this.props.navigation} />;
  };

  //MARK: - API CALL

  callGetForms() {
    var input = {
      // sellId: this.props.user.sellId,
      // token: this.props.user.token,
      page: '1',
    };
    this.props.getForms(input);
  }
}
//MARK: - Data Management

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    forms: formListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getForms: input => dispatch(getForms(input)),
  };
}

//MARK: - Navigation Header

const FormListNew = withTheme(FormList);

FormListNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: translate('select_eApplications'),
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
export default connect(mapStateToProps, mapDispatchToProps)(FormListNew);
