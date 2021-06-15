import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { MenuProvider } from 'react-native-popup-menu';

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import store, { rrfProps } from "./redux/store";

export default function App(): JSX.Element {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <MenuProvider>
            <Navigation colorScheme={colorScheme} />
          </MenuProvider>
        </ReactReduxFirebaseProvider>
      </Provider>
      <StatusBar />
    </SafeAreaProvider>
  );
}
