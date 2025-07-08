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



// ✅ Unique ID generator
const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};

export default function SignupScreen({ navigation }) {



  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Validation function
  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!name.trim()) {
      tempErrors.name = 'Name is required';
      valid = false;
    }

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
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

const handleSignup = async () => {
  if (!validate()) return;

  const uid = generateUniqueId();

  try {
    setLoading(true);

    // ✅ Save user to Firestore
    await firestore().collection('Users').doc(uid).set({
      uid,
      name,
      phone,
      password,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // ✅ Save to local storage FIRST
    await AsyncStorage.setItem('userName', name);
    await AsyncStorage.setItem('userPhone', phone);
    await AsyncStorage.setItem('userId', uid);

    setLoading(false);
    Alert.alert('Success', 'Account created successfully!');

    // ✅ THEN navigate
    navigation.replace('chatlist'); // replace is safer than navigate in login/signup flows

  } catch (error) {
    setLoading(false);
    Alert.alert('Signup Error', error.message || 'Something went wrong.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

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
        onChangeText={setPassword}
                keyboardType="phone-pad"

        style={styles.input}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#6200ee" style={{ marginVertical: 20 }} />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} color="#6200ee" />
      )}

      <Text style={styles.switchText} onPress={() => navigation.navigate('loging')}>
        Already have anff account? <Text style={{ color: '#6200ee' }}>Login</Text>
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




