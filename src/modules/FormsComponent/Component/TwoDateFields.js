/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Button, View, Keyboard, TouchableOpacity} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextField} from 'react-native-material-textfield';
import moment from 'moment';
import KeyboardManager from 'react-native-keyboard-manager';
import {isIOS} from '../../../components/utility/Settings';
import DateTimePickerComponent from '../Component/DateTimePickerComponent';

export default class TwoDateFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      fromDate: '',
      toDate:'',
      dateSelection:false
    };

    this.pickerRef = this.updateRef.bind(this, 'picker');
    this.onAfterDateSelection = this.onAfterDateSelection.bind(this);
    this.renderToDateField = this.renderToDateField.bind(this);
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

  handleFromDatePicked = date => {
    console.log('A date has been picked: ', date);

    const selectedDate = moment(date).format('DD/MM/YYYY');

        // this.fromDate.state.text = selectedDate.toString();
        this.state.fromDate = selectedDate.toString();

        this.setState({
            isDateTimePickerVisible: false,
            fromDate: selectedDate.toString(),
          },() => {
            this.fromDate.state.text = selectedDate.toString();
            this.fromDate.onFocus()
          });
           
    this.props.item.value = undefined;
  };
  handleToDatePicked = date => {
    console.log('A date has been picked: ', date);

    const selectedDate = moment(date).format('DD/MM/YYYY');
       
          // this.toDate.state.text = selectedDate.toString();
       this.state.toDate = selectedDate.toString();

        this.setState({
            isDateTimePickerVisible: false,
            toDate: selectedDate.toString(),
        },() => {
            this.toDate.state.text = selectedDate.toString();
            this.toDate.onFocus()
        });
    
    this.props.item.value = undefined;

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
    if (this.fromDate !== undefined) {
      if (this.fromDate !== undefined && this.fromDate.isFocused()) {
        this.fromDate.blur();
        this.showDateTimePicker();
      }
    }
    if (this.toDate !== undefined) {
      if (this.toDate !== undefined && this.toDate.isFocused()) {
        this.toDate.blur();
        this.showDateTimePicker();
      }
    }
  }
 
  getTodaysDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const newDate = new Date(year, month , day); // PLUS 1 YEAR

    return newDate;
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

  render() {

    let item = this.props.item
        return(
        <View style={{flex:1,flexDirection:'row'}}>
            <View style={{width:'48%'}}>
            {this.renderFromDateField(item.childFields[0])}
            </View>
            <View style={{width:'4%'}}></View>
            <View style={{width:'48%'}}>
            {this.renderToDateField(item.childFields[1])}
            </View>
        </View>
        );
        
   
  }


  renderFromDateField(item) {
    // const {item} = this.props;

    return (

      <DateTimePickerComponent
        mode={this.props.mode}
        item={item}
        value={item.value}
        // theme={this.props.theme}
        onRef={ref => (this[item.name] = ref)}
        onAfterDateSelection={this.onAfterDateSelection}
        // minimumDate = {this.state.toDate  == "" ?  item.value : this.state.toDate}


      />
    )
  
  }
  onAfterDateSelection = (date) => {

    this.setState({toDate:date,dateSelection:true});
  }

  renderToDateField(item) {
    // const {item} = this.props;

    if(this.state.toDate) {
      return (

        <DateTimePickerComponent
            mode={this.props.mode}
            item={item}
            value={this.state.toDate }
            // theme={this.props.theme}
            onRef={ref => (this[item.name] = ref)}
            // minimumDate = {this.state.toDate  == "" ?  item.value : this.state.toDate}

        />
      )
    }
    return (

      <DateTimePickerComponent
          mode={this.props.mode}
          item={item}
          value={this.state.toDate  == "" ?  item.value : this.state.toDate }
          // theme={this.props.theme}
          onRef={ref => (this[item.name] = ref)}
          // minimumDate = {this.state.toDate  == "" ?  item.value : this.state.toDate}
      />
    )
    

  
  }
  onSubmitEditingField = () => {
    if (this.fromDate !== undefined) {
      this.fromDate.isFocused = false;
    }
    if (this.toDate !== undefined) {
      this.toDate.isFocused = false;
    }
  };
  validateTheField = () => {};
}
