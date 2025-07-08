// // ChatScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import { useRoute } from '@react-navigation/native';

// const ChatScreen = () => {

//   let route= useRoute()

//   let {userphone,resiverphone}=route.params
//   // Alert.alert("hh",resiverphone)
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

// useEffect(() => {
//   const unsubscribe = firestore()
//     .collection('chats')
//     .doc('6392831776') // Make sure `userid` is defined
//     .collection('messages')
//     .orderBy('createdAt', 'desc')
//     .onSnapshot(snapshot => {
//       const msgs = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(msgs);
//       console.log('messageData:', msgs); // ✅ Corrected log
//     });

//   return () => unsubscribe();
// }, []);


//  const sendMessage = async () => {
//   if (input.trim() === '') return;

//   try {
//     await firestore()
//       .collection('chats')          // Main chats collection
//       .doc(userphone)                  // Specific user chat document
//       .collection('messages')       // Subcollection for messages
//       .add({
//         text: input,
//         sender: userphone,
//         receiver: resiverphone,
//         createdAt: firestore.FieldValue.serverTimestamp(),
//       });

//     setInput('');
//   } catch (error) {
//     Alert.alert("Error", error.message); // Show actual error
//   }
// };


//   return (
//     <View style={styles.container}>
//        <Text>
//           {`userphone${userphone}resiverphone${resiverphone}`}
//         </Text>
//       <FlatList
//         data={messages}
//         keyExtractor={item => item.id}
//         inverted
//         renderItem={({ item }) => (
//           <View style={styles.message}>
//             <Text><Text style={{ fontWeight: 'bold' }}>{item.user}</Text>: {item.text}</Text>
//           </View>
//         )}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           value={input}
//           onChangeText={setInput}
//           placeholder="Type a message"
//           style={styles.input}
//         />
//         <Button title="Send" onPress={sendMessage} />
       
//       </View>
//     </View>
//   );
// };

// export default ChatScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10, backgroundColor: '#fff' },
//   inputContainer: { flexDirection: 'row', alignItems: 'center' },
//   input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginRight: 5 },
//   message: { padding: 10, backgroundColor: '#f1f1f1', borderRadius: 5, marginVertical: 4 },
// });














import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useRoute } from '@react-navigation/native';

const ChatScreen = () => {
  const route = useRoute();
  const { userphone, resiverphone } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const chatId = [userphone, resiverphone].sort().join('_'); // ✅ consistent ID

  // 👇 Fetch messages from correct chat thread
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, []);

  // 👇 Send message to the correct chat thread
  const sendMessage = async () => {
    if (input.trim() === '') return;

    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          text: input,
          sender: userphone,
          receiver: resiverphone,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setInput('');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{`Chat between ${userphone} and ${resiverphone}`}</Text>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        inverted
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === userphone
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 5,
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
});
