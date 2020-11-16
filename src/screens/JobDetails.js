import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Alert,
    Platform,
    Linking
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import Animated, { Extrapolate, interpolate } from "react-native-reanimated";
import { BackButton, Options } from "../components";
import { BLUE, BORDERCOLOR, FORESTGREEN, LIGHTGREY } from "../constants/Colors";
import { MARGIN_TOP, SCREEN_WIDTH } from "../constants/Layout";
import { useStore } from "../store/store";

const Header = ({ scrollY, title }) => {
    const opacity = interpolate(scrollY, {
        inputRange: [0, 100, 150],
        outputRange: [0, 0.5, 1],
        extrapolate: Extrapolate.CLAMP
    })
    return (
        <Animated.View style={[styles.header, { opacity }]}>
            <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
        </Animated.View>
    )
}

const ApplyButton = ({ job }) => {
    const [applied, setApplied] = useState(false)
    const navigation = useNavigation()
    const store = useStore()
    useEffect(() => {
        if (job.applied) setApplied(true)
    }, [])

    if (applied) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Alert.alert('Applied')}
                style={styles.applyButton}>
                <Text style={styles.applyButtonTitle}>Applied</Text>
            </TouchableOpacity>
        )
    }
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Apply', { job })}
            style={styles.applyButton}>
            <Text style={styles.applyButtonTitle}>Apply Now</Text>
        </TouchableOpacity>
    )
}

const Footer = ({ scrollY, job }) => {
    const translateY = interpolate(scrollY, {
        inputRange: [0, 200, 250],
        outputRange: [100, 50, 0],
        extrapolate: Extrapolate.CLAMP
    })
    return (
        <Animated.View
            style={[styles.footerButton, { transform: [{ translateY }] }]}
        >
            <ApplyButton job={job} />
        </Animated.View>
    )
}

const JobDetails = ({ }) => {
    const store = useStore()
    const job = store.jobDetails //should be fetched from api and stored in state
    const { title, center, location, type, salary, imageUrl, details, creator, coordinates } = job
    const scrollY = useRef(new Animated.Value(0)).current

    const onPressLocation = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${coordinates.latitude},${coordinates.longitude}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    // const [loading, setLoading] = useState(true)
    // const [job, setJob] = useState(null)
    // const { id, title, category, center, location, type, salary, imageUrl, details, creator } = job

    // useEffect(() => {
    //    store.getJobDetails(userId, id).then(response=> {
    // setJob(response)
    // setLoading(false)
    // }) .catch((error) => {
    //         setLoading(false)
    //     });
    // }, [])

    // if (loading) {
    //     return <ActivityIndicator size='large' color={'grey'} animating/> 
    // }

    return (
        <SafeAreaView style={styles.container}>
            <Header scrollY={scrollY} title={title} />
            <BackButton top={15} left={10} />
            <Animated.ScrollView
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }]
                )}
                contentContainerStyle={{ paddingBottom: 50 }}
                style={{ flex: 1 }}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.topContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.lightText}>{center}</Text>
                    <View style={styles.row}>
                        <Text numberOfLines={1} style={styles.salary}>{salary}</Text>
                        <Text numberOfLines={1} style={styles.lightText}>{salary ? ' · ' : ''}{type}</Text>

                        <TouchableOpacity
                            onPress={onPressLocation}
                            style={styles.locationContainer}
                        >
                            <Text numberOfLines={1} style={styles.location}> · {location}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ marginVertical: 15 }}>
                        <ApplyButton job={job} />
                    </View>
                    <Options displayedJob={job} />
                </View>

                <View style={styles.detailsContainer} >
                    <View style={styles.detailsHeaderContainer}>
                        <Text style={styles.detailsHeader}>Job Details</Text>
                    </View>
                    <View style={styles.details}>
                        <Text>{details}</Text>
                    </View>
                </View>

                <View style={styles.creatorContainer}>
                    <Text style={styles.detailsHeader}>Posted by</Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { Alert.alert('Creator Page') }}
                        style={styles.creatorDetailsContainer}>
                        <View style={styles.creatorImageContainer}>
                            <Image source={{ uri: creator.imageUrl }} style={styles.creatorImage} />
                        </View>
                        <View style={styles.creatorDetails}>
                            <Text style={styles.detailsHeader}>{creator.title}</Text>
                            <Text style={styles.lightText}>{creator.category}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </Animated.ScrollView>
            <Footer scrollY={scrollY} job={job} />
        </SafeAreaView>
    )
};
export default observer(JobDetails);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: MARGIN_TOP
    },
    image: {
        height: 200,
        width: '100%',
        resizeMode: 'cover',
        flex: 1
    },
    topContainer: {
        padding: 15, backgroundColor: '#fff'
    },
    header: {
        height: 50,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    headerTitle: {
        fontSize: 16,
        maxWidth: 200,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
    },
    lightText: {
        color: 'grey',
        fontSize: 13,
        maxWidth: 200
    },
    locationContainer: {

    },
    location: {
        color: BLUE,
        fontSize: 13
    },
    salary: {
        color: FORESTGREEN,
        maxWidth: 200
    },
    footerButton: {
        height: 50,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButton: {
        width: SCREEN_WIDTH - 30,
        marginVertical: 0,
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
    detailsContainer: {
        marginTop: 10,
        backgroundColor: '#fff'
    },
    detailsHeaderContainer: {
        borderBottomWidth: 1,
        borderColor: LIGHTGREY,
        padding: 15,
        paddingVertical: 10
    },
    detailsHeader: {
        fontWeight: 'bold'
    },
    details: {
        padding: 15
    },
    creatorContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: BORDERCOLOR
    },
    creatorDetailsContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    creatorImageContainer: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: LIGHTGREY,
        borderWidth: 1.5,
        overflow: 'hidden'
    },
    creatorImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        resizeMode: 'contain'
    },
    creatorDetails: {
        marginHorizontal: 10
    },

})