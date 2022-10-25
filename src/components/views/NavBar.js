/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Icons from '../common/Icons';
import SearchBar from 'react-native-dynamic-search-bar';
import {CustomLayoutSpring} from 'react-native-animation-layout';

const DrawerIcon = object => (
  <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={object.action}>
      <Image
        source={require('../../assets/menu.png')}
        style={{
          width: 30,
          height: 30,
          marginLeft: 10,
          //backgroundColor: '#343957',
        }}
      />
    </TouchableOpacity>
  </View>
);

const NavSearchBar = object => (
  <SearchBar
    onPressToFocus
    autoFocus={false}
    fontColor="#c6c6c6"
    iconColor="#c6c6c6"
    shadowColor="#c6c6c6"
    cancelIconColor="#353d5e"
    backgroundColor="#8E8E931F"
    placeholder="Search here"
    onChangeText={text => {
      this.filterList(text);
    }}
    onPressCancel={() => {
      this.filterList('');
    }}
    onPress={() => alert('onPress')}
  />
);

const AddButton = (object, navigation) => (
  <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={object.action}>
      <Icons.MaterialCommunityIcons
        name={'plus'}
        size={30}
        tintColor="white"
        color={'white'}
        style={{tintColor: 'white', paddingRight: 3}}
      />
    </TouchableOpacity>

    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={object.action}
        style={{paddingLeft: 5, paddingRight: 10}}>
        <Icons.MaterialIcons name={'notifications'} size={30} color="white" />
        {object.isBadgeShown === true ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 15,
              borderRadius: 10,
              width: 10,
              height: 10,
              backgroundColor: 'red',
            }}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  </View>
);

const CustomBackButton = (object, navigation) => (
  <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={object.action} style={{paddingLeft: 10}}>
      <Icons.MaterialCommunityIcons
        name={'arrow-left'}
        size={25}
        color="#81B833"
      />
    </TouchableOpacity>

    {/* <TouchableOpacity onPress={object.notiaction}>
      <Icons.MaterialIcons name={'notifications'} size={30} tintColor="black" />
    </TouchableOpacity> */}
  </View>
);

const BackButton = (object, navigation) => (
  <View style={{flexDirection: 'row'}}>
    <TouchableOpacity onPress={object.action} style={{paddingLeft: 5}}>
      <Icons.MaterialCommunityIcons
        name={'arrow-left'}
        size={25}
        color="white"
      />
    </TouchableOpacity>
  </View>
);

const NotificationButton = (object, navigation) => (
  <View style={{flexDirection: 'row'}}>
    <TouchableOpacity
      onPress={object.action}
      style={{paddingLeft: 5, paddingRight: 10}}>
      <Icons.MaterialIcons name={'notifications'} size={30} color="white" />
      {object.isBadgeShown === true ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 15,
            borderRadius: 10,
            width: 10,
            height: 10,
            backgroundColor: 'red',
          }}
        />
      ) : null}
    </TouchableOpacity>
  </View>
);

const style = {
  addButtonStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
    backgroundColor: 'transparent',
    tintColor: 'white',
    marginTop: 5,
  },
  leftButtonStyle: {
    width: 25,
    height: 25,
    marginLeft: 5,
    backgroundColor: 'transparent',
    tintColor: 'white',
  },
};
export {
  DrawerIcon,
  AddButton,
  BackButton,
  NavSearchBar,
  CustomBackButton,
  NotificationButton,
};
