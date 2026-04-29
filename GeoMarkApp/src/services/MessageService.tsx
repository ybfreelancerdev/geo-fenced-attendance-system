import Toast from 'react-native-toast-message';

export const showSuccess = (title:string, message?:string) => {
  Toast.show({
    type: 'success', // 'success' | 'error' | 'info'
    text1: title,
    text2: message,
    position: 'bottom', // or 'top'
    visibilityTime: 3000,
  });
};

export const showError = (title: string, message?: string) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
};

export const showInfo = (title: string, message?: string) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
};

export const showCustom = (title: string, message?: string) => {
  Toast.show({
    type: 'custom',
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 3000,
  });
};

