import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, SafeAreaView, Image, ScrollView,
    Platform, PermissionsAndroid, StyleSheet, TextInput,
    TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AwesomeAlert from 'react-native-awesome-alerts';

import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import { attendanceDataAsunc, getInfoAsync } from '../services/Actions/employeeAction';
import { useLoading } from '../navigation/LoadingContext';

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const { loading, setLoading } = useLoading();
    const { attResponse, employee, att_info } = useSelector(state => state.employee);

    const [employees, setEmployees] = useState({});
    const [remark, setRemark] = useState("");
    const [showPunchCard, setShowPunchCard] = useState(false);
    const [capturedImage, setCapturedImage] = useState({});
    const [location, setLocation] = useState(null);
    const [isPunchedIn, setIsPunchedIn] = useState({
        status: '', active: '', message: '',
        time: "--:--:--", selfi: '', outtime: "--:--:--", active: ''
    });
    const [punchInTime, setPunchInTime] = useState(null);
    const [punchOutTime, setPunchOutTime] = useState(null);
    const [totalHours, setTotalHours] = useState('--:--:--');
    const [currentTime, setCurrentTime] = useState('');
    const [birthdays, setBirthdays] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSuccess, setAlertSuccess] = useState(false);

    const showCustomAlert = (title, message, isSuccess = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertSuccess(isSuccess);
        setShowAlert(true);
    };

    useEffect(() => { if (employee) setEmployees(employee); }, [employee]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            setCurrentTime(formattedTime);
            if (isPunchedIn && punchInTime) updateTotalHours(now);
        }, 1000);
        return () => clearInterval(timer);
    }, [isPunchedIn, punchInTime]);

    useEffect(() => {
        if (attResponse) {
            setIsPunchedIn({
                status: attResponse.status,
                message: attResponse.message,
                active: attResponse.active,
                selfi: attResponse.selfi,
            });
        }
    }, [attResponse]);

    const updateTotalHours = (now) => {
        const diffMs = now - punchInTime;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMin = Math.floor((diffMs % 3600000) / 60000);
        const diffSec = Math.floor((diffMs % 60000) / 1000);
        setTotalHours(`${diffHrs.toString().padStart(2, '0')}:${diffMin.toString().padStart(2, '0')}:${diffSec.toString().padStart(2, '0')}`);
    };

    const requestCameraPermission = async () => {
        if (Platform.OS !== 'android') return true;
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Camera Permission",
                message: "Need camera access to take picture",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "Cancel",
                buttonPositive: "OK"
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const collectPunchData = async (isIn) => {
        const now = new Date();
        if (isIn) setPunchInTime(now);
        else setPunchOutTime(now);

        // 1️⃣ Ask for camera permission
        if (!(await requestCameraPermission())) return null;

        // 2️⃣ Launch camera with reduced quality
        const resp = await new Promise(resolve =>
            launchCamera(
                {
                    mediaType: 'photo',
                    cameraType: 'front',
                    quality: 0.5,  // reduce size without resizer
                    saveToPhotos: false,
                    includeBase64: false,
                },
                resolve
            )
        );

        // 3️⃣ Handle cancel or failure
        if (resp.didCancel || !resp.assets?.length) return null;

        const image = resp.assets[0];

        // 4️⃣ Directly use original image (no resizing)
        const imageData = {
            uri: image.uri,
            name: image.fileName || 'photo.jpg',
            type: image.type || 'image/jpeg'
        };

        setCapturedImage(imageData);
        setShowPunchCard(true);
        return { image: imageData, loc: location, now };
    };


    const handlePunch = async () => {
        const isIn = !isPunchedIn.active;
        const punchData = await collectPunchData(isIn);
        if (!punchData) return;
    };

    const resetPunchStatus = () => {
        setIsPunchedIn({
            status: '',
            active: '',
            message: '',
            time: '--:--:--',
            selfi: '',
            outtime: '--:--:--'
        });
    };


    const handleAttandance = async () => {
        setLoading(true);
        // ✅ Use location from state (fallback)
        let coords = null;
        try {
            coords = await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    pos => resolve(pos.coords),
                    err => {
                        console.warn('Location Error:', err.message);
                        reject(err);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
                );
            });
        } catch (error) {
            if (location) {
                coords = location; // fallback to previously fetched location
            } else {
                setLoading(false);
                return showCustomAlert('Location Error', 'Unable to fetch location. Please ensure GPS is ON and location permission is granted.', false);
            }
        }

        // ✅ Check if selfie exists
        if (!capturedImage?.uri) {
            setLoading(false);
            return showCustomAlert('Error', 'Please take a selfie before submitting.', false);
        }
        // ✅ Prepare time and data
        const empid = employees.empid;
        const time = new Date();
        const formattedTime = time.toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
        const formattedDate = time.toLocaleDateString('en-CA');

        // ✅ Prepare form data
        const formData = new FormData();
        formData.append('empid', empid);
        formData.append('attdate', formattedDate);
        formData.append('intime', formattedTime);
        formData.append('lati', coords.latitude.toString());
        formData.append('longi', coords.longitude.toString());
        formData.append('remark', remark);

        if (capturedImage && capturedImage.uri) {
            formData.append('fileName', {
                uri: capturedImage.uri,
                name: capturedImage.fileName || 'photo.jpg',
                type: capturedImage.type || 'image/jpeg',
            });
        }

        // ✅ Dispatch
        dispatch(attendanceDataAsunc(formData))
            .then((res) => {
                setLoading(false);
                showCustomAlert(
                    res.status === '200' || res.status === '201' ? 'Success' : 'Error',
                    res.message || 'Something went wrong',
                    res.status === '200' || res.status === '201'
                );

                const now = new Date();
                const date = now.toLocaleDateString('en-CA');
                const empid = employees.empid;
                dispatch(getInfoAsync({ empid, date }))
                    .then((res) => {
                        if (res?.status === "200" && res?.Data?.length > 0) {
                            const lastData = res.Data[res.Data.length - 1];
                            setIsPunchedIn({
                                status: lastData.att_status || '',
                                active: lastData.active || '',
                                message: '',
                                time: lastData.intime || '--:--:--',
                                selfi: lastData.selfie || '',
                                outtime: lastData.outtime || '--:--:--'
                            });
                        } else {
                            resetPunchStatus();
                        }
                    }).catch((err) => {
                        setLoading(false);
                        console.error("Error fetching data:", err);
                        resetPunchStatus(); // 👈 Fallback on error
                    });
            })
            .catch((err) => {
                setLoading(false);
                showCustomAlert('Error', err.message || 'Something went wrong', false);
            });

        setShowPunchCard(false);
        setCapturedImage(null);
        setRemark('');
    };

    const handleProfile = () => navigation.navigate('Profile');

    const handleInfo = (empid) => {
        const time = new Date();
        const date = time.toLocaleDateString('en-CA')
        const empname = employees.empname
        const info = {
            empid,
            date,
            empname
        };

        navigation.navigate('Attendance_rec', {
            empid: info.empid,
            date: info.date,
            empname : info.empname
        });
    };

    const getCurrentMonthBirthdays = (data) => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;

        return data.filter(emp => {
            const [year, month, day] = emp.dob.split('-').map(Number);
            return (
                month === currentMonth
            );
        });
    };

    useEffect(() => {
        if (!employees.empid) return;

        let watchId = null;

        const fetchData = async () => {
            setLoading(true);

            // 🎯 1. Start Live Location Tracking
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'App needs access to your location.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    watchId = Geolocation.watchPosition(
                        (position) => {
                            setLocation(position.coords); // 🔁 updates live
                            console.log("📍 Live location:", position.coords);
                        },
                        (error) => {
                            console.warn("📡 Location tracking error:", error.message);
                        },
                        {
                            enableHighAccuracy: true,
                            distanceFilter: 5, // update after 5 meters movement
                            interval: 5000,     // Android only
                            fastestInterval: 2000,
                        }
                    );
                }
            } catch (error) {
                console.warn("Permission or Location error:", error);
            }

            // 🎯 2. Attendance info
            const today = new Date();
            const date = today.toLocaleDateString('en-CA');
            const empid = employees.empid;
            const getData = { date, empid };

            try {
                const res = await dispatch(getInfoAsync(getData));
                setLoading(false);

                if (res?.status === "200" && res?.Data?.length > 0) {
                    const lastData = res.Data[res.Data.length - 1];
                    setIsPunchedIn({
                        status: lastData.att_status || '',
                        active: lastData.active || '',
                        message: '',
                        time: lastData.intime || '--:--:--',
                        selfi: lastData.selfie || '',
                        outtime: lastData.outtime || '--:--:--'
                    });
                } else {
                    resetPunchStatus();
                }

                const birthdayData = getCurrentMonthBirthdays(res.emp || []);
                setBirthdays(birthdayData);
            } catch (err) {
                setLoading(false);
                console.error("Error fetching data:", err);
                resetPunchStatus();
            }
        };

        fetchData();

        return () => {
            if (watchId !== null) {
                Geolocation.clearWatch(watchId);
                console.log("🛑 Location watch stopped");
            }
        };
    }, [employees, isFocused]);


    // ================================
    // Render JSX UI
    // ================================

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', flexWrap: 'wrap', elevation: 16, paddingHorizontal: 10 , rowGap : 10}}>

                {/* 👤 Profile & Employee Info */}
                <View style={{ flexDirection: 'row', alignItems: 'center' , width:'60%'}}>
                    <TouchableOpacity onPress={handleProfile}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?crop=faces&fit=crop&w=300&h=300' }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', textTransform: "capitalize" }}>{employees.empname ?? 'Loading...'}</Text>
                        <Text style={{ fontSize: 12, color: 'gray' }}>{employees.empcode ?? ''}</Text>
                    </View>
                </View>

                {/* ⏱ Check In/Out Button */}
                <View style={{ padding: 16, backgroundColor: '#fff', flexDirection: 'row', width : "40%" }}>
                    {isPunchedIn.active != 1 && isPunchedIn ? (
                        employees.mobatt == '1' ? (
                            <TouchableOpacity style={{ width: 100, height: 50, borderColor: '#E53935', borderRadius: 75, justifyContent: 'cenetr', alignItems: 'flex-end', alignSelf: 'center', padding: 10 }} onPress={() => setShowPunchCard(true)}>
                                <MaterialIcons name="fingerprint" size={30} color="green" />
                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'green' }}>Check In</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={{ width: 100, height: 50, borderColor: '#E53935', borderRadius: 75, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', padding: 10 }} onPress={() => showCustomAlert('FAILED', "Mobile punching not allowed", false)}>
                                <MaterialIcons name="fingerprint" size={30} color="#AAA" />
                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#AAAAAA' }}>Check In</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={{ width: 100, height: 50, borderColor: '#E53935', borderRadius: 75, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', padding: 10 }} onPress={() => setShowPunchCard(true)}>
                                <MaterialIcons name="fingerprint" size={30} color="#E53935" />
                                <Text style={{ color: "#E53935" }}>Check Out</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* ℹ️ Info & Timing */}
                <View style={{ flexDirection: "row", backgroundColor: "white", justifyContent: "space-between", paddingLeft: 10, width: "100%" }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: "45%" }}>
                        <Ionicons name="ellipse-outline" size={10} style={{ backgroundColor: "green", borderRadius: 40, color: "green", marginTop: 6, marginRight: 5 }} />
                        <Text style={{ fontSize: 16, color: '#333' }}>In : {isPunchedIn.time || "--:--:--"}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: "45%" }}>
                        <Ionicons name="ellipse-outline" size={10} style={{ backgroundColor: "#E53935", borderRadius: 40, color: "#E53935", marginTop: 6, marginRight: 5 }} />
                        <Text style={{ fontSize: 16, color: '#E53935' }}>out : {isPunchedIn.outtime || "--:--:--"}</Text>
                    </View>
                    <View style={{ width: "10%" }}>
                        <Ionicons name="information-circle-outline" size={24} color="#E53935" onPress={() => handleInfo(employees.empid)} />
                    </View>
                </View>
            </View>

            {/* 📸 Punch Card View */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} keyboardVerticalOffset={80}>
                    <View style={{ padding: 16, backgroundColor: '#fff', flexDirection: 'row' }}>
                        {showPunchCard && (
                            <ScrollView>
                                <View style={{ marginVertical: 20, backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 8, alignItems: 'center', width: '95%', alignSelf: 'center' }}>
                                    <View style={{ backgroundColor: '#E53935', padding: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12, width: '100%', borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{new Date().toDateString()}</Text>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center', flex: 1 }}>Attendance</Text>
                                        <TouchableOpacity onPress={() => setShowPunchCard(false)}>
                                            <Ionicons name="close" size={20} color="white" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, width: '100%' }}>
                                        {capturedImage?.uri && (
                                            <View style={{ width: 80, height: 80, backgroundColor: '#fff', borderRadius: 40, justifyContent: 'flex-start', alignItems: 'center', marginLeft: 10, overflow: 'hidden', elevation: 4 }}>
                                                <Image source={{ uri: capturedImage.uri }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                                            </View>
                                        )}

                                        <TouchableOpacity style={{ backgroundColor: '#E53935', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 10, elevation: 4 }} onPress={handlePunch}>
                                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 }}>{!capturedImage?.uri ? ("📷 Take Selfie") : ("📷 Take Again")}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {location && (
                                        <Text style={{ color: '#E53935', fontSize: 14, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ddd', width: '100%', paddingBottom: 8, textAlign: 'center' }}>
                                            Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                        </Text>
                                    )}

                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 10 }}>
                                        <View style={{ flex: 1, marginRight: 10 }}>
                                            <TextInput style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, backgroundColor: '#f9f9f9', color: '#000' }}
                                                placeholder="Enter Remark" placeholderTextColor="#888" multiline numberOfLines={4} value={remark} onChangeText={(text) => setRemark(text)} />
                                        </View>
                                        <TouchableOpacity style={{ backgroundColor: '#e53935', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 }} onPress={handleAttandance}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

            {!showPunchCard && (
                <ScrollView contentContainerStyle={styles.newSections} showsVerticalScrollIndicator={false}>
                    {/* Top to bottom sections */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Off this week</Text>
                        <ScrollView>
                            {['Anjali Sharma', 'Rohit Mehra', 'Simran Kaur'].map((name, index) => (
                                <View key={index} style={styles.rowWithIcon}>
                                    <Ionicons name="person-outline" size={20} color="#E53935" style={styles.iconLeft} />
                                    <Text style={styles.bdayName}>{name} (12 Jul - 18 Jul)</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Wish them section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Wish them</Text>

                        {birthdays.length === 0 ? (
                            <View style={{ paddingVertical: 10 }}>
                                <Text style={{ fontSize: 14, color: 'gray' }}>No birthdays this month.</Text>
                            </View>
                        ) : (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {birthdays.map((person, index) => {
                                    const name = person.empname;
                                    const [year, month, day] = person.dob.split("-");
                                    const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
                                    const displayDate = `${day} ${new Date(person.dob).toLocaleString('default', { month: 'short' })}`;

                                    const today = new Date();
                                    const birthdayDate = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
                                    const isUpcoming = birthdayDate >= new Date(today.setHours(0, 0, 0, 0));

                                    return (
                                        <View key={index} style={{ alignItems: 'center', marginRight: 15 }}>
                                            <View style={[
                                                styles.birthdayIcon,
                                                {
                                                    backgroundColor: isUpcoming ? '#4CAF50' : '#BDBDBD' // Green for upcoming, Grey for past
                                                }
                                            ]}>
                                                <Text style={{ color: '#fff' }}>{initials}</Text>
                                            </View>
                                            <View>
                                                <Text style={[
                                                    styles.bdayName,
                                                    { color: isUpcoming ? '#333' : '#888' } // grey text if birthday is past
                                                ]}>
                                                    {name}
                                                </Text>
                                                <Text style={[
                                                    styles.bdayDate,
                                                    { color: isUpcoming ? '#333' : '#aaa' }
                                                ]}>
                                                    {displayDate}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </View>

                    {/* Announcements */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Announcements</Text>
                        <ScrollView>
                            <Text style={styles.sectionSub}>No announcements for now</Text>
                        </ScrollView>
                    </View>

                    {/* Wall Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Wall</Text>
                        <Text style={styles.sectionSub}>There are no posts here</Text>
                        <TouchableOpacity style={styles.postBtn}>
                            <Text style={styles.postBtnText}>Create first post</Text>
                        </TouchableOpacity>
                    </View>

                    {/* holiday Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Upcoming holidays</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {[
                                { title: 'Raksha Bandhan', date: '09 Aug 2025' },
                                { title: 'Independence Day', date: '15 Aug 2025' },
                                { title: 'Ganesh Chaturthi', date: '28 Aug 2025' },
                                { title: 'Diwali', date: '12 Nov 2025' },
                                { title: 'Christmas', date: '25 Dec 2025' }
                            ].map((holiday, index) => (
                                <View key={index} style={styles.holidayCard}>
                                    <Ionicons name="calendar-outline" size={16} color="#E53935" style={{ marginRight: 5 }} />
                                    <View>
                                        <Text style={styles.holidayTitle}>{holiday.title}</Text>
                                        <Text style={styles.holidayDate}>{holiday.date}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            )
            }
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={alertTitle}
                message={alertMessage}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={true}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor={alertSuccess ? "#4CAF50" : "#E53935"}
                onConfirmPressed={() => setShowAlert(false)}
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

        </SafeAreaView>
    );
};
export default HomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' }, // Main screen background
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', flexWrap: "wrap", elevation: 16, paddingHorizontal: 10 }, // Top header
    headerLeft: { flexDirection: 'row', alignItems: 'center' }, // Left section in header
    profilePic: { width: 40, height: 40, borderRadius: 20 }, // Profile picture
    heyText: { fontSize: 16, fontWeight: 'bold' }, // "Hey" text
    empCode: { fontSize: 12, color: 'gray' }, // Employee code

    punchCard: { marginVertical: 20, backgroundColor: '#fff', padding: 15, borderRadius: 12, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3, alignItems: 'center', width: '95%', alignSelf: 'center' }, // Punch in/out card
    cardHeader: { backgroundColor: '#E53935', padding: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12, width: '100%', borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, // Card header
    cardHeaderText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }, // Card header text
    cardHeaderTitle: { textAlign: 'center', flex: 1 }, // Card title center align

    userInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, width: '100%' }, // User info row
    userInfoText: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#ddd', marginLeft: 15 }, // User name/id container
    userName: { fontSize: 16, fontWeight: 'bold' }, // User name text
    userId: { fontSize: 14, color: 'gray' }, // User ID text
    userImageWrapper: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 40, justifyContent: 'flex-start', alignItems: 'center', marginLeft: 10, overflow: 'hidden', elevation: 4 }, // Profile image container
    userImage: { width: 80, height: 80, borderRadius: 40 }, // Profile image

    selfieBtn: { backgroundColor: '#E53935', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 10, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 }, // Take selfie button
    selfieBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 }, // Selfie button text

    locationText: { color: '#E53935', fontSize: 14, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ddd', width: '100%', paddingBottom: 8, textAlign: 'center' }, // Location text

    footerRow: { flexDirection: 'row', alignItems: 'center', padding: 10, marginTop: 10 }, // Footer row
    inputWrapper: { flex: 1, marginRight: 10 }, // Input wrapper
    remarkInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, backgroundColor: '#f9f9f9', color: '#000' }, // Remark input field

    submitBtn: { marginTop: 5, backgroundColor: '#E53935', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 }, // Submit button
    submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }, // Submit button text

    cardTimeText: { color: '#000', fontSize: 14, marginBottom: 8 }, // Time text inside card

    statusCard: { backgroundColor: '#f2f7fd', padding: 12, marginVertical: 10, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#007AFF', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 }, // Status card
    statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 }, // Status row
    statusText: { fontSize: 14, marginLeft: 8, color: '#333' }, // Status label

    punchContainer: { padding: 16, backgroundColor: '#fff', flexDirection: "row" }, // Punch container row
    time: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' }, // Punch time
    date: { fontSize: 14, color: 'gray', marginBottom: 10, textAlign: 'center' }, // Punch date

    circle: { width: 100, height: 50, borderColor: '#E53935', borderRadius: 75, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', padding: 10 }, // Punch in circle button
    punchText: { fontWeight: 'bold', fontSize: 12, color: 'green' }, // Punch in text
    punchOutRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-around' }, // Punch out row
    dotBullet: { fontSize: 50, color: '#E53935', alignSelf: "flex-start" }, // Dot for in-time
    timeText: { fontSize: 16, color: '#333' }, // Time value

    dotBulletOut: { fontSize: 50, alignSelf: "flex-start" }, // Dot for out-time
    timeTextOut: { fontSize: 16, color: '#E53935' }, // Out-time text
    punchOutBtn: { width: 100, height: 50, borderColor: '#E53935', borderRadius: 75, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', padding: 10 }, // Punch out button

    disabledCircle: { backgroundColor: '#EFEFEF' }, // Disabled circle background
    disabledText: { color: '#AAAAAA' }, // Disabled text color

    section: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 15, borderRadius: 8, marginTop: 10, width: '100%' }, // Generic section container
    sectionTitle: { fontWeight: 'bold', fontSize: 14, marginBottom: 20, borderBottomColor: '#E53935', borderBottomWidth: 1 }, // Section heading
    sectionSub: { fontSize: 12, color: '#777', textAlign: 'center' }, // Section subtext

    birthdayRow: { flexDirection: 'column', alignItems: 'flex-start' }, // Birthday list vertical
    birthdayIcon: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#E53935', justifyContent: 'center', alignItems: 'center', marginRight: 8 }, // Birthday icon container
    rowWithIcon: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 }, // Row with icon
    iconLeft: { marginRight: 8 }, // Space beside icon
    bdayName: { fontWeight: 'bold' }, // Birthday name
    birthdayItem: { alignItems: 'center', marginRight: 10 }, // Individual birthday item

    postBtn: { backgroundColor: '#E53935', padding: 6, borderRadius: 5, alignSelf: 'center', marginTop: 5 }, // Post button
    postBtnText: { color: '#fff', fontSize: 12 }, // Post button text

    holidayCard: { backgroundColor: '#FFEBEE', padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center', marginRight: 10 }, // Holiday card
    holidayTitle: { fontWeight: 'bold' }, // Holiday title
    holidayDate: { fontSize: 12, color: '#555' }, // Holiday date

    newSections: { padding: 16 }, // Section padding
});



