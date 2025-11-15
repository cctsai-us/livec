/**
 * Yoii LiveComm - Live Commerce App
 * @format
 */

import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, Text, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { t, initializeLocale, onLanguageChange } from './src/i18n';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
import ExploreScreen from './src/screens/ExploreScreen';
import GoLiveScreen from './src/screens/GoLiveScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Auth Screens
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import PhoneVerificationScreen from './src/screens/auth/PhoneVerificationScreen';

// Product Screens
import ProductDetailScreen from './src/screens/product/ProductDetailScreen';
import ProductListScreen from './src/screens/product/ProductListScreen';

// Profile - Orders
import MyOrdersScreen from './src/screens/profile/orders/MyOrdersScreen';
import OrderDetailScreen from './src/screens/profile/orders/OrderDetailScreen';

// Profile - Shopping
import WishlistScreen from './src/screens/profile/shopping/WishlistScreen';
import RecentlyViewedScreen from './src/screens/profile/shopping/RecentlyViewedScreen';

// Profile - Streaming
import MyLiveStreamsScreen from './src/screens/profile/streaming/MyLiveStreamsScreen';
import StreamAnalyticsScreen from './src/screens/profile/streaming/StreamAnalyticsScreen';
import FollowingScreen from './src/screens/profile/streaming/FollowingScreen';
import FollowersScreen from './src/screens/profile/streaming/FollowersScreen';

// Profile - Finance
import WalletScreen from './src/screens/profile/finance/WalletScreen';
import VouchersScreen from './src/screens/profile/finance/VouchersScreen';

// Profile - Settings
import EditProfileScreen from './src/screens/profile/settings/EditProfileScreen';
import AddressBookScreen from './src/screens/profile/settings/AddressBookScreen';
import PaymentMethodsScreen from './src/screens/profile/settings/PaymentMethodsScreen';
import LanguageSettingsScreen from './src/screens/profile/settings/LanguageSettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab bar icons
const tabIcons = {
  Home: require('./assets/icons/tabs/home.png'),
  Explore: require('./assets/icons/tabs/explore.png'),
  'Go Live': require('./assets/icons/tabs/live.png'),
  Cart: require('./assets/icons/tabs/cart.png'),
  Profile: require('./assets/icons/tabs/profile.png'),
};

function MainTabs() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Listen for language changes and force re-render
    const unsubscribe = onLanguageChange(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return (
    <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              const iconSource = tabIcons[route.name as keyof typeof tabIcons];

              // If PNG exists, use it. Otherwise show emoji fallback
              if (iconSource) {
                return (
                  <Image
                    source={iconSource}
                    style={{
                      width: size,
                      height: size,
                      tintColor: color, // iOS automatically applies tint color
                    }}
                    resizeMode="contain"
                  />
                );
              } else {
                // Fallback emoji for missing icons
                const fallbackEmoji: { [key: string]: string } = {
                  'Go Live': '📹',
                  'Cart': '🛒',
                  'Profile': '👤',
                };
                return <Text style={{ fontSize: size }}>{fallbackEmoji[route.name] || '•'}</Text>;
              }
            },
            tabBarLabel: ({ focused, color }) => {
              const labelMap: { [key: string]: string } = {
                'Home': 'home',
                'Explore': 'explore',
                'Go Live': 'goLive',
                'Cart': 'cart',
                'Profile': 'profile',
              };
              return (
                <Text style={{ color, fontSize: 10 }}>{t(labelMap[route.name])}</Text>
              );
            },
            tabBarActiveTintColor: '#6C5CE7',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              height: 85,
              paddingBottom: 10,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              marginBottom: 5,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Explore" component={ExploreScreen} />
          <Tab.Screen
            name="Go Live"
            component={GoLiveScreen}
            options={{
              tabBarIconStyle: { fontSize: 32 },
            }}
          />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash || isLoading) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLogin={() => {
                  // Mock login - in production would call API
                  const mockUser = {
                    id: '1',
                    name: 'Test User',
                    username: 'testuser',
                    email: 'test@example.com',
                  };
                  props.navigation.navigate('MainTabs' as never);
                }}
                onRegister={() => props.navigation.navigate('Register' as never)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen
                {...props}
                onRegister={() => props.navigation.navigate('MainTabs' as never)}
                onLogin={() => props.navigation.navigate('Login' as never)}
                onVerifyPhone={(phone) =>
                  props.navigation.navigate('PhoneVerification' as never, { phone } as never)
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PhoneVerification">
            {(props) => (
              <PhoneVerificationScreen
                {...props}
                phone={(props.route.params as any)?.phone || ''}
                onVerify={() => props.navigation.navigate('MainTabs' as never)}
                onResend={() => console.log('Resend OTP')}
              />
            )}
          </Stack.Screen>
        </>
      ) : null}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Product Screens */}
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />

      {/* Profile - Orders */}
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />

      {/* Profile - Shopping */}
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="RecentlyViewed" component={RecentlyViewedScreen} />

      {/* Profile - Streaming */}
      <Stack.Screen name="MyLiveStreams" component={MyLiveStreamsScreen} />
      <Stack.Screen name="StreamAnalytics" component={StreamAnalyticsScreen} />
      <Stack.Screen name="Following" component={FollowingScreen} />
      <Stack.Screen name="Followers" component={FollowersScreen} />

      {/* Profile - Finance */}
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Vouchers" component={VouchersScreen} />

      {/* Profile - Settings */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddressBook" component={AddressBookScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
    </Stack.Navigator>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [localeInitialized, setLocaleInitialized] = useState(false);

  useEffect(() => {
    // Initialize locale from AsyncStorage on app startup
    initializeLocale().then(() => {
      setLocaleInitialized(true);
    });
  }, []);

  if (!localeInitialized) {
    return null; // or a loading screen
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

export default App;
