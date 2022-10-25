/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Animated, Easing, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {BottomButton} from '../../../components/views/Button';
import {styless} from '../../../components/common/Styles';
import {translate} from '../../../../App';
import {StackActions, NavigationActions} from 'react-navigation';
import {applicationsListSelector, userLoginSelector, apiSelector, errorSelector,isLoadingSelector} from '../Actions/selectors';
import {connect} from 'react-redux';

import { getApplications } from '../Actions/FormActions';
import { APPLICATION_GET } from '../Actions/type';

class SuccessForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      progress: new Animated.Value(0),
    };

    this.onDoneButtonTapped = this.onDoneButtonTapped.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error !== null && this.props.api === APPLICATION_GET) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(this.props.error.message);
      }
    }

    if (!this.props.error && this.props.api === APPLICATION_GET) {
      let resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Dashboard' })
        ],
      });
      
      this.props.navigation.dispatch(resetAction);
    
    }
  }

  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
    }).start();

    setTimeout(
      () =>
        this.state.progress.stopAnimation(() => {
          //  this.save()
          // this.loadDrawer()
        }),
      1500,
    );
  }

  updatePageDetailsIfNeeded() {}
  render() {
    const {theme} = this.props;
  

    return (
      <View style={styless.container}>
        <View style={{paddingTop: 50, paddingHorizontal: 50}}>
          <View
            style={{
              width: 100,
              height: 100,
              alignSelf: 'center',
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <LottieView
              ref={animation => {
                this.animation = animation;
              }}
              source={require('../../../assets/Json/success_mark_jason.json')}
              loop={false}
              progress={this.state.progress}
            />
          </View>
        </View>
        <View style={styless.textVertical}>
          <Text
            style={[
              theme.H2,
              {paddingTop: 80, alignSelf: 'center', textAlign: 'center'},
            ]}>
            {' '}
            Form Submitted{' '}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                paddingHorizontal: 20,
                paddingTop: 30,
                alignSelf: 'center',
                textAlign: 'center',
                textTransform: 'none',
              },
            ]}>
            {' '}
            Your form has been successfully submitted to our Admin for review.
            See your form status on your eApplication.{' '}
          </Text>
        </View>
        <View>{this.renderBottomButton()}</View>
      </View>
    );
  }

  renderBottomButton1() {
    const {theme} = this.props;

    return (
      <View style={{backgroundColor: 'transparent', height: 55}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 5,
            backgroundColor: theme.blueColor,
            position: 'absolute',
            bottom: 10,
            width: '100%',
          }}
          title={translate('next')}
          action={this.onDoneButtonTapped}
          activeState={true}

        />
      </View>
    );
  }

  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View
        style={{
          backgroundColor: 'transparent',
          height: 55,
          width: '100%',
          bottom: 50,
        }}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 50,
            // position: 'absolute',
            // bottom: 100,
            width: '100%',
          }}
          backgroundColor={theme.primaryColor}
          title={translate('done')}
          action={this.onDoneButtonTapped}
          activeState={true}
          isLoader={false}
          isGray={false}
        />
      </View>
    );
  }

  onDoneButtonTapped = () => {
    // this.props.updatePage()


    this.callGetApplications()

    // this.props.navigation.goBack('ApplicationMain');
  };

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
    applications: applicationsListSelector(state.FormReducer),
    user : userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.FormReducer),
    api: apiSelector(state.FormReducer),
    error: errorSelector(state.FormReducer),
    // successMessage: successSelector(state.FormReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getApplication: input => dispatch(getApplications(input)),
  }
};

//MARK: - Navigation Header

const SuccessFormNew = withTheme(SuccessForm);

SuccessFormNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    navigationOptions: {
      // tabBarOnPress: (scene, jumpToIndex) => {
      //   console.log('onPress:', scene.route);
      //   jumpToIndex(scene.index);
      // },
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
    },

    headerStyle: {shadowColor: 'transparent', borderBottomWidth: 0},
    headerTintColor: theme.primaryColor,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SuccessFormNew);

// export default withTheme(SuccessForm);
