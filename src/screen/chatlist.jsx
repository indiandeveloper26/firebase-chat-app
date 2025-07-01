// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function chatlist({ navigation }) {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = firestore()
//       .collection('Users')
//       .orderBy('createdAt', 'desc')
//       .onSnapshot(
//         (snapshot) => {
//           const userList = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));
//           setUsers(userList);
//           setLoading(false);
//         },
//         (error) => {
//           console.error('Error fetching users:', error);
//           setLoading(false);
//         }
//       );

//     return () => unsubscribe();
//   }, []);


// //   useEffect(() => {
    
// // adduser()

// //   }, [])
  

//   const renderItem = ({ item }) => (
//     // <TouchableOpacity
//     //   style={styles.card}
//     //   onPress={() => navigation.navigate('chatscreen', { user: item })}
//     // >
//     //   <Text style={styles.name}>{item.name}</Text>
//     //   <Text style={styles.phone}>{item.phone}</Text>
//     // </TouchableOpacity>

//         <TouchableOpacity style={styles.chatItem} onPress={() => handlePress(item)}>
//           <Image source={{ uri: item.avatar }} style={styles.avatar} />
//           <View style={styles.chatInfo}>
//             <View style={styles.chatHeader}>
//               <Text style={styles.name}>{item.name}</Text>
//               <Text style={styles.time}>{item.phone}</Text>
//             </View>
//             <Text style={styles.lastMessage} numberOfLines={1}>
//               {item.lastMessage}
//             </Text>
//           </View>
//         </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#6200ee" />
//       </View>
//     );
//   }


    
// //   let adduser= async()=>{



// //     let name=   await AsyncStorage.getItem('userName', );
// //        let phone=  await AsyncStorage.getItem('userPhone', );
// //       let id=   await AsyncStorage.getItem('userId', );

// //           Alert.alert("helli",JSON.stringify(phone,id))
// //   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={users}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 10 }}
//         ListEmptyComponent={<Text>No users found</Text>}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   card: {
//     backgroundColor: '#f1f1f1',
//     padding: 15,
//     marginVertical: 6,
//     borderRadius: 10,
//   },
//   name: { fontSize: 18, fontWeight: 'bold' },
//   phone: { color: '#555', marginTop: 4 },
// });



import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function chatList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const id = await AsyncStorage.getItem('userId');
      setCurrentUserId(id);
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = firestore()
      .collection('Users')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const userList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            avatar:
              doc.data().avatar ||
              `https://ui-avatars.com/api/?background=random&name=${doc.data().name}`,
            lastMessage: doc.data().lastMessage || 'Start chatting...',
          }))
          .filter((user) => user.uid !== currentUserId); // 👈 Exclude self

        setUsers(userList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [currentUserId]);

  const handlePress = (item) => {
    navigation.navigate('chatroom', { user: item });
    // Alert.alert(JSON.stringify(item))
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handlePress(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.phone}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text>No users found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  chatItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  chatInfo: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: { fontSize: 16, fontWeight: '600' },
  time: { fontSize: 12, color: '#999' },
  lastMessage: { color: '#555' },
});
