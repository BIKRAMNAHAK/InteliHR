import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '../../store';

// const BASE_URL = 'http://10.0.2.2:80/HRMS/controller';    
const BASE_URL = 'https://chaaruvi.com/hrms/Mobileapp/';

/** LoginUserAsync - authenticate user with username/password */
export const LoginUserAsync = (input) => {
  console.log("action", input);

  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/emp_login.php`, input, {
        headers: { "Content-Type": "application/json" },
      });
      const response = res.data;

      let msg = "";
      if (response.status === "200") msg = "Login Successful";
      else if (response.status === "401") msg = "Incorrect Password";
      else if (response.status === "403") msg = "User Not Found";
      else if (response.status === "405") msg = "Missing Fields";
      else msg = "Unknown Error";

      const payload = {
        status: response.status,
        message: msg,
        employee: response.employee || null
      };

      if (response.status === "200") {
        dispatch({ type: "LOGIN_SUCC", payload });
      } else {
        dispatch({ type: "LOGIN_FAILED", payload });
      }

      return payload;
    } catch (error) {
      console.log("Network Error:", error.message);
      const payload = {
        status: "500",
        message: "Server Error or Network Failure"
      };
      dispatch({ type: "LOGIN_FAILED", payload });
      return payload;
    }
  };
};

/** requestOtpAsync - request OTP sent via WhatsApp */
export const requestOtpAsync = (phone) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/otp_generate.php`, phone, {
        headers: { "Content-Type": "application/json" }
      });
      const r = res.data;

      let msg = '';
      if (r.status === "200") msg = "OTP sent to your WhatsApp";
      else if (r.status === "401") msg = "Input is required";
      else if (r.status === "403") msg = "Mobile number not registered";
      else msg = "Unknown Error";

      const payload = { status: r.status, message: msg };

      if (r.status === "200") dispatch({ type: "OTP_GEN_SUCC", payload });
      else dispatch({ type: "OTP_FAILED", payload });

      return payload;
    } catch (error) {
      console.log("OTP Request Failed:", error);
      throw error;
    }
  };
};

/** loginUserWithOtp - authenticate user using OTP */
export const loginUserWithOtp = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/otp_verify.php`, data, {
        headers: { "Content-Type": "application/json" }
      });
      const r = res.data;

      if (r.status === "200") dispatch({ type: 'LOGIN_OTP_SUCC', payload: { employee: r } });
      else dispatch({ type: 'OTP_FAILED', payload: { status: r.status } });

      let msg = '';
      if (r.status === "200") msg = "Login Successful";
      else if (r.status === "401") msg = "Login OTP is Invalid";
      else if (r.status === "403") msg = "Login OTP is Expired, please try again";
      else if (r.status === "404") msg = "Login Mobile Number or OTP is missing";
      else msg = "Unknown Error";

      return { status: r.status, message: msg };
    } catch (error) {
      console.log("error :- ", error);
      throw error;
    }
  };
};

/** logoutUser - remove session data and navigate to Login */
export const logoutUser = (navigation) => {
  return async (dispatch) => {
    await AsyncStorage.removeItem('persist:root');
    dispatch({ type: 'LOGOUT_SUCCESS' });
    navigation.replace('Login');
  };
};

export const ATTENDANCE_SUCCESS = "ATTENDANCE_SUCCESS";
export const ATTENDANCE_ERROR = "ATTENDANCE_ERROR";

/** attendanceDataAsunc - submit attendance (check-in or check-out) with selfie */
export const attendanceDataAsunc = (formData) => {
  console.log("formdata", formData);

  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/emp_attendance.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const r = res.data;

      let msg = "";
      if (r.status === "200") msg = r.message || "Checked In Successfully";
      else if (r.status === "201") msg = "Checked Out Successfully";
      else if (r.status === "401") msg = "Check Out Failed";
      else if (r.status === "403") msg = "You are Out Of Range";
      else if (r.status === "501") msg = "Mobile Attendance Not Allowed";
      else if (r.status === "400") msg = "Check In Failed";
      else msg = "Unknown Error";

      const payload = {
        status: r.status,
        message: msg,
        active: r.active,
        intime: r.intime,
        outtime: r.outtime,
        selfi: r.selfi
      };

      if (r.status === "200" || r.status === "201") dispatch({ type: ATTENDANCE_SUCCESS, payload });
      else dispatch({ type: ATTENDANCE_ERROR, payload });

      return payload;
    } catch (err) {
      const errorMsg = err.message || "Network error";
      console.log("errror : 500", errorMsg);
      console.log("URL : ", `${BASE_URL}/emp_attendance.php`);
      dispatch({ type: ATTENDANCE_ERROR, payload: { status: "500", message: errorMsg } });
      throw errorMsg;
    }
  };
};

/** getInfoAsync - get today's attendance record for employee */
export const getInfoAsync = (info) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${BASE_URL}/att_record.php?empid=${info.empid}&time=${info.date}`);
      const response = res.data;
      console.log("responce", response);
      return response;
    } catch (error) {
      console.log("responce", error);
      throw error;
    }
  };
};

/** getAttHistoryAsync - get historical attendance data for employee */
export const getAttHistoryAsync = (empid) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${BASE_URL}/att_history.php?empid=${empid}`);
      const response = res.data;
      console.log("responce histry: ", response);
      return response;
    } catch (error) {
      console.log("error ", error);
      throw error;
    }
  };
};


//** postWallAsync - submit a post to the wall */
export const postWallAsync=(formData) => {
  console.log("formdata", formData);
  
  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/content_wall.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const response = res.data;

      if (response.status === "200") {
        return response
      } else {
      }

      return response;
    } catch (error) {
      console.log("Post Wall Error:", error);
      throw error;
    }
  };
}

/** getWallPostsAsync - fetch all posts from the wall */
export const getWallPostsAsync = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${BASE_URL}/get_all_posts.php`);
      const response = res.data;
      console.log("response", response);
      if (response.status === "200") {
        return response.posts;
      } else {
        return [];
      }
    } catch (error) {
      console.log("Get Wall Posts Error:", error);
      throw error;
    }
  };
}

export const interactWithPostAsync = (contentId, userId, type, comment = '') => {
  console.log("Sending:", contentId, userId, type, comment);

  return async () => {
    try {
      const res = await axios.post(`${BASE_URL}/content_interactions.php`, {
        content_id: contentId,
        user_id: userId,
        type,
        comment
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("API Response:", res.data.status);
      return res.data
    } catch (error) {
      console.log("Post Interaction Error:", error.message);
      if (error.response) {
        console.log("Server Error:", error.response.data);
      }
      throw error;
    }
  };
};

// get like and comment actions

export const getLikesAndCommentsAsync = () => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${BASE_URL}/get_all_comments.php`);
      // console.log("Fetch Likes/Comments Response:", res.data);
      return res.data;  
      
    } catch (error) {
      console.error("Fetch Likes/Comments Error:", error);
      throw error;
    }
  };
};

export const getLeaveAsync = ()=>{
  return async(dispatch)=>{
    try {
        const res = await axios.get(`${BASE_URL}/get_leave.php`)
        const responce = res.data;
        return responce
    } catch (error) {
      throw error
    }
  }
}