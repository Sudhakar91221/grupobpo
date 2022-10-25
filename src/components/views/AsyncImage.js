/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react'; // eslint-disable-line no-unused-vars

import {ImageBackground, View, ActivityIndicator,Image} from 'react-native';
import Shimmer from 'react-native-shimmer';
import {API_KEY, IMAGE_DOWNLOAD_URL, USER_IMAGE_DOWNLOAD_URL} from '../../network/config';

export default class AsyncImage extends Component {
  constructor(props) {
    super(props);
    this.state = {loaded: false};
  }

  render() {
    const {placeholderColor, style, source} = this.props;
    const requestHeader = {
      'x-api-key': API_KEY,
    };
    let newSource = source;

    // if(newSource) {
    //   newSource['method'] = 'GET';
    //   newSource['headers'] = requestHeader;
    // }
  

    if (source.uri  && source.uri.type !== undefined) {
      newSource = {};
      newSource['uri'] = source.uri;

      console.log('newsource is........................', newSource);
    }
    if ('string' !== typeof source) {
      console.log('source is........................', source);
    } else {
      console.log('source is proper........................', source);
    }

    let url =  `${newSource.uri}`;
    if(this.props.isUserImage === true ) {
      if(newSource.uri) {
        url =  `${USER_IMAGE_DOWNLOAD_URL}/${newSource.uri}/400`;
      }

    }

    if(url == "null") {
      return(
        <View style={style}>
        <Image
            source={require('../../assets/ic_profile.png')}
            resizeMode="stretch"
            style={[
              // styless.imageThumbnail,
              {width: '100%', height: '100%', tintColor: 'black', borderRadius: 35},
            ]}
            tintColor={'black'}
          />

      </View>
      );
     
    }

    return (
      <View style={style}>
        <ImageBackground
         // source={newSource}
          source={{
                  uri: url,
                  method: 'GET',
                  headers: requestHeader
                }}
          resizeMode={this.props.resizeMode}
          style={[
            style,
            {
              position: 'absolute',
              resizeMode: 'contain',
              borderRadius: this.props.borderRadius,
              aspectRatio: 1 / 1,
            },
          ]}
          onLoad={this._onLoad}
          borderRadius={this.props.borderRadius}>
          {this.props.children}
        </ImageBackground>

        {!this.state.loaded && (
          <Shimmer
            style={[
              style,
              {
                backgroundColor: placeholderColor || '#90a4ae',
                position: 'absolute',
                borderRadius: this.props.borderRadius,
              },
            ]}>
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={[
                style,
                {
                  backgroundColor: placeholderColor || '#90a4ae',
                  position: 'absolute',
                  borderRadius: this.props.borderRadius,
                },
              ]}
            />
          </Shimmer>
        )}
      </View>
    );
  }

  _onLoad = () => {
    this.setState(() => ({loaded: true}));
  };
}
