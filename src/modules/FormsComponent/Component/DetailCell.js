/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, ImageBackground} from 'react-native';
import Icons from '../../../components/common/Icons';
import {styless} from '../../../components/common/Styles';
import Moment from 'moment';
import CardView from '../../../components/views/CardView';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import {ScreenHeight} from '../../../components/utility/Settings';
class DetailCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
    this.showDetail = this.showDetail.bind(this);
  }

  //MARK: - Main Render
  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this);
    }
  }
  render() {
    const {theme} = this.props;
    const item = this.props.item;

    return (
      <View
        style={{
          paddingTop: 0,
          paddingHorizontal: 5,
          justifyContent: 'center',
          marginVertical: 20,
          // height: 60,
        }}>
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: 1,
          }}
          onPress={this.props.editable === true ? this.showDetail(item) : null}>
          <CardView
            cardElevation={0}
            cardMaxElevation={2}
            cornerRadius={0}
            style={[
              styless.leftRight,
              {
                padding: 0,
                // justifyContent: 'center',
                // alignItems: 'center',
                // overflow: 'hidden',
                // alignSelf: 'center',
              },
            ]}>
            <Text
              style={[
                theme.detailLarge,
                {
                  textAlignVertical: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flex: 0.5,
                },
              ]}>
              {item.lable}
            </Text>

            {this.props.selectedValue !== undefined && (
              <Text
                style={[
                  theme.header,
                  {
                    justifyContent: 'center',
                    alignSelf: 'center',
                    flex: 0.4,
                    textAlign: 'right',
                  },
                ]}>
                {this.props.selectedValue}
              </Text>
            )}

            {this.props.error !== undefined &&
            this.props.selectedValue === undefined ? (
              <Icons.MaterialIcons
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flex: 0.1,
                }}
                name="error"
                size={30}
                color="red"
                backgroundColor="white"
              />
            ) : null}

            {this.props.editable === true ? (
              <Icons.MaterialIcons
                style={{
                  textAlignVertical: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flex: 0.1,
                }}
                name="keyboard-arrow-right"
                size={30}
                color="gray"
                backgroundColor="pink"
              />
            ) : null}
          </CardView>
        </TouchableOpacity>
      </View>
    );
  }

  //   //MARK: - Event Handlers
  showDetail = item => e => {
    // this.props.navigation.navigate('AnotherScreen', {item: this.props.item,applicationId:this.props.applicationId});
    this.props.showDetail(item);
  };

  //MARK: - Render UI
}

export default withTheme(DetailCell);
