/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, ImageBackground} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {TextField} from 'react-native-material-textfield';
import {validateField} from '../../../components/utility/validation';
import {
  emailRule,
  mobileRule,
  emptyRule,
} from '../../../components/utility/validation';
import {styless} from '../../../components/common/Styles';
import Divider from '../../../components/views/Divider';
import {FieldType} from '../Actions/APIIntegers';
import Icons from '../../../components/common/Icons';
import {ScreenWidth} from '../../../components/utility/Settings';
import {Dropdown} from 'react-native-material-dropdown';

class DropDownField extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      error: props.error,
      data: undefined,
    };
    this.onChangeText = this.onChangeText.bind(this);
    // this.onFocus = this.onFocus.bind(this);

    this.inputRef = this.updateRef.bind(this, props.item.name);
    this.onSubmitEditingField = this.onSubmitEditingField.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }

    let dropDownData = [];

    const options = this.props.item.childFields.option;
    Object.keys(options).map(key => {
      dropDownData = [...dropDownData, {value: key, label: options[key]}];
    });

    this.setState({dropDownData: dropDownData});
  }
  updateRef(name, ref) {
    this[name] = ref;
  }

  //MARK: - Main Render

  render() {
    const {theme, item} = this.props;

    return <View style={{flex: 1}}>{this.renderNormalTextField()}</View>;
  }

  renderNormalTextField() {
    const {theme, error} = this.props;
    const item = this.props.item;
    // let {errors = {}, secureTextEntry, ...data} = this.state;

    const value = this.props.values;
    let lable = '';

    if (item.rules !== undefined && item.rules.includes('required')) {
      lable = item.lable + '*';
    } else {
      lable = item.lable;
    }

    return (
      <Dropdown
        ref={this.inputRef}
        label={lable}
        // placeholder={item.lable}
        data={this.state.dropDownData}
        value={value !== undefined ? value : undefined}
        onChangeText={this.onChangeText}
        multiline={false}
        autoCapitalize="words"
        onFocus={() => {
          this.props.onFocus;
        }}
        error={this.state.error}
        // onChange={event => this.setState({[item.name]: event.nativeEvent.text})}
        textColor={theme.headerColor}
        baseColor={theme.detailPlaceholderColor}
        fontSize={18}
        tintColor={theme.centerColor}
        lineWidth={2.0}
        onSubmitEditing={this.onSubmitEditingField}
        onEndEditing={this.validateTheField}
        // blurOnSubmit={false}
      />
    );
  }

  onSubmitEditingField = () => {
    this.props.focusTheField(this.props.item.name);
  };
  validateTheField = () => {
    this.props.validateTheField(this.props.item.name);
  };

  onChangeText(text, id, data) {
    var self = this;

    [this.props.item.name]
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          self.setState({[name]: data[id].label, value: data[id].value});
        }
      });
  }
}

export default withTheme(DropDownField);
