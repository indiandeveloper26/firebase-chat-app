import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const DeviceInfoScreen = () => {
  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    const getDeviceInfo = async () => {
      const data = {
        Brand: await DeviceInfo.getBrand(),
        Model: await DeviceInfo.getModel(),
        System: await DeviceInfo.getSystemName(),
        'System Version': await DeviceInfo.getSystemVersion(),
        'Device ID': await DeviceInfo.getDeviceId(),
        'Unique ID': await DeviceInfo.getUniqueId(),
        'Device Name': await DeviceInfo.getDeviceName(),
      'Device ip': await DeviceInfo.isLowRamDevice(),
        'Is Emulator': (await DeviceInfo.isEmulator()) ? 'Yes' : 'No',
        'Is Tablet': (await DeviceInfo.isTablet()) ? 'Yes' : 'No',
        'Battery Level': `${Math.round(
          (await DeviceInfo.getBatteryLevel()) * 100
        )}%`,
        'Total Memory': `${(await DeviceInfo.getTotalMemory()) / 1024 / 1024} MB`,
        'Free Disk Storage': `${(
          (await DeviceInfo.getFreeDiskStorage()) /
          1024 /
          1024
        ).toFixed(2)} MB`,
        'Used Storage': `${(
          (await DeviceInfo.getUsedMemory()) /
          1024 /
          1024
        ).toFixed(2)} MB`,
      };
      setDeviceData(data);
    };

    getDeviceInfo();
  }, []);

  if (!deviceData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E90FF" />
        <Text style={{ marginTop: 10 }}>Loading Device Info...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📱 Device Information</Text>
      {Object.entries(deviceData).map(([key, value]) => (
        <View key={key} style={styles.item}>
          <Text style={styles.label}>{key}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default DeviceInfoScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  item: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  label: {
    fontWeight: '600',
    color: '#555',
  },
  value: {
    color: '#000',
    fontSize: 15,
    marginTop: 4,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
