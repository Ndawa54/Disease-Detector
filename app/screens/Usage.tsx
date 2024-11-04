import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { combineTransition } from "react-native-reanimated";
import BASE_URL from "../API";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

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
                        <Text style={styles.txt_header}>{name}</Text>
                        <Text style={styles.text}>Application instruction</Text>
                        <Text style={styles.textApplication}>{item.treatment}</Text>
                        <View>
                            <Text style={styles.text}>Application Method</Text>
                            <View style={styles.safety_icons}>
                                <Image source={require('../../assets/images/spra.png')} style={styles.images}/>
                                <Text style={styles.txt}>Spray </Text>
                            </View>
                        </View>
                        <View >
                            <Text style={styles.text}>Safety Precautions</Text>

                            <View style={styles.safety_icons}>
                                <Image source={require('../../assets/images/children.png')} style={styles.images}/>
                                <Text style={styles.txt}>Keep it away and out of reach of children </Text>
                            </View>
                            <View style={styles.safety_icons}>
                                <Image source={require('../../assets/images/mask.png')} style={styles.images}/>
                                <Text style={styles.txt}>Wear protection over nose and mouth</Text>
                            </View>
                            <View style={styles.safety_icons}>
                                <Image source={require('../../assets/images/ggles.png')} style={styles.images}/>
                                <Text style={styles.txt}>Wear eye Protection</Text>
                            </View>
                            <View style={styles.safety_icons}>
                                <Image source={require('../../assets/images/gloves.png')} style={styles.images}/>
                                <Text style={styles.txt}>Wear long rubber gloves</Text>
                            </View>
                            <View style={styles.safety_icons}>
                                <MaterialIcons name='sanitizer' size={50}/>
                                <Text style={styles.txt}>Wash the hands with clean water</Text>
            
                            </View>
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
        marginVertical: 7,
        fontSize: 15
    },
    images: {
        width: 60,
        height: 60,
    },
    safety_icons:{
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        margin: 8,
    },
    txt:{
        position:  'absolute',
        top:   20,
        left:   80,
        fontSize: 16,
        fontWeight: 'bold'
    },
    txt_header:{
        textAlign: 'center',
        fontSize: 29,
        fontWeight: 'bold'
    }
})