import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MenuView from "../components/menuView";
import { useTheme } from "@react-navigation/native";

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
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <MenuView actions={actions}>
        <Entypo
          name="dots-three-horizontal"
          size={24}
          color={theme.colors.text}
        />
      </MenuView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
