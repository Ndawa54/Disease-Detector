import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Image,
  Text,
  Pressable,
} from "react-native";
import BASE_URL from "../API";

const img = require("../../assets/images/logo.png");

export default function Login({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const errors: any = {};
    if (!username) errors.username = "Username is required";
    if (!password) errors.password = "Password is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/logins`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Assuming the API returns success on valid credentials
          navigation.jumpTo('Kulima Bette');
        } else {
          // Handle invalid credentials
          setErrors({ general: data.message || "Invalid username or password" });
        }
      } catch (error) {
        console.error(error);
        setErrors({ general: "Something went wrong. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={img} style={styles.image} />
      </View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      {errors.username && <Text style={styles.errors}>{errors.username}</Text>}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errors}>{errors.password}</Text>}
      {errors.general && <Text style={styles.errors}>{errors.general}</Text>}
      <Pressable onPress={handleSubmit} disabled={loading}>
        <Text style={styles.text}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
      <Text style={styles.text}>Register</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  input: {
    borderWidth: 1,
    width: "100%",
    height: 50,
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  image: {
    width: 190,
    height: 100,
    alignSelf: "center",
    marginVertical: 30,
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor: "#ADD8E6",
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
  },
  errors: {
    color: "red",
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
  },
});
