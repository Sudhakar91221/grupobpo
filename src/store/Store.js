// store.js

import UserReducer from '../modules/AuthModule/Actions/UserReducer';
import HomeReducer from '../modules/HomeModule/Actions/HomeReducer';
import MoreReducer from '../modules/MoreModule/Actions/MoreReducer';
import FormReducer from '../modules/FormsComponent/Actions/FormReducer';
import {applyMiddleware, createStore, compose, combineReducers} from 'redux';
import NotificationReducer from '../modules/NotificationModule/Actions/NotificationReducer';
import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import thunk from 'redux-thunk';
import DashboardReducer from '../modules/DashboardModule/Actions/DashboardReducer';
import CalenderReducer from '../modules/CalenderModule/Actions/CalenderReducer';
import LeaveReducer from '../modules/LeaveModule/Actions/LeaveReducer';
import TimesheetReducer from '../modules/TimesheetModule/Actions/TimesheetReducer';
import HolidayReducer from '../modules/HolidayModule/Actions/HolidayReducer';
import AnnouncementReducer from '../modules/AnnouncementModule/Actions/AnnouncementReducer';
import DirectoryReducer from '../modules/DirectoryModule/Actions/DirectoryReducer';
import PayslipReducer from '../modules/PayslipModule/Actions/PayslipReducer';
import RequestReducer from '../modules/RequestModule/Actions/RequestReducer';
import MemberReducer from '../modules/MemberModule/Actions/MemberReducer';
import AlbumReducer from '../modules/AlbumModule/Actions/AlbumReducer';
import FileReducer from '../modules/FileModule/Actions/FileReducer';
import OccurrenceReducer from '../modules/OccuranceModule/Actions/OccuranceReducer';
import SupportReducer from '../modules/SupportModule/Actions/SupportReducer';

// import {NetInfo} from 'react-native'

import {reducer as network} from 'react-native-offline';

const rootReducer = combineReducers({
  UserReducer: UserReducer,
  FormReducer: FormReducer,
  HomeReducer: HomeReducer,
  NotificationReducer: NotificationReducer,
  MoreReducer: MoreReducer,
  DashboardReducer: DashboardReducer,
  CalenderReducer: CalenderReducer,
  LeaveReducer: LeaveReducer,
  TimesheetReducer: TimesheetReducer,
  HolidayReducer: HolidayReducer,
  AnnouncementReducer: AnnouncementReducer,
  DirectoryReducer: DirectoryReducer,
  PayslipReducer: PayslipReducer,
  RequestReducer: RequestReducer,
  MemberReducer: MemberReducer,
  AlbumReducer: AlbumReducer,
  FileReducer: FileReducer,
  OccurrenceReducer: OccurrenceReducer,
  SupportReducer: SupportReducer,
});

const configureStore = () => {
  return createStore(
    rootReducer,
    compose(applyMiddleware(thunk), offline(offlineConfig)),
  );
};

export default configureStore;
