/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Button, View, Keyboard, TouchableOpacity, Text, Image} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {TextField} from 'react-native-material-textfield';
import moment from 'moment';
import KeyboardManager from 'react-native-keyboard-manager';
import {isIOS,ScreenWidth} from '../../../components/utility/Settings';
import DateTimePickerComponent from '../Component/DateTimePickerComponent';
import InputTextField from '../Component/InputTextField';
import {FieldType} from '../Actions/APIIntegers';
import DropDownField from '../Component/DropDownField';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class MultiAnyFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
        errors : {}
    };

    this.focus = this.focus.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
    this.focusTheField = this.focusTheField.bind(this);
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  

  updateRef(name, ref) {
    this[name] = ref;
  }
  
  render() {
    let inputs = [];

    let item = this.props.item
    const {theme} = this.props;
 let width =(ScreenWidth-30)/item.childFields.length;

    item.childFields.map(
        function(item) {
          // let itemName = item.name !== '' ? item.name : item.controller;
          // item.value = this.state[itemName];
  
          switch (parseInt(item.type)) {

            case FieldType.DROPDOWN:
              inputs.push(
                <View style={{backgroundColor: theme.backgroundColor,width:width}}>
                  {this.renderDropDownField(item)}
                </View>,
              );
              break;

         case FieldType.TEXT:
          case FieldType.NUMBER:
          case FieldType.PASSWORD:
          case FieldType.EMAIL:
            if (
              item.type == FieldType.PASSWORD &&
              this.state.applicationId !== undefined
            ) {
            } else {
              inputs.push(
                <View style={{backgroundColor: theme.backgroundColor,width:width}}>
                  {this.renderNewTextField(item)}
                  {/* <Divider borderColor="gray"  /> */}
                </View>,
              );
            }
            break;


          }
    }.bind(this),
  );


     return (

        <View style={{flex:1,flexDirection:'row'}}>
       {inputs}
        </View>
     )
        
   
  }

  renderDropDownField(item) {
    // item.value = this.state[item.name];

    const {theme} = this.props;
    let error =
    // this.inputFormRef[item.type + ':' + item.name] && this.inputFormRef[item.type + ':' + item.name][item.name] 
    //     ? this.inputFormRef[item.type + ':' + item.name][item.name].state.error
    //     : undefined;

      this[item.name] !== undefined
        ? this[item.name].state.error
        : undefined;

    if (error == undefined) {
      if (this.state.errors !== undefined) {
        error = this.state.errors[item.name];
      }
    }

    let applicationModelValue = this.props.applicationModel;
    if (this.props.applicationModel !== undefined) {
      applicationModelValue = this.props.applicationModel[item.name];
    }

    let itemValue = item.value !== '' ? item.value : applicationModelValue;

    //  if(itemValue == undefined) {
    //   itemValue = this.state.newInputDict !== undefined ? this.state.newInputDict[item.name] : ''
    //  }
    //  if(itemValue == undefined) {
    //   itemValue = this.state.inputDict !== undefined ? this.state.inputDict[item.name] : ''
    //  }

    return (
      <View style={{flexDirection: 'row'}}>
          <DropDownField
            onRef={ref => {
              this[item.name] = ref;
            }}
            values={itemValue}
            error={error}
            focus={this.focus}
            focusTheField={this.focusTheField}
            validateTheField={this.validateTheField}
            item={item}
            editable={this.props.editable}
          />
      </View>
    );
  }

  focus = () => {
    this.props.focus();
  };
  
  focusTheField = () => {
    this.props.focusTheField(this.props.item.name);
  };
  validateTheField = () => {
    this.props.validateTheField(this.props.item.name, this.props.item.type, true);
  };
 
  renderNewTextField(item) {
    // item.value = this.state[item.name];

    const {theme} = this.props;
    let error =
      this[item.name] !== undefined
        ? this[item.name].state.error
        : undefined;

    if (error == undefined) {
      if (this.state.errors !== undefined) {
        error = this.state.errors[item.name];
      }
    }

    let applicationModelValue = this.props.applicationModel;
    if (this.props.applicationModel !== undefined) {
      applicationModelValue = this.props.applicationModel[item.name];
    }

    let itemValue = item.value !== '' ? item.value : applicationModelValue;

    //  if(itemValue == undefined) {
    //   itemValue = this.state.newInputDict !== undefined ? this.state.newInputDict[item.name] : ''
    //  }
    //  if(itemValue == undefined) {
    //   itemValue = this.state.inputDict !== undefined ? this.state.inputDict[item.name] : ''
    //  }

    return (
      <View style={{flexDirection: 'row'}}>
        {this.props.isLoginField === true ? (
          <View style={{position: 'absolute', height: 60, top: 43, width: 30}}>
            <Image
              source={{uri: item.name === 'email' ? 'user' : 'lock'}}
              // size={20}
              color={'cornflowerblue'}
              style={{
                height: 22,
                width: item.name === 'email' ? 22 : 17,
                bottom: 10,
              }}
            />
            <View
              style={[
                {
                  width: 30,
                  height: 2.0,
                  backgroundColor: theme.detailPlaceholderColor,
                },
              ]}>
              <Text style={{color: theme.backgroundColor}}>.</Text>
            </View>
          </View>
        ) : null}

        <View
          style={{
            marginLeft: this.props.isLoginField === true ? 25 : 0,
            flex: 1,
          }}>
          <InputTextField
            onRef={ref => {
              this[item.name] = ref;
            }}
            values={itemValue}
            error={error}
            focus={this.focus}
            focusTheField={this.focusTheField}
            validateTheField={this.validateTheField}
            item={item}
            editable={this.props.editable}
          />
        </View>
      </View>
    );
  }
 
}

const MultiAnyFieldsNew = withTheme(MultiAnyFields);
export default MultiAnyFieldsNew;