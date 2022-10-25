/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SUPPORT_REPLY_IMAGE_DOWNLOAD_URL,
  SUPPORT_TEMP_IMAGE_DOWNLOAD_URL,
  SUPPORT_TICKET_IMAGE_DOWNLOAD_URL,
  API_KEY,
  IMAGE_DOWNLOAD_URL,
} from '../../../network/config';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ImageBackground,
  FlatList,
  ScrollView,
} from 'react-native';
import {requestHeader} from '../../../network/APICall';
import Icons from '../../../components/common/Icons';
import {StackActions} from 'react-navigation';
import Popover from '../../../components/external/Popover';
import AsyncImage from '../../../components/views/AsyncImage';
import Moment from 'moment';
import {styless} from '../../../components/common/Styles';
import CardView from 'react-native-cardview';
import {withTheme} from 'react-native-elements';
const IMAGE_WIDTH_HEIGHT = 40;

class CommentCell extends React.Component {
  constructor() {
    super();
    this.state = {
      showEditDeletePopover: false,
    };
  }
  render() {
    let height = '200';

    const item = this.props.item;
    const {theme} = this.props;
    // console.log(`${SUPPORT_REPLY_IMAGE_DOWNLOAD_URL}/${item.attachment[0]}`)

    let time = 'Just';
    if (item.postedOn != 'Just') {
      time = Moment.unix(item.postedOn).format('DD-MM-YYYY @ HH:mm a');
      //  const actualTime  = Moment(time).format("DD MMM YYYY @ HH:mm a")
    }

    return (
      <CardView
        style={{
          width: '100%',
          flex: 1,
          margin: 1,
          padding: 10,
        }}
        cardElevation={5}
        cardMaxElevation={2}
        cornerRadius={10}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <AsyncImage
            // source= {{
            //     uri: `${IMAGE_DOWNLOAD_URL}/${item.images[0].image}/${height}`,
            //     method: 'GET',
            //     headers: {
            //             'x-api-key': API_KEY,
            //             'Content-Type': 'multipart/form-data',
            //             }
            //     }}
            source={require('../../../assets/ic_profile.png')}
            resizeMode="stretch"
            style={[
              styles.imageThumbnail,
              styless.leftContainer,
              {flex: 0.25, width: 70, height: 70, padding: 5},
            ]}
          />

          <View style={[styless.textVertical, {justifyContent: 'center'}]}>
            <Text style={[styless.header, {color: '#2E324C'}]}>
              {item.postedBy}
            </Text>
            {item.postedOn != 'Just' ? (
              <Text style={[styless.detail, {color: 'gray'}]}>
                {Moment(time, 'DD-MM-YYYY HH:mm:ss').fromNow()}
              </Text>
            ) : (
              <Text style={[styless.detail]}>Just Now</Text>
            )}
          </View>
        </View>
        <Text style={[styless.detail]}>{item.comment}</Text>

        <FlatList
          ref={ref => (this.flatList = ref)}
          data={item.attachment}
          renderItem={this.renderAttachments.bind(this)}
          horizontal={true}
        />

        {/* <ScrollView contentContainerStyle={{alignItems:'flex-start',backgroundColor:'white',flex:1,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start',padding:5}}>
              {this.renderAttachments(item)}
            </ScrollView> */}
      </CardView>
    );
  }

  renderAttachments(image) {
    const item = this.props.item;
    const attachment = image.item;

    if (attachment !== undefined && attachment != null) {
      if (attachment.length > 0) {
        return (
          // attachment.map(
          //   (attachment, i) =>

          <TouchableOpacity
            onPress={this.showDetailActual(attachment, item.id)}>
            {this.checkForSelectedMediaISImage(attachment) == true ? (
              <AsyncImage
                source={{
                  uri: `${SUPPORT_REPLY_IMAGE_DOWNLOAD_URL}/${item.id}/${attachment}`,
                  // method: 'GET',
                }}
                resizeMode="stretch"
                style={[
                  styles.imageThumbnail,
                  {
                    width: 40,
                    height: 40,
                    padding: 2,
                    marginHorizontal: 3,
                    alignSelf: 'flex-start',
                  },
                ]}
              />
            ) : (
              <View>
                {this.checkForSelectedMediaISVideo(attachment) != true ? (
                  <ImageBackground
                    style={[
                      styles.imageThumbnail,
                      {
                        width: 40,
                        height: 40,
                        padding: 2,
                        marginHorizontal: 3,
                        alignSelf: 'flex-start',
                        backgroundColor: 'lightgray',
                      },
                    ]}
                    blurRadius={this.props.selected ? 3 : 0}
                    tintColor="lightgray">
                    <Text style={[styles.header]}>
                      {this.getFileExtension(attachment).toUpperCase()}
                    </Text>
                  </ImageBackground>
                ) : (
                  <Image
                    source={require('../../../assets/video.png')}
                    style={[
                      styles.imageThumbnail,
                      {
                        width: 40,
                        height: 40,
                        padding: 2,
                        marginHorizontal: 3,
                        alignSelf: 'flex-start',
                      },
                    ]}
                    blurRadius={this.props.selected ? 3 : 0}
                    tintColor="gray"
                  />
                )}
              </View>
            )}
          </TouchableOpacity>

          // }

          // )
        );
      }
    }
  }

  getFileExtension(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  }
  checkForSelectedMediaISImage(filename) {
    let extension = this.getFileExtension(filename);
    if (
      extension == 'jpg' ||
      extension == 'jpeg' ||
      extension == 'png' ||
      extension == 'heic' ||
      extension == 'HEIC'
    ) {
      return true;
    }
    return false;
  }
  checkForSelectedMediaISVideo(filename) {
    let extension = this.getFileExtension(filename);
    if (
      extension == 'mp4' ||
      extension == 'wmv' ||
      extension == 'flv' ||
      extension == 'ogg' ||
      extension == 'AVI' ||
      extension == 'WAV' ||
      extension == 'MOV' ||
      extension == 'mov'
    ) {
      return true;
    }
    return false;
  }

  showDetailActual = (attachment, id) => e => {
    let screenName = 'VideoPlayer';
    // let param = undefined
    const image = attachment;

    if (this.checkForSelectedMediaISVideo(attachment)) {
      screenName = 'VideoPlayer';
      uri = image;
    } else {
      screenName = 'ImageViewer';
      uri = image;
    }

    let imageUrl = `${SUPPORT_REPLY_IMAGE_DOWNLOAD_URL}/${id}/${uri}`;

    const pushAction = StackActions.push({
      routeName: screenName,
      params: {
        imageUrl,
      },
    });
    this.props.navigation.dispatch(pushAction);
  };

  checkForSelectedMediaISVideo(filename) {
    let extension = this.getFileExtension(filename);
    if (
      extension == 'mp4' ||
      extension == 'wmv' ||
      extension == 'flv' ||
      extension == 'ogg' ||
      extension == 'AVI' ||
      extension == 'WAV' ||
      extension == 'MOV' ||
      extension == 'mov'
    ) {
      return true;
    }
    return false;
  }

  getFileExtension(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  }
  showDetail = item => e => {
    const pushAction = StackActions.push({
      routeName: 'SupportDetail',
      params: {
        // supportModel: item,
        supportId: item.ticketNo,
      },
    });
    this.props.navigation.dispatch(pushAction);
  };
  onMoreButtonTapped = item => e => {
    this.setState({showEditDeletePopover: true});
  };

  closePopover() {
    this.setState({showEditDeletePopover: false});
  }

  renderEditDeletePopover() {
    return (
      <Popover
        isVisible={this.state.showEditDeletePopover}
        fromView={this.editDeleteRef}
        onRequestClose={() => this.closePopover()}>
        <Text> </Text>
        <TouchableOpacity onPress={this.editSupport}>
          <Text> Edit </Text>
        </TouchableOpacity>
        <Text> </Text>
        <TouchableOpacity onPress={this.deleteSupport}>
          <Text> Delete </Text>
        </TouchableOpacity>
        <Text> </Text>
      </Popover>
    );
  }

  editSupport = () => {
    this.setState(
      {
        showEditDeletePopover: false,
      },
      () => {
        this.props.editSupportTapped(this.props.item);
      },
    );
  };

  deleteSupport = () => {
    this.setState(
      {
        showEditDeletePopover: false,
      },
      () => {
        this.props.deleteSupportTapped(this.props.item);
      },
    );
  };
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: 30,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  header: {
    fontWeight: '300',
    color: '#2E324C',
    fontSize: 11,
  },
});
export default withTheme(CommentCell);
