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
class NotificationListCell extends React.PureComponent {
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

    // var time = Moment.unix(item.Posted_on).format("DD-MM-YYYY HH:mm:ss");
    const time = Moment.unix(item.timeStamp).format('DD MMM');

    return (
      <View
        style={
          (styless.textVertical,
          {
            paddingHorizontal: this.props.isFromDetail === undefined ? 5 : null,
            justifyContent: 'flex-start',
            margin: this.props.isFromDetail === undefined ? 2 : null,
            backgroundColor:
              item.readStatus == '-1' ? theme.primaryColor : 'white',
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
              },
            ]}>
            <View
              style={{
                paddingLeft: this.props.isFromDetail === undefined ? 10 : 0,
                alignSelf: 'center',
              }}>
              {this.renderImage(item)}
            </View>
            <View
              style={[
                styless.textVertical,
                {
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '100%',
                  height: '100%',
                  paddingVertical: 10,
                },
              ]}>
              <Text style={([theme.H3], {fontSize: 18, fontWeight: '600'})}>
                {item.msg}
              </Text>
              <Text
                style={[
                  theme.detailMedium,
                  {textAlign: 'right', color: 'gray'},
                ]}
                numberOfLines={1}>
                {time}
              </Text>
            </View>
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - Event Handlers
  showDetail = item => e => {
    switch (parseInt(item.type)) {
      case 1:
        this.props.navigation.navigate('ApplicationDetail', {
          applicationId: item.typeId,
        });
        break;
    }
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
    let imgSource = '';
    // switch (parseInt(item.type)) {
    //   case 1:
    //     imgSource = require('../../../asset/tablet-green.png');
    //     break;
    //   case 2:
    //     imgSource = require('../../../asset/exclamation-mark.png');
    //     break;
    //   case 3:
    //     imgSource = require('../../../asset/commentary.png');
    //     break;
    //   case 4:
    //     imgSource = require('../../../asset/hourglass.png');
    //     break;
    // }

    return (
      <View
        style={{
          borderRadius: (ScreenHeight * 0.08) / 2.0,
          borderWidth: 0.5,
          borderColor: 'lightgray',
          padding: 10,
          width: ScreenHeight * 0.08,
          height: ScreenHeight * 0.08,
        }}>
        <ImageBackground
          source={imgSource}
          //source={require('../../../asset/time-left.png')}
          resizeMode="contain"
          style={{
            backgroundColor: 'white',
            width: '100%',
            height: '100%',
          }}
        />
      </View>
    );
  }
}

export default withTheme(NotificationListCell);
