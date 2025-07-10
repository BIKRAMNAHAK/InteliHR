import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor } from '../../store';
// const BASE_URL = 'http://10.0.2.2:80/HRMS/controller';
const BASE_URL = 'https://chaaruvi.com/hrms/Mobileapp/'

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

      return payload; // ✅ return for .then() in UI

    } catch (error) {
      console.log("Network Error:", error.message);
      const payload = {
        status: "500",
        message: "Server Error or Network Failure"
      };
      dispatch({ type: "LOGIN_FAILED", payload });
      return payload; // ✅ return even in catch block
    }
  };
};


export const requestOtpAsync = (phone) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/otp_generate.php`, phone, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("OTP Request Response:", res.data);
      const r = res.data;

      let msg = '';
      if (r.status === "200") msg = "OTP sent to your WhatsApp";
      else if (r.status === "401") msg = "Input is required";
      else if (r.status === "403") msg = "Mobile number not registered";
      else msg = "Unknown Error";

      const payload = {
        status: r.status,
        message: msg
      };

      if (r.status === "200") {
        dispatch({ type: "OTP_GEN_SUCC", payload });
      } else {
        dispatch({ type: "OTP_FAILED", payload });
      }

      return payload;
    } catch (error) {
      console.log("OTP Request Failed:", error);
      throw error;
    }
  };
};


export const loginUserWithOtp = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/otp_verify.php`, data, {
        headers: { "Content-Type": "application/json" }
      });

      const r = res.data;
      if (r.status == "200") {
        dispatch({ type: 'LOGIN_OTP_SUCC', payload: { employee: r }})
      }else {
        dispatch({ type: 'OTP_FAILED', payload });
      }


        let msg = '';
      if (r.status == "200") msg = "Login Successful";
      else if (r.status === "401") msg = "Login OTP is Invalid";
      else if (r.status === "403") msg = "Login OTP is Expired, please try again";
      else if (r.status === "404") msg = "Login Mobile Number or OTP is missing";
      else msg = "Unknown Error";

      const payload = {
        status: r.status,
        message: msg,
      };

      return payload;

    } catch (error) {
      console.log("error :- ", error);
      throw error;
    }
  };
};


export const logoutUser = (navigation) => {
  return async (dispatch) => {
    await AsyncStorage.removeItem('persist:root');
    dispatch({ type: 'LOGOUT_SUCCESS' });
    navigation.replace('Login');
  };
};


export const ATTENDANCE_SUCCESS = "ATTENDANCE_SUCCESS";
export const ATTENDANCE_ERROR = "ATTENDANCE_ERROR";

export const attendanceDataAsunc = (formData) => {
  console.log("formdata", formData);

  return async (dispatch) => {
    try {
      const res = await axios.post(`${BASE_URL}/emp_attendance.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("URL : ", `${BASE_URL}/emp_attendance.php`);

      const r = res.data;
      console.log("Server Response:", r);
      console.log("Server Response status:", r.status);
      console.log("Server Response message:", r.message);
      console.log("Server Response active:", r.active);
      console.log("Server Response intime:", r.intime);

      let msg = "";
      if (r.status === "200") {
        if (r.message) {
          msg = r.message
        }
        msg = "Checked In Successfully";
      }
      else if (r.status === "201") msg = "Checked Out Successfully";
      else if (r.status === "401") msg = "Check Out Failed";
      else if (r.status === "403") msg = "You are Out Of Range";
      else if (r.status === "501") msg = "Mobile Attendance Not Allowed";
      else if (r.status === "400") msg = "Check In Failed";
      else msg = "Unknown Error";

      const payload = {
        status: r.status,
        message: msg,
        active: r.active,   // "1" or "0"
        intime: r.intime,   // "HH:MM:SS"
        outtime: r.outtime,
        selfi: r.selfi
      };

      if (r.status === "200" || r.status === "201") {
        dispatch({ type: ATTENDANCE_SUCCESS, payload });
      } else {
        dispatch({ type: ATTENDANCE_ERROR, payload });
      }
      return payload

    } catch (err) {
      const errorMsg = err.message || "Network error";
      console.log("errror : 500", errorMsg);
      console.log("URL : ", `${BASE_URL}/emp_attendance.php`);

      dispatch({
        type: ATTENDANCE_ERROR,
        payload: { status: "500", message: errorMsg }

      });
      throw errorMsg
    }
  };
};

export const getInfoAsync = (info) => {
  return async (dispatch) => {
    try {
      const res = await axios.get(`${BASE_URL}/att_record.php?empid=${info.empid}&time=${info.date}`)
      const responce = res.data
      console.log("responce", responce);

      // if (responce.status == '200') {
      //   dispatch({type : "GET_ATT_INFO" , payload : responce})
      // }else{
      //   dispatch({type : "GET_FAILED_ATT_INFO" , payload : responce.status})
      // }
      return responce;
    } catch (error) {
      console.log("responce", error);
      throw error;
    }
  }
}

export const getAttHistoryAsync = (empid) => {

  return async (dispatch) => {
    try {
      const res = await axios.get(`${BASE_URL}/att_history.php?empid=${empid}`)
      const responce = res.data;
      // console.log("responce histry: ", responce);
      return responce
    } catch (error) {
      console.log("error ", error);
      throw error
    }
  }
}