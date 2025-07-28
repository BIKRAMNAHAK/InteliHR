import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';

const CameraScreen = () => {
    const cameraRef = useRef(null);

    // Sirf front camera use karna hai
    const devices = useCameraDevices();
    const device = devices.find(d => d.position === 'front');

    console.log("Available Devices:", devices);
    console.log("Selected Device:", device);

    const navigation = useNavigation();
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);

    const imageSetter = global.setCapturedImage || null;

    useEffect(() => {
        if (device) {
            setIsCameraReady(true);
        }
    }, [device]);

    if (!device || !isCameraReady) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={{ color: 'white', fontSize: 16 }}>Loading Camera...</Text>
            </View>
        );
    }

    const takePicture = async () => {
        if (isCapturing) return;
        try {
            setIsCapturing(true);
            const photo = await cameraRef.current.takePhoto({
                flash: 'off',
                qualityPrioritization: 'speed',
                photoCodec: 'jpeg',
            });

            console.log('Photo captured:', photo);

            // Step 1: Compress Image (800px, 70% quality)
            const resizedImage = await ImageResizer.createResizedImage(
                `file://${photo.path}`,   // (1) Original captured image path
                800,                      // (2) Resize width to 800px
                800,                      // (3) Resize height to 800px
                'JPEG',                   // (4) Output format is JPEG
                70,                       // (5) Quality = 70% (reduces size)
                270,                      // (6) Rotate 270° (fix orientation)
                undefined,                // (7) Output path (default cache dir)
                false,                    // (8) Do not keep EXIF metadata
                { mode: 'contain', onlyScaleDown: false }  // (9) Extra resizing options
            );

            // Step 2: Navigate back to HomeScreen (Instant UI Update)
            navigation.navigate('MainTabs', {
                screen: 'Home',
                params: {
                    capturedImage: {
                        uri: resizedImage.uri,
                        name: 'selfie.jpg',
                        type: 'image/jpeg',
                        shouldUpload: true
                    }
                }
            });

        } catch (error) {
            console.error('Error capturing photo:', error);
            Alert.alert('Error', 'Failed to capture photo.');
        } finally {
            setIsCapturing(false);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
            />

            {/* Capture Button */}
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={takePicture} style={styles.captureBtn}>
                    <View style={styles.innerCircle} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'red',
    },
    backBtn: {
        position: 'absolute',
        left: 20,
        top: -60,
    }
});

export default CameraScreen;
