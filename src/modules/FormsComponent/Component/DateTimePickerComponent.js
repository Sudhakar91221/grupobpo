/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Button, View, Keyboard, TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextField} from 'react-native-material-textfield';
import moment from 'moment';
import KeyboardManager from 'react-native-keyboard-manager';
import {isIOS} from '../../../components/utility/Settings';

export default class DateTimePickerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      date: '',
    };
    this.dateRef = this.updateRef.bind(this, 'date');
    this.pickerRef = this.updateRef.bind(this, 'picker');

    this.handleDatePicked = this.handleDatePicked.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
    this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
    this.showDateTimePicker = this.hideDateTimePicker.bind(this);
    this.onTextFieldPress = this.onTextFieldPress.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      
      this.props.onRef(this);
    }
  }
  showDateTimePicker = () => {
    if (this.state.isDateTimePickerVisible == true) {
      this.setState({isDateTimePickerVisible: false});
    } else {
      this.setState({isDateTimePickerVisible: true});
    }
  };

  hideDateTimePicker = () => {
    if (this.state.isDateTimePickerVisible == true) {
      this.setState({isDateTimePickerVisible: false});
    } else {
      this.setState({isDateTimePickerVisible: true});
    }
  };

  handleDatePicked = date => {
    console.log('A date has been picked: ', date);

    let selectedDate = moment(date).format('DD/MM/YYYY');

    if(this.props.mode == 'time') {
       selectedDate = moment(date).format('hh:mm');

    }


    this.date.state.text = selectedDate.toString();
    this.state.date = selectedDate.toString();
    this.props.item.value = undefined;

    // if (isIOS == true) {
    //   this.date.onFocus = null;
    // } else {
    //   this.date.blur();
    // }
    this.setState({
      isDateTimePickerVisible: false,
      date: selectedDate.toString(),
    },() => {
      this.date.state.text = selectedDate.toString();
      this.date.onFocus();
      if(this.props.onAfterDateSelection) {
        this.props.onAfterDateSelection(selectedDate.toString());
      }
    });

    
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
    if (this.state.isDateTimePickerVisible === true) {
      this.setState({isDateTimePickerVisible: false});
    } else {
      this.setState({isDateTimePickerVisible: true});
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
      this.setState({isDateTimePickerVisible: true});
    }

    // if (name == 'date') {
    //   this.setState({[name]: text, isDateTimePickerVisible: true});
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
    const newDate = new Date(year, month, day + 2); // PLUS 1 YEAR

    return newDate;
  }
  getTodaysDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const newDate = new Date(year, month, day ); // PLUS 1 YEAR

    return newDate;
  }

  render() {

    // if(isIOS) {
      return this.renderIOSDateField()
    // }else {
    //   return this.renderAndroidDateField()
    // }
  }


  renderIOSDateField() {
    const {item} = this.props;

    let date = undefined 
    if(!this.state.date) {
   date = this.props.value !== undefined || this.props.value !== 'undefined'
  ? this.props.value
  : (item.name === 'dob'
  ? this.get18YearsBack()
  : this.getFutureDateAfter5Days()) 
    }
    return (
      <TouchableOpacity onPress={this.state.isDateTimePickerVisible == false
            ? this.onTextFieldPress
            : null}>
        <TextField
          lineWidth={2.0}
          ref={this.dateRef}
          label={item.lable}
          value={ this.state.date ? this.state.date : date}
          // onFocus={
          //   this.state.isDateTimePickerVisible == false
          //     ? this.onTextFieldPress
          //     : null
          // }
          onSubmitEditing={this.onSubmitEditingField}
          onEndEditing={this.validateTheField}
          tintColor="black"
          editable={false}
        />

         {this.state.isDateTimePickerVisible === true && (
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={() => {
                  this.setState({isDateTimePickerVisible: false});
                }}
                mode={this.props.mode}
                 minimumDate={this.props.minimumDate ? moment(this.props.minimumDate,"dd/mm/yyyy") : this.getTodaysDate()}
                //maximumDate={this.getTodaysDate()}
              />
            )
          }
      </TouchableOpacity>
    );
  }
  onSubmitEditingField = () => {
    this.date.isFocused = false;
  };
  validateTheField = () => {};
}
