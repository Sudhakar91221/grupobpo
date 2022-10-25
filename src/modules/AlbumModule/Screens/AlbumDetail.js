/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {GET_ALBUMS, REMOVE_IMAGES} from '../Actions/type';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  albumListSelector,
  removeImagesSelector,
} from '../Actions/selectors';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import ActivityIndicatorCustom from '../../../components/views/ActivityIndicatorCustom';
import {connect} from 'react-redux';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import {getAlbums, removeImages} from '../Actions/AlbumActions';
import AsyncImage from '../../../components/views/AsyncImage';
import {BASE_URL} from '../../../network/config';
import Icons from '../../../components/common/Icons';
import UploadSingleImage from '../../FileModule/Screens/UploadSingleImage';
import {AttachmentTypes} from '../../FileModule/Actions/FileIntegers';
import {ScrollView} from 'react-native-gesture-handler';

class AlbumDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: this.props.navigation.state.params.item.images,
      selectedImages: [],
    };
    this.selectItem = this.selectItem.bind(this);
    this.callRemoveImagesAPI = this.callRemoveImagesAPI.bind(this);
    this.getUploadedFileName = this.getUploadedFileName.bind(this);
  }

  componentWillMount() {
    this.props.navigation.setParams({
      handleStateChange: this.callRemoveImagesAPI,
    });
  }

  callRemoveImagesAPI() {
    var input = {
      userId: this.props.user.userId,
      albumId: this.state.item.albumId,
      imageId: this.state.selectedImages.join(','),
      request: REMOVE_IMAGES,
    };
    this.props.removeImages(input);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.error &&
      (this.props.error.request == GET_ALBUMS ||
        this.props.error.request == REMOVE_IMAGES)
    ) {
      if (this.props.error !== prevProps.error) {
        Alert.alert(
          this.props.error.message,
          '',
          [
            {
              text: 'OK',
              onPress: () => {
                //this.props.navigation.navigate('Login');
                console.log('OK Pressed');
              },
            },
          ],

          {cancelable: false},
        );
      }
    }

    //remove images
    if (this.props.api === REMOVE_IMAGES) {
      if (this.props.error !== null && this.props.api === REMOVE_IMAGES) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            '',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (this.props.error.message === 'Invalid Token') {
                    this.props.navigation.navigate('Login');
                  }
                  this.props.navigation.goBack();
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === REMOVE_IMAGES) {
        if (this.props.images !== this.state.images) {
          this.setState({images: this.props.images});
        }
      }
    }
  }

  render() {
    const item = this.props.navigation.state.params.item;
    if (this.state.images === undefined) {
      return <ActivityIndicatorCustom />;
    }
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{flex: 1, padding: 10}}>
          {this.state.images === undefined ? (
            this.renderNoRecords()
          ) : this.state.images.length === 0 ? (
            this.renderNoRecords()
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                //columnWrapperStyle={{flex: 0.5, justifyContent: 'space-evenly'}}
                data={this.state.images}
                renderItem={this.renderAlbumItem}
                numColumns={2}
                keyExtractor={this._keyExtractor}
                extraData={this.props}
                ItemSeparatorComponent={flatListItemSpaceSeparator}
              />
            </View>
          )}
        </View>
        <View style={{padding: 5}}>
          <UploadSingleImage
            isAlbumImage={true}
            isAddImage={true}
            navigation={this.props.navigation}
            getUploadedFileName={this.getUploadedFileName}
            isUploadImage={true}
            input={{
              type: AttachmentTypes.UPLOAD_FILE_TYPE_ALBUM,
              typeId: item.albumId,
              title: '',
            }}
          />
        </View>
      </ScrollView>
    );
  }

  getUploadedFileName = (imageToUpload, tempImageName) => {
    this.state.images.push(imageToUpload);
  };

  renderAlbumItem = ({item}) => {
    const {theme} = this.props;
    let uri = `${BASE_URL}/File/getThumb/${item.image}/500`;
    return (
      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        onPress={() =>
          this.props.navigation.navigate('ImageViewer', {
            imageUrl: uri,
            downloadImage: true,
          })
        }
        onLongPress={() => this.selectItem(item)}>
        <View
          style={{
            backgroundColor: item.isSelect ? 'rgba(0,0,0,0.5)' : 'white',
            flexDirection: 'row',
            opacity: item.isSelect ? 0.6 : 1,
            width: 150,
            height: 150,
            borderRadius: 10,
          }}>
          {item.isSelect ? (
            <Image
              source={require('../../../assets/ic_done_white.png')}
              style={{position: 'absolute', top: 60, right: 60}}
            />
          ) : null}

          <AsyncImage
            source={{uri: uri}}
            resizeMode="cover"
            style={{
              justifyContent: 'center',
              tintColor: 'white',
              width: 150,
              height: 150,
              borderRadius: 10,
            }}
            tintColor={theme.primaryColor}
            borderRadius={10}
          />
        </View>
      </TouchableOpacity>
    );
  };

  selectItem = data => {
    data.isSelect = !data.isSelect;
    if (data.isSelect) {
      this.state.selectCount = this.state.selectCount + 1;
    }

    const index = this.state.images.findIndex(
      item => data.imageId === item.imageId,
    );

    this.state.images[index] = data;
    this.state.selectedImages.push(data.imageId);
    this.setState({
      images: this.state.images,
    });
  };

  renderNoRecords() {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text
          style={{
            alignSelf: 'center',
            fontSize: 16,
          }}>
          No Images Available
        </Text>
      </View>
    );
  }
}

const AlbumDetailNew = withTheme(AlbumDetail);
AlbumDetailNew.navigationOptions = ({navigation, screenProps}) => {
  const {theme} = screenProps;
  const {params = {}} = navigation.state;
  return {
    headerStyle: {
      shadowColor: 'transparent',
      borderBottomWidth: 0,
      backgroundColor: theme.primaryColor,
    },
    headerTintColor: 'white',
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.state.params.handleStateChange()}>
        <Icons.MaterialCommunityIcons
          name={'delete'}
          size={30}
          tintColor="white"
          color={'white'}
          style={{tintColor: 'white', paddingRight: 3}}
        />
      </TouchableOpacity>
    ),
  };
};

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.AlbumReducer),
    api: apiSelector(state.AlbumReducer),
    error: errorSelector(state.AlbumReducer),
    albumList: albumListSelector(state.AlbumReducer),
    images: removeImagesSelector(state.AlbumReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getAlbums: input => dispatch(getAlbums(input)),
    removeImages: input => dispatch(removeImages(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumDetailNew);
