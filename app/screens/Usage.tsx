import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { combineTransition } from "react-native-reanimated";
import BASE_URL from "../API";

export default function Usage({ route }: any) {
    const [data, setData] = useState<any[]>([])
    const { name } = route.params
    const fetchData = async () => {
     
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
        } 
    };

    useEffect(() => {
        fetchData()
    },[])

    const filteredData = data.filter(item => item.name.toLowerCase() === name.toLowerCase())
    return (

        <View style={styles.container}>
            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    
                    <View style={styles.usageCard}>
                        <Text>{name}</Text>
                        <Text style={styles.text}>Application instruction</Text>
                        <Text style={styles.textApplication}>{item.treatment}</Text>
                        <View>
                            <Text style={styles.text}>Application Method</Text>
                            <Text>Spray</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>Safety Precautions</Text>
                        </View>
                        
                    </View>
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    usageCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 12,
        marginHorizontal: 10,
        padding: 14
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8
    },
    textApplication: {
        fontStyle: 'italic',
        marginVertical: 7
    }
})