// navigation/StackNavigater.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

// Screens & Components
import TabNavigater from './TabNavigater';
import Dashboard from '../screens/Dashboard';
import AttendanceHistory from '../screens/AttendanceHistory';
import LoginUser from '../screens/LoginUser';
import LeaveReqScreen from '../screens/LeaveReqScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomHeader from '../components/CustomHeader';
import SplashScreen from '../screens/SplashScreen';
import LoginWithOtp from '../screens/LoginWithOtp';
import Forget_Password from '../screens/Forget_Password';
import Attendance_rec from '../screens/Attendance_rec';

const Stack = createStackNavigator();

// Function to get current tab title from route
function getTabTitle(route) {
  return getFocusedRouteNameFromRoute(route) ?? 'Home';
}

const StackNavigater = () => {
  // ✅ useSelector hook must be inside the component
  const { employee } = useSelector((state) => state.employee);
  const COMPANY_NAME = employee?.branch_name || "Company";

  return (
    <Stack.Navigator
      screenOptions={({ navigation, route }) => ({
        header: ({ back, options }) => (
          <CustomHeader
            companyName={COMPANY_NAME}
            title={
              route.name === 'MainTabs'
                ? getTabTitle(route)
                : options.title || route.name
            }
            canGoBack={!back}
            navigation={navigation}
            // onLogout={() => navigation.replace('Login')}
          />
        ),
        headerStyle: { height: 70 }
      })}
    >
      {/* Screens */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={LoginUser}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ForgetPassword"
        component={Forget_Password}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LoginOtp"
        component={LoginWithOtp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MainTabs"
        component={TabNavigater}
      />

      <Stack.Screen
        name="Attendance_rec"
        component={Attendance_rec}
        options={{ title: 'Attendance_rec' }}
      />

      {/* <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      /> */}

      <Stack.Screen
        name="Attendance"
        component={AttendanceHistory}
        options={{  title: ''}}
      />

      <Stack.Screen
        name="Leave"
        component={LeaveReqScreen}
        options={{ title: 'Leave Request' }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigater;
