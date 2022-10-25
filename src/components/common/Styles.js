import {ScreenHeight, ScreenWidth} from '../utility/Settings';

export const styless = {
  newContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },

  container: {
    flex: 1,
    paddingHorizontal: 10,
  },

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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  nextToEach: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  stretchEqual: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  stretchEqualVertical: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  center: {
    // justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: 'center',
  },
  header: {
    fontWeight: '700',
    color: 'black',
    fontSize: 16,
    // paddingHorizontal: 5,
    alignSelf: 'flex-start',
  },
  headerSmall: {
    fontWeight: '500',
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },

  detail: {
    fontWeight: '300',
    color: 'black',
    fontSize: 16,
    // paddingHorizontal: 5,
  },
  detailSmall: {
    fontWeight: '300',
    color: 'darkgray',
    fontSize: 14,
    paddingHorizontal: 5,
    textAlign: 'left',
    alignSelf: 'flex-start',
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
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'red',
    paddingRight: 10,
  },

  centerOfSuperview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerOfSuperviewVertical: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreRightContainer: {
    position: 'absolute',
    height: 50,
    width: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-start',
    right: 0,
  },
  navBarBackground: {
    backgroundColor: 'black',
  },
  bottomButton: {
    width: '100%',
    alignSelf: 'center',
    height: ScreenHeight * 0.065,
    borderRadius: 30,
  },
  menuItem: {
    flex: 1,
    padding: 5,
    // backgroundColor:'yellow'
  },
  subMenuItem: {
    flex: 1,
    padding: 5,
    // backgroundColor:'green'

  },
};
