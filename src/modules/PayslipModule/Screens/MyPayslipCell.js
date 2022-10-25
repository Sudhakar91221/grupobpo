/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styless} from '../../../components/common/Styles';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import CardView from 'react-native-cardview';

class MyPayslipCell extends React.PureComponent {
  //MARK: - Constructor

  constructor() {
    super();
    this.state = {};
  }

  //MARK: - Main Render

  render() {
    const {theme} = this.props;
    const item = this.props.item;

    return (
      <View style={{margin: 2, flex: 1}}>
        <CardView
          style={{
            width: '100%',
            flex: 1,
            backgroundColor:'white'
          }}
          cardElevation={5}
          cardMaxElevation={2}
          cornerRadius={10}>
          <TouchableOpacity
            style={[
              styless.textVertical,
              {
                width: '100%',
                height: '100%',
                padding: 10,
              },
            ]}
            onPress={() =>
              this.props.navigation.navigate('SalaryDetail', {
                item: item,
                isEmployeeSalary: false,
              })
            }>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  theme.header,
                  {textAlign: 'left', color: theme.primaryColor, flex: 1},
                ]}
                numberOfLines={1}>
                {item.period}
              </Text>
              <View
                style={{
                  flex: 0.3,
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={[
                    theme.detail,
                    {textAlign: 'right', color: theme.black, fontSize: 18},
                  ]}
                  numberOfLines={1}>
                  {this.props.currency}
                </Text>
                <Text
                  style={[
                    theme.header,
                    {textAlign: 'right', color: theme.black},
                  ]}
                  numberOfLines={1}>
                  {item.netSalary}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </CardView>
      </View>
    );
  }
}

export default withTheme(MyPayslipCell);
