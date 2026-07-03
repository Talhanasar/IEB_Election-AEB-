// Polyfill Node's Buffer for React Native before Expo Router loads the app.
import 'buffer';
global.Buffer = global.Buffer || require('buffer').Buffer;

// Delegate to Expo Router's standard entry point.
import 'expo-router/entry';
