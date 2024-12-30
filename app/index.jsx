import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  Button,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { uploadFile } from "../lib/uploadFile";
import { useEvent } from "expo";
import { StatusBar } from "expo-status-bar";

const videoSource =
  "https://ojqesbgbrumoezrzdzxt.supabase.co/storage/v1/object/public/only%20for%20upload/1735547259124.mp4?t=2024-12-30T08%3A35%3A40.045Z";

const App = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handlePickFile = async (mediaType) => {
    try {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        allowsEditing: true,
        quality: 1,
      });

      if (pickerResult.canceled) {
        Alert.alert("No file selected");
        return;
      }

      const fileUri = pickerResult.assets[0].uri;
      setIsLoading(true);

      const uploadedFileUrl = await uploadFile(fileUri);
      console.log(uploadedFileUrl);

      if (mediaType === ImagePicker.MediaTypeOptions.Images) {
        setImageUrl(uploadedFileUrl);
      } else {
        setVideoUrl(uploadedFileUrl);
      }

      Alert.alert("Upload Successful", "File uploaded successfully!");
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const openUrl = (url) => {
  //   if (!url) {
  //     Alert.alert("No URL available");
  //     return;
  //   }
  //   Linking.openURL(url);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePickFile(ImagePicker.MediaTypeOptions.Images)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Uploading..." : "Pick an Image"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePickFile(ImagePicker.MediaTypeOptions.Videos)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Uploading..." : "Pick a Video"}
        </Text>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Image src={imageUrl} style={styles.image} />
        <VideoView
          style={styles.video}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
        {/* <View style={styles.controlsContainer}>
          <Button
            title={isPlaying ? "Pause" : "Play"}
            onPress={() => {
              if (isPlaying) {
                player.pause();
              } else {
                player.play();
              }
            }}
          />
        </View> */}
      </View>
      <StatusBar backgroundColor="black" style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  image: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});

export default App;
