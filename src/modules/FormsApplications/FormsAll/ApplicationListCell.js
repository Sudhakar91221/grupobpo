/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {IMAGE_DOWNLOAD_URL} from '../../../network/config';
import Shimmer from 'react-native-shimmer';
import ImageCell from '../../FormsComponent/Component/Image/ImageCell';
import {View, TouchableOpacity, Text, ImageBackground} from 'react-native';
import Icons from '../../../components/common/Icons';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import CardView from '../../../components/views/CardView';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ScreenHeight} from '../../../components/utility/Settings';
class ApplicationListCell extends React.PureComponent {
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

    let time = 'Submitted ...';
    if (item.postUpdateTime !== 'Just Now') {
      time = 'Submitted ' + Moment.unix(item.postUpdateTime).fromNow();
    } else {
      time = 'Submitted ' + item.postUpdateTime;
    }

    return (
      <View
        style={
          (styless.textVertical,
          {
            paddingTop: 0,
            paddingHorizontal: this.props.isFromDetail === undefined ? 5 : null,
            justifyContent: 'flex-start',
            margin: this.props.isFromDetail === undefined ? 2 : null,
            // backgroundColor:
            //       this.props.isFromDetail === undefined
            //         ? theme.processingBackColor
            //         : null,
          })
        }>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 1,
            // backgroundColor: 'darkgray',
          }}
          onPress={this.showDetail(item)}>
          <CardView
            cardElevation={2}
            cardMaxElevation={2}
            cornerRadius={5}
            style={[
              styless.nextToEach,
              {
                padding: 1,
                justifyContent: 'center',
                alignItems: 'center',
                // marginBottom: 10,
                overflow: 'hidden',
                alignSelf: 'center',
                backgroundColor:
                  this.props.isFromDetail === undefined
                    ? theme.processingBackColor
                    : null,
                borderColor:
                  this.props.isFromDetail === undefined
                    ? theme.processingColor
                    : null,
                borderWidth: this.props.isFromDetail === undefined ? 1.0 : 0,
              },
            ]}>
            <View
              style={[
                styless.textVertical,
                {
                  paddingHorizontal: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '100%',
                  height: '100%',
                  paddingVertical: 10,
                },
              ]}>
              <Text style={theme.headerSmall}>
                {item.title !== undefined || item.title !== ''
                  ? item.title
                  : item.buisnessName}
              </Text>
              <Text
                style={[theme.detailSmall, {textAlign: 'right'}]}
                numberOfLines={1}>
                {time}
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal:
                  this.props.isFromDetail === undefined ? 10 : 0,
                alignSelf: 'center',
              }}>
              {this.renderImage(item)}
            </View>
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - Event Handlers
  showDetail = item => e => {
    this.props.navigation.navigate('ApplicationDetail', {
      applicationId: item.id,
    });
  };

  //MARK: - Render UI
  renderImage(item) {
    //TODO: - temp commented
    //const {theme} = this.props;
    /* if (item.commentBy !== undefined && item.commentBy.photo !== undefined) {
      let url = item.postedBy.photo;

      return (
        <ImageCell
          placeholderImage={'../../../asset/ecity.png'}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'green',
            paddingTop: 0,
          }}
          id={item.nfid} //this s required for downloading - ex. productId
          item={url}
          //imageDetailAction={false}
          // navigation={this.props.navigation}
          actionOnImage={this.showDetail(item)} //to hide the imagePreview action
          isActual={true}
          isCircular={false}
          // children={this.renderMoreButton(item)}
        >
          <View style={styless.centerOfSuperview}>
            {this.renderMoreButton(item)}
          </View>
        </ImageCell>
      );
    } else { */
    return (
      <ImageBackground
        source={require('../../../asset/time-left.png')}
        resizeMode="contain"
        style={{
          width: ScreenHeight * 0.045,
          height: ScreenHeight * 0.045,
          backgroundColor: 'white',
          borderRadius: 15,
        }}
      />
    );
  }
}

export default withTheme(ApplicationListCell);
