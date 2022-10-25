
import * as Keychain from 'react-native-keychain';
import React,{Component} from 'react';
const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
const ACCESS_CONTROL_MAP = [null, Keychain.ACCESS_CONTROL.DEVICE_PASSCODE, Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD, Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET]
// export default class Keychain extends React.PureComponent{

  export async function save(username = 'undefined',password = 'undefined') {
        try {
          await Keychain.setGenericPassword(
            username,
            password,
            { accessControl: accessControl }
          );
          this.setState({ username: '', password: '', status: 'Credentials saved!' });
        } catch (err) {
          this.setState({ status: 'Could not save credentials, ' + err });
        }
      }
    
      export async function load() {
        try {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            this.setState({ ...credentials, status: 'Credentials loaded!' });
          } else {
            this.setState({ status: 'No credentials stored.' });
          }
        } catch (err) {
          this.setState({ status: 'Could not load credentials. ' + err });
        }
      }
    
      export async function  reset() {
        try {
          await Keychain.resetGenericPassword();
          global.isLoggedIn = false

          this.setState({
            status: 'Credentials Reset!',
            username: '',
            password: '',
          });
        } catch (err) {
          this.setState({ status: 'Could not reset credentials, ' + err });
        }
      }
// }

