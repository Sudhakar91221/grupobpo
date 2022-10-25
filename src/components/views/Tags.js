import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableHighlight,
  ViewPropTypes
} from 'react-native';
import Icons from '../common/Icons';
import { TextField } from 'react-native-material-textfield';


class Tags extends React.Component {

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  clear() {
    this.input.clear();
  }

  isFocused() {
    return this.input.isFocused();
  }

  setNativeProps(nativeProps) {
    this.input.setNativeProps(nativeProps);
  }

  renderLabel = (text, style) => {
    return (
      <Text style={style}>
      {text}
      </Text>
  )
  };

  renderLeftElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.leftElement, style])}>
      {element}
      </View>
  )
  };

  renderRightElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.rightElement, style])}>
      {element}
      </View>
  )
  };

  onChangeText = (text, tags, updateState, keysForTags) => {

    let keysStr;
    if (typeof keysForTags === 'string') {
      keysStr = keysForTags;
    } else {
      keysStr = ' ';
    }

    if (text.includes(keysStr)) {
      if (text === keysStr) {
        return
      }
      let tempTag = text.replace(keysStr, '');
      let tempArray = tags.tagsArray;
      console.log(tempTag);
      tempArray.push(tempTag);
      let tempObject = {
        tag: '',
        tagsArray: tempArray
      };
      updateState(tempObject);
      return this.input.clear();
    }
    let tempObject = {
      tag: text,
      tagsArray: tags.tagsArray
    };
    return updateState(tempObject)
  };

  deleteTag = (tagToDelete, tags, updateState) => {

    let tempArray = tags.tagsArray;
    tempArray.splice(tagToDelete, 1);

    let tempObject = {
      tag: tags.tag,
      tagsArray: tempArray
    };
    updateState(tempObject)
  };

  render() {
    const {
      containerStyle,
      disabled,
      disabledInputStyle,
      inputContainerStyle,
      leftElement,
      leftElementContainerStyle,
      rightElement,
      rightElementContainerStyle,
      inputStyle,
      label,
      labelStyle,
      tags,
      tagStyle,
      tagTextStyle,
      tagsViewStyle,
      updateState,
      keysForTag,
      deleteIconStyles
    } = this.props;

    const props = this.props;
    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {/* {label ? this.renderLabel(label, StyleSheet.flatten([styles.labelStyle, labelStyle])) : null} */}
      {/* <View style={StyleSheet.flatten(StyleSheet.flatten([styles.inputContainer, inputContainerStyle]))}> */}
      {/* {leftElement ? this.renderLeftElement(leftElement, leftElementContainerStyle) : null} */}

      {tags.tag != "" ? 

      <TextField
    // underlineColorAndroid="transparent"
    editable={!disabled}
    ref={ref => {
      this.input = ref;
    }}
    style={[styles.input]}
    value={tags.tag != "" ? tags.tag : undefined}
    label={label}
    onChangeText={text => this.onChangeText(text, tags, updateState, keysForTag)}
    />

    :      <TextField
    // underlineColorAndroid="transparent"
    editable={!disabled}
    ref={ref => {
      this.input = ref;
    }}
    style={[styles.input]}
    label={label}
    onChangeText={text => this.onChangeText(text, tags, updateState, keysForTag)}
    />
      }

    {rightElement ? this.renderRightElement(rightElement, rightElementContainerStyle) : null}
  {/* </View> */}
    <View style={StyleSheet.flatten([styles.tagsView, tagsViewStyle])}>
      {tags.tagsArray.map((item, count) => {
          return (
            <View
          style={StyleSheet.flatten([styles.tag, tagStyle])}
          key={count}
            >
            <Text style={[styles.tagText, {color:tagTextStyle}]}>{item}</Text>
            <TouchableHighlight onPress={() => this.deleteTag(count, tags, updateState) }>
       
          <Icons.MaterialCommunityIcons name="close-circle" size={20} style={StyleSheet.flatten([styles.deleteIcon, deleteIconStyles])}></Icons.MaterialCommunityIcons>
          </TouchableHighlight>
          </View>
        )
        })}
      </View>
      </View>
  );
  }
}

Tags.propTypes = {
  disabled: PropTypes.bool,
  leftElement: PropTypes.element,
  rightElement: PropTypes.element,
  label: PropTypes.string,
  tags: PropTypes.object,
  updateState: PropTypes.function,
  keysForTag: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  inputStyle: ViewPropTypes.style,
  disabledInputStyle: ViewPropTypes.style,
  leftElementContainerStyle: ViewPropTypes.style,
  rightElementContainerStyle: ViewPropTypes.style,
  labelStyle: ViewPropTypes.style,
  deleteIconStyles: ViewPropTypes.style,
};

const styles = {
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  disabledInput: {
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    // borderWidth: 0.5,
    // borderColor: 'gray'
  },
  leftElement: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightElement: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    color: 'black',
    fontSize: 18,
    flex: 1,
    minHeight: 40,
    marginLeft: 5,
    marginRight: 5,
  },
  tagsView: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    height: 35,
    borderRadius: 13,
    backgroundColor: '#979797',
    minWidth: 40,
    maxWidth: 150,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 5,
    borderWidth: 0.5,
    borderColor: 'gray'
  },
  tagText: {
    marginHorizontal: 5
  },
  labelStyle: {
    fontSize: 12,
    // marginTop: 12,
    // marginBottom: -4
  },
  deleteIcon: {
    width: 20,
    height: 20,
    opacity: 0.5,
    marginLeft: 5
  }
};

export default Tags;