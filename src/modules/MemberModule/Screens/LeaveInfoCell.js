/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import HidableView from '../../../components/views/HidableView';

class LeaveInfoCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ishide: true,
    };
  }

  render() {
    const {theme} = this.props;
    return (
      <TouchableOpacity
        onPress={() => this.setState({ishide: !this.state.ishide})}>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              theme.header,
              {textAlign: 'left', color: theme.black, flex: 1, fontSize: 20},
            ]}>
            {this.props.item.groupName}
          </Text>

          <Text
            style={[
              theme.header,
              {textAlign: 'right', color: theme.black, flex: 1, fontSize: 20},
            ]}>
            {this.props.item.balance}
          </Text>
        </View>

        <Text
          style={[
            theme.detail,
            {textAlign: 'right', color: 'gray', flex: 1, paddingRight: 5},
          ]}>
          Days
        </Text>

        <HidableView hide={this.state.ishide}>
          <View>
            <View
              style={{height: 0.8, width: '100%', backgroundColor: '#C8C8C8'}}
            />
            <View style={{flexDirection: 'row', padding: 5, marginLeft: 10}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 1},
                    ]}>
                    CYL
                  </Text>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 0.5},
                    ]}>
                    {this.props.item.cyl}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 1},
                    ]}>
                    Leave Taken
                  </Text>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 0.5},
                    ]}>
                    {this.props.item.takenTotal}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{flexDirection: 'row', padding: 5, marginLeft: 10}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 1},
                    ]}>
                    LYCF
                  </Text>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 0.5},
                    ]}>
                    {this.props.item.lycf}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 1},
                    ]}>
                    Pending
                  </Text>
                  <Text
                    style={[
                      theme.header,
                      {textAlign: 'left', color: theme.black, flex: 0.5},
                    ]}>
                    {this.props.item.pendingTotal}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </HidableView>
      </TouchableOpacity>
    );
  }
}
export default withTheme(LeaveInfoCell);
