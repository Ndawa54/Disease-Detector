import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Audio } from 'expo-av';
import BASE_URL from "../API";

const img = require('../../assets/images/wedds.png');
const img0 = require('../../assets/images/dry.jpg');
const img1 = require('../../assets/images/diseasw.png');

export default function Notification({ navigation }: any) {
    const [data, setData] = useState<any[]>([]);
    const [previousDataLength, setPreviousDataLength] = useState<number>(0);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const fetchData = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            const response = await fetch(`${BASE_URL}/notifications`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            if (result.length > previousDataLength) {
                await playSound();
                showAlert();
                setPreviousDataLength(result.length);
            }

            setData(result);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsFetching(false);
        }
    }

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/notification.wav'));
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    const showAlert = () => {
        Alert.alert(
            "Notification",
            "Detected!",
            [{ text: "OK" }]
        );
    }

    useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 60000); // Fetch data every 10 seconds
        return () => {
            clearInterval(interval); // Clear interval on component unmount
            sound?.unloadAsync(); // Unload sound on component unmount
        }
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable onPress={() => {
                        navigation.navigate('Message', {
                            name: `${item.name}`
                        });
                    }}>
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={img} style={styles.image} />
                                <Ionicons name="chevron-forward-circle-outline" size={30} style={styles.icon} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.textHeader}>Detected</Text>
                                <Text style={styles.time}>3:00am</Text>
                                <Text style={styles.type}>{item.name}</Text>
                                <Text style={styles.cause}>{item.type}</Text>
                            </View>
                        </View>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        padding: 10,
        margin: 15,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    image: {
        width: 100,
        height: 100,
        justifyContent: 'flex-start',
        borderRadius: 14
    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'flex-end'
    },
    textContainer: {
        position: 'absolute',
        top: 10,
        left: 130,
    },
    textHeader: {
        fontSize: 22,
        marginBottom: 6,
        marginTop: 4
    },
    time: {
        fontSize: 18,
        position: 'absolute',
        left: 160,
    },
    type: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 6
    },
    cause: {
        fontSize: 16,
        fontStyle: 'italic'
    }
});
