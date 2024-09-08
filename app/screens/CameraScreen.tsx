import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const CameraScreen: React.FC = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameraViewRef, setCameraViewRef] = useState<any>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Request permission to use the camera
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const captureImage = async (): Promise<void> => {
        if (cameraViewRef) {
            const photo = await cameraViewRef.takePictureAsync();
            setImageUri(photo.uri);

            try {
                const base64 = await FileSystem.readAsStringAsync(photo.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setBase64Image(base64);
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
                setLoading(false); // Stop loading indicator on error
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

    const captureAgain = () => {
        setImageUri(null); // Reset imageUri to go back to camera view
        setPrediction(null); // Clear the previous prediction
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            {!imageUri ? (
                <CameraView style={styles.cameraView} ref={(ref) => setCameraViewRef(ref)}>
                    <View style={styles.cameraButtonContainer}>
                        <TouchableOpacity style={styles.cameraButton} onPress={captureImage}>
                            <Text style={styles.buttonText}>Capture Image</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (
                <View>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    <View style={styles.btnContainer}>
                        <TouchableOpacity onPress={() => base64Image && predictImage(base64Image)}>
                            <Text style={styles.anlyBtn}>Analyse Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={captureAgain}>
                            <Text style={styles.anlyBtn}>Capture Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {loading && (
                <View style={{ marginVertical: 20 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.predText}>Analyzing image...</Text>
                </View>
            )}
            {prediction && (
                <View>
                    <Text></Text>
                    {prediction.predictions && prediction.predictions.length > 0 ? (
                        <Text style={styles.predText}>{prediction.predictions[0].class}</Text>
                    ) : (
                        <Text style={styles.predText}>No predictions found</Text>
                    )}
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
    cameraButton: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
    imagePreview: {
        width: 350,
        height: 350,
        alignSelf: 'center',
        margin: 20,
    },
    predText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 7,
    },
    anlyBtn: {
        backgroundColor: '#90EE90',
        color: '#006400',
        padding: 15,
        fontSize: 18,
        fontWeight: 'bold',
        borderRadius: 15
    }
});

export default CameraScreen;
