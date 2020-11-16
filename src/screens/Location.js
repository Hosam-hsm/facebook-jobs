import React, { createRef, useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Circle, Marker } from "react-native-maps";
import { getBoundsOfDistance } from "geolib";
import Slider from '@react-native-community/slider';
import { MARGIN_TOP, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/Layout";
import { Header } from "../components";
import { BORDERCOLOR, DARKGREY, FORESTGREEN, LIGHTGREY } from "../constants/Colors";
import { useStore } from "../store/store";
import { GOOGLEAPIKEY } from "../constants/Keys";
import { useNavigation } from "@react-navigation/native";

const LATITUDE = -23.311413;
const LONGITUDE = -51.16732;
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const padding = 300;

const Location = () => {
    const store = useStore()
    const navigation = useNavigation()
    const [top, setTop] = useState(1)
    const [distance, setDistance] = useState(0)
    const [sliderValue, setSliderValue] = useState()
    const [initialRegion, setInitialRegion] = useState({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    })
    const mapRef = createRef()
    const markerRef = useRef()
    const circleRef = useRef().current

    const fitToCircle = () => {
        const bounds = getBoundsOfDistance(
            { latitude: initialRegion.latitude, longitude: initialRegion.longitude },
            distance
        );
        if (mapRef) {
            mapRef.current?.fitToCoordinates(
                [bounds[0], bounds[1]],
                true
            );
        }
    };

    const onRegionChange = region => {
        setInitialRegion(region)
    }

    const handleApply = () => {
        store.setLocation(initialRegion, parseInt(distance) / 1000)
        navigation.navigate('Jobs')
    }

    // _onChangeText = async (input) => {
    //     this.setState({ input: input.trim() })
    //     try {
    //         const result = await fetch(
    //             `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.googleApiKey}&input=${input}&components=${COUNTRY_FORMAT}`
    //         )
    //         const data = await result.json()
    //         this.setState({ data: data.predictions })
    //     } catch (err) {
    //         console.log("## LocationPicker _onChangeText err: ", err)
    //     }
    // } // for searching places

    useEffect(() => {
        async function getCurrentLocation() {
            navigator.geolocation.getCurrentPosition(
                position => {
                    let region = {
                        latitude: parseFloat(position.coords.latitude),
                        longitude: parseFloat(position.coords.longitude),
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    };
                    setInitialRegion(region)
                    mapRef.current?.animateToRegion(region, 500)
                },
                error => console.log(error),
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000
                }
            );
        }
        getCurrentLocation()
    }, []);

    useEffect(() => {
        sliderValue ? setDistance(sliderValue * 200000) : null
        fitToCircle()
    }, [sliderValue])

    return (
        <>
            <View style={{ marginTop: MARGIN_TOP }}>
                <Header title={'Location'} />
            </View>
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    fetchDetails
                    placeholder='Search'
                    onPress={(data, details = null) => {
                        let location = {
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }
                        setInitialRegion(location)
                        mapRef.current?.animateToRegion(location, 2000)
                    }}
                    query={{
                        key: GOOGLEAPIKEY,
                        language: 'en',
                    }}
                    styles={{
                        textInput: styles.search,
                        listView: { marginHorizontal: 10 }
                    }}
                />
            </View>

            <View style={[styles.container]}>
                <MapView
                    showsUserLocation
                    showsMyLocationButton
                    paddingAdjustmentBehavior="never"
                    mapPadding={{ bottom: padding, top: padding }}
                    initialRegion={initialRegion}
                    ref={mapRef}
                    style={{ ...StyleSheet.absoluteFill, top: top }}
                    onMapReady={() => setTop(0)}
                    loadingEnabled={true}
                    onRegionChangeComplete={onRegionChange}
                >
                    <Marker
                        ref={markerRef}
                        pinColor={'rgba(20, 126, 251, 1)'}
                        coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
                    />
                    <Circle
                        ref={circleRef}
                        style={styles.markerFixed}
                        onLayout={() =>
                            circleRef?.setNativeProps({
                                fillColor: "rgba(20, 126, 251, 0.3)"
                            })
                        }
                        center={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}
                        strokeWidth={3}
                        strokeColor="#147efb"
                        fillColor="rgba(20, 126, 251, 0.3)"
                        radius={distance}
                    />
                </MapView>
            </View>

            <View style={{ backgroundColor: '#fff' }}>
                <View style={{ margin: 10, marginBottom: 0 }}>
                    <Text style={styles.sliderText}>Radius</Text>
                </View>
                <View style={styles.sliderContainer}>
                    <Slider
                        style={{ width: SCREEN_WIDTH - 150, marginLeft: 15, height: 50 }}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor={DARKGREY}
                        maximumTrackTintColor={LIGHTGREY}
                        onValueChange={value => setSliderValue(value)}
                    />
                    <View>
                        <Text style={styles.sliderText}>{parseInt(distance) / 1000} km</Text>
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleApply}
                    style={styles.applyButton}>
                    <Text style={styles.applyButtonTitle}>Apply</Text>
                </TouchableOpacity>
            </View>
        </>
    );

}

export default Location;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sliderText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 15
    },
    applyButton: {
        width: SCREEN_WIDTH - 30,
        margin: 15,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: FORESTGREEN,
        borderRadius: 5
    },
    applyButtonTitle: {
        color: '#fff',
        fontWeight: 'bold'
    },
    markerFixed: {
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
        position: 'absolute',
        top: '50%'
    },
    search: {
        padding: 10,
        borderWidth: 1,
        borderColor: BORDERCOLOR,
        marginHorizontal: 10,
        borderRadius: 10,
        marginTop: 5
    },
    searchContainer: {
        zIndex: 100,
        top: 50,
        left: 0,
        right: 0,
        position: 'absolute'
    }
});