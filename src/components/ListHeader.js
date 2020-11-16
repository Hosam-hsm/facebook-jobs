import React from "react";
import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Animated, { Extrapolate, interpolate } from "react-native-reanimated";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BORDERCOLOR, DARKGREY, LIGHTGREY } from "../constants/Colors";
import { observer } from "mobx-react";
import { useStore } from "../store/store";

const HEADER_MAX_HEIGHT = 120
const HEADER_MIN_HEIGHT = 60


const FirstSliderItems = [
    {
        "icon": "briefcase",
        "title": "Manage",
    },
    {
        "icon": "plus-circle",
        "title": "Create Job",
    },
    {
        "icon": "bookmark",
        "title": "Your Jobs",
    },
]

const FirstSlider = ({ item }) => {
    const navigation = useNavigation();
    const onPressFirstSliderItem = () => {
        switch (item.icon) {
            case 'briefcase':
                navigation.navigate('ManageJobs')
                break;
            case 'plus-circle':
                navigation.navigate('CreateJob')
                break;
            case 'bookmark':
                navigation.navigate('YourJobs')
                break;
            default:
                return;
        }
    }
    return (
        <TouchableOpacity
            onPress={onPressFirstSliderItem}
            style={styles.firstSlider}>
            <MaterialCommunityIcons name={item.icon} size={20} style={styles.icon} color={DARKGREY} />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    )
}


const ListHeader = ({ scrollY, handleClick }) => {
    const store = useStore()
    const onClickHandler = (button) => {
        handleClick(button)
    }
    const navigation = useNavigation()
    const translateY = interpolate(scrollY,
        {
            inputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT)],
            outputRange: [0, -HEADER_MIN_HEIGHT],
            extrapolate: Extrapolate.CLAMP
        });

    return (
        <Animated.View style={[styles.container, { height: HEADER_MAX_HEIGHT, transform: [{ translateY }] }]}>
            <ScrollView
                contentContainerStyle={{ padding: 10 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {FirstSliderItems.map((item, index) => <FirstSlider key={index} item={item} />)}
            </ScrollView>

            <ScrollView
                contentContainerStyle={{ padding: 10 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('Location')}
                    style={styles.secondSlider}>
                    <Text style={styles.title}>Location</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onClickHandler('category')}
                    style={styles.secondSlider}>
                    <Text style={styles.title}>{store.getCategoriesTitle}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onClickHandler('jobType')}
                    style={styles.secondSlider}>
                    <Text style={styles.title}>{store.getJobTypesTitle}</Text>
                </TouchableOpacity>
            </ScrollView>
        </Animated.View>
    )
};
export default observer(ListHeader);

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomColor: BORDERCOLOR,
        borderBottomWidth: 0.3,
        paddingBottom: 5
    },
    firstSlider: {
        margin: 3,
        height: 38,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: LIGHTGREY
    },
    icon: {
        marginRight: 5,
    },
    title: {
        color: DARKGREY,
        fontWeight: '700'
    },
    secondSlider: {
        margin: 3,
        height: 38,
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: BORDERCOLOR
    },
})