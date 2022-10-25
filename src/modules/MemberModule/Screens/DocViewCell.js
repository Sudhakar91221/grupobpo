/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {flatListItemSpaceSeparator} from '../../../components/utility/common';
import DocDetailCell from './DocDetailCell';
import CardView from 'react-native-cardview';
import {BottomButton} from '../../../components/views/Button';
import {translate} from '../../../../App';
import {throwStatement} from '@babel/types';

class DocViewCell extends React.PureComponent {
  //MARK: - Constructor

  constructor(props) {
    super(props);
    this.state = {
      item: this.props.item,
    };
    this.renderItem = this.renderItem.bind(this);
    this.renderAddImageButton = this.renderAddImageButton.bind(this);
    this.renderImages = this.renderImages.bind(this);
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.state.item;
    let title = '';
    switch (item.type) {
      case 10:
        title = 'Birth Certificate';
        break;
      case 11:
        title = 'Marriage Certificate';
        break;
      case 12:
        title = 'Birth Certificate Of Dependents';
        break;
      case 13:
        title = 'Certificate of Employment';
        break;
      case 14:
        title = 'BIR Form 2316';
        break;
      case 15:
        title = 'Medical Results';
        break;
      case 16:
        title = "Government Id's";
        break;
      case 17:
        title = 'NBI Clearance';
    }
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          padding: 2,
          flex: 1,
        }}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            padding: 5,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <Text
            style={[theme.header, {flex: 1, fontSize: 18}]}
            numberOfLines={1}>
            {title}
          </Text>
          {item.images.length === 0 ? (
            this.renderAddImageButton()
          ) : this.props.item.type === 12 ||
            this.props.item.type === 15 ||
            this.props.item.type === 16 ? (
            <View>
              {this.renderAddImageButton()}
              {this.renderImages()}
            </View>
          ) : (
            this.renderImages()
          )}
        </CardView>
      </View>
    );
  }

  renderAddImageButton() {
    return (
      <BottomButton
        style={{height: 30, borderRadius: 50, margin: 10, width: '30%'}}
        title={translate('add')}
        action={() =>
          this.props.navigation.navigate('AddFile', {
            type: this.state.item.type,
            typeId: this.props.employeeId,
            getSelectedFile: fileName => this.getSelectedFile(fileName),
          })
        }
      />
    );
  }

  getSelectedFile(fileName) {
    console.log('UPLOADED FILE => ' + fileName);
  }

  renderImages() {
    const item = this.state.item;
    return (
      <View style={{flex: 1, padding: 3}}>
        <FlatList
          data={item.images}
          renderItem={this.renderItem}
          numColumns={1}
          extraData={this.props}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={flatListItemSpaceSeparator}
        />
      </View>
    );
  }

  renderItem = ({item}) => {
    return (
      <DocDetailCell
        item={item}
        navigation={this.props.navigation}
        type={this.props.item.type}
        employeeId={this.props.employeeId}
      />
    );
  };
}

export default withTheme(DocViewCell);
