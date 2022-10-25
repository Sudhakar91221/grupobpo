import {
  FAQ_GET,
  FEEDBACK_ADD,
  FEEDBACK_GET,
  FEEDBACK_UPDATE,
  GET_MY_ADS,
  VIEW_MY_AD,
  AD_STATISTICS,
  VIEW_AD,
} from './type';

import {apiCall, RequestType} from '../../../network/APICall';

export const MoreApiList = type => {
  switch (type) {
    case FAQ_GET:
      return '/GetFAQ';
    case FEEDBACK_ADD:
      return '/AddFeedback';
    case FEEDBACK_GET:
      return '/GetFeedback';
    case FEEDBACK_UPDATE:
      return '/UpdateFeedback';
    case GET_MY_ADS:
      return '/MyAdvertisementList';
    case VIEW_MY_AD:
      return '/ViewMyAdvertise';
    case AD_STATISTICS:
      return '/ViewAdvertiseStatistic';
    case VIEW_AD:
      return '/ViewAdvertise';
  }
};

class MoreAPI {
  static getFAQ(input) {
    return apiCall(MoreApiList(FAQ_GET), input, FAQ_GET, RequestType.POST);
  }
  static feedbackAdd(input) {
    return apiCall(
      MoreApiList(FEEDBACK_ADD),
      input,
      FEEDBACK_ADD,
      RequestType.POST,
    );
  }
  static feedbackGet(input) {
    return apiCall(
      MoreApiList(FEEDBACK_GET),
      input,
      FEEDBACK_GET,
      RequestType.POST,
    );
  }
  static feedbackUpdate(input) {
    return apiCall(
      MoreApiList(FEEDBACK_UPDATE),
      input,
      FEEDBACK_UPDATE,
      RequestType.POST,
    );
  }
  static getMyAds(input) {
    return apiCall(
      MoreApiList(GET_MY_ADS),
      input,
      GET_MY_ADS,
      RequestType.POST,
    );
  }
  static viewMyAd(input) {
    return apiCall(
      MoreApiList(VIEW_MY_AD),
      input,
      VIEW_MY_AD,
      RequestType.POST,
    );
  }

  static viewAdStatistics(input) {
    return apiCall(
      MoreApiList(AD_STATISTICS),
      input,
      AD_STATISTICS,
      RequestType.POST,
    );
  }

  static viewAd(input) {
    return apiCall(MoreApiList(VIEW_AD), input, VIEW_AD, RequestType.POST);
  }
}

export default MoreAPI;
