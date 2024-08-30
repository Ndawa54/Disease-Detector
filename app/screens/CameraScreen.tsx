import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Camera() {

    const [showCamera, setShowCamera] = useState(true);
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    if (!showCamera) {
        return (
            <View style={styles.container}>
                <Pressable onPress={() => setShowCamera(true)}>
                    <View style={styles.card}>
                        <EvilIcons name="camera" size={80} style={styles.icon} />
                        <Text style={styles.textType}>Detect Weeds</Text>
                    </View>
                </Pressable>

                <Pressable onPress={() => setShowCamera(true)}>
                    <View style={styles.card}>
                        <Ionicons name="camera-outline" size={80} style={styles.icon} />
                        <Text style={styles.textType}>Detect Disease</Text>
                    </View>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setShowCamera(false)}>
                        <Text style={styles.text}>Exit Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },

    card: {

        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 20,
        elevation: 10,
        margin: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'

    },
    textType: {
        fontSize: 25,
        margin: 20,
    },
    icon: {
        marginTop: 50,
        marginBottom: 50,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
