import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default function App() {
    const [sound, setSound] = React.useState();

    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(
            { uri: 'https://firebasestorage.googleapis.com/v0/b/reactnative-redux.appspot.com/o/images%2Ftest.mp3?alt=media&token=c058b3e8-5423-48c9-9289-968c8e7a431a' }
            ,
            { shouldPlay: true }
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }

    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <View>
            <Button title="Play Sound" onPress={playSound} />
        </View>
    );
}