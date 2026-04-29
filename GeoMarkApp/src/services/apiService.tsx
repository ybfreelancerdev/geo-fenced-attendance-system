import axios from 'axios';
import api from './api';
import { SERVER_BASE, showAlertMessage } from '../constants';
import { showCustom } from './MessageService';

// Common APIs
export const userLogin = async (payload: any) => {
    try {
        let res = await axios.post(`${SERVER_BASE}/Auth/Login`, payload);
        if (res.status === 200 && res.data.success) {
            axios.defaults.headers.common.Authorization = `Bearer ${res.data.data.token}`;
            return res.data;
        } 
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        }
        else {
            showAlertMessage(
                'Error',
                res.data.message,
            );
            return false;
        }
    } catch (e: any) {
        showAlertMessage(
            'Error',
            'Incorrect Username or Password. Please enter the correct Username and Password.',
        );
        return false;
    }
};

export const createAccount = async (data:any) => {
    try {
        let res = await axios.post(`${SERVER_BASE}/Auth/Register`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const resendOtp = async (data:any) => {
    try {
        let res = await axios.post(`${SERVER_BASE}/Auth/resend-otp`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const verifyOtp = async (data:any) => {
    try {
        let res = await axios.post(`${SERVER_BASE}/Auth/verify-otp`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const forgotPassword = async (data:any) => {
    try {
        let res = await axios.post(`${SERVER_BASE}/Auth/forgot-password`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const resetPassword = async (data:any) => {
    try {
        let res = await axios.post(`${SERVER_BASE}/Auth/reset-password`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getUserDetail = async () => {
    try {
        let res = await api.get(`${SERVER_BASE}/User/profile`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getTopUpcomingEvents = async () => {
    try {
        let res = await api.get(`${SERVER_BASE}/Event/upcoming/top5`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getUpcomingEvents = async () => {
    try {
        let res = await api.get(`${SERVER_BASE}/Event/upcoming`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getAllEvents = async () => {
    try {
        let res = await api.get(`${SERVER_BASE}/Event/allEvents`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getEvents = async (payload:any) => {
    try {
        let res = await api.post(`${SERVER_BASE}/Event/list`, payload);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const myEvents = async (payload:any) => {
    try {
        let res = await api.post(`${SERVER_BASE}/Event/my-events`, payload);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const markAttendance = async (id:number) => {
    try {
        let res = await api.post(`${SERVER_BASE}/Event/attendance/${id}`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getEventDetailById = async (id:number) => {
    try {
        let res = await api.get(`${SERVER_BASE}/Event/events?id=${id}`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const addfcmToken = async (payload:any) => {
    try {
        let res = await api.post(`${SERVER_BASE}/User/add-fcm-token`, payload);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const removefcmToken = async (payload:any) => {
    try {
        let res = await api.post(`${SERVER_BASE}/User/remove-fcm-token`, payload);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

// Admin APIs

export const getDashboard = async () => {
    try {
        let res = await api.get(`${SERVER_BASE}/User/dashboard`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const createEvent = async (data:any) => {
    try {
        let res = await api.post(`${SERVER_BASE}/Event/admin/event`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getEventDataById = async (id:number) => {
    try {
        let res = await api.get(`${SERVER_BASE}/Event/admin/event/${id}`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const updateEvent = async (id: number, data:any) => {
    try {
        let res = await api.put(`${SERVER_BASE}/Event/admin/event/${id}`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const userList = async (data:any) => {
    try {
        let res = await api.post(`${SERVER_BASE}/User/list`, data);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const blockUser = async (id:number) => {
    try {
        let res = await api.put(`${SERVER_BASE}/User/block-user/${id}`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

// User APIs

export const applyEvent = async (id:number) => {
    try {
        let res = await api.post(`${SERVER_BASE}/Event/${id}/apply`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getMyProfile = async () => {
    try {
        let res = await api.get(`${SERVER_BASE}/User/myprofile`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const getProfile = async () => {
    try {
        let res = await api.get(`${SERVER_BASE}/User/profile`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const updateProfile = async (payload:any) => {
    try {
        let res = await api.put(`${SERVER_BASE}/User/update-profile`, payload);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const changePassword = async (payload:any) => {
    try {
        let res = await api.post(`${SERVER_BASE}/User/change-password`, payload);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};

export const deleteAccount = async () => {
    try {
        let res = await api.delete(`${SERVER_BASE}/User/delete-account`);
        if (res.status === 200 && res.data.success) {
            return res.data;
        }
        else if(res.status === 200 && res.data.success == false) {
            showCustom(res.data.message);
            return res.data;
        } else {
            showAlertMessage('Error', res.data.message);
            return false;
        }
    } catch (e) {
        showAlertMessage('Error', 'Something went wrong !! Please try again ..');
        return false;
    }
};


