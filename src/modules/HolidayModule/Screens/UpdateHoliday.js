/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Alert, Text} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {UPDATE_HOLIDAY} from '../Actions/type';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  updateHolidaySelector,
} from '../Actions/selectors';
import {updateHoliday} from '../Actions/HolidayActions';
import {Dropdown} from 'react-native-material-dropdown';
import {translate} from '../../../../App';
import InputForm from '../../FormsComponent/Forms/InputForm';
import {styless} from '../../../components/common/Styles';
import {BottomButton} from '../../../components/views/Button';
import moment from 'moment';

class UpdateHoliday extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.getParam('item');
    let formData = {
      fields: [
        {
          name: 'title',
          type: '1',
          lable: 'Title',
          rules: 'required',
          value: item.title,
        },
        {
          name: 'date',
          type: '7',
          lable: 'Date',
          rules: 'required',
          value: item.date,
        },
      ],
    };
    this.state = {
      item: item,
      formData: formData,
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

    this.state.value = list[this.state.item.type - 1].value;

    this.state.typeList = list;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == UPDATE_HOLIDAY) {
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
    if (this.props.api === UPDATE_HOLIDAY) {
      if (this.props.error !== null && this.props.api === UPDATE_HOLIDAY) {
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

      if (!this.props.error && this.props.api === UPDATE_HOLIDAY) {
        if (this.props.success !== prevProps.success) {
          Alert.alert(
            'Holiday updated successfully',
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
            item={this.state.formData}
            blockModel={this.state.formData}
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
    let details = this.currentPageRef.holiday.currentFieldsRef;
    var title =
    details.title.state.title === ''
        ? this.state.item.title
        : details.title.state.title;
    var date =
    details.date.state.date === ''
        ? this.state.item.date
        : details.date.state.date;
    let momentObj = moment(date, 'DD-MM-YYYY');
    let formattedDate = moment(momentObj).format('YYYY-MM-DD');
    var type = this.state.typeList.findIndex(
      obj => obj.value === this.state.value,
    );

   
    var input = {
      date: formattedDate,
      companyId: this.props.user.userCompany,
      userId: this.props.user.userId,
      holidayId: this.state.item.holidayId,
      request: UPDATE_HOLIDAY,
    };
    //if(title) {
      input['title'] = title;
   // }
    //if(type) {
      input['type'] = type + 1;
    //}
    this.props.updateHoliday(input);
  }

  changeText = text => {
    this.setState({value: text});
  };
}
const UpdateHolidayNew = withTheme(UpdateHoliday);
UpdateHolidayNew.navigationOptions = ({navigation, screenProps, params}) => {
  const {theme} = screenProps;
  return {
    title:'Update Holiday'
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.HolidayReducer),
    api: apiSelector(state.HolidayReducer),
    error: errorSelector(state.HolidayReducer),
    success: updateHolidaySelector(state.HolidayReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateHoliday: input => dispatch(updateHoliday(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateHolidayNew);
