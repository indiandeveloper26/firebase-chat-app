import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    Platform,
    PermissionsAndroid,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
const map = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    };

    const getLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Enable location permission from settings.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        Geolocation.getCurrentPosition(
            (position) => {
                console.log('✅ Location:', position.coords);
                setLocation(position.coords);
                setLoading(false);
            },
            (error) => {
                console.error('❌ Error:', error.message);
                setErrorMsg(error.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: false, // <- Try false if true gives timeout
                timeout: 20000,
                maximumAge: 10000,
            }
        );
    };

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📍 Current Location</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : location ? (
                <View>
                    <Text>Latitude: {location.latitude}</Text>
                    <Text>Longitude: {location.longitude}</Text>
                    <Text>Accuracy: {location.accuracy}m</Text>
                </View>
            ) : (
                <Text style={{ color: 'red', marginBottom: 20 }}>
                    {errorMsg ? `Error: ${errorMsg}` : 'No location yet.'}
                </Text>
            )}

            <Button title="🔄 Refresh Location" onPress={getLocation} />

              <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.6139,
          longitude: 77.2090,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{ latitude: 28.6139, longitude: 77.2090 }}
          title="New Delhi"
          description="This is the capital of India"
        />
      </MapView>
        </View>
    );
};

export default map;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});











// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Platform,
//   PermissionsAndroid,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import MapView, { Marker } from 'react-native-maps';

// const map = () => {
//   const [location, setLocation] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState('');

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//           PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//         ]);
//         return (
//           granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
//         );
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const getLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Enable location permission from settings.');
//       return;
//     }

//     setLoading(true);
//     setErrorMsg('');

//     Geolocation.getCurrentPosition(
//       (position) => {
//         setLocation(position.coords);
//         setLoading(false);
//       },
//       (error) => {
//         console.error('❌ Error:', error.message);
//         setErrorMsg(error.message);
//         setLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 20000,
//         maximumAge: 10000,
//       }
//     );
//   };

//   useEffect(() => {
//     getLocation();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>📍 Your Location</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007AFF" />
//       ) : location ? (
//         <View style={styles.infoBox}>
//           <Text style={styles.label}>Latitude: <Text style={styles.value}>{location.latitude}</Text></Text>
//           <Text style={styles.label}>Longitude: <Text style={styles.value}>{location.longitude}</Text></Text>
//           <Text style={styles.label}>Accuracy: <Text style={styles.value}>{location.accuracy} meters</Text></Text>
//         </View>
//       ) : (
//         <Text style={{ color: 'red', marginBottom: 10 }}>
//           {errorMsg ? `Error: ${errorMsg}` : 'No location yet.'}
//         </Text>
//       )}

//       <View style={styles.buttonBox}>
//         <Button title="🔄 Refresh Location" onPress={getLocation} color="#007AFF" />
//       </View>

//       <MapView
//         style={styles.map}
//         region={
//           location
//             ? {
//                 latitude: location.latitude,
//                 longitude: location.longitude,
//                 latitudeDelta: 0.01,
//                 longitudeDelta: 0.01,
//               }
//             : {
//                 latitude: 28.6139,
//                 longitude: 77.2090,
//                 latitudeDelta: 0.05,
//                 longitudeDelta: 0.05,
//               }
//         }
//         showsUserLocation={true}
//         showsMyLocationButton={true}
//       >
//         {location && (
//           <Marker
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             title="You are here"
//             description="This is your current location"
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// export default map;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFF',
//     alignItems: 'center',
//     paddingTop: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   infoBox: {
//     marginVertical: 10,
//     padding: 10,
//     borderRadius: 10,
//     backgroundColor: '#EAF4FF',
//     width: '90%',
//   },
//   label: {
//     fontSize: 16,
//     color: '#333',
//   },
//   value: {
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   buttonBox: {
//     marginVertical: 10,
//     width: '90%',
//   },
//   map: {
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height / 2,
//     marginTop: 10,
//     borderRadius: 10,
//   },
// });













// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     Button,
//     Platform,
//     PermissionsAndroid,
//     Alert,
//     StyleSheet,
//     ActivityIndicator,
//     Dimensions,
// } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// const map = () => {
//     const [location, setLocation] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [errorMsg, setErrorMsg] = useState('');

//    const requestLocationPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
//         PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
//       ]);

//       // Check all 3 permissions
//       const allGranted =
//         granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
//         granted['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
//         granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED;

//       return allGranted;
//     } catch (err) {
//       console.warn('Permission error:', err);
//       return false;
//     }
//   }
//   return true; // iOS
// };


//     const getLocation = async () => {
//         const hasPermission = await requestLocationPermission();
//         if (!hasPermission) {
//             Alert.alert('Permission Denied', 'Enable location permission from settings.');
//             return;
//         }

//         setLoading(true);
//         setErrorMsg('');

//         Geolocation.getCurrentPosition(
//             (position) => {
//                 setLocation(position.coords);
//                 setLoading(false);
//             },
//             (error) => {
//                 console.error('❌ Error:', error.message);
//                 setErrorMsg(error.message);
//                 setLoading(false);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 20000,
//                 maximumAge: 10000,
//             }
//         );
//     };

//     useEffect(() => {
//         getLocation();
//     }, []);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>📍 Your Location</Text>

//             {loading ? (
//                 <ActivityIndicator size="large" color="#007AFF" />
//             ) : location ? (
//                 <View style={styles.infoBox}>
//                     <Text style={styles.label}>Latitude: <Text style={styles.value}>{location.latitude}</Text></Text>
//                     <Text style={styles.label}>Longitude: <Text style={styles.value}>{location.longitude}</Text></Text>
//                     <Text style={styles.label}>Accuracy: <Text style={styles.value}>{location.accuracy} meters</Text></Text>
//                 </View>
//             ) : (
//                 <Text style={{ color: 'red', marginBottom: 10 }}>
//                     {errorMsg ? `Error: ${errorMsg}` : 'No location yet.'}
//                 </Text>
//             )}

//             <View style={styles.buttonBox}>
//                 <Button title="🔄 Refresh Location" onPress={getLocation} color="#007AFF" />
//             </View>

//             <MapView
//                 provider={PROVIDER_GOOGLE} // ✅ Google Maps look & blue dot
//                 style={styles.map}
//                 region={
//                     location
//                         ? {
//                             latitude: location.latitude,
//                             longitude: location.longitude,
//                             latitudeDelta: 0.01,
//                             longitudeDelta: 0.01,
//                         }
//                         : {
//                             latitude: 28.6139,
//                             longitude: 77.2090,
//                             latitudeDelta: 0.05,
//                             longitudeDelta: 0.05,
//                         }
//                 }
//                 showsUserLocation={true}
//                 showsMyLocationButton={true}
//                 loadingEnabled={true}
//             >
//                 {location && (
//                     <Marker
//                         coordinate={{
//                             latitude: location.latitude,
//                             longitude: location.longitude,
//                         }}
//                         title="You are here"
//                         description="This is your current location"
//                     />
//                 )}
//             </MapView>
//         </View>
//     );
// };

// export default map;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8FAFF',
//         alignItems: 'center',
//         paddingTop: 20,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     infoBox: {
//         marginVertical: 10,
//         padding: 10,
//         borderRadius: 10,
//         backgroundColor: '#EAF4FF',
//         width: '90%',
//     },
//     label: {
//         fontSize: 16,
//         color: '#333',
//     },
//     value: {
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     buttonBox: {
//         marginVertical: 10,
//         width: '90%',
//     },
//     map: {
//         width: Dimensions.get('window').width,
//         height: Dimensions.get('window').height / 2,
//         marginTop: 10,
//         borderRadius: 10,
//     },
// });
