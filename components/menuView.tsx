import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import OutsidePressHandler from "react-native-outside-press";
import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const back = {
  id: "back",
  title: "Back",
  icon: (props) => <Feather name="arrow-left" {...props} />,
};

const MIN_WIDTH = 160;

const MenuView = ({ children, actions, onPressAction, ...props }) => {
  const { width, height } = useWindowDimensions();
  const tint = useColorScheme();
  const childHeight = useSharedValue(0);
  const menuDimension = useSharedValue({ width, height });
  const offsetValue = useSharedValue({ x: 0, y: 0, pageX: 0, pageY: 0 });
  const theme = useTheme();
  const [state, setState] = useState({
    isFirstTime: true,
    isMenuOpen: false,
    subMenu: null,
  });

  const onMenuLayout = (e) => {
    const { height, width } = e.nativeEvent.layout;
    menuDimension.value = {
      height,
      width,
    };
  };

  const pan = Gesture.Pan()
    .onChange((e) => {
      offsetValue.value = {
        x: offsetValue.value.x + e.changeX,
        y: offsetValue.value.y + e.changeY,
        pageX: e.absoluteX,
        pageY: e.absoluteY,
      };
    })
    .onEnd(() => {});

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetValue.value.x },
        { translateY: offsetValue.value.y },
      ],
    };
  });

  const animatedHeight = useAnimatedStyle(() => {
    let guardHeight = height;
    let remainHeight = guardHeight - offsetValue.value.pageY;
    let isRight = width - offsetValue.value.pageX < menuDimension.value.width;
    let isBottom = remainHeight < menuDimension.value.height;
    let heightValue = state.isMenuOpen
      ? withTiming(childHeight.value + 5)
      : withTiming(0);
    let reverseHeightValue = state.isMenuOpen
      ? withTiming(-childHeight.value - 5)
      : withTiming(0);

    return {
      right: isRight ? 0 : "auto",
      bottom: isBottom ? 0 : "auto",
      transform: [
        {
          translateY: isBottom ? reverseHeightValue : heightValue,
        },
        { scaleX: state.isMenuOpen ? withTiming(1) : withTiming(0.9) },
      ],
    };
  });

  const ListItems = useCallback(
    ({ item, index, lastIndex }) => {
      const setSubMenu = () => {
        setState((prev) => ({ ...prev, isFirstTime: false }));
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
          style={[
            styles.menuItem,
            item.subActions && styles.isSubMenu,
            {
              borderColor:
                tint === "dark" ? "rgba(0, 0, 0, 0.1)" : "rgba(0,0,0,0.05)",
            },
            lastIndex === index && { borderColor: "transparent" },
          ]}
          onPress={setSubMenu}
        >
          <Animated.View
            entering={state.isFirstTime ? FadeIn.delay(80 * index) : null}
            style={styles.menuItemContainerWrapper}
          >
            <View style={styles.menuItemContainer}>
              {item.icon &&
                item.icon({
                  color: item.destructive
                    ? theme.colors.notification
                    : theme.colors.text,
                  size: 20,
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
    },
    [tint, theme, state.isFirstTime]
  );

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    childHeight.value = height;
  };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        <View>
          <Pressable
            disabled={state.isMenuOpen}
            onLayout={onLayout}
            onPress={() => setState((prev) => ({ ...prev, isMenuOpen: true }))}
          >
            {children}
          </Pressable>
        </View>
        {state.isMenuOpen && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.menuViewContainer, animatedHeight]}
            layout={LinearTransition}
          >
            <BlurView
              tint={
                tint === "light"
                  ? "systemThinMaterialLight"
                  : "systemThinMaterialDark"
              }
              intensity={Platform.select({ android: 0, ios: 100 })}
              style={[
                styles.blurViewStyle,
                {
                  backgroundColor: Platform.select({
                    android: theme.colors.menuBg,
                    ios: "transparent",
                  }),
                },
              ]}
            />
            <OutsidePressHandler
              onOutsidePress={() => {
                if (state.isMenuOpen) {
                  setState((prev) => ({
                    ...prev,
                    isMenuOpen: false,
                    subMenu: null,
                    isFirstTime: true,
                  }));
                }
              }}
            >
              <Animated.View
                layout={LinearTransition}
                onLayout={onMenuLayout}
                style={{
                  overflow: "hidden",
                }}
              >
                {!state.subMenu && (
                  <Animated.FlatList
                    showsVerticalScrollIndicator={false}
                    itemLayoutAnimation={LinearTransition}
                    entering={state.isFirstTime ? null : SlideInLeft}
                    exiting={SlideOutLeft}
                    data={actions}
                    renderItem={({ item, index }) => (
                      <ListItems
                        item={item}
                        index={index}
                        lastIndex={actions.length - 1}
                      />
                    )}
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
                    renderItem={({ item, index }) => (
                      <ListItems
                        item={item}
                        index={index}
                        lastIndex={[back, ...state.subMenu].length - 1}
                      />
                    )}
                    keyExtractor={(i) => i.id}
                  />
                )}
              </Animated.View>
            </OutsidePressHandler>
          </Animated.View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  menuItemContainerWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: MIN_WIDTH,
    alignItems: "center",
  },
  menuItem: {
    borderBottomWidth: Platform.select({ android: 0, ios: 2 }),
  },
  isSubMenu: {
    borderBottomWidth: 7,
  },
  menuItemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuViewContainer: {
    position: "absolute",
    overflow: "hidden",
    borderRadius: 14,
  },
  blurViewStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: -1000,
    right: -1000,
  },
});

export default MenuView;
