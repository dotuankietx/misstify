import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Dimensions, Image, FlatList, Animated } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from "expo-av";
import { updateSongState } from '../actions/songActions';
import { useContext } from 'react';
import { convertTime } from '../misc/audioController';
// import TrackPlayer from 'react-native-track-player';

const { width, height } = Dimensions.get('window');




export default function MusicPlayer() {
    //const playBackState = usePlaybackState();
    const [songIndex, setsongIndex] = useState(0);
    const [songPositionMillis, setsongPositionMillis] = useState(0);

    const dispatch = useDispatch();
    const db = useSelector((store) => store.audio);
    const scrollX = useRef(new Animated.Value(0)).current;
    const songSlider = useRef(null)
    const getStatus = async () => {
        await db.playbackObj.getStatusAsync().then((e) => {
            setsongPositionMillis(e.positionMillis)
        })
    }
    useEffect(() => {
        let interval = setInterval(async () => {
            if (db.playbackObj && db.isPlaying) {
                await getStatus()
            }
        }, 1000)
        return () => clearInterval(interval);

    }, [db.currentAudio])


    useEffect(() => {
        console.log(db.cunrentAudioIndex)
        handleAudioPress(db.songs[db.cunrentAudioIndex]).then((e) => {
            songSlider.current.scrollToOffset({
                offset: db.cunrentAudioIndex * width
            })
        })
        // setupPlayer();
        scrollX.addListener(({ value }) => {
            //console.log(`ScrollX : ${value} | Device Width : ${width} `);
            const index = Math.round(value / width);
            setsongIndex(index);
        })


    }, [db.cunrentAudioIndex])
    const renderSongs = ({ item, index }) => {
        return (
            <Animated.View style={styles.mainImageWrapper}>
                <View style={[styles.imageWrapper, styles.elevation]}>
                    <Image
                        source={{uri:item.artwork}}
                        style={styles.musicImage}
                    />
                </View>
            </Animated.View>

        )
    }

    const haddlePlaySong = (state) => {
        dispatch(updateSongState(state));
    }

    const handleAudioPress = async (audio) => {
        //playing audio for the 1st time
        if (db.soundObj === null) {
            const playbackObj = new Audio.Sound();
            const status = await playbackObj.loadAsync(
                { uri: audio.url },
                { shouldPlay: true }
            );
            const index = db.songs.indexOf(audio)
            return haddlePlaySong({
                playbackObj: playbackObj,
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                cunrentAudioIndex: index
            });
        }
        //pause audio
        if (db.soundObj.isLoaded && db.soundObj.isPlaying && db.currentAudio.id === audio.id) {
            const status = await db.playbackObj.setStatusAsync({ shouldPlay: false });
            return haddlePlaySong({ soundObj: status, isPlaying: false });
        }
        //resume audio
        if (db.soundObj.isLoaded && !db.soundObj.isPlaying && db.currentAudio.id === audio.id) {
            const status = await db.playbackObj.playAsync();
            return haddlePlaySong({ soundObj: status, isPlaying: true });
        }
        //select another audio
        if (db.soundObj.isLoaded && db.currentAudio.id !== audio.id) {
            await db.playbackObj.stopAsync();
            await db.playbackObj.unloadAsync();
            const status = await await db.playbackObj.loadAsync(
                { uri: audio.url },
                { shouldPlay: true }
            );;
            const index = db.songs.indexOf(audio)
            setsongIndex(index)
            return haddlePlaySong({
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                cunrentAudioIndex: index
            });
        }


    };
    const skipToNext = () => {
        if (db.songs[db.cunrentAudioIndex + 1] === undefined) {
            songSlider.current.scrollToOffset({
                offset: 0
            })
            haddlePlaySong({
                cunrentAudioIndex: 0
            });
        } else {
            songSlider.current.scrollToOffset({
                offset: (db.cunrentAudioIndex + 1) * width
            })
            haddlePlaySong({
                cunrentAudioIndex: db.cunrentAudioIndex + 1
            });
        }

    }
    const skipToPrevious = () => {
        if (db.songs[db.cunrentAudioIndex - 1] === undefined) {
            songSlider.current.scrollToOffset({
                offset: (db.songs.length - 1) * width

            })
            haddlePlaySong({
                cunrentAudioIndex: db.songs.length - 1
            });
        } else {
            songSlider.current.scrollToOffset({
                offset: (db.cunrentAudioIndex - 1) * width
            })
            haddlePlaySong({
                cunrentAudioIndex: db.cunrentAudioIndex - 1
            });
        }

    }


    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 40, waitForInteraction: true };

    const onViewableItemsChanged = useCallback(({ changed, viewableItems }) => {
        // do something with viewableItems here. It’s a list of items in the viewport. 
        console.log(changed)
    }, []);

    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

    if (!db.soundObj) {
        return (<Text>Loading</Text>)
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.mainContainer}>

                    {/* image */}
                    <Animated.FlatList
                        renderItem={renderSongs}
                        ref={songSlider}
                        data={db.songs}
                        keyExtractor={item => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        initialScrollIndex={db.cunrentAudioIndex}
                        //viewabilityConfig={ viewabilityConfig }
                        //viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(event.nativeEvent.contentOffset.x / width);
                            if (songIndex !== index) {
                                haddlePlaySong({
                                    cunrentAudioIndex: index
                                });

                            }


                        }}
                    //onScrollBeginDrag={()=>{console.log(songIndex)}}
                    //onScrollEndDrag={(e)=>{console.log(songIndex)}}
                    // onScroll={Animated.event(
                    //     [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    //     { useNativeDriver: true },)
                    // }
                    />
                    {/* song content */}
                    <View>
                        <Text style={[styles.songContent, styles.songTitle]} >{db.songs[db.cunrentAudioIndex].title}</Text>
                        <Text style={[styles.songContent]} >{db.songs[db.cunrentAudioIndex].artist}</Text>
                    </View>
                    {/* slider */}
                    <View>
                        <Slider
                            style={styles.progressBar}
                            value={songPositionMillis}
                            minimumValue={0}
                            maximumValue={db.soundObj.durationMillis}
                            thumbTintColor='#FFD369'
                            minimumTrackTintColor="#FFD369"
                            maximumTrackTintColor="#fff"
                            onSlidingComplete={async (value) => { 
                                await db.playbackObj.setPositionAsync(value)
                            }}
                            //onValueChange={(value)=>{console.log(value)}}
                        />
                    </View>
                    {/* music progress duration */}
                    <View style={styles.progressLevelDuraiton}>
                        <Text style={styles.progressLabelText}>{!songPositionMillis?"00:00" : convertTime(songPositionMillis)}</Text>
                        <Text style={styles.progressLabelText}>{convertTime(db.soundObj.durationMillis)}</Text>
                    </View>
                    {/* music control */}
                    <View style={styles.musicControlsContainer}>
                        <TouchableOpacity onPress={() => { skipToPrevious(); }}>
                            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={()=>{togglePlayBack(playBackState)}}>
                    <Ionicons name={playBackState === State.Playing?"ios-play-circle":"ios-pause-circle"} size={75} color="#FFD369"/>
                </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => { handleAudioPress(db.songs[db.cunrentAudioIndex]) }}>
                            <Ionicons name={db.isPlaying ? "ios-pause-circle" : "ios-play-circle"} size={75} color="#FFD369" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            if (db.songs[songIndex + 1] === undefined) {
                                skipToNext()
                            }
                            else skipToNext();
                        }}
                        >
                            <Ionicons name="play-skip-forward-outline" size={35} color="#FFD369" />
                        </TouchableOpacity>
                    </View>

                </View>
                {/* <View style={styles.bottomContainer}>
                <View style={styles.bottomIconContainer}>
                <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name="heart-outline" size={30} color="#888888"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name="repeat" size={30} color="#888888"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name="share-outline" size={30} color="#888888"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                    <Ionicons name="ellipsis-horizontal" size={30} color="#888888"/>
                </TouchableOpacity>
                </View>
                
            </View> */}
            </SafeAreaView>

        );
    }



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831',
    },

    mainContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomContainer: {
        width: width,
        alignItems: 'center',
        paddingVertical: 15,
        borderTopColor: '#393E46',
        borderWidth: 1
    },
    bottomIconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },

    mainImageWrapper: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    imageWrapper: {
        width: 300,
        height: 340,
        marginBottom: 25,
    },
    musicImage: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    elevation: {
        elevation: 5,

        shadowColor: '#ccc',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
    },
    songContent: {
        textAlign: 'center',
        color: '#EEEEEE',
    },
    songTitle: {
        fontSize: 18,
        fontWeight: '600',
    },

    songArtist: {
        fontSize: 16,
        fontWeight: '300',
    },
    progressBar: {
        width: 350,
        height: 40,
        marginTop: 25,
        flexDirection: 'row',
    },
    progressLevelDuraiton: {
        width: 340,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabelText: {
        color: '#FFF',
    },

    musicControlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        width: '60%',
    },
});