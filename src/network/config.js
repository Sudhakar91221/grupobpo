import {CompanyType} from '../modules/Base/Main';

// const IMAGE_DOWNLOAD_LINK = '/User/getThumbByName';
const IMAGE_DOWNLOAD_LINK =  '/File/getThumb'
const USER_IMAGE_DOWNLOAD_LINK = '/User/getThumbByName';

//-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
let commonUrl = '/api'; //TODO: /api/
let localCommonUrl = '/api/index.php/';
//-----------------------------------------------------------------------------------------
const USE_REAL_API = true;
const NOTIFICATION_KEY = '';
//-----------------------------------------------------------------------------------------

let MAIN_BASE_RUL = '';
let BASE_URL = '';
let IMAGE_DOWNLOAD_URL = '';
let TEMP_IMAGE_DOWNLOAD_URL = '';
let USER_IMAGE_DOWNLOAD_URL = '';
let PROJECT_KEY = '';
let API_KEY = '123456';
let BUILD_VERSION = '';
let LAST_UPDATED = '';
let apiVersion = '';
let REPORT_IMAGE_DOWNLOAD_URL = '';
export const timeZone = 'Asia/Manila';
export const CURRENCY = 'PHP';

let COMPANY_DOMAIN_URL =
  'http://lognwork.mawsoftwares.in/master/v1/Subdomain/get';
const COMPANY_DOMAIN_API_KEY = '123456';

let COMMON_APP_URL_OLYMPIC = '';

export function setTheServerSettings(company) {
  if (company.name.includes('ccs')) {
    global.CompanyType = CompanyType.CCSPH;
    BUILD_VERSION = '1.0';
  }
  if (company.name.includes('cap')) {
    global.CompanyType = CompanyType.Capstone;
    BUILD_VERSION = '1.0';
  }
  if (company.name.includes('log')) {
    global.CompanyType = CompanyType.LogNWork;
    BUILD_VERSION = '2.2';
  }

  const HostServer = {
    liveServer: 'http://lognwork.mawsoftwares.in',
  };

  MAIN_BASE_RUL = HostServer.liveServer;
  API_KEY = company.key;
  PROJECT_KEY = 'b205a6679ec6fa76c356a3511e6898b3';
  apiVersion = 'v35';
  // BUILD_VERSION     = "1.0"
  LAST_UPDATED = '5th Nov 2019';

  BASE_URL = MAIN_BASE_RUL + commonUrl + apiVersion;
  IMAGE_DOWNLOAD_URL = MAIN_BASE_RUL + IMAGE_DOWNLOAD_LINK;
  USER_IMAGE_DOWNLOAD_URL = BASE_URL + USER_IMAGE_DOWNLOAD_LINK;
}

export function setTheServerSettingsOriginal(serverType) {
  switch (serverType) {
    case CompanyType.eCity:
      {
        const HostServer = {
          liveServer: 'https://app.lognwork.com',
          prodServer: 'http://lognwork.mawsoftwares.in',
          localServer: 'http://192.168.1.11/maw/lognwork/app',
          stageServer: 'http://stage.lognwork.mawsoftwares.in',
          grupoServer: 'https://app.lognwork.com',
        };

        MAIN_BASE_RUL = HostServer.grupoServer;
        API_KEY = '986d5a25052402ebb86fcbc8de7209e2';
        //PROJECT_KEY = 'a6116c24ed47d2b11dd90ba6d018cb6f'; //production
        PROJECT_KEY = 'b205a6679ec6fa76c356a3511e6898b3'; //live

        apiVersion = '/v35';
        BUILD_VERSION = '1.1';
        LAST_UPDATED = '5th Nov 2019';

        // BASE_URL = MAIN_BASE_RUL + '/seller' + commonUrl + apiVersion;

        BASE_URL = MAIN_BASE_RUL + commonUrl + apiVersion;
        IMAGE_DOWNLOAD_URL = BASE_URL + IMAGE_DOWNLOAD_LINK;
        REPORT_IMAGE_DOWNLOAD_URL = MAIN_BASE_RUL + '/uploads' + '/report';
        TEMP_IMAGE_DOWNLOAD_URL = MAIN_BASE_RUL + '/uploads' + '/tmp';
        USER_IMAGE_DOWNLOAD_URL = BASE_URL + USER_IMAGE_DOWNLOAD_LINK;
        // COMMON_APP_URL_OLYMPIC =
        //   'http://olympic.mawsoftwares.in' + '/' + apiVersion;
      }
      break;
  }
}

//-----------------------------------------------------------------------------------------
const SupportServer = {
  prodServer: 'http://support.mawsoftwares.in',
  localServer: 'http://192.168.1.14/maw/lognwork/app',
};

var supportUplaodUrl = '/uploads/';
var supportCommonUrl = '/api/v1';

const SUPPORT_API_KEY = '123456';
const SUPPORT_MAIN_URL = SupportServer.prodServer;
const SUPPORT_TICKET_IMAGE_DOWNLOAD_URL =
  SUPPORT_MAIN_URL + supportUplaodUrl + 'ticket';
const SUPPORT_REPLY_IMAGE_DOWNLOAD_URL =
  SUPPORT_MAIN_URL + supportUplaodUrl + 'replies';
const SUPPORT_TEMP_IMAGE_DOWNLOAD_URL =
  SUPPORT_MAIN_URL + supportUplaodUrl + 'tmp';
const SUPPORT_URL = SUPPORT_MAIN_URL + supportCommonUrl;

//------------------------------------------------------------------------------------------

export {
  BASE_URL,
  API_KEY,
  IMAGE_DOWNLOAD_URL,
  USER_IMAGE_DOWNLOAD_URL,
  SUPPORT_URL,
  SUPPORT_TICKET_IMAGE_DOWNLOAD_URL,
  SUPPORT_REPLY_IMAGE_DOWNLOAD_URL,
  SUPPORT_TEMP_IMAGE_DOWNLOAD_URL,
  PROJECT_KEY,
  BUILD_VERSION,
  LAST_UPDATED,
  apiVersion,
  NOTIFICATION_KEY,
  MAIN_BASE_RUL,
  SUPPORT_API_KEY,
  COMPANY_DOMAIN_API_KEY,
  COMPANY_DOMAIN_URL,
  COMMON_APP_URL_OLYMPIC,
  REPORT_IMAGE_DOWNLOAD_URL,
};
