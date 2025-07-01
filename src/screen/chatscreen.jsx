
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLayoutEffect } from 'react';
const chatscreen = () => {

  let navigation= useNavigation()
  const route = useRoute();
  const { user } = route.params; // 👈 user.id is receiver

  const [message, setMessage] = useState('');
  
  const [smg, setmsg] = useState([]);

  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // 👈 fetched from storage

  useEffect(() => {
    getUserId(); // fetch from storage first
  }, []);

  useLayoutEffect(() => {
  if (user?.name) {
    navigation.setOptions({ title: user.name });
  }
}, [navigation, user]);

  // when currentUserId is available, set real-time listener
  // useEffect(() => {
  //   if (!currentUserId) return;

  //   const unsubscribe = firestore()
  //     .collection('chats')
  //     .doc(user.id+currentUserId)
  //     .onSnapshot(snapshot => {
  //       const allMessages = snapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       // Filter messages between the two users only
  //       // const filtered = allMessages.filter(
  //       //   msg =>
  //       //     (msg.senderId === currentUserId && msg.receiverId === user.id) ||
  //       //     (msg.senderId === user.id && msg.receiverId === currentUserId)
  //       // );

  //       if (allMessages.receiverId===user.id) {
  //         Alert.alert("yes")
  //       }
  //       else{
  //          Alert.alert("not")
  //       }

  //       // setMessages(allMessages);
  //     });

  //   return () => unsubscribe();
  // }, [currentUserId]);
  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

//       const filtered = allMessages.filter(
//   msg =>
//    (msg.senderId==currentUserId)||(msg.receiverId=='rama')
// );



        
        const filtered = allMessages.filter(
          msg =>
            (msg.senderId === currentUserId && msg.receiverId === user.id) ||
    (msg.senderId === user.id && msg.receiverId === currentUserId)
      
        );

      
console.warn(filtered)
        setMessages(filtered);
      });

    return () => unsubscribe();
  }, [currentUserId]);
  

  const getUserId = async () => {
    const id = await AsyncStorage.getItem('userId');
    // Alert.alert(id)
    if (id) setCurrentUserId(id);
  };

  const sendMessage = async () => {
   

     if (!message.trim() || !currentUserId) return;

    await firestore().collection('chats').add({
      text: message,
      createdAt: firestore.FieldValue.serverTimestamp(),
      senderId: currentUserId,
      receiverId: user.id,
    });

    setmsg((pre)=>[...pre,message])

    console.warn('smg',smg)

    setMessage('');
  };

  // const renderItem = ({ item }) => (
  //   <View
  //     style={[
  //       styles.msgBox,
  //       item.senderId === currentUserId ? styles.right : styles.left,
  //     ]}
  //   >
  //     <Text style={styles.text}>{item.text}</Text>
  //   </View>
  // );

//   const renderItem = ({ item }) => (
//   <View
//     style={[
//       styles.msgBox,
//       item.senderId === currentUserId ? styles.right : styles.left,
//     ]}
//   >
//     <Text
//       style={[
//         styles.text,
//         item.senderId !== currentUserId && { color: '#000' }, // receiver msg = black
//       ]}
//     >
//       {item.text}
//     </Text>
//   </View>
// );


  return (
    <View style={styles.container}>


      {/* <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
      /> */}





   
{/* <View style={{direction:"flex" ,flexDirection:"row"}}>

    <ScrollView >
      {messages.map((item, index) => {
    const isSender = item.senderId === currentUserId;

    return (
      <View
        key={index}
        style={[
          styles.chatBubble,
          isSender ? styles.chatRight : styles.chatLeft,
        ]}
      >
        <Text style={styles.chatText}>{item.text}</Text>
        <Text style={styles.senderInfo}>
          {isSender ? 'You' : item.senderId}
        </Text>
      </View>
    );
  })}
  </ScrollView>



<ScrollView>
     {smg && smg.length > 0 && (
  <View style={{ marginTop: 20 }}>
    {smg.map((item, index) => (
      <View key={index} style={[styles.chatBubble, styles.chatRight]}>
        <Text style={styles.chatText}>{item}</Text>
        <Text style={styles.senderInfo}>You (Local)</Text>
      </View>
    ))}
  </View>
)}
</ScrollView>
</View> */}

<View style={{ flex: 1 }}>
  <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
    {messages.map((item, index) => {
      const isSender = item.senderId === currentUserId;

      return (
        <View
          key={index}
          style={{
            flexDirection: 'row',
            justifyContent: isSender ? 'flex-end' : 'flex-start',
            marginVertical: 5,
          }}
        >
          <View
            style={[
              styles.chatBubble,
              isSender ? styles.chatRight : styles.chatLeft,
            ]}
          >
            <Text style={styles.chatText}>{item.text}</Text>
            <Text style={styles.senderInfo}>
              {isSender ? 'You' : user?.name || 'User'}
            </Text>
          </View>
        </View>
      );
    })}

    {/* Optional: Temporary local messages */}
    {smg.map((item, index) => (
      <View
        key={`smg-${index}`}
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginVertical: 5,
        }}
      >
        <View style={[styles.chatBubble, styles.chatRight]}>
          <Text style={styles.chatText}>{item}</Text>
          <Text style={styles.senderInfo}>You (Local)</Text>
        </View>
      </View>
    ))}
  </ScrollView>
</View>





      <View style={styles.inputBox}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default chatscreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10,

   },

  chatBubble: {
    marginVertical: 6,
    padding: 10,
    maxWidth: '75%',
    borderRadius: 10,
  },
  chatLeft: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  chatRight: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
  },
  chatText: {
    color: '#fff',
    fontSize: 16,
  },
  senderInfo: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 5,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  msgBox: {
    marginVertical: 5,
    padding: 10,
    maxWidth: '70%',
    borderRadius: 10,
  },
  left: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  right: {
    backgroundColor: '#007bff',
    alignSelf: 'flex-end',
  },
  text: { color: '#fff' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },


senderInfo: {
  fontSize: 10,
  color: '#ccc',
  marginTop: 5,
  alignSelf: 'flex-end',
},

  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  chatBubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: '75%',
  },
  chatLeft: {
    backgroundColor: '#e0e0e0',
    borderTopLeftRadius: 0,
  },
  chatRight: {
    backgroundColor: '#007bff',
    borderTopRightRadius: 0,
  },
  chatText: {
    color: '#fff',
    fontSize: 16,
  },
  senderInfo: {
    fontSize: 10,
    color: '#ddd',
    marginTop: 5,
    textAlign: 'right',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendBtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },


});






// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const chatscreen = () => {
//   const route = useRoute();
//   const { user } = route.params;

//   const [message, setMessage] = useState('');
//   const [smg, setmsg] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   useEffect(() => {
//     getUserId();
//   }, []);

//   const getUserId = async () => {
//     const id = await AsyncStorage.getItem('userId');
//     if (id) setCurrentUserId(id);
//   };

//   useEffect(() => {
//     if (!currentUserId) return;

//     const unsubscribe = firestore()
//       .collection('chats')
//       .orderBy('createdAt', 'desc')
//       .onSnapshot(snapshot => {
//         const allMessages = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const filtered = allMessages.filter(
//           msg =>
//             (msg.senderId === currentUserId && msg.receiverId === user.id) ||
//             (msg.senderId === user.id && msg.receiverId === currentUserId)
//         );

//         setMessages(filtered.reverse()); // reverse for correct order
//       });

//     return () => unsubscribe();
//   }, [currentUserId]);

//   const sendMessage = async () => {
//     if (!message.trim() || !currentUserId) return;

//     await firestore().collection('chats').add({
//       text: message,
//       createdAt: firestore.FieldValue.serverTimestamp(),
//       senderId: currentUserId,
//       receiverId: user.id,
//     });

//     setmsg(prev => [...prev, { text: message, temp: true }]); // local pending
//     setMessage('');
//   };

//   const combinedMessages = [...messages, ...smg]; // both Firebase + smg

//   const renderItem = ({ item }) => {
//     const isSender = item.senderId === currentUserId || item.temp;
//     return (
//       <View
//         style={[
//           styles.chatBubble,
//           isSender ? styles.chatRight : styles.chatLeft,
//         ]}
//       >
//         <Text style={styles.chatText}>{item.text}</Text>
//         <Text style={styles.senderInfo}>
//           {isSender ? 'You' : item.senderId || 'Unknown'}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={combinedMessages}
//         keyExtractor={(item, index) => item.id || index.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 10 }}
//       />

//       <View style={styles.inputBox}>
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type a message"
//           style={styles.input}
//         />
//         <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
//           <Text style={{ color: '#fff' }}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default chatscreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10, backgroundColor: '#fff' },
//   chatBubble: {
//     padding: 10,
//     marginVertical: 6,
//     marginHorizontal: 10,
//     maxWidth: '70%',
//     borderRadius: 12,
//     elevation: 1,
//   },
//   chatLeft: {
//     backgroundColor: '#f0f0f0',
//     alignSelf: 'flex-start',
//     borderTopLeftRadius: 0,
//   },
//   chatRight: {
//     backgroundColor: '#007bff',
//     alignSelf: 'flex-end',
//     borderTopRightRadius: 0,
//   },
//   chatText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   senderInfo: {
//     fontSize: 10,
//     color: '#eee',
//     marginTop: 5,
//     alignSelf: 'flex-end',
//   },
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 5,
//     borderTopWidth: 1,
//     borderColor: '#ccc',
//     marginTop: 5,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: '#f1f1f1',
//     padding: 10,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   sendBtn: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
// });



// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import { useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ChatScreen = () => {
//   const route = useRoute();
//   const { user } = route.params;

//   const [message, setMessage] = useState('');
//   const [smg, setmsg] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [currentUserId, setCurrentUserId] = useState(null);

//   useEffect(() => {
//     getUserId();
//   }, []);

//   const getUserId = async () => {
//     const id = await AsyncStorage.getItem('userId');
//     if (id) setCurrentUserId(id);
//   };

//   useEffect(() => {
//     if (!currentUserId) return;

//     const unsubscribe = firestore()
//       .collection('chats')
//       .orderBy('createdAt', 'asc') // ✅ Correct chronological order
//       .onSnapshot(snapshot => {
//         const allMessages = snapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         const filtered = allMessages.filter(
//           msg =>
//             (msg.senderId === currentUserId && msg.receiverId === user.id) 
         
//         );

//         setMessages(filtered);
//       });

//     return () => unsubscribe();
//   }, [currentUserId]);

//   const sendMessage = async () => {
//     if (!message.trim() || !currentUserId) return;

//     await firestore().collection('chats').add({
//       text: message,
//       createdAt: firestore.FieldValue.serverTimestamp(),
//       senderId: currentUserId,
//       receiverId: user.id,
//     });

//     setmsg(prev => [...prev, { text: message, temp: true }]);
//     setMessage('');
//   };

//   const combinedMessages = [...messages, ...smg];

//   const renderItem = ({ item }) => {
//     const isSender = item.senderId === currentUserId || item.temp;
//     return (
//       <View
//         style={[
//           styles.chatBubble,
//           isSender ? styles.chatRight : styles.chatLeft,
//         ]}
//       >
//         <Text style={styles.chatText}>{item.text}</Text>
//       </View>
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
//     >
//       <FlatList
//         data={combinedMessages}
//         keyExtractor={(item, index) => item.id || index.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingVertical: 10 }}
//       />

//       <View style={styles.inputBox}>
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type a message"
//           style={styles.input}
//         />
//         <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
//           <Text style={{ color: '#fff' }}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },

//   chatBubble: {
//     marginHorizontal: 10,
//     marginVertical: 5,
//     padding: 10,
//     maxWidth: '70%',
//     borderRadius: 10,
//   },
//   chatLeft: {
//     backgroundColor: '#e5e5ea',
//     alignSelf: 'flex-start',
//   },
//   chatRight: {
//     backgroundColor: '#007aff',
//     alignSelf: 'flex-end',
//   },
//   chatText: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderTopWidth: 1,
//     borderColor: '#ddd',
//     backgroundColor: '#f8f8f8',
//   },
//   input: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f1f1f1',
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   sendBtn: {
//     backgroundColor: '#007aff',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
// });
