import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  mainContainer: {
    height: 60,
    padding: 0,
    //borderRadius: 45,
    // alignItems: 'center',
    // justifyContent: 'center',
    //backgroundColor: '#EBEBEB',
  },
  segmentContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    //backgroundColor: '#EBEBEB',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeSegment: {
    flex: 1,
    //zIndex: 5,
    borderRadius: 40,
    //position: 'absolute',
    //backgroundColor: '#FFBA0D',
  },
  touchableSegment: {
    zIndex: 10,
  },
  animatedView: {
    zIndex: 5,
    position: 'absolute',
  },
  defaultText: {
    color: 'gray',
    fontSize: 16,
  },
  activeText: {
    color: '#343957',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 20,
  },
  vivid: {
    opacity: 0.7,
  },
});
