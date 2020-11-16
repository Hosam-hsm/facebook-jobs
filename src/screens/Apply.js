import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Image,
    TextInput,
    Alert,
    TouchableOpacity
} from "react-native";
import { Header } from "../components";
import { BORDERCOLOR, FORESTGREEN, LIGHTGREY } from "../constants/Colors";
import { MARGIN_TOP, SCREEN_WIDTH } from "../constants/Layout";
import { useStore } from "../store/store";

const Apply = ({ route }) => {
    const { job } = route.params
    const { title, center, type, imageUrl } = job
    const store = useStore()
    const [name, setName] = useState(null)
    const [city, setCity] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)

    const userDetails = {
        name, city, email, phone
    }

    const applyJob = () => {
        store.applyJob(store.user.id, job.id, userDetails)
        Alert.alert('Apply')
    }


    const Footer = ({ }) => {
        return (
            <View
                style={styles.footerButton}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => applyJob()}
                    style={styles.sendButton}>
                    <Text style={styles.sendButtonTitle}>Send</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={'Application'} />
            <ScrollView>

                <View style={styles.creatorContainer}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    </View>
                    <View style={styles.creatorDetails}>
                        <Text style={styles.creatorTitle}>{title}</Text>
                        <Text style={styles.lightText}>{center}</Text>
                        <Text style={styles.lightText}>{type}</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.placeholder}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholder={'Name'}
                        placeholderTextColor={'grey'}
                    />
                    <TextInput
                        style={styles.placeholder}
                        value={city}
                        onChangeText={(text) => setCity(text)}
                        placeholder={'City'}
                        placeholderTextColor={'grey'}
                    />
                    <TextInput
                        style={styles.placeholder}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder={'Email address'}
                        placeholderTextColor={'grey'}
                    />
                    <TextInput
                        style={styles.placeholder}
                        value={phone}
                        onChangeText={(text) => setPhone(text)}
                        placeholder={'Phone Number'}
                        placeholderTextColor={'grey'}
                    />
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    )
};
export default Apply;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: MARGIN_TOP
    },
    creatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15
    },
    imageContainer: {
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: LIGHTGREY,
        borderWidth: 1.5,
        overflow: 'hidden'
    },
    image: {
        height: 60,
        width: 60,
        borderRadius: 30,
        resizeMode: 'contain'
    },
    creatorDetails: {
        marginHorizontal: 10
    },
    creatorTitle: {
        fontSize: 15
    },
    lightText: {
        color: 'grey',
        fontSize: 12
    },
    formContainer: {
        padding: 15,
        backgroundColor: '#fff'
    },
    placeholder: {
        borderColor: BORDERCOLOR,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        height: 60,
        marginVertical: 8,
        width: SCREEN_WIDTH - 30
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
    sendButton: {
        width: SCREEN_WIDTH - 30,
        marginVertical: 0,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: FORESTGREEN,
        borderRadius: 5
    },
    sendButtonTitle: {
        color: '#fff'
    },
})