/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ADD_HOLIDAY} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  addHolidaySelector,
} from '../Actions/selectors';
import {addHoliday} from '../Actions/HolidayActions';
import {Dropdown} from 'react-native-material-dropdown';
import {translate} from '../../../../App';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';

class Holiday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Public Holiday',
    };
    this.currentPageRef = {};
    this.onSubmitTapped = this.onSubmitTapped.bind(this);
  }

  componentWillMount() {
    let list = [];
    var lastYearObj = {index: 1, value: translate('public_holiday')};
    var currentYearObj = {index: 2, value: translate('special_day')};
    var nextYearObj = {index: 3, value: translate('double_holiday')};
    list.push(lastYearObj);
    list.push(currentYearObj);
    list.push(nextYearObj);
    this.state.typeList = list;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == ADD_HOLIDAY) {
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

    //add holiday
    if (this.props.api === ADD_HOLIDAY) {
      if (this.props.error !== null && this.props.api === ADD_HOLIDAY) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
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
      }

      if (!this.props.error && this.props.api === ADD_HOLIDAY) {
        if (this.props.holidayId !== prevProps.holidayId) {
          Alert.alert(
            'Holiday added successfully',
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }
  }

  render() {
    var value = '';
    if (this.state.value !== undefined) {
      value = this.state.value;
    } else {
      value = this.state.typeList[0].value;
    }
    const {theme} = this.props;

    return (
      <View style={{flex: 1}}>
        <View style={{height: 150}}>
          <InputForm
            onRef={ref => {
              this.currentPageRef['holiday'] = ref;
            }}
            item={formData}
            blockModel={formData}
            formId={'0'}
            navigation={this.props.navigation}
            editable={true}
            fromDetail={true}
            hideBottomButton={true}
            isRequireHeader={false}
          />
        </View>
        <Text
          style={[
            theme.header,
            {
              color: theme.primaryColor,
              fontWeight: 'bold',
              paddingTop: 20,
              paddingLeft: 20,
            },
          ]}
          numberOfLines={1}>
          {translate('holiday_type')}
        </Text>
        <View style={{padding: 5, paddingLeft: '5%', paddingRight: '5%'}}>
          <View
            style={{
              paddingLeft: '5%',
              paddingRight: '5%',
              borderRadius: 5,
              borderColor: 'gray',
              borderWidth: 1,
            }}>
            <Dropdown
              data={this.state.typeList}
              value={value}
              textColor={theme.headerColor}
              baseColor={'gray'}
              fontSize={16}
              tintColor={theme.centerColor}
              onChangeText={this.changeText}
              animationDuration={0}
            />
          </View>
        </View>

        <View style={{paddingLeft: '25%', paddingRight: '25%', paddingTop: 30}}>
          <BottomButton
            style={styless.bottomButton}
            title={translate('submit')}
            action={
              !this.state.submitLoader && !this.state.submitGray
                ? this.onSubmitTapped
                : null
            }
            isLoader={this.state.submitLoader}
            isGray={this.state.submitGray}
          />
        </View>
      </View>
    );
  }

  onSubmitTapped() {
    var title = this.currentPageRef.holiday.currentFieldsRef.title.state.title;
    var date = this.currentPageRef.holiday.currentFieldsRef.date.state.date;
    let momentObj = moment(date, 'DD/MM/YYYY');
    let formattedDate = moment(momentObj).format('YYYY-MM-DD');
    var type = this.state.typeList.findIndex(
      obj => obj.value === this.state.value,
    );
    var input = {
      title: title,
      date: formattedDate,
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      type: type + 1,
      request: ADD_HOLIDAY,
    };
    this.props.addHoliday(input);
  }

  changeText = text => {
    this.setState({value: text});
  };
}

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.HolidayReducer),
    api: apiSelector(state.HolidayReducer),
    error: errorSelector(state.HolidayReducer),
    holidayId: addHolidaySelector(state.HolidayReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    addHoliday: input => dispatch(addHoliday(input)),
  };
}


const HolidayNew = withTheme(Holiday);

HolidayNew.navigationOptions = ({navigation, screenProps, params}) => {
  //To hide the NavigationBar from current Screen
  const {state, setParams, navigate} = navigation;
  ;
  const {theme} = screenProps;

  return {
    title: 'New Holiday',
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HolidayNew);


let formData = {
  fields: [
    {
      name: 'title',
      type: '1',
      lable: 'Title',
      rules: 'required',
    },
    {
      name: 'date',
      type: '7',
      lable: 'Date',
      rules: 'required',
    },
  ],
};
