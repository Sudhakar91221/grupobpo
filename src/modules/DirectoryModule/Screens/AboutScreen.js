import React from 'react';
import {ScrollView, Text} from 'react-native';
import {withTheme} from '../../../components/common/Theme/themeProvider';
import HeaderDetailComponent from '../../../components/views/HeaderDetailComponent';
import {translate} from '../../../../App';

class AboutScreen extends React.Component {
  constructor(props) {
    super(props);
    let item = this.props.navigation.state.params.item;
    this.state = {
      item: item,
    };
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <HeaderDetailComponent
          header={translate('employee_code')}
          description={this.state.item.code}
        />
        <HeaderDetailComponent
          header={translate('department')}
          description={this.state.item.department}
        />
        <HeaderDetailComponent
          header={translate('designation')}
          description={this.state.item.designation}
        />
        <HeaderDetailComponent
          header={translate('email_address')}
          description={this.state.item.email}
        />
        <HeaderDetailComponent
          header={translate('mobile_number')}
          description={this.state.item.phone}
        />
        <HeaderDetailComponent
          header={translate('work_schedule')}
          detail={this.state.item.workSchedule}
        />
      </ScrollView>
    );
  }
}

export default withTheme(AboutScreen);
