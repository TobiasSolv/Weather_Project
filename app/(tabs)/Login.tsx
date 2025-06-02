import { Text, View, StyleSheet, Button } from "react-native";
import React, { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google'
// ios: 854833969140-fau6pbm824pl5ffkkqjnaqa9mtnq5u07.apps.googleusercontent.com
// android:  854833969140-r25l4sfrv5hgvem07p49vnnegrjffae5.apps.googleusercontent.com
export default function Login() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:"854833969140-r25l4sfrv5hgvem07p49vnnegrjffae5.apps.googleusercontent.com"
        })

    useEffect(() =>{
        if(response?.type === "success"){
            console.log("bla ", response.authentication.accessToken)
            }
        },[response])

  return (
    <View style={styles.container}>
      <Text>HEj </Text>
      <Button
        title="Google login"
        onPress={() => promptAsync()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: 'White',
    alignItems: 'center',
    justifyContent: 'center',
  },

});