import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NavigationTab from './view/NavigationTab'
import { NavigationContainer } from "@react-navigation/native";
import { Store } from './store/tagStore';
import { Provider } from 'react-redux';

export default function App() {
  return (

    <NavigationContainer>
      <Provider store={Store}>
        <NavigationTab />
      </Provider>      
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
