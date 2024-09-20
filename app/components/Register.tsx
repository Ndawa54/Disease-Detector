import { Image, Pressable, Text } from "react-native";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import DrawerNavigator from "../tabs/Drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";

const img = require('../../assets/images/logo.png')



export default function Register() {
    const [names,setNames] = useState("")
    return (
        <SafeAreaView style={styles.container}>

            <View>
                <Image source={img} style={styles.image}/>
            </View>
            <TextInput
                placeholder="Email" value={names} onChangeText={setNames}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                style={styles.input}

            />
            
            <Text style={styles.text}>Submit</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center'
    }
    ,
    input: {
        borderWidth: 1,
        width: 375,
        height: 50,
        padding: 5,
        margin: 10,
        marginVertical: 19,
        borderRadius: 10,
        borderColor: '#ADD8E6'

    },
    image:{
        width: 190,
        height: 100,
        alignSelf: 'center',
        marginVertical: 30,
    },
    text:{
        textAlign: 'center',
        fontSize:  15,
        fontWeight: 'bold',
        backgroundColor: '#ADD8E6',
        padding: 12,
        margin: 10,
        borderRadius: 10,
        
    }
})