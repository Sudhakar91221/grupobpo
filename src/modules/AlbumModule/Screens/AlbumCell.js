/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Modal, Alert, Image} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import CardView from 'react-native-cardview';
import AsyncImage from '../../../components/views/AsyncImage';
import {BASE_URL} from '../../../network/config';
import {translate} from '../../../../App';
import {ALBUM_DELETE} from '../Actions/type';
import {albumDelete} from '../Actions/AlbumActions';
import {connect} from 'react-redux';
import {userLoginSelector} from '../../AuthModule/Actions/selectors';
import {
  isLoadingSelector,
  apiSelector,
  errorSelector,
  albumDeleteSelector,
} from '../Actions/selectors';

class AlbumCell extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
    };
    this.renderGridView = this.renderGridView.bind(this);
    this.renderListView = this.renderListView.bind(this);
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.callDeleteAlbum = this.callDeleteAlbum.bind(this);
  }
  setModalVisible(visible) {
    this.setState({
      modalVisible: visible,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && this.props.error.request == ALBUM_DELETE) {
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

    //delete album
    if (this.props.api === ALBUM_DELETE) {
      if (this.props.error !== null && this.props.api === ALBUM_DELETE) {
        if (this.props.error !== prevProps.error) {
          Alert.alert(
            this.props.error.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  // if (this.props.error.message === 'Invalid Token') {
                  //   this.props.navigation.navigate('Login');
                  // }
                  console.log('OK Pressed');
                },
              },
            ],
            {cancelable: false},
          );
        }
      }

      if (!this.props.error && this.props.api === ALBUM_DELETE) {
        if (this.props.message !== this.state.message) {
          this.setState({message: this.props.message});
        }
      }
    }
  }

  render() {
    const {theme} = this.props;
    const item = this.props.item;

    return (
      <View
        style={[
          styless.textVertical,
          {
            margin: 5,
          },
        ]}>
        <CardView
          style={{
            width: this.props.isLastItem === true ? '50%' : '100%',
            height: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('AlbumDetail', {
                item: item,
              })
            }>
            {this.props.isGrid === true
              ? this.renderGridView()
              : this.renderListView()}
          </TouchableOpacity>
        </CardView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                this.setModalVisible(false);
              }}>
              <View
                style={{
                  marginTop: '80%',
                  marginRight: '20%',
                  marginLeft: '20%',
                  backgroundColor: 'white',
                  borderColor: 'gray',
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 30,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({modalVisible: false});
                    this.props.navigation.navigate('EditAlbum', {
                      item: item,
                    });
                  }}>
                  <Text style={[theme.detail, {color: theme.primaryColor}]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.showDeleteAlert()}>
                  <Text
                    style={[
                      theme.detail,
                      {color: theme.primaryColor, marginTop: 20},
                    ]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }

  renderListView() {
    const {theme} = this.props;
    const item = this.props.item;
    let uri = undefined;
    if (item.images.length > 0) {
      uri = `${BASE_URL}/File/getThumb/${item.images[0].image}/500`;
    }

    return (
      <View style={[styless.leftRight, {paddingVertical: 5}]}>
        <View style={{padding: 10}}>
          <AsyncImage
            source={{uri: uri}}
            resizeMode="cover"
            style={{
              justifyContent: 'center',
              tintColor: 'white',
              width: 60,
              height: 60,
              overflow: 'hidden',
            }}
            tintColor={theme.primaryColor}
          />
        </View>

        <View style={[styless.textVertical, {justifyContent: 'center'}]}>
          <Text style={[theme.header]}>{item.albumName}</Text>
          <Text style={[theme.detail]}>{item.count} Photos</Text>
        </View>

        <TouchableOpacity
          onPress={() => this.setState({modalVisible: true})}
          style={{paddingRight: 10}}>
          <Image
            source={require('../../../assets/ic_more.png')}
            tintColor={'#343957'}
            style={{tintColor: '#343957', width: 20, height: 30}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderGridView() {
    const {theme} = this.props;
    const item = this.props.item;
    let uri = undefined;
    if (item.images.length > 0) {
      uri = `${BASE_URL}/File/getThumb/${item.images[0].image}/500`;
    }
    return (
      <View style={{flex: 1}}>
        <View>
          <AsyncImage
            source={{uri: uri}}
            resizeMode="cover"
            style={{
              justifyContent: 'center',
              tintColor: 'white',
              width: '100%',
              height: 150,
              overflow: 'hidden',
            }}
            tintColor={theme.primaryColor}
          />
          <TouchableOpacity
            onPress={() => this.setState({modalVisible: true})}
            style={{position: 'absolute', top: 5, right: 5}}>
            <Image
              source={require('../../../assets/ic_more.png')}
              tintColor={'#343957'}
              style={{tintColor: '#343957', width: 20, height: 30}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            flexDirection: 'row',
            width: '100%',
          }}>
          <View style={[styless.nextToEach]}>
            <Text
              style={[
                theme.header,
                {color: 'white', textAlign: 'left', flex: 1, paddingLeft: 5},
              ]}>
              {item.albumName}
            </Text>
            <Text
              style={[
                theme.detail,
                {
                  color: 'white',
                  textAlign: 'right',
                  flex: 0.3,
                  paddingRight: 10,
                  paddingTop: 5,
                },
              ]}>
              {item.count}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  showDeleteAlert() {
    this.setState({modalVisible: false});
    Alert.alert(
      '',
      translate('delete_album_hint'),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: this.callDeleteAlbum},
      ],
      {cancelable: false},
    );
  }

  callDeleteAlbum() {
    var input = {
      albumId: this.props.item.albumId,
      userId: this.props.user.userId,
      request: ALBUM_DELETE,
    };
    this.props.albumDelete(input);
  }
}
const AlbumCellNew = withTheme(AlbumCell);

function mapStateToProps(state) {
  return {
    user: userLoginSelector(state.FormReducer),
    isLoading: isLoadingSelector(state.AlbumReducer),
    api: apiSelector(state.AlbumReducer),
    error: errorSelector(state.AlbumReducer),
    message: albumDeleteSelector(state.AlbumReducer),
  };
}
function mapDispatchToProps(dispatch) {
  return {
    albumDelete: input => dispatch(albumDelete(input)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumCellNew);
