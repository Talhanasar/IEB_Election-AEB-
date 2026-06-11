import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight } from '@/constants/theme';

export default function VoterLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryBlue,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-variant" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="candidates"
        options={{
          title: 'Candidates',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-tie" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="election-info"
        options={{
          title: 'Election Info',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-month" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="newspaper-variant-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="phone" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    height: 64,
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 16,
    right: 16,
    borderRadius: 24,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
