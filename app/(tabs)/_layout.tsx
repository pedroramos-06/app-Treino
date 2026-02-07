import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 15,
          paddingTop: 5,
          elevation: 0,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: "PoppinsSemiBold",
          fontSize: 20,
          color: theme.colors.onSurface,
        },
        tabBarLabelStyle: {
          fontFamily: "InterMedium",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Fichas",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "clipboard-text-multiple" : "clipboard-text-multiple-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercicios"
        options={{
          title: "Exercícios",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "dumbbell" : "dumbbell"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}