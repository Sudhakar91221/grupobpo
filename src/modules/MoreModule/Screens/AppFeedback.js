/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {connect} from 'react-redux';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {AirbnbRating} from 'react-native-ratings';
import {feedbackAdd, feedbackGet, feedbackUpdate} from '../Actions/MoreActions';
import {
  isLoadingSelector,
  feedbackAddSelector,
  apiSelector,
  errorSelector,
  feedbackGetSelector,
  feedbackUpdateSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {FEEDBACK_ADD, FEEDBACK_GET, FEEDBACK_UPDATE} from '../Actions/type';
import {Dropdown} from 'react-native-material-dropdown';

class AppFeedback extends React.Component {
  constructor() {
    super();
    this.state = {
      submitGray: false,
      submitLoader: false,
      rating: 3,
      feedbackModel: undefined,
      category: 1,
    };

    this.feedbackRef = this.updateRef.bind(this, 'feedback');
    this.renderBottomButton = this.renderBottomButton.bind(this);
    this.renderFeedbackView = this.renderFeedbackView.bind(this);
    this.submitFeedbackTapped = this.submitFeedbackTapped.bind(this);
    this.ratingCompleted = this.ratingCompleted.bind(this);
    this.renderRatingView = this.renderRatingView.bind(this);
    this.validateSingleField = this.validateSingleField.bind(this);
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentWillMount() {
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      request: FEEDBACK_GET,
    };
    this.props.feedbackGet(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == FEEDBACK_ADD ||
        this.props.error.request == FEEDBACK_GET ||
        this.props.error.request == FEEDBACK_UPDATE)
    ) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          {
            text: 'OK',
            onPress: () => {
              this.props.navigation.navigate('Login');
            },
          },
          {cancelable: false},
        );
      }
    }

    //get feedback
    if (this.props.api === FEEDBACK_GET) {
      if (this.props.error !== null && this.props.api === FEEDBACK_GET) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            {
              text: 'OK',
              onPress: () => {
                if (this.props.error.message === 'Invalid Token') {
                  this.props.navigation.navigate('Login');
                }
              },
            },
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === FEEDBACK_GET) {
        if (this.props.feedbackModel.data !== this.state.feedbackModel) {
          this.setState({feedbackModel: this.props.feedbackModel.data});
          this.state.submitLoader = false;
          this.state.feedback = this.props.feedbackModel.data.desc;
          this.state.rating = this.props.feedbackModel.data.rating;
          this.state.category =
            this.props.feedbackModel.data.categoryId === undefined
              ? 1
              : this.props.feedbackModel.data.categoryId;

          let categoryList = [];
          Object.keys(this.props.feedbackModel.feedbackCategory).map(key => {
            categoryList = [
              ...categoryList,
              {
                index: key,
                value: this.props.feedbackModel.feedbackCategory[key].name,
              },
            ];
          });

          this.setState({categoryList: categoryList});
        }
      }
    }

    //add feedback
    if (this.props.api === FEEDBACK_ADD) {
      if (this.props.error !== null && this.props.api === FEEDBACK_ADD) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            {
              text: 'OK',
              onPress: () => {
                if (this.props.error.message === 'Invalid Token') {
                  this.props.navigation.navigate('Login');
                }
              },
            },
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === FEEDBACK_ADD) {
        if (this.props.feedbackAddSuccess !== this.state.feedbackAddSuccess) {
          this.state.submitLoader = false;
          Alert.alert(
            'Feedback added successfully !!!',
            '',
            [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
            {cancelable: false},
          );
        }
      }
    }

    //update feedback
    if (this.props.api === FEEDBACK_UPDATE) {
      if (this.props.error !== null && this.props.api === FEEDBACK_UPDATE) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            {
              text: 'OK',
              onPress: () => {
                if (this.props.error.message === 'Invalid Token') {
                  this.props.navigation.navigate('Login');
                }
              },
            },
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === FEEDBACK_UPDATE) {
        if (this.props.successMessage !== this.state.successMessage) {
          this.state.submitLoader = false;
          Alert.alert(
            this.props.successMessage,
            [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
            {cancelable: false},
          );
        }
      }
    }
  }

  render() {
    const {theme} = this.props;

    if (this.state.feedbackModel === undefined) {
      return <ActivityIndicatorCustom />;
    }

    return (
      <View style={{flex: 1, padding: 20}}>
        <View style={{flex: 1, marginTop: 20, padding: 10}}>
          <Text style={[theme.header, {fontSize: 26, alignSelf: 'center'}]}>
            {translate('submit_feedback')}
          </Text>
        </View>
        <View style={{flex: 1, marginTop: 50, padding: 10}}>
          <Text
            style={[
              theme.detail,
              {
                fontSize: 16,
                color: 'gray',
                textAlign: 'center',
              },
            ]}>
            {translate('feedback_hint')}
          </Text>
        </View>

        {this.renderDropdown()}
        {this.renderRatingView()}
        {this.renderFeedbackView()}
        <View style={{paddingTop: 30, width: '100%', height: '100%'}}>
          {this.renderBottomButton()}
        </View>
      </View>
    );
  }

  changeText = text => {
    var categoryIndex = this.state.categoryList
      .map(function(item) {
        return item.value;
      })
      .indexOf(text);
    this.setState({category: categoryIndex + 1});
  };

  renderDropdown() {
    const {theme} = this.props;
    var value =
      this.state.categoryList == undefined
        ? 'Select'
        : this.state.categoryList[this.state.category - 1].value;
    return (
      <View
        style={{
          width: '100%',
          paddingLeft: '10%',
          paddingRight: '10%',
          marginTop: 50,
        }}>
        <Dropdown
          label="Select Feedback Category"
          data={this.state.categoryList}
          value={value}
          textColor={theme.headerColor}
          baseColor={'gray'}
          fontSize={18}
          tintColor={theme.centerColor}
          onChangeText={this.changeText}
          animationDuration={0}
        />
      </View>
    );
  }

  renderRatingView() {
    const {theme} = this.props;
    return (
      <View style={{marginTop: 10}}>
        <AirbnbRating
          count={5}
          reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Great']}
          defaultRating={this.state.rating}
          size={40}
          selectedColor={theme.primaryColor}
          reviewColor={theme.primaryColor}
          reviewSize={22}
          onFinishRating={this.ratingCompleted}
        />
      </View>
    );
  }

  focus() {
    this.feedback.focus();
  }

  renderFeedbackView() {
    let {errors = {}} = this.state;
    const {theme} = this.props;
    return (
      <TouchableOpacity onPress={() => this.focus()}>
        <View
          style={{
            borderColor: 'lightgray',
            borderWidth: 1,
            padding: 10,
            marginTop: 30,
            minHeight: '30%',
          }}>
          <TextField
            ref={this.feedbackRef}
            value={this.state.feedback}
            placeholder={''}
            onChangeText={this.onChangeText}
            maxLength={300}
            multiline={true}
            lineWidth={0}
            activeLineWidth={0}
            // onFocus={this.onFocus}
            error={errors.feedback}
            autoCapitalize="none"
            onChange={event =>
              this.setState({feedback: event.nativeEvent.text})
            }
            textColor={theme.headerColor} //input color
            baseColor={theme.detailPlaceholderColor} //normal color
            fontSize={15}
            tintColor={theme.centerColor} //typing color
            // onSubmitEditing={() => {
            //   this.validateTheField('feedback');
            // }}
            // onEndEditing={() => {
            //   this.validateTheField('shop');
            // }}
            blurOnSubmit={true}
            // enablesReturnKeyAutomatically={true}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderBottomButton() {
    const {theme} = this.props;

    return (
      <View style={{backgroundColor: 'white', height: 55}}>
        <BottomButton
          style={{
            height: 50,
            borderRadius: 30,
            backgroundColor: theme.blueColor,
            position: 'absolute',
            bottom: 0,
            width: '80%',
          }}
          title={
            this.state.feedbackModel.id === ''
              ? translate('submit')
              : translate('update')
          }
          action={
            !this.state.submitLoader && !this.state.submitGray
              ? this.submitFeedbackTapped
              : null
          }
          isLoader={this.state.submitLoader}
          isGray={this.state.submitGray}
        />
      </View>
    );
  }

  ratingCompleted(rating) {
    this.setState({rating: rating});
  }

  submitFeedbackTapped() {
    if (this.validateSingleField('feedback') == false) {
      return;
    }
    this.setState({submitLoader: true});
    var input = {
      userId: this.props.user.userId,
      token: this.props.user.token,
      desc: this.state.feedback,
      rating: this.state.rating,
      category: this.state.category,
      request:
        this.state.feedbackModel.id === '' ? FEEDBACK_ADD : FEEDBACK_UPDATE,
    };
    this.state.feedbackModel.id === ''
      ? this.props.feedbackAdd(input)
      : this.props.feedbackUpdate(input);
  }

  validateSingleField(name) {
    let errors = {};
    let errorCount = 0;

    let value = this[name].value();

    if (!value) {
      errors[name] = 'This field is required';
      errorCount = errorCount + 1;
    }
    this.setState({errors});

    if (errorCount > 0) {
      return false;
    }
  }
}

const AppFeedbackNew = withTheme(AppFeedback);

AppFeedbackNew.navigationOptions = ({navigation, screenProps, params}) => {
  //To hide the NavigationBar from current Screen
  const {state, setParams, navigate} = navigation;
  const {theme} = screenProps;

  return {
    title: translate('in_app_feedback'),
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
    user: userLoginSelector(state.FormReducer),
    feedbackAddSuccess: feedbackAddSelector(state.MoreReducer),
    isLoading: isLoadingSelector(state.MoreReducer),
    api: apiSelector(state.MoreReducer),
    error: errorSelector(state.MoreReducer),
    feedbackModel: feedbackGetSelector(state.MoreReducer),
    successMessage: feedbackUpdateSelector(state.MoreReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    feedbackAdd: input => dispatch(feedbackAdd(input)),
    feedbackGet: input => dispatch(feedbackGet(input)),
    feedbackUpdate: input => dispatch(feedbackUpdate(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppFeedbackNew);
