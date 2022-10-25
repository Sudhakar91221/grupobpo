import React, {Component} from 'react';
import {SearchBar} from 'react-native-elements';
import {Text, StyleSheet, TextInput, FlatList, Keyboard, TouchableOpacity, Button,View} from 'react-native';
import Icons from '../common/Icons';
// import {View} from 'react-native-animatable';
import {ThemeColors} from 'react-navigation';
import {withTheme} from '../common/Theme/themeProvider';
// const listItems = [];

class SearchComponent extends React.Component {
  state = {
    search: '',
    searchBarFocused: false,
  };

  updateSearch = search => {
    this.setState({search});
  };
  componentDidMount() {
    this.keyboardDidShow = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardWillShow = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardWillHide = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
    this.keyboardDidHide = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  keyboardDidShow = () => {
    this.setState({searchBarFocused: false});
  };

  keyboardWillShow = () => {
    this.setState({searchBarFocused: false});
  };

  keyboardWillHide = () => {
    this.setState({searchBarFocused: false});
  };
  keyboardDidHide = () => {
    this.setState({searchBarFocused: false});
  };
  render() {
    const {search} = this.state;
    const {theme} = this.props;
    return (
      <View style={{ paddingTop: 10}}>
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: 5,
          }}>
          <View
            // animation="slideInRight"
            // duration={1000}
            style={{
              borderWidth: 1,
              height: 50,
              borderRadius: 5,
              borderColor: theme.grayText,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={this.props.onClearText}>
            <Icons.MaterialIcons
              name={this.state.searchBarFocused ? 'arrow-back' : 'search'}
              size={30}
              color="gray"
            />
            </TouchableOpacity>
            <TextInput
              placeholder="Search"
              placeholderTextColor={theme.grayText}
              style={[theme.detailLarge,{paddingLeft: 15, width: '100%'}]}
              onChangeText={this.props.onChangeText}
              
            />
          </View>
        </View>
        {/* <FlatList
                  style={{
                    backgroundColor: this.state.searchBarFocused
                      ? theme.headerColor
                      : 'white',
                  }}
                  data={listItems}
                  renderItem={({item}) => (
                    <Text style={{ padding: 20, fontSize: 20 }}>{item}</Text>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                /> */}
      </View>
    );
  }
}
export default withTheme(SearchComponent);
