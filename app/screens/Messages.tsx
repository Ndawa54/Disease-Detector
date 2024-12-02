import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View, ActivityIndicator, ScrollView, Pressable } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import BASE_URL from "../API";

export default function Message({ route,navigation }: any) {
    const img = require('../../assets/images/spraying.png');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { name, cause } = route.params;

    const fetchData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${BASE_URL}/pesticides`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
            console.log(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleClick = () => {
        fetchData();
    };

    const filteredData = data.filter(item => item.type.toLowerCase() === name.toLowerCase());

    return (
        <ScrollView>
        <View style={styles.container}>
            <View style={styles.infoCard}>
                <Text style={styles.header}>{name}</Text>
                <Text style={styles.textTitle}>Cause</Text>
                <Text style={styles.context}>
                    {cause}
                </Text>
                <Text style={styles.context}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident
                    ipsa non deserunt nulla tenetur earum aperiam quos at, vitae ipsam in
                    commodi reprehenderit nesciunt labore facere perferendis ut architecto maiores!
                </Text>
                <Button title="Get Recommendation" onPress={handleClick} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="green" style={styles.loading} />
                ) : (
                       
                <FlatList
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => {
                                        navigation.navigate('Usage', {
                                            name: `${item.name}`
                                        })
                                    }}>
                                    
                        <View style={styles.card}>
                            <View style={styles.iconContainer}>
                                <Image source={img} style={styles.image} />
                                <Ionicons name="chevron-forward-outline" size={20} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.method}>Pesticide</Text>
                                <Text style={styles.type}>{item.name}</Text>
                            </View>
                                    </View>
                                </Pressable>
                    )}
                            />
                        
            )}
            </View>
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 15,
        paddingBottom: 20, // Added padding to ensure FlatList items are visible
    },
    image: {
        width: 100,
        height: 100,
        justifyContent: 'flex-start',
        borderRadius: 14,
    },
    header: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    context: {
        fontSize: 16,
        fontStyle: 'italic',
        padding: 10,
    },
    textTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        left: 110,
        top: 20, // Added margin to separate items
    },
    type: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    method: {
        fontSize: 18,
    },
    loading: {
        marginVertical: 20, // Center the activity indicator in the vertical axis
    },
});
