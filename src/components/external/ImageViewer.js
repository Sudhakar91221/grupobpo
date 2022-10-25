'use strict';
import React, {Component} from 'react';

import {
  Alert,
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  // NativeModules,
  // NativeEventEmitter,
} from 'react-native';
import AsyncImage from '../views/AsyncImage';
import {ScreenHeight, ScreenWidth} from '../utility/Settings';
import {styless} from '../common/Styles';
import WebView from 'react-native-webview';
import {IMAGE_DOWNLOAD_URL, API_KEY} from '../../network/config';

// import OpenFile from 'react-native-doc-viewer';

export default class ImageViewer extends React.PureComponent {
  componentWillUnmount() {
    // this.eventEmitter.removeListener();
  }
  componentDidMount() {
    // console.log('------------IMage Viewer Started here-------------------');
    // console.log(this.props.isVisible);
    // console.log('IMAGE URL => ' + this.props.navigation.state.params.imageUrl);
    // let extension = this.getFileExtension(
    //   this.props.navigation.state.params.imageUrl,
    // );
    // if (
    //   extension == 'png' ||
    //   extension == 'jpeg' ||
    //   extension == 'jpg' ||
    //   extension == 'HEIC' ||
    //   extension == 'jpg' ||
    //   extension == 'heic'
    // ) {
    // } else {
    //   // this.handlePress()
    // }
    // // download progress
    // // this.eventEmitter.addListener('RNDownloaderProgress', Event => {
    // //   console.log('Progress - Download ' + Event.progress + ' %');
    // //   this.setState({progress: Event.progress + ' %'});
    // // });
  }
  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      progress: '',
      donebuttonclicked: false,
      isAlreadyImageViewOpen: false,
      isLoading: true,
    };
    // this.eventEmitter = new NativeEventEmitter(
    //   NativeModules.RNReactNativeDocViewer,
    // );
    // this.eventEmitter.addListener('DoneButtonEvent', data => {
    //   /*
    //    *Done Button Clicked
    //    * return true
    //    */
    //   console.log(data.close);
    //   this.setState({donebuttonclicked: data.close});
    // });
  }

  static navigationOptions = ({navigation, screenProps}) => {
    return {
      title: 'Attachment',
      largeTitle: 'true',
      style: {
        marginTop: Platform.OS === 'ios' ? 0 : 24,
      },
      headerStyle: {
        backgroundColor: '#383C55',
      },
      titleStyle: {color: 'white'},
      headerTintColor: 'white',
    };
  };
  render() {
    const requestHeader = {
      'x-api-key': API_KEY,
    };
    let extension = this.getFileExtension(
      this.props.navigation.state.params.imageUrl,
    );
    // let url =  `${IMAGE_DOWNLOAD_URL}/${this.props.navigation.state.params.imageUrl}/400`;
 let url = `${this.props.navigation.state.params.imageUrl}`
    console.log('image url for viewing ....', url)
    if (
      (extension == 'png' ||
        extension == 'jpeg' ||
        extension == 'jpg' ||
        extension == 'HEIC' ||
        extension == 'jpg' ||
        extension == 'heic' ||
        extension.includes('png') ||
        extension.includes('jpeg') ||
        extension.includes('jpg') ||
        extension.includes('HEIC') ||
        extension.includes('heic'))
        // &&
      // this.props.navigation.state.params.downloadImage === true
    ) {
      return (
        <View style={styless.container}>
          <AsyncImage
            source={{
              uri: url,
              method: 'GET',
              headers: requestHeader,
            }}
            resizeMode="contain"
            style={[{width: '100%', height: '100%'}]}
            isUserImage={this.props.navigation.state.params.type == 'profile' ? true : undefined}
          />
        </View>
      );
    } else {
      let uri = this.props.navigation.state.params.imageUrl;
      return (
        <View style={styless.container}>
          <WebView
            style={{flex: 1}}
            originWhitelist={['*']}
            source={{uri: uri}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
          {/* { this.handlePress()} */}
        </View>
      );
    }
  }
  hideImage() {}

  getFileExtension(filename) {
    var ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? '' : ext[1];
  }

  //MARK- for other types of files
  /*
    handlePress = () => {
      this.setState({isAlreadyImageViewOpen:true})
      this.setState({animating: true});
      if(Platform.OS === 'ios'){
        OpenFile.openDoc([{
          url:this.props.navigation.state.params.imageUrl,
          fileNameOptional:"Attachment"
        }], (error, url) => {
           if (error) {
            this.setState({animating: false,isLoading:false},() => this.props.navigation.goBack()) 
 
           } else {
             this.setState({animating: false,isLoading:false},() => this.props.navigation.goBack()) 
 
             console.log(url)
           }
         })
      }else{
        //Android
        this.setState({animating: true});
        OpenFile.openDoc([{
          url:this.props.url, // Local "file://" + filepath
          fileName:"sample",
          cache:false,
         //  fileType:"jpg"
        }], (error, url) => {
           if (error) {
             this.setState({animating: false,isLoading:false}) 
             
             console.error(error);
           } else {
            //  this.setState({animating: false,isLoading:false},  () => this.props.hideImage()) 
 
             console.log(url)
           }
         })
      }
     
    }
    
    
    // 
    // * Handle Local File Method
    // * fileType Default == "" you can use it, to set the File Extension (pdf,doc,xls,ppt etc) when in the Url the File Extension is missing.
    // 
    handlePressLocal = () => {
      this.setState({animating: true});
      if(Platform.OS === 'ios'){
          OpenFile.openDoc([{url:SavePath+"/react-native-logo.jpg",
          fileNameOptional:"Attachment"
        }], (error, url) => {
           if (error) {
            this.setState({animating: false});
           } else {
            this.setState({animating: false});
             console.log(url)
           }
         })
      }else{
        OpenFile.openDoc([{url:SavePath+"/demo.jpg",
          fileName:"sample",
          cache:false,
          fileType:"jpg"
        }], (error, url) => {
           if (error) {
            this.setState({animating: false});
           } else {
            this.setState({animating: false});
             console.log(url)
           }
         })
       
      }
    }
    */
}
const style = {
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    // width:300,
    // height:300
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    // width:100
  },
  newcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
};
