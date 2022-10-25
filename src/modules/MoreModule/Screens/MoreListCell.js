/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, ImageBackground} from 'react-native';
import Icons from '../../../components/common/Icons';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import CardView from '../../../components/views/CardView';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ScreenHeight} from '../../../components/utility/Settings';
class MoreListCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
    this.showDetail = this.showDetail.bind(this);
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;

    return (
      <View
        style={{
          paddingTop: 10,
          paddingHorizontal: 20,
          justifyContent: 'flex-start',
          // backgroundColor: 'pink', //theme.backgroundColor,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 1,
          }}
          onPress={this.showDetail(item)}>
          <CardView
            cardElevation={0}
            cardMaxElevation={0}
            cornerRadius={0}
            style={[
              styless.leftRight,
              {
                padding: 0,
                // justifyContent: 'center',
                // alignItems: 'center',
                // overflow: 'hidden',
                // alignSelf: 'center',
              },
            ]}>
            <Text
              style={[theme.detailLarge, {textTransform: 'none', flex: 0.9}]}>
              {item.title}
            </Text>
            {item.detail !== undefined && (
              <Text
                style={[
                  theme.header,
                  {textAlign: 'right', justifyContent: 'flex-end'},
                ]}
                textAlign={'right'}>
                {item.detail}
              </Text>
            )}
            <Icons.MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color="gray"
              style={0.1}
            />
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - Event Handlers
  showDetail = item => e => {
    switch (item.title) {
      case 'Create Advertisement':
        this.props.navigation.navigate('CreateAdd');
        break;
      case 'Account Settings':
        this.props.navigation.navigate('Profile');
        break;
      case 'About eCity':
        this.props.navigation.navigate('WebviewScreen', {
          title: 'About eCity',
          url: 'https://ecity.mawsoftwares.in/about',
        });
        break;
      case 'Privacy, Terms and Conditions':
        this.props.navigation.navigate('WebviewScreen', {
          title: 'Terms & Conditions',
          url: 'https://ecity.mawsoftwares.in/terms',
        });
        break;
      case 'FAQs':
        this.props.navigation.navigate('FAQScreen');
        break;
      case 'In-App Feedback':
        this.props.navigation.navigate('AppFeedback');
        break;
      case 'My Advertisements':
        this.props.navigation.navigate('Advertisement');
        break;
    }
  };

  //MARK: - Render UI
}

export default withTheme(MoreListCell);
