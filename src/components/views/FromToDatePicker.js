/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Button, View, Keyboard, TouchableOpacity} from 'react-native';
import DateTimePicker from '../../components/views/DateTimePicker';
import {TextField} from 'react-native-material-textfield';
import moment from 'moment';
import KeyboardManager from 'react-native-keyboard-manager';
import {isIOS} from '../utility/Settings';

export default class FromToDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFromDatePickerVisible: false,
      fromDate: undefined,
      toDate: undefined,
      isToDatePickerVisible: false,
    };
    this.dateRef = this.updateRef.bind(this, 'date');
    this.pickerRef = this.updateRef.bind(this, 'picker');

    this.handleFromDatePicked = this.handleFromDatePicked.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.showDateTimePicker = this.hideDateTimePicker.bind(this);
    this.onTextFieldPress = this.onTextFieldPress.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onToDateTextPress = this.onToDateTextPress.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }

  showDateTimePicker = () => {
    if (this.state.isFromDatePickerVisible == true) {
      this.setState({isFromDatePickerVisible: false});
    } else {
      this.setState({isFromDatePickerVisible: true});
    }
  };

  hideDateTimePicker = () => {
    if (this.state.isFromDatePickerVisible == true) {
      this.setState({isFromDatePickerVisible: false});
    } else {
      this.setState({isFromDatePickerVisible: true});
    }
  };

  handleFromDatePicked = date => {
    console.log('From date has been picked: ', date);

    if (this.props.mode === 'time') {
      const selectedDate = moment(date).format('HH:mm');

      this.date.state.text = selectedDate.toString();
      //this.state.fromDate = selectedDate.toString();
      //this.props.fromDate = undefined;

      // if (isIOS == true) {
      //   this.date.onFocus = null;
      // } else {
      //   this.date.blur();
      // }
      this.setState({
        isFromDatePickerVisible: false,
        fromDate: selectedDate.toString(),
        //stoDate: selectedDate.toString(),
      });
    } else {
      const selectedDate = moment(date).format('DD/MM/YYYY');

      this.date.state.text = selectedDate.toString();
      //this.state.fromDate = selectedDate.toString();
      //this.props.fromDate = undefined;

      // if (isIOS == true) {
      //   this.date.onFocus = null;
      // } else {
      //   this.date.blur();
      // }
      this.setState({
        isFromDatePickerVisible: false,
        fromDate: selectedDate.toString(),
        //toDate: selectedDate.toString(),
      });
    }

    // this.hideDateTimePicker

    // this.setState(
    //   {isFromDatePickerVisible: false, date: selectedDate.toString()},
    //   () => {
    //     // let selectedDate = MomentTz.tz(date,timeZone).format("DD/MM/YYYY")
    //     // this.date.blur();

    //     this.date.state.text = selectedDate.toString();
    //     this.date.blur();
    //   },
    // );
    // this.hideDateTimePicker;
  };

  handleToDatePicked = date => {
    if (this.props.mode === 'time') {
      console.log('To date has been picked: ', date);

      const selectedDate = moment(date).format('HH:mm');

      this.date.state.text = selectedDate.toString();
      this.state.toDate = selectedDate.toString();
      //this.props.fromDate = undefined;

      // if (isIOS == true) {
      //   this.date.onFocus = null;
      // } else {
      //   this.date.blur();
      // }
      this.setState({
        isToDatePickerVisible: false,
        toDate: selectedDate.toString(),
      });
    } else {
      console.log('To date has been picked: ', date);

      const selectedDate = moment(date).format('DD/MM/YYYY');

      this.date.state.text = selectedDate.toString();
      this.state.toDate = selectedDate.toString();
      //this.props.fromDate = undefined;

      // if (isIOS == true) {
      //   this.date.onFocus = null;
      // } else {
      //   this.date.blur();
      // }
      this.setState({
        isToDatePickerVisible: false,
        toDate: selectedDate.toString(),
      });
    }

    // this.hideDateTimePicker

    // this.setState(
    //   {isFromDatePickerVisible: false, date: selectedDate.toString()},
    //   () => {
    //     // let selectedDate = MomentTz.tz(date,timeZone).format("DD/MM/YYYY")
    //     // this.date.blur();

    //     this.date.state.text = selectedDate.toString();
    //     this.date.blur();
    //   },
    // );
    // this.hideDateTimePicker;
  };

  updateRef(name, ref) {
    this[name] = ref;
  }

  validateTheField = () => {
    // this.hideDateTimePicker()
  };

  onTextFieldPress = () => {
    // KeyboardManager.resignFirstResponder();

    // Keyboard.dismiss()
    // if(this.date != undefined && this.date.isFocused()) {
    //   this.date.blur()
    // }

    // if(this.dateRef.state.isFocused == true) {

    // }
    if (this.state.isFromDatePickerVisible === true) {
      this.setState({isFromDatePickerVisible: false});
    } else {
      this.setState({isFromDatePickerVisible: true});
    }
  };

  onToDateTextPress = () => {
    // KeyboardManager.resignFirstResponder();

    // Keyboard.dismiss()
    // if(this.date != undefined && this.date.isFocused()) {
    //   this.date.blur()
    // }

    // if(this.dateRef.state.isFocused == true) {

    // }

    if (this.state.isToDatePickerVisible === true) {
      this.setState({isToDatePickerVisible: false});
    } else {
      this.setState({isToDatePickerVisible: true});
    }
  };

  onFocus() {
    if (this.date !== undefined) {
      if (this.date !== undefined && this.date.isFocused()) {
        this.date.blur();
        this.showDateTimePicker();
      }
    }
  }

  onChangeText(text, id, data) {
    // ['date']
    //   .map(name => ({name, ref: this[name]}))
    //   .forEach(({name, ref}) => {
    //     if (ref.isFocused()) {

    if (isIOS == true) {
      this.date.onFocus = this.onTextFieldPress;
      this.setState({isFromDatePickerVisible: true});
    }

    // if (name == 'date') {
    //   this.setState({[name]: text, isFromDatePickerVisible: true});
    // } else {
    //   this.setState({[name]: text});
    //     // }
    //   }
    // });
  }

  get18YearsBack() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const newDate = new Date(year, month - 216, day); // PLUS 1 YEAR

    return newDate;
  }

  get20YearsBack() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const newDate = new Date(year, month - 120, day); // PLUS 1 YEAR

    return newDate;
  }

  getFutureDateAfter5Days() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    //const newDate = new Date(year, month, day + 5); // PLUS 1 YEAR
    const newDate = new Date(year, month, day);
    return newDate;
  }

  render() {
    if (isIOS) {
      return this.renderIOSDateField();
    } else {
      return this.renderAndroidDateField();
    }
  }

  renderAndroidDateField() {
    // if(this.state.isFromDatePickerVisible == false) {
    //   this.state.isFromDatePickerVisible = true
    // }

    const {item} = this.props;
    return (
      <View style={{flexDirection: 'row', height: 80}}>
        <View
          style={{
            flex: 1,
            // paddingLeft: 10,
            // paddingRight: 10,
            // borderRadius: 5,
            // borderWidth: 1,
            // borderColor: 'gray',
            // marginLeft: 10,
            marginRight: 10,
          }}>
          <TextField
            lineWidth={1}
            ref={this.dateRef}
            label={'From'}
            value={
              this.state.fromDate === undefined
                ? this.props.fromDate
                : this.state.fromDate
            }
            placeholder={
              this.state.fromDate === undefined
                ? this.props.fromDate
                : this.state.fromDate
            }
            onFocus={
              this.state.isFromDatePickerVisible == false
                ? this.onTextFieldPress
                : null
            }
            onSubmitEditing={this.onSubmitEditingField}
            onEndEditing={this.validateTheField}
            tintColor="#343957"
          />

          {item.name == 'dob'
            ? this.state.isFromDatePickerVisible === true && (
                <DateTimePicker
                  isVisible={this.state.isFromDatePickerVisible}
                  onConfirm={this.handleFromDatePicked}
                  onCancel={() => {
                    this.setState({isFromDatePickerVisible: false});
                  }}
                  mode={this.props.mode}
                  // minimumDate={this.get18YearsBack()}
                  maximumDate={this.get18YearsBack()}
                />
              )
            : this.state.isFromDatePickerVisible === true && (
                <DateTimePicker
                  isVisible={this.state.isFromDatePickerVisible}
                  onConfirm={this.handleFromDatePicked}
                  onCancel={() => {
                    this.setState({isFromDatePickerVisible: false});
                  }}
                  mode={this.props.mode}
                  //minimumDate={this.getFutureDateAfter5Days()}
                />
              )}
        </View>
        <View
          style={{
            flex: 1,
            // paddingLeft: 10,
            // paddingRight: 10,
            // borderRadius: 5,
            // borderWidth: 1,
            // borderColor: 'gray',
            marginLeft: 10,
            // marginRight: 10,
          }}>
          <TextField
            lineWidth={1}
            ref={this.dateRef}
            label={'To'}
            value={
              this.props.toDate !== undefined
                ? this.props.toDate
                : this.state.toDate
            }
            placeholder={
              this.props.toDate !== undefined
                ? this.props.toDate
                : this.state.toDate
            }
            onFocus={
              this.state.isToDatePickerVisible == false
                ? this.onToDateTextPress
                : null
            }
            onSubmitEditing={this.onSubmitEditingField}
            onEndEditing={this.validateTheField}
            tintColor="#343957"
          />

          {item.name == 'dob'
            ? this.state.isToDatePickerVisible === true && (
                <DateTimePicker
                  isVisible={this.state.isToDatePickerVisible}
                  onConfirm={this.handleToDatePicked}
                  onCancel={() => {
                    this.setState({isToDatePickerVisible: false});
                  }}
                  mode={this.props.mode}
                  // minimumDate={this.get18YearsBack()}
                  maximumDate={this.get18YearsBack()}
                />
              )
            : this.state.isToDatePickerVisible === true && (
                <DateTimePicker
                  isVisible={this.state.isToDatePickerVisible}
                  onConfirm={this.handleToDatePicked}
                  onCancel={() => {
                    this.setState({isToDatePickerVisible: false});
                  }}
                  mode={this.props.mode}
                  //minimumDate={this.getFutureDateAfter5Days()}
                />
              )}
        </View>
      </View>
    );
  }

  renderIOSDateField() {
    const {item} = this.props;

    let date = undefined;
    if (!this.state.date) {
      date =
        this.props.value !== undefined || this.props.value !== 'undefined'
          ? this.props.value
          : item.name === 'dob'
          ? this.get18YearsBack()
          : this.getFutureDateAfter5Days();
    }
    return (
      <TouchableOpacity
        onPress={
          this.state.isFromDatePickerVisible == false
            ? this.onTextFieldPress
            : null
        }>
        <TextField
          lineWidth={2.0}
          ref={this.dateRef}
          label={item.lable}
          value={this.state.date ? this.state.date : date}
          // onFocus={
          //   this.state.isFromDatePickerVisible == false
          //     ? this.onTextFieldPress
          //     : null
          // }
          onSubmitEditing={this.onSubmitEditingField}
          onEndEditing={this.validateTheField}
          tintColor="#343957"
          editable={false}
        />

        {item.name == 'dob'
          ? this.state.isFromDatePickerVisible === true && (
              <DateTimePicker
                isVisible={this.state.isFromDatePickerVisible}
                onConfirm={this.handleFromDatePicked}
                onCancel={() => {
                  this.setState({isFromDatePickerVisible: false});
                }}
                mode={this.props.mode}
                // minimumDate={this.get18YearsBack()}
                maximumDate={this.get18YearsBack()}
              />
            )
          : this.state.isFromDatePickerVisible === true && (
              <DateTimePicker
                isVisible={this.state.isFromDatePickerVisible}
                onConfirm={this.handleFromDatePicked}
                onCancel={() => {
                  this.setState({isFromDatePickerVisible: false});
                }}
                mode={this.props.mode}
                minimumDate={this.getFutureDateAfter5Days()}
              />
            )}
      </TouchableOpacity>
    );
  }

  onSubmitEditingField = () => {
    this.date.isFocused = false;
  };

  validateTheField = () => {};
}
