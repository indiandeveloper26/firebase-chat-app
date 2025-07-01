import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { pickDirectory } from '@react-native-documents/picker';

const DirectoryPickerScreen = () => {
  const [pickedUri, setPickedUri] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const openDirectory = async () => {
    try {
      const { uri } = await pickDirectory({
        requestLongTermAccess: false, // set true if you want future access
      });

      if (uri) {
        setPickedUri(uri);
        setErrorMsg('');
        console.log('📂 Picked Directory URI:', uri);
      } else {
        setPickedUri(null);
        setErrorMsg('No directory selected.');
      }
    } catch (err) {
      console.error('❌ Picker Error:', err);
      setPickedUri(null);
      setErrorMsg(err.message || 'Unknown error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📁 Pick a Directory</Text>

      <Button title="Open Directory Picker" onPress={openDirectory} color="#007AFF" />

      {pickedUri ? (
        <View style={styles.resultBox}>
          <Text style={styles.label}>📂 Selected Directory URI:</Text>
          <Text style={styles.uri}>{pickedUri}</Text>
        </View>
      ) : errorMsg ? (
        <Text style={styles.error}>❌ {errorMsg}</Text>
      ) : (
        <Text style={{ color: '#888', marginTop: 20 }}>No directory selected yet.</Text>
      )}
    </View>
  );
};

export default DirectoryPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F0F8FF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultBox: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E8F4FF',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  uri: {
    color: '#000',
    fontSize: 14,
  },
  error: {
    color: 'red',
    marginTop: 20,
    textAlign: 'center',
  },
});
