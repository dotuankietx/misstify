import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import {firebase} from '../firebase.js'
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import mainApi from '../api/mainApi.js';

export default function Test() {
    const [audioFile, setAudioFile] = useState('')
    //const navigation = useNavigation();
    //const dispatch = useDispatch();
    //const db = useSelector((store) => store.audio);
    // const haddleSelectSong = (song) => {
    //     dispatch(viewAllSong(song));
    // }
    const handlePicker = async () => {
        let result = await DocumentPicker.getDocumentAsync({type:'audio/*'});
        setAudioFile(result.uri)
        console.log(result)
    }
    const handleUpload = async () => {
        try {
            console.log(audioFile)
            let id = firebase.firestore().collection('name').doc().id;
            const response = await fetch(audioFile);
            const blob = await response.blob();
            let ref = firebase.storage().ref().child("audio/" + id);
            let upload = await ref.put(blob);
            let url = await ref.getDownloadURL();

            let payload = {
                title:'title',
                artist:'artist',
                artwork:'artwork',
                url:url,
                duration:0,
            }
            await mainApi.postMusic(payload)
            return { id: id, url: url };
        } catch (error) {

        }
    }
    return (
        <View>
            <Button title="Pick Audio File" onPress={() => { handlePicker() }} />
            <Button title="Upload" onPress={() => { handleUpload() }} />
        </View>
    );
}