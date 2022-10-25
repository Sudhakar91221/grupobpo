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

class InputTextField extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {error: props.error, secureTextEntry: true};
    this.onChangeText = this.onChangeText.bind(this);
    // this.onFocus = this.onFocus.bind(this);

    this.inputRef = this.updateRef.bind(this, props.item.name);
    this.onSubmitEditingField = this.onSubmitEditingField.bind(this);
    this.validateTheField = this.validateTheField.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);
  }
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  updateRef(name, ref) {
    this[name] = ref;
  }

  //MARK: - Main Render

  render() {
    const {theme, item} = this.props;

    if (item.name == 'country') {
      return (
        <View style={{flex: 1}}>{this.renderCountryMobileTextFields()}</View>
      );
    }

    switch (parseInt(item.type)) {
      case FieldType.PASSWORD:
        return <View style={{flex: 1}}>{this.renderPasswordField()}</View>;
      case FieldType.NUMBER:
        return <View style={{flex: 1}}>{this.renderNormalTextField()}</View>;
      case FieldType.EMAIL:
        return <View style={{flex: 1}}>{this.renderNormalTextField()}</View>;
      case FieldType.TEXT:
        return <View style={{flex: 1}}>{this.renderNormalTextField()}</View>;
    }
  }

  renderSInglelineTextField() {
    const {theme} = this.props;
    const item = this.props.item;
    let {errors = {}, secureTextEntry, ...data} = this.state;

    return (
      <View style={{flex: 1, padding: 10}}>
        <View style={[styless.leftRight, {backgroundColor: 'green'}]}>
          <Text
            style={[
              {
                textAlign: 'left',
                textTransform: 'uppercase',
                fontSize: 15,
                paddingTop: 18,
              },
            ]}>
            {' '}
            {item.lable}{' '}
          </Text>
        </View>
        {/* <Divider height={1.5} /> */}
      </View>
    );
  }

  updateField() {
    this.setState({updateField: true});
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
    let minLength = 20;
    let maxLength = 150;
    let multiline = false;

    if (item.rules !== undefined && item.rules.includes('min')) {
      let rules = item.rules.toString().split('|');

      let matchArray = item.rules.match(/.*min(.*)min.*/);
      if (matchArray !== null) {
        minLength = parseInt(matchArray[1]);
      }
    }

    if (item.rules !== undefined && item.rules.includes('max')) {
      let rules = item.rules.toString().split('|');

      let matchArray = item.rules.match(/.*max(.*)max.*/);
      if (matchArray !== null) {
        maxLength = parseInt(matchArray[1]);
      }
    }

    if (item.rules !== undefined && item.rules.includes('callback_multiline')) {
      multiline = true;
    }
    let keyboardType = 'default';
    switch (parseInt(item.type)) {
      case FieldType.NUMBER:
        keyboardType = 'numeric';
        break;
      case FieldType.EMAIL:
        keyboardType = 'email-address';
        break;
    }

    // let maxLength = this.props.item.name === 'mobile' ? 10 : 50;

    return (
      <TextField
        ref={this.inputRef}
        label={lable}
        // placeholder={item.lable}
        value={value}
        onChangeText={this.onChangeText}
        maxLength={maxLength}
        minLength={minLength}
        multiline={multiline}
        autoCapitalize={
          parseInt(item.type) !== FieldType.EMAIL ? 'words' : 'none'
        }
        onFocus={() => {
          this.props.onFocus;
        }}
        error={this.props.error}
        // onChange={event => this.setState({[item.name]: event.nativeEvent.text})}
        textColor={theme.headerColor}
        baseColor={theme.detailPlaceholderColor}
        fontSize={18}
        tintColor={theme.centerColor}
        keyboardType={keyboardType}
        lineWidth={2.0}
        onSubmitEditing={this.onSubmitEditingField}
        onEndEditing={this.validateTheField}
        // blurOnSubmit={false}
        editable={this.props.editable}
      />
    );
  }

  onSubmitEditingField = () => {
    this.props.focusTheField(this.props.item.name);
  };
  validateTheField = () => {
    this.props.validateTheField(this.props.item.name, this.props.item.type);
  };

  renderPasswordField() {
    let {secureTextEntry, confirmSecureTextEntry, ...data} = this.state;

    const {theme} = this.props;
    const item = this.props.item;
    // let {errors = {}, secureTextEntry, ...data} = this.state;

    const value = this.props.values;
    let lable = '';

    if (item.rules !== undefined && item.rules.includes('required')) {
      lable = item.lable + '*';
    } else {
      lable = item.lable;
    }

    let minLength = 20;
    let maxLength = 150;
    let multiline = false;
    
    if (item.rules !== undefined && item.rules.includes('min')) {
      let rules = item.rules.toString().split('|');

      let matchArray = item.rules.match(/.*min(.*)min.*/);
      if (matchArray !== null) {
        minLength = parseInt(matchArray[1]);
      }
    }

    if (item.rules !== undefined && item.rules.includes('max')) {
      let rules = item.rules.toString().split('|');

      let matchArray = item.rules.match(/.*max(.*)max.*/);
      if (matchArray !== null) {
        maxLength = parseInt(matchArray[1]);
      }
    }

    return (
      // <View>
        <TextField
          ref={this.inputRef}
          label={lable}
          value={value}
          onChangeText={this.onChangeText}
          minLength={minLength}
          maxLength={maxLength}
          multiline={multiline}
          lineWidth={2.0}
          onFocus={() => {
            this.props.onFocus;
          }}
          error={this.props.error}
          autoCapitalize="none"
          // onChange={event => this.setState({password: event.nativeEvent.text})}
          textColor={theme.headerColor} //input color
          baseColor={theme.detailPlaceholderColor} //normal color
          fontSize={18}
          tintColor={theme.centerColor} //typing color
          secureTextEntry={secureTextEntry}
          characterRestriction={20}
          textContentType={'password'}
          password={true}
          suffix={this.renderPasswordAccessory()}
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={this.onSubmitEditingField}
          onEndEditing={this.validateTheField}
          // blurOnSubmit={false}
          editable={this.props.editable}
        />
      // </View>
    );
  }

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({secureTextEntry: !secureTextEntry}));
  }
  renderPasswordAccessory() {
    let {secureTextEntry} = this.state;

    let name = secureTextEntry ? 'visibility' : 'visibility-off';

   
    
    return (
      <Icons.MaterialIcons
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress}
        suppressHighlighting={true}
      />
    );
  }

  renderCountryMobileTextFields() {
    let {secureTextEntry, confirmSecureTextEntry, ...data} = this.state;

    const {theme, errors} = this.props;
    const item = this.props.item;
    // let {errors = {}, secureTextEntry, ...data} = this.state;

    const value = this.props.values;
    let lable = '';

    if (item.rules !== undefined && item.rules.includes('required')) {
      lable = item.lable + '*';
    } else {
      lable = item.lable;
    }

    // if(item.name == 'mobile') {

    //  return(
    //   <View style={{width: ScreenWidth, paddingRight: 10,paddingLeft:120,height:50}}>
    //   {this.renderNormalTextField()}
    //   </View>)
    // }

    if (item.name == 'country') {
      return (
        // <View style={styless.stretchEqual}>

        <View style={{width: '100%', paddingRight: 10}}>
          <TextField
            ref={this.inputRef}
            label={lable}
            value={value}
            onChangeText={this.onChangeText}
            maxLength={4}
            multiline={false}
            autoCapitalize="none"
            onFocus={() => {
              this.props.onFocus;
            }}
            lineWidth={2.0}
            error={this.props.error}
            // onChange={event =>
            //   this.setState({countryMobile: event.nativeEvent.text})
            // }
            textColor={theme.headerColor}
            baseColor={theme.detailPlaceholderColor}
            fontSize={18}
            tintColor={theme.centerColor}
            keyboardType="phone-pad"
            lineColor={theme.headerColor}
            onSubmitEditing={this.onSubmitEditingField}
            onEndEditing={this.validateTheField}
            prefix={'+'}
            editable={this.props.editable}
          />
        </View>

        // </View>
      );
    }
  }

  onChangeText(text, id, data) {
    var self = this;

    //  if(this.countryOtherMobile != undefined && this.countryOtherMobile.isFocused()) {
    //       this.setState({ countryOtherMobileCode: text,countryOtherMobile:text,otherCountryId:data[id].actualValue.id })

    //  }else if(this.countryMobile != undefined && this.countryMobile.isFocused()) {
    //        this.setState({ countryMobileCode: text ,countryMobile : text,countryId:data[id].actualValue.id})

    //   }else{

    [this.props.item.name]
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          // if(name == 'countryOtherMobile' ) {
          //   this.setState({ countryOtherMobileCode: text });

          // }else  if(name == 'countryMobile') {
          //   this.setState({ countryMobileCode: text });

          // }else {

          if (text.length > 0) {
            this.setState({[name]: text, error: ''});
          } else {
            this.setState({[name]: text});
          }
          this.props.validateTheField(name, this.props.item.type);

          // }
        }
      });
  }

  //  }
  // }
}

export default withTheme(InputTextField);
