import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import OutsidePressHandler from "react-native-outside-press";
import { useTheme } from "@react-navigation/native";

const back = {
  id: "back",
  title: "Back",
  icon: (props) => <Feather name="arrow-left" {...props} />,
};

const MenuView = ({ children, actions, onPressAction, ...props }) => {
  const theme = useTheme();
  const [state, setState] = useState({
    isFirstTime: true,
    isMenuOpen: false,
    subMenu: null,
    childHeight: 0,
    menuData: [],
  });

  useEffect(() => {
    if (state.isMenuOpen) {
      if (actions.length > 0 && state.menuData?.length === 0) {
        for (let i = 0; i <= actions.length - 1; i++) {
          setTimeout(
            () =>
              setState((prev) => ({
                ...prev,
                menuData: [...prev.menuData, actions[i]],
              })),
            (i || 0) * 5
          );
        }
      }
      setState((prev) => ({ ...prev, isFirstTime: false }));
    }
  }, [actions, state.isMenuOpen]);

  const listItems = useCallback(({ item }) => {
    const setSubMenu = () => {
      if (item.subActions) {
        setState((prev) => ({ ...prev, subMenu: item.subActions }));
      } else {
        if (item.id === "back") {
          setState((prev) => ({ ...prev, subMenu: null }));
        } else {
          onPressAction(item);
        }
      }
    };
    return (
      <Pressable
        android_ripple={{
          foreground: false,
          borderless: false,
          color: theme.colors.border,
        }}
        onPress={setSubMenu}
      >
        <Animated.View
          layout={LinearTransition.springify()}
          style={[
            styles.menuItemContainerWrapper,
            item.subActions && {
              ...styles.isSubMenu,
              borderBottomColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.menuItemContainer}>
            {item.icon &&
              item.icon({
                color: item.destructive
                  ? theme.colors.notification
                  : theme.colors.text,
                size: 18,
              })}
            <Text
              style={[
                styles.menuItemText,
                {
                  color: item.destructive
                    ? theme.colors.notification
                    : theme.colors.text,
                },
              ]}
            >
              {item.title}
            </Text>
          </View>
          {item.subActions && (
            <Ionicons
              name="chevron-forward"
              size={15}
              color={theme.colors.text}
            />
          )}
        </Animated.View>
      </Pressable>
    );
  }, []);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setState((prev) => ({ ...prev, childHeight: height }));
  };

  return (
    <View {...props}>
      <Pressable
        android_ripple={{
          borderless: true,
          foreground: true,
          color: theme.colors.border,
        }}
        onLayout={onLayout}
        onPress={() =>
          setState((prev) => ({ ...prev, isMenuOpen: !prev.isMenuOpen }))
        }
      >
        {children}
      </Pressable>

      {state.isMenuOpen && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          layout={LinearTransition}
          style={[
            styles.menuContainer,
            { backgroundColor: theme.colors.menuBg, top: state.childHeight },
          ]}
        >
          <OutsidePressHandler
            onOutsidePress={() => {
              if (state.isMenuOpen) {
                setState((prev) => ({
                  ...prev,
                  isMenuOpen: false,
                  subMenu: null,
                  isFirstTime: true,
                  menuData: [],
                }));
              }
            }}
          >
            {!state.subMenu && (
              <Animated.FlatList
                showsVerticalScrollIndicator={false}
                itemLayoutAnimation={LinearTransition}
                entering={state.isFirstTime ? null : SlideInLeft}
                exiting={SlideOutLeft}
                data={state.menuData}
                renderItem={listItems}
                keyExtractor={(i) => i.id}
              />
            )}
            {state.subMenu && (
              <Animated.FlatList
                showsVerticalScrollIndicator={false}
                itemLayoutAnimation={LinearTransition}
                entering={SlideInRight}
                exiting={SlideOutRight}
                data={[back, ...state.subMenu]}
                renderItem={listItems}
                keyExtractor={(i) => i.id}
              />
            )}
          </OutsidePressHandler>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  menuItemContainerWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 160,
    alignItems: "center",
  },
  isSubMenu: {
    borderBottomWidth: 7,
    // borderBottomColor: "rgba(0,0,0,0.05)",
  },
  menuItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  menuItemText: {
    fontSize: 14,
  },
  menuContainer: {
    borderRadius: 10,
    elevation: 10,
    position: "absolute",
    overflow: "hidden",
  },
});

export default MenuView;
