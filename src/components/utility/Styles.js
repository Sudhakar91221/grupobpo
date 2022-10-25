import {StyleSheet} from 'react-native';
import {ScreenHeight, ScreenWidth} from './Settings';

export default styles = StyleSheet.create({
  leftRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userImage: {
    paddingTop: 10,
    width: 70,
    height: 70,
    borderRadius: 35,
    // borderColor: '#FFFFFF',
    // backgroundColor:'yellow'
  },
  navBaruserImage: {
    paddingTop: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    paddingLeft: 20,
    // borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  textVertical: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextToEach: {
    flex: 1,
    flexDirection: 'row',
  },
  center: {
    // justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: 'center',
  },
  header: {
    fontWeight: '500',
    color: '#2E324C',
    fontSize: 18,
  },
  titleGreen: {
    fontWeight: '500',
    color: 'green',
    fontSize: 18,
  },
  headerSmall: {
    fontWeight: '500',
    color: '#2E324C',
    fontSize: 16,
  },

  detail: {
    fontWeight: '300',
    color: '#2E324C',
    fontSize: 16,
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  textMultiline: {
    flex: 1,
    flexGrow: 1,
    width: 0,
  },
  footer: {
    position: 'absolute',
    height: 40,
    left: 0,
    top: ScreenHeight - 40,
    width: ScreenWidth,
  },
});
