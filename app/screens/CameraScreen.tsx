import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import BASE_URL from '../API';

const CameraScreen: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraViewRef, setCameraViewRef] = useState<any>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const analyzeVideo = async (): Promise<void> => {
        if (cameraViewRef) {
            const photo = await cameraViewRef.takePictureAsync({ skipProcessing: true, mute: true });

            try {
                const base64 = await FileSystem.readAsStringAsync(photo.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                await predictImage(base64);
            } catch (error) {
                console.error('Error converting image to base64:', error);
            }
        }
    };

    const predictImage = async (base64Image: string): Promise<void> => {
        // const apiKey = '7JDhTHZb92dqMa8JVme2';
        // const modelEndpoint = `https://detect.roboflow.com/leaffs/2?api_key=${apiKey}`;

        // const apiKey = `U40uJawaVtDsWkPf31Tm`;
        // const modelEndpoint = `https://detect.roboflow.com/agrovision-hv9yk/1?api_key=${apiKey}`;

        const apiKey = `U40uJawaVtDsWkPf31Tm`;
        const modelEndpoint = `https://detect.roboflow.com/disease-detector-oqy70/1?api_key=${apiKey}`; // Good Accuracy

        // const apiKey = `U40uJawaVtDsWkPf31Tm`;
        // const modelEndpoint = `https://detect.roboflow.com/tomato-nixik-x7hgu/1?api_key=${apiKey}`; //tomato

        setLoading(true);
        setPrediction(null);

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

            if (data?.predictions?.length > 0) {
                const predictedName = data.predictions[0].class;
                await sendPredictionToAPI(predictedName);
            }
        } catch (error) {
            console.error('Error making prediction:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendPredictionToAPI = async (name: string): Promise<void> => {
        const apiUrl = `${BASE_URL}/notifications`; // Replace with your Laravel API endpoint
        const payload = {
            name: name,
            type: 'Disease',
            cause: 'Plant diseases are mainly caused by pathogens like fungi, bacteria, viruses, and nematodes. These organisms infect plants, leading to issues such as wilting., leaf spots, root rots, and stunted growth.' // Replace with your desired text
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response from Laravel API:', errorText);
            } else {
                console.log('Prediction sent successfully:', payload);
            }
        } catch (error) {
            console.error('Error sending prediction to API:', error);
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
                    <TouchableOpacity style={styles.cameraButton} onPress={analyzeVideo}>
                        <Text style={styles.buttonText}>Analyze Video</Text>
                    </TouchableOpacity>
                </View>
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.predText}>Analyzing...</Text>
                    </View>
                )}
                {prediction && (
                    <View style={styles.predictionOverlay}>
                        {prediction.predictions && prediction.predictions.length > 0 ? (
                            <Text style={styles.predText}>{prediction.predictions[0].class}</Text>
                        ) : (
                            <Text style={styles.predText}>No predictions found</Text>
                        )}
                    </View>
                )}
            </CameraView>
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
    cameraButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: 'center',
    },
    predText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    predictionOverlay: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
});

export default CameraScreen;
