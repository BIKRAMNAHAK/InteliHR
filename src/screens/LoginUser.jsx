import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ImageBackground, Animated, Platform, KeyboardAvoidingView,
  ScrollView, ActivityIndicator, Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUserAsync } from '../services/Actions/employeeAction';
import { useLoading } from '../navigation/LoadingContext';
import AwesomeAlert from 'react-native-awesome-alerts';

const LoginUser = ({ navigation }) => {
  const [input, setInput] = useState({ email: '', password: '' });
  const animValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current
  ];
  const anim = (a, to) => Animated.timing(a, { toValue: to, duration: 200, useNativeDriver: false }).start();

  const dispatch = useDispatch();
  const { employee } = useSelector(state => state.employee);
  const { loading, setLoading } = useLoading();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'success',
  });

  const handleLogin = () => {
    if (!input.email || !input.password) {
      setAlertConfig({
        title: "Missing Fields",
        message: "Please enter both email and password.",
        type: "warning"
      });
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    dispatch(LoginUserAsync(input))
      .then((res) => {
        setAlertConfig({
          title: res.status === "200" ? "Login Successful" : "Login Failed",
          message: res.message,
          type: res.status === "200" ? "success" : "danger"
        });
        setAlertVisible(true);

        if (res.status === "200") {
          navigation.replace("MainTabs");
        }

        setLoading(false);
      })
      .catch((err) => {
        setAlertConfig({
          title: "Network Error",
          message: err?.message || "Unexpected error occurred.",
          type: "danger"
        });
        setAlertVisible(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (employee) {
      navigation.navigate('MainTabs');
    }
  }, [employee]);

  return (
    <ImageBackground source={require('../assets/images/auth_2.png')} style={styles.bg}>
      <View style={styles.overlay} />
      {loading && (
        <View style={styles.fullscreenOverlay}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      )}

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.img_box}>
            <Image source={require('../assets/images/splash.png')} style={styles.logo} />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Login to your</Text>
            <Image source={require('../assets/images/splash.png')} style={styles.Textlogo} />
            <Text style={styles.titleText}>account</Text>
          </View>

          <Text style={styles.paragraph}>Log in with email & password, or use OTP.</Text>

          <View style={styles.formSection}>
            {['Email or Mobile Number', 'Password'].map((label, i) => (
              <View key={i} style={styles.inputWrapper}>
                <Animated.Text style={labelStyle(animValues[i])}>{label}</Animated.Text>
                <TextInput
                  style={styles.input}
                  secureTextEntry={i === 1}
                  keyboardType={i === 0 ? 'email-address' : 'default'}
                  value={i === 0 ? input.email : input.password}
                  onChangeText={t => setInput(prev => ({ ...prev, [i === 0 ? 'email' : 'password']: t }))}
                  onFocus={() => anim(animValues[i], 1)}
                  onBlur={() => {
                    const val = i === 0 ? input.email : input.password;
                    if (!val) anim(animValues[i], 0);
                  }}
                />
              </View>
            ))}

            <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
              <Text style={styles.btnText}>{loading ? 'Logging in...' : 'Login'}</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <TouchableOpacity style={[styles.btn, styles.otpBtn]} onPress={() => navigation.navigate('LoginOtp')}>
                <Text style={styles.btnTextSmall}>Login With OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.forgotBtn]} onPress={() => navigation.navigate('ForgetPassword')}>
                <Text style={styles.btnTextSmall}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    <AwesomeAlert
  show={alertVisible}
  showProgress={false}
  title={alertConfig.title}
  message={alertConfig.message}
  closeOnTouchOutside={true}
  closeOnHardwareBackPress={false}
  showConfirmButton={true}
  confirmText="OK"
  confirmButtonColor={
    alertConfig.type === "success"
      ? "#4CAF50"
      : alertConfig.type === "warning"
      ? "#FFA000"
      : "#E53935"
  }
  onConfirmPressed={() => setAlertVisible(false)}
  contentContainerStyle={{
    width: '85%',          // 📏 Increase width here
    paddingHorizontal: 20,
    borderRadius: 10,
  }}
  titleStyle={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}
  messageStyle={{ fontSize: 16, textAlign: 'center' }}
  confirmButtonStyle={{ paddingHorizontal: 20 }}
  confirmButtonTextStyle={{ fontSize: 16 }}
/>

    </ImageBackground>
  );
};

const labelStyle = anim => ({
  position: 'absolute',
  left: 10,
  top: anim.interpolate({ inputRange: [0, 1], outputRange: [18, -10] }),
  fontSize: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
  color: anim.interpolate({ inputRange: [0, 1], outputRange: ['#aaa', '#E91E63'] }),
  backgroundColor: '#fff',
  paddingHorizontal: 4
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bg: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  img_box: {
    width: 100, height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    elevation: 15
  },
  logo: { width: 100, height: 100 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleText: { fontSize: 18, color: '#000', paddingBottom: 10 },
  Textlogo: { width: 80, height: 90, bottom: -30 },
  paragraph: { fontSize: 14, textAlign: 'center', color: '#444', marginBottom: 20 },
  formSection: { width: '100%', alignItems: 'center' },
   inputWrapper: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    marginBottom: 20, paddingHorizontal: 10,
    paddingTop: 18, paddingBottom: 4,
    backgroundColor: '#fff', width: '100%',
  },
  input: { fontSize: 16, height: 30, color: '#000', paddingVertical:"auto"},
  btn: {
    backgroundColor: '#E91E63',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnTextSmall: { color: '#fff', fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', marginTop: 10 },
  otpBtn: { backgroundColor: '#2196F3', flex: 1, marginRight: 5 },
  forgotBtn: { backgroundColor: '#FF9800', flex: 1, marginLeft: 5 },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  }
});

export default LoginUser;
