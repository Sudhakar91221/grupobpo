/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, ImageBackground} from 'react-native';
import Icons from '../../../components/common/Icons';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import CardView from '../../../components/views/CardView';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ScreenHeight} from '../../../components/utility/Settings';
class FormListCell extends React.PureComponent {
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
          paddingHorizontal: 20,
          justifyContent: 'center',
          height: 60,
          // backgroundColor: 'pink', //theme.backgroundColor,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 1,
            height: '100%',
            alignItems: 'center',
          }}
          onPress={this.showDetail(item)}>
          <CardView
            cardElevation={0}
            cardMaxElevation={0}
            cornerRadius={0}
            style={[
              styless.leftRight,
              {
                // padding: 1,
                // justifyContent: 'center',
                // alignItems: 'center',
                // overflow: 'hidden',
                // alignSelf: 'center',
              },
            ]}>
            <Text style={[theme.detailLarge, {textAlignVertical: 'center'}]}>
              {item.lable}
            </Text>
            <Icons.MaterialIcons
              name="keyboard-arrow-right"
              size={30}
              color="gray"
            />
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }

  //MARK: - Event Handlers
  showDetail = item => e => {
    const {applicationId, item, editable} = this.props;

    if (this.props.isFromApplicationDetail == true) {
      //TODO: -
      // this.props.navigation.navigate('InputForm',{item:item,isFromDetail:true});
      // fromDetailItem:item
      this.props.navigation.navigate('SingleForm', {
        applicationId: applicationId,
        formId: item.formId,
        blockId: item.fbId,
        editable: editable,
      });
    } else {
      this.props.navigation.navigate('FormType');
    }
  };

  //MARK: - Render UI
}

export default withTheme(FormListCell);
