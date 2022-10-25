/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {withTheme} from '../common/Theme/themeProvider';
import {Dropdown} from 'react-native-material-dropdown';
import {TextField} from 'react-native-material-textfield';
import {validateField, urlRule} from '../../components/utility/validation';

class UrlComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      protocol: 'http://',
      error: props.error,
    };

    this.validateSingleField = this.validateSingleField.bind(this);
    this.inputRef = this.updateRef.bind(this, props.item.name);
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
    const {theme} = this.props;
    const data = [{value: 'http://'}, {value: 'https://'}];
    let lable = '';
    const item = this.props.item;

    if (item.rules !== undefined && item.rules.includes('required')) {
      lable = item.lable + '*';
    } else {
      lable = item.lable;
    }
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 0.25, marginTop: 2}}>
          <Dropdown
            label=""
            data={data}
            value={'http://'}
            textColor={theme.headerColor}
            baseColor={theme.detailPlaceholderColor}
            fontSize={18}
            tintColor={theme.centerColor}
            onChangeText={this.changeText}
            animationDuration={0}
            lineWidth={2}
          />
        </View>
        <View style={{flex: 0.9}}>
          <TextField
            ref={this.inputRef}
            label={lable}
            textColor={theme.headerColor}
            baseColor={theme.detailPlaceholderColor}
            fontSize={18}
            tintColor={theme.centerColor}
            lineWidth={2}
            activeLineWidth={2}
            onChangeText={this.onChangeText}
            onChange={event => this.setState({url: event.nativeEvent.text})}
            onSubmitEditing={() => {
              this.validateSingleField();
            }}
            error={this.state.error}
            autoCapitalize="none"
            value={this.props.value}
          />
        </View>
      </View>
    );
  }
  changeText = text => {
    this.setState({protocol: text});
  };

  validateSingleField(name) {
    let value = this.state.url;

    if (!value) {
      this.setState({error: 'This field is required'});
    } else {
      let result = true;
      let warning = '';

      result = validateField(value, urlRule.validationRules);
      warning = 'Enter valid url';

      if (result === false) {
        this.setState({error: warning});
      } else {
        this.setState({error: undefined});
      }
    }
  }
}

export default withTheme(UrlComponent);
