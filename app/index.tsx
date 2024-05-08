import React from "react";
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  useColorScheme,
} from "react-native";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MenuView from "../components/menuView";
import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const actions = [
  {
    id: "mute",
    title: "Mute",
    icon: (props) => <Ionicons name="volume-high-outline" {...props} />,
    subActions: [
      {
        id: "disable",
        title: "Disable sound",
        icon: (props) => <Ionicons name="musical-notes-outline" {...props} />,
      },
      {
        id: "for",
        title: "Mute for",
        icon: (props) => (
          <Ionicons name="notifications-off-outline" {...props} />
        ),
      },
      {
        id: "customize",
        title: "Customize",
        icon: (props) => <Ionicons name="options-outline" {...props} />,
      },
      {
        id: "forever",
        title: "Mute forever",
        destructive: true,
        icon: (props) => <Ionicons name="volume-mute-outline" {...props} />,
      },
    ],
  },
  {
    id: "video",
    title: "Video Call",
    icon: (props) => <Ionicons name="videocam-outline" {...props} />,
  },
  {
    id: "search",
    title: "Search",
    icon: (props) => <Ionicons name="search-outline" {...props} />,
  },
  {
    id: "wallpaper",
    title: "Change Wallpaper",
    icon: (props) => <Ionicons name="image-outline" {...props} />,
  },
  {
    id: "clearHistory",
    title: "Clear History",
    icon: (props) => <MaterialCommunityIcons name="broom" {...props} />,
  },
  {
    id: "delete",
    title: "Delete chat",
    // destructive: true,
    icon: (props) => <Ionicons name="trash-outline" {...props} />,
  },
];

const App = () => {
  const tint = useColorScheme();
  const theme = useTheme();

  const onPressAction = (item) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(item.title, ToastAndroid.BOTTOM);
    } else {
      alert(item.title);
    }
  };

  return (
    <ImageBackground
      style={styles.container}
      imageStyle={{
        resizeMode: "cover",
      }}
      source={{
        uri: "https://images.unsplash.com/photo-1577398628395-4ebd1f36731b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      }}
    >
      <MenuView actions={actions} onPressAction={onPressAction}>
        <BlurView
          tint={tint === "light" ? "systemMaterialLight" : "systemMaterialDark"}
          intensity={100}
          style={styles.blurView}
        >
          <Entypo
            name="dots-three-horizontal"
            size={24}
            color={theme.colors.text}
          />
        </BlurView>
      </MenuView>
    </ImageBackground>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  blurView: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});
