/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  FlatList,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {translate} from '../../../../App';
import {connect} from 'react-redux';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  salaryDetailSelector,
} from '../Actions/selector';
import {getSalaryDetail} from '../Actions/PayslipActions';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {GET_SALARY_DETAIL} from '../Actions/type';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import HidableView from '../../../components/views/HidableView';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import PayslipComponent from './PayslipComponent';
import FloatingButton from '../../../components/views/FloatingButton';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';

class SalaryDetail extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.state.params.item;
    let dates = item.period.split(' - ');
    let startDate = Moment(dates[0], 'YYYY-MM-DD').format('DD MMM YY');
    let endDate = Moment(dates[1], 'YYYY-MM-DD').format('DD MMM YY');
    this.state = {
      item: item,
      isEmployeeSalary: this.props.navigation.state.params.isEmployeeSalary,
      earningHide: true,
      allowanceHide: true,
      otherEarningHide: true,
      deductionHide: true,
      otherDeductionHide: true,
      modalVisible: false,
      period: startDate + ' - ' + endDate,
    };
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      handleStateChange: this.setModalVisible,
    });
  }

  componentWillMount() {
    if (this.state.isEmployeeSalary === false) {
      var input = {
        userId: this.props.user.userId,
        salaryId: this.state.item.salaryId,
        empId: this.props.user.userId,
        request: GET_SALARY_DETAIL,
      };
      this.props.getSalaryDetail(input);
    } else {
      var input = {
        userId: this.props.user.userId,
        salaryId: this.state.item.salaryId,
        empId: this.state.item.empId,
        request: GET_SALARY_DETAIL,
      };
      this.props.getSalaryDetail(input);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == GET_SALARY_DETAIL) {
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

    //get salary details
    if (this.props.api === GET_SALARY_DETAIL) {
      if (this.props.error !== null && this.props.api === GET_SALARY_DETAIL) {
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
      }

      if (!this.props.error && this.props.api === GET_SALARY_DETAIL) {
        if (this.props.salaryModel !== prevProps.salaryModel) {
          this.setState({salaryModel: this.props.salaryModel});
        }
      }
    }
  }

  setModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  render() {
    const {theme} = this.props;
    if (this.state.salaryModel === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View
          style={
            (styless.container,
            {
              flex: 1,
            })
          }>
          {this.state.isEmployeeSalary === true ? (
            <Text
              style={[
                theme.header,
                {textAlign: 'center', color: theme.primaryColor},
              ]}
              numberOfLines={1}>
              {this.state.period}
            </Text>
          ) : null}
          <ScrollView style={{flex: 1, padding: 10}}>
            <View style={{flexDirection: 'row', padding: 5}}>
              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}>
                  <View
                    style={{
                      marginRight: '10%',
                      marginLeft: '10%',
                      backgroundColor: 'white',
                      borderColor: 'gray',
                      borderRadius: 5,
                      borderWidth: 1,
                      padding: 5,
                    }}>
                    {this.renderDialogView()}
                  </View>
                </View>
              </Modal>
              <Text
                style={[
                  theme.header,
                  {textAlign: 'left', color: theme.primaryColor, flex: 1},
                ]}
                numberOfLines={1}>
                {translate('particulars')}
              </Text>

              <Text
                style={[
                  theme.header,
                  {textAlign: 'right', color: theme.primaryColor, flex: 1},
                ]}
                numberOfLines={1}>
                {translate('amount')}
              </Text>
            </View>
            <View
              style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
            />
            {this.renderEarningsView()}
            {this.renderAllowancesView()}
            {this.renderOtherEarningsView()}
            {this.renderDeductionView()}
            {this.renderOtherDeductionView()}
            <View style={{flexDirection: 'row', padding: 5, marginBottom: 10}}>
              <Text
                style={[
                  theme.header,
                  {textAlign: 'left', color: theme.net_pay, flex: 1},
                ]}
                numberOfLines={1}>
                {translate('net_total')}
              </Text>

              <Text
                style={[
                  theme.header,
                  {textAlign: 'right', color: theme.net_pay, flex: 1},
                ]}
                numberOfLines={1}>
                {this.state.salaryModel.currencySymbol}
                {this.state.salaryModel.salaryRec.netTotalSecond}
              </Text>
            </View>
          </ScrollView>
          <FloatingButton
            title={translate('detail')}
            onFloatButtonTapped={() =>
              this.props.navigation.navigate('SalaryTimesheetDetail', {
                period: this.state.salaryModel.periodId,
                startDate: this.state.salaryModel.salaryRec.startDate,
                endDate: this.state.salaryModel.salaryRec.endDate,
                userId: this.state.salaryModel.userId,
                isEmployeeSalary: this.state.isEmployeeSalary,
              })
            }
          />
        </View>
      </ScrollView>
    );
  }

  renderDialogView() {
    const {theme} = this.props;
    return (
      <View style={{marginLeft: 20, marginRight: 20}}>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.salaryRec.workingDays}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('working_days')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.salaryRec.holidays}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('holidays')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.salaryRec.leaves}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('leaves')}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 5}}>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.salaryRec.weeklyOff}
          </Text>
          <Text
            style={[
              theme.detail,
              {
                color: theme.black,
                marginLeft: 20,
              },
            ]}
            numberOfLines={1}>
            {translate('weekly_off')}
          </Text>
        </View>

        <View
          style={{width: '100%', height: 1, backgroundColor: 'lightgray'}}
        />
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible();
          }}>
          <Text
            style={{
              color: theme.primaryColor,
              fontWeight: 'bold',
              fontSize: 18,
              alignSelf: 'center',
              marginBottom: 10,
              textTransform: 'uppercase',
              marginTop: 10,
            }}>
            OK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderEarningsView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() => this.setState({earningHide: !this.state.earningHide})}>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              theme.header,
              {textAlign: 'left', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {translate('earnings')}
          </Text>

          <Text
            style={[
              theme.header,
              {textAlign: 'right', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.currencySymbol}
            {this.state.salaryModel.salaryRec.totalEarnings}
          </Text>
        </View>
        <HidableView hide={this.state.earningHide}>
          <View style={{flexDirection: 'row', padding: 5, marginLeft: 10}}>
            <FlatList
              data={this.state.salaryModel.earningRec}
              renderItem={this.renderPayslipItem}
              numColumns={1}
              keyExtractor={this._keyExtractor}
              extraData={this.props}
              ItemSeparatorComponent={flatListItemSpaceSeparator}
            />
          </View>
        </HidableView>
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
      </TouchableOpacity>
    );
  }

  renderAllowancesView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({allowanceHide: !this.state.allowanceHide})
        }>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              theme.header,
              {textAlign: 'left', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {translate('allowances')}
          </Text>

          <Text
            style={[
              theme.header,
              {textAlign: 'right', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.currencySymbol}
            {this.state.salaryModel.salaryRec.totalAllowance}
          </Text>
        </View>
        <HidableView hide={this.state.allowanceHide}>
          <View style={{flexDirection: 'row', padding: 5, marginLeft: 10}}>
            <FlatList
              data={this.state.salaryModel.allowanceRec}
              renderItem={this.renderPayslipItem}
              numColumns={1}
              keyExtractor={this._keyExtractor}
              extraData={this.props}
              ItemSeparatorComponent={flatListItemSpaceSeparator}
            />
          </View>
        </HidableView>
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
      </TouchableOpacity>
    );
  }

  renderOtherEarningsView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({otherEarningHide: !this.state.otherEarningHide})
        }>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              theme.header,
              {textAlign: 'left', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {translate('other_earnings')}
          </Text>

          <Text
            style={[
              theme.header,
              {textAlign: 'right', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.currencySymbol}
            {this.state.salaryModel.salaryRec.totalOtherearnings}
          </Text>
        </View>
        <HidableView hide={this.state.otherEarningHide}>
          <View style={{flexDirection: 'row', padding: 5, marginLeft: 10}}>
            <FlatList
              data={this.state.salaryModel.otherearningRec}
              renderItem={this.renderPayslipItem}
              numColumns={1}
              keyExtractor={this._keyExtractor}
              extraData={this.props}
              ItemSeparatorComponent={flatListItemSpaceSeparator}
            />
          </View>
        </HidableView>
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
      </TouchableOpacity>
    );
  }

  renderDeductionView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({deductionHide: !this.state.deductionHide})
        }>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              theme.header,
              {textAlign: 'left', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {translate('deductions')}
          </Text>

          <Text
            style={[
              theme.header,
              {textAlign: 'right', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.currencySymbol}
            {this.state.salaryModel.salaryRec.totalDeductions}
          </Text>
        </View>
        <HidableView hide={this.state.deductionHide}>
          <View style={{flexDirection: 'row', padding: 5, marginLeft: 10}}>
            <FlatList
              data={this.state.salaryModel.deductionRec}
              renderItem={this.renderPayslipItem}
              numColumns={1}
              keyExtractor={this._keyExtractor}
              extraData={this.props}
              ItemSeparatorComponent={flatListItemSpaceSeparator}
            />
          </View>
        </HidableView>
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
      </TouchableOpacity>
    );
  }

  renderOtherDeductionView() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({otherDeductionHide: !this.state.otherDeductionHide})
        }>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              theme.header,
              {textAlign: 'left', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {translate('other_deductions')}
          </Text>

          <Text
            style={[
              theme.header,
              {textAlign: 'right', color: theme.primaryColor, flex: 1},
            ]}
            numberOfLines={1}>
            {this.state.salaryModel.currencySymbol}
            {this.state.salaryModel.salaryRec.totalOtherdeductions}
          </Text>
        </View>
        <HidableView hide={this.state.otherDeductionHide}>
          <View style={{flexDirection: 'row', padding: 5, marginLeft: 10}}>
            <FlatList
              data={this.state.salaryModel.otherdeductionRec}
              renderItem={this.renderPayslipItem}
              numColumns={1}
              keyExtractor={this._keyExtractor}
              extraData={this.props}
              ItemSeparatorComponent={flatListItemSpaceSeparator}
            />
          </View>
        </HidableView>
        <View
          style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
        />
      </TouchableOpacity>
    );
  }

  renderPayslipItem = ({item}) => {
    return (
      <PayslipComponent
        item={item}
        navigation={this.props.navigation}
        currency={this.state.salaryModel.currencySymbol}
      />
    );
  };
}

const SalaryDetailNew = withTheme(SalaryDetail);
SalaryDetailNew.navigationOptions = ({navigation, screenProps}) => {
  const {theme} = screenProps;
  const {params = {}} = navigation.state;
  const title =
    params.isEmployeeSalary === true ? params.item.empName : params.item.period;

  return {
    title: title,
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
    headerRight: () => (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => params.handleStateChange()}>
          <Image
            source={require('../../../assets/ic_info.png')}
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
              //backgroundColor: '#343957',
            }}
          />
        </TouchableOpacity>
      </View>
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.PayslipReducer),
    api: apiSelector(state.PayslipReducer),
    error: errorSelector(state.PayslipReducer),
    salaryModel: salaryDetailSelector(state.PayslipReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getSalaryDetail: input => dispatch(getSalaryDetail(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SalaryDetailNew);
