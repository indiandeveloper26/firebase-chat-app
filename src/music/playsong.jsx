// import React, { useEffect, useState } from 'react';
// import { View, Button, Text, StyleSheet } from 'react-native';
// import TrackPlayer from 'react-native-track-player';

// const MusicPlayerScreen = () => {
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     setupPlayer();
//     return () => {
//       TrackPlayer.destroy(); // cleanup
//     };
//   }, []);

//   const setupPlayer = async () => {
//     await TrackPlayer.setupPlayer();
//     await TrackPlayer.updateOptions({
//       stopWithApp: true,
//       capabilities: [
//         TrackPlayer.CAPABILITY_PLAY,
//         TrackPlayer.CAPABILITY_PAUSE,
//       ],
//     });

//     await TrackPlayer.add({
//       id: 'local-song',
//       url: require('./assets/song.mp3'), // 🔽 song.mp3 ko assets me daalo
//       title: 'Local Song',
//       artist: 'Unknown Artist',
//     });
//   };

//   const togglePlayback = async () => {
//     const state = await TrackPlayer.getState();

//     if (state === TrackPlayer.STATE_PLAYING) {
//       await TrackPlayer.pause();
//       setIsPlaying(false);
//     } else {
//       await TrackPlayer.play();
//       setIsPlaying(true);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>🎵 Local Music Player</Text>
//       <Button title={isPlaying ? '⏸ Pause' : '▶️ Play'} onPress={togglePlayback} />
//     </View>
//   );
// };

// export default MusicPlayerScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 22,
//     marginBottom: 20,
//   },
// });



import { View, Text } from 'react-native'
import React from 'react'

const playsong = () => {
  return (
    <View>
      <Text>playsong</Text>
    </View>
  )
}

export default playsong