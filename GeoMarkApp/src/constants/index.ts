import { Alert, Dimensions, Platform, StatusBar } from "react-native";
import DeviceInfo from 'react-native-device-info';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height; //44 is the header height in ParentWrapper
export const PLATFORM_IOS = Platform.OS == 'ios' ? true : false;
export const PAGE_SIZE = 20;
export const RPI_CompID = 1060;
export const PHOTOIcon_Height = 150;
export const PHOTOIcon_Width = 150;
export const PHOTO_Height = 480;
export const PHOTO_Width = 360;

export const _LOGO = require('../../assets/logo.png');
export const _BANNER = require('../../assets/banner.png');
export const _EVENT = require('../../assets/event.png');

// API endpoint
//export const SERVER_BASE = 'https://taza360.com/Rhino360Api';
export const SERVER_BASE = 'http://10.0.2.2:5124/api';
//Session Keys
export const tokenSessionKey = 'auth-token';
export const loginCredentialKey = 'user-Credential';
export const userSessionKey = 'auth-user';
export const roleSessionKey = 'auth-role';


export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  d.setUTCHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // 👈 Add 1 day
  return d.toISOString().split('T')[0];
};

export function getStatusBarHeight(skipAndroid?:any) {
  const { height, width } = Dimensions.get('window');

  const isIPhoneXOrNewer = Platform.OS === 'ios' && (
    DeviceInfo.hasNotch() || // Check for a notch
    (height === 812 || height === 896 || width === 812 || width === 896) 
  );

  return Platform.select({
    ios: isIPhoneXOrNewer ? 44 : 20, 
    android: skipAndroid ? 0 : StatusBar.currentHeight, 
    default: 0, 
  });
}

export function showAlertMessage(title:string, message?:string) {
  Alert.alert(
    title,
    message,
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    {
      cancelable: false,
    },
  );
}

export function GetPropertyMenuList(StatusId:number, TypeId:number, CompID:number, RPI_CompID:number, IsAssignedByTAZA: boolean) {
  const strings = [];
  if (StatusId === 1) {
    strings.push("ACCEPT/REJECT NEW INSPECTION");
  }

  strings.push("Upload Photos");
  strings.push("View Photos");

  if (TypeId === 7) {
    strings.push("Details");
    strings.push("Features");
    strings.push("Security");
    strings.push("Marketing");
    strings.push("Utilities");
    strings.push("Maintenance");
    strings.push("Repair Costs");
    strings.push("Property General Notes");
  }

  if (TypeId === 8) {
    strings.push("HUD General Information");
    strings.push("HUD Exterior");
    strings.push("HUD Interior");
    strings.push("HUD Safety");
    strings.push("HUD Ready To close");
    strings.push("HUD Ready To List");
    strings.push("HUD Signature");
  }

  if (TypeId === 9) {
    strings.push("EZ Weekly Exterior");
    strings.push("EZ Weekly Interior");
  }

  if (TypeId === 7 || TypeId === 9) {
    strings.push("Property Occupancy");
    strings.push("Property HOA");
  }

  if (TypeId === 10) {
    strings.push("Exterior Inspection Details");
  }

  if (CompID !== RPI_CompID) {
    strings.push("Preview Report");
    strings.push("Transfer to RhinoREO");
    strings.push("Duplicate Report");
  }

  if (!IsAssignedByTAZA) {
    strings.push("Submit Report");
  }

  strings.push("Email Photos & Report");

  return strings;
}

export const commonvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
  { label: 'NA', value: 'NA' }
];
export const Conditionvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Good', value: 'Good' },
  { label: 'Poor', value: 'Poor' },
  { label: 'Damaged', value: 'Damaged' },
  { label: 'Missing', value: 'Missing' },
  { label: 'NA', value: 'NA' }
];
export const extInspectionvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Excellect', value: 'Excellect' },
  { label: 'Good', value: 'Good' },
  { label: 'Average', value: 'Average' },
  { label: 'Poor', value: 'Poor' },
];
export const Paymentvalues = [
  { label: 'Unknown', value: 'Unknown' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Semi-Annually', value: 'Semi-Annually' },
  { label: 'Annually', value: 'Annually' },
  { label: 'Other', value: 'Other' }
];
export const InspTypes = [
  { label: 'Routine inspection', value: 'Routine' },
  { label: 'Initial inspection', value: 'Initial' },
  { label: 'Ready to list inspection', value: 'List' },
  { label: 'Ready to close inspection', value: 'Close' },
  { label: 'Other', value: 'Other' },
];

export const emailValidation = (email:any) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/;
    if (regex.test(email) === true) {
        return true;
    }
    else {
        return false;
    }
}