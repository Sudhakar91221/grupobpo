/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {BottomButton} from '../../../components/views/Button';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import BoxCell from './BoxCell';
import {styless} from '../../../components/common/Styles';
import {ScreenHeight, ScreenWidth} from '../../../components/utility/Settings';
import {connect} from 'react-redux';
import BaseClass from '../../Base/BaseClass';

import {
  isLoadingSelector,
  blockListSelector,
  apiSelector,
  errorSelector,
  applicationSubmitSelector,
} from '../../FormsComponent/Actions/selectors';
import {getBlocks, emptyApplication} from '../../FormsComponent/Actions/FormActions';
import {BLOCKS_GET, EMPTY_APPLICATION} from '../../FormsComponent/Actions/type';
// import FormPagerTab from './FormPagerTab';

class FormType extends React.PureComponent {

  //MARK: - Constructor
  constructor(props) {
    super(props);

    this.state = {
      defaultSelected: 0,
    };
    this.onStartEApplicationTapped = this.onStartEApplicationTapped.bind(this);
    this.changeBoxSelection = this.changeBoxSelection.bind(this);

  }

  //MARK: - View LIfecycle

  componentDidMount() {
    // this.callGetBlock();
    this.callEmptyApplicationModel()

  }

  refreshApplicationModel = () => {
    // this.callEmptyApplicationModel()

  }

  componentDidUpdate(prevProps) {
    if (
      (!this.props.error && this.props.api === BLOCKS_GET,
      this.state.blocksFetchedAlready == false)
    ) {
      if (this.props.blocks !== prevProps.blocks) {
        this.setState({blocks: this.props.blocks}, () => {});
      }
    }

    if (
      (!this.props.error && this.props.api === EMPTY_APPLICATION)
    ) {
      if (this.props.blocks !== prevProps.blocks) {
        this.setState({blocks: this.props.blocks}, () => {});
      }
    }
  }

  //MARK: - Render Main

  render() {
    const {theme} = this.props;
    return (
      <BaseClass title={translate('buisness_permit')}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            bottom: 80,
          }}>
          <View style={{height: ScreenWidth - 100, width: ScreenWidth - 30}}>
            <Text
              style={[
                theme.detailMedium,
                {paddingBottom: 20, textTransform: 'none'},
              ]}>
              {translate('select_one_of_the_choices')}
            </Text>
            {/* <View style={styless.stretchEqual}></View> */}
            <View style={{flex:1,width:'50%',alignSelf:'center'}}> 
              <BoxCell
                title={translate('new_business_permit')}
                image={require('../../../asset/form.png')}
                navigation={this.props.navigation}
                defaultSelected={
                  this.state.defaultSelected === 0 ? true : false
                }
                changeSelection={
                  this.state.defaultSelected === 0
                    ? null
                    : this.changeBoxSelection
                }
              />
              {/* <BoxCell
                title={translate('for_renewal')}
                image={require('../../../asset/form.png')}
                navigation={this.props.navigation}
                defaultSelected={
                  this.state.defaultSelected === 1 ? true : false
                }
                changeSelection={
                  this.state.defaultSelected === 1
                    ? null
                    : this.changeBoxSelection
                }
              /> */}
            </View>
            <View style={{paddingTop: 30, width: '100%'}}>
              {this.renderBottomButton()}
            </View>
          </View>
        </View>
      </BaseClass>
    );
  }

  changeBoxSelection = () => {
    if (this.state.defaultSelected == 0) {
      this.setState({defaultSelected: 1});
    } else {
      this.setState({defaultSelected: 0});
    }
  };
  //MARK: - Event Handler
  onStartEApplicationTapped = () => {
    this.props.navigation.navigate('NewBusiness', {
      applicationId:
        this.props.navigation.state.params !== undefined
          ? this.props.navigation.state.params.applicationId
          : undefined,
    });
  };

  //MARK: - Render UI

  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View style={{backgroundColor: 'transparent', width: '100%'}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            backgroundColor: theme.blueColor,
            // position: 'absolute',
            // bottom: 10,
            width: '100%',
          }}
          title={translate('get_started')}
          action={this.onStartEApplicationTapped}
          activeState={true}
          isLoader={false}
          isGray={false}
        />
      </View>
    );
  }

  //MARK: - API CALL
  callGetBlock() {
    var input = {
      // sellId: this.props.user.sellId,
      // token: this.props.user.token,
      formId: '1',
    };
    this.props.getBlocks(input);
  }

  callEmptyApplicationModel() {
    var input = {
      // sellId: this.props.user.sellId,
      // token: this.props.user.token,
      formId: '1',
    };
    this.props.emptyApplicationModel(input);
  }
}

const FormTypeNew = withTheme(FormType);

FormTypeNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title: translate('buisness_permit'),
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

//MARK: - Data Management

function mapStateToProps(state) {
  return {
    // user: userLoginSelector(state.FormReducer),
    blocks: blockListSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    applicationModel:applicationSubmitSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getBlocks: input => dispatch(getBlocks(input)),
    emptyApplicationModel: input => dispatch(emptyApplication(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormTypeNew);
