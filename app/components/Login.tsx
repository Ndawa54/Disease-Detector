import { Image, Pressable, Text } from "react-native";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import DrawerNavigator from "../tabs/Drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import Home from "../screens/HomeScreen";

const img = require('../../assets/images/logo.png')
const click = () => {
    return(
        // <DrawerNavigator/>
        <Home/>
    )
}


export default function Login() {
    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<any>({}) 

    const validateForm = () => {
        let errors = {email,password}

        if(!email) errors.email = "Email not correct"
        if(!password) errors.password = "Password Incorrect"
        
        setErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = () =>{
        if(validateForm()){
            setEmail("")
            setPassword("")
            setErrors({})
        }
    }

    return (
        <SafeAreaView style={styles.container}>

            <View>
                <Image source={img} style={styles.image}/>
            </View>
            <TextInput
                placeholder="Email" 
                value={email} 
                onChangeText={setEmail}
                style={styles.input}
            />
            {errors.email ? <Text style={styles.errors}>{errors.email}</Text>: null}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry

            />
            {errors.password ? <Text style={styles.errors}>{errors.password}</Text>: null}
            <Pressable onPress={handleSubmit}><Text style={styles.text}>Login</Text></Pressable>
            <Text style={styles.text}>Register</Text>
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
        
    },
    errors:{
        color: 'red',
        fontSize: 15,
        marginHorizontal: 10
    }
})