/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styless} from '../../../components/common/Styles';
import HidableView from '../../../components/views/HidableView';
import Icons from '../../../components/common/Icons';
import {withTheme} from '../../../components/common/Theme/themeProvider';

class FAQCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {hide: true};
    this.showDetail = this.showDetail.bind(this);
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;

    return (
      <View style={{flex: 1}}>
        <View
          style={
            (styless.textVertical,
            {
              padding: 5,
              justifyContent: 'flex-start',
            })
          }>
          <TouchableOpacity
            style={{
              flex: 1,
              margin: 1,
              padding: 5,
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}
            onPress={this.showDetail(this.state.item)}>
            <Text style={[theme.header, {fontSize: 20, flex: 1}]}>
              Q. {this.props.item.question}
            </Text>
            <Icons.MaterialIcons
              name="keyboard-arrow-down"
              size={30}
              color="black"
            />
          </TouchableOpacity>
          <HidableView
            hide={this.state.hide}
            style={{backgroundColor: theme.backgroundColor}}>
            <Text style={[theme.detail, {padding: 5, fontSize: 18}]}>
              Ans. {this.props.item.answer}
            </Text>
          </HidableView>
        </View>
      </View>
    );
  }

  //MARK: - Event Handlers

  showDetail = item => e => {
    this.setState({hide: !this.state.hide});
  };
}

export default withTheme(FAQCell);
