/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {IMAGE_DOWNLOAD_URL, API_KEY} from '../../../network/config';
import Shimmer from 'react-native-shimmer';
import ImageCell from '../../FormsComponent/Component/Image/ImageCell';
import {View, TouchableOpacity, Text} from 'react-native';

import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import CardView from '../../../components/views/CardView';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ScreenHeight} from '../../../components/utility/Settings';
import {ImageRow} from './NewMember';
import Icons from '../../../components/common/Icons';
import {translate} from '../../../../App';

class BoxCell extends React.PureComponent {
  constructor() {
    super();
    this.showDetail = this.showDetail.bind(this);
  }
  render() {
    const {theme, title, image, defaultSelected} = this.props;

    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 5,
          // overflow: 'hidden',
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 1,
            // overflow: 'hidden',
          }}
          onPress={this.showDetail(title)}>
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}
            style={[
              styless.textVertical,
              {
                padding: 0,
                justifyContent: 'space-between',
                alignItems: 'center',
                overflow: 'hidden',
                borderRadius: 15,
                paddingTop: 5,
                borderColor: 'lightgray',
                borderWidth: 1.0,
                backgroundColor:
                  defaultSelected === true
                    ? theme.primaryColor
                    : theme.backgroundColor,
              },
            ]}>
            <View
              style={{
                // alignSelf: 'center',
                height: 30,
                width: 30,
                top: 20,
                right: 20,
                position: 'absolute',
              }}>
              <Icons.Foundation
                name={
                  this.props.title == translate('for_renewal')
                    ? 'refresh'
                    : 'plus'
                }
                size={30}
                color={
                  defaultSelected === true
                    ? theme.backgroundColor
                    : theme.primaryColor
                }
              />
              {/* <ImageRow
                name={'default'}
                url={image}
                height={'100%'}
                width={'100%'}
                tintColor={
                  defaultSelected === true
                    ? theme.backgroundColor
                    : theme.primaryColor
                } 
              />*/}
            </View>
            <View
              style={{
                alignSelf: 'center',
                height: '60%',
                width: '40%',
              }}>
              <ImageRow
                name={'default'}
                url={image}
                height={'100%'}
                width={'100%'}
                tintColor={
                  defaultSelected === true
                    ? theme.backgroundColor
                    : theme.primaryColor
                }
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                height: 50,
                width: '100%',
              }}>
              <Text
                style={[
                  theme.header,
                  {
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    color:
                      defaultSelected === true
                        ? theme.backgroundColor
                        : theme.primaryColor,
                  },
                ]}>
                {title}
              </Text>
            </View>
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }

  showDetail = item => e => {
    if(this.props.changeSelection !== null) {
      this.props.changeSelection();

    }
  };
}

export default withTheme(BoxCell);
