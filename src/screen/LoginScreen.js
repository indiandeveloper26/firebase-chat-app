import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Validation
  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!phone.trim()) {
      tempErrors.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      tempErrors.phone = 'Invalid Indian phone number';
      valid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // ✅ Firestore se user fetch karo by phone number
      const querySnapshot = await firestore()
        .collection('Users')
        .where('phone', '==', phone)
        .get();

      if (querySnapshot.empty) {
        setLoading(false);
        Alert.alert('Login Failed', 'User not found.');
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.password !== password) {
        setLoading(false);
        Alert.alert('Login Failed', 'Incorrect password.');
        return;
      }

      setLoading(false);
      Alert.alert('Login Success', `Welcome ${userData.name}`);
      navigation.replace('chatlist'); // Replace with your home/chat screen
   await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('userPhone', phone);
    await AsyncStorage.setItem('userId', uid);
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Error', error.message || 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
         keyboardType="phone-pad"
        onChangeText={setPassword}
        style={styles.input}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={{ marginVertical: 20 }} />
      ) : (
        <Button title="Login" onPress={handleLogin} color="#6200ee" />
      )}

      <Text style={styles.switchText} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? <Text style={{ color: '#6200ee' }}>Sign Up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 5,
    borderRadius: 6,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 12,
  },
  switchText: {
    marginTop: 20,
    alignSelf: 'center',
    fontSize: 14,
    color: '#333',
  },
});
