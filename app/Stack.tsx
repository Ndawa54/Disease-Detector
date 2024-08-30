import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Notification from "./screens/NotificationScreen"
import Message from "./screens/Messages"
import Usage from "./screens/Usage"
import WeatherScreen from "./screens/Weather"

export default function StackNavigation() {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
           
            <Stack.Screen name="Notify" component={Notification} />
            <Stack.Screen name="Message" component={Message} />
            <Stack.Screen name="Usage" component={Usage} />
            
     </Stack.Navigator>   
    )
}