import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const CameraScreen: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraViewRef, setCameraViewRef] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    // Request permission to use the camera
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Start automatic image capturing
    useEffect(() => {
        if (hasPermission) {
            const id = setInterval(captureImage, 5000); // Capture image every 5 seconds
            setIntervalId(id);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId); // Clear interval on unmount
            }
        };
    }, [hasPermission]);

    const captureImage = async (): Promise<void> => {
        if (cameraViewRef) {
            const photo = await cameraViewRef.takePictureAsync();
            try {
                const base64 = await FileSystem.readAsStringAsync(photo.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                await predictImage(base64); // Automatically predict after capturing
            } catch (error) {
                console.error('Error converting image to base64:', error);
            }
        }
    };

    const predictImage = async (base64Image: string): Promise<void> => {
        const apiKey = '7JDhTHZb92dqMa8JVme2';
        const modelEndpoint = `https://detect.roboflow.com/leaffs/2?api_key=${apiKey}`;

        setLoading(true); // Start loading indicator
        setPrediction(null); // Reset previous prediction

        try {
            const response = await fetch(modelEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: base64Image,
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response from API:', errorText);
                return;
            }

            const data = await response.json();
            setPrediction(data);
        } catch (error) {
            console.error('Error making prediction:', error);
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.cameraView} ref={(ref) => setCameraViewRef(ref)}>
                <View style={styles.cameraButtonContainer}>
                    <Text style={styles.buttonText}>Analyzing...</Text>
                </View>
            </CameraView>
            {loading && (
                <View style={{ marginVertical: 20 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.predText}>Analyzing image...</Text>
                </View>
            )}
            {prediction && (
                <View style={styles.predictionContainer}>
                    <Text style={styles.predText}>
                        {prediction.predictions && prediction.predictions.length > 0
                            ? prediction.predictions[0].class
                            : 'No predictions found'}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraView: {
        flex: 1,
    },
    cameraButtonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    predictionContainer: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    predText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default CameraScreen;
