// // GoogleSignInScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Alert } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';

// const GoogleSignInScreen = () => {

// useEffect(() => {
// GoogleSignin.configure({
//   webClientId:"565996568285-o51evnlm59v3773lpb0dbbvs3ega64fp.apps.googleusercontent.com" // 👈 from Firebase console (not Android client ID)
// });
// }, [])


//   const onGoogleButtonPress = async () => {
//     try {
//       await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//       const signInResult = await GoogleSignin.signIn();

//       let idToken = signInResult?.idToken || signInResult?.data?.idToken;
//       if (!idToken) throw new Error('No ID token found');

//       const googleCredential = GoogleAuthProvider.credential(idToken);
//       const authResult = await signInWithCredential(getAuth(), googleCredential);

//       Alert.alert('Login Success', `Welcome ${authResult.user.displayName}`);
//       console.log('User Info:', authResult.user);
//     } catch (error) {
//       console.error('Google Sign-In Error:', error);
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Google Sign-In</Text>
//       <Button title="Sign In with Google" onPress={onGoogleButtonPress} />


//     </View>
//   );
// };

// export default GoogleSignInScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 22,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });








import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Button,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const GoogleSignInScreen = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  let navagation= useNavigation()
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '565996568285-o51evnlm59v3773lpb0dbbvs3ega64fp.apps.googleusercontent.com', // ✅ Web Client ID
    });
  }, []);

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      let idToken = signInResult?.idToken || signInResult?.data?.idToken;
      if (!idToken) throw new Error('No ID token found');

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const authResult = await signInWithCredential(getAuth(), googleCredential);

      setUser(authResult.user);
      Alert.alert('Login Success', `Welcome ${authResult.user.displayName}`);
      console.log('User Info:', authResult.user);
      navagation.navigate("chatlist")
      
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sign-In</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4285F4" />
    //   ) : user ? (
    //     <View style={styles.profileContainer}>
    //       <Image source={{ uri: user.photoURL }} style={styles.avatar} />
    //       <Text style={styles.name}>{user.displayName}</Text>
    //       <Text style={styles.email}>{user.email}</Text>
    //        <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
    //       <Image
    //         source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
    //         style={styles.googleLogo}
    //       />
    //       <Text style={styles.googleText}>Sign In with Google</Text>
    //     </TouchableOpacity>
    //     </View>
      ) : (
        <TouchableOpacity style={styles.googleButton} onPress={onGoogleButtonPress}>
          <Image
            source={{ uri: 'https://img.icons8.com/color/48/google-logo.png' }}
            style={styles.googleLogo}
          />
          <Text style={styles.googleText}>Sign In with Google</Text>
        </TouchableOpacity>
      )}



      <Button onPress={()=>navagation.navigate("docpicker")} title='device '></Button>
    </View>
  );
};

export default GoogleSignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#4285F4',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
