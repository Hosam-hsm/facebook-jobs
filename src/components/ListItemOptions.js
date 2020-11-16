import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import BottomSheet from 'reanimated-bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LIGHTGREY } from "../constants/Colors";
import Animated from "react-native-reanimated";
import { observer } from "mobx-react";
import { useStore } from "../store/store";

const ListItemOptions = ({ handleRef, jobId }) => {
    const sheetRef = useRef()
    const store = useStore()
    let fall = useRef(new Animated.Value(1)).current

    useEffect(() => {
        handleRef(sheetRef) // pass sheetRef to jobs page
    }, []);

    const onPress = () => {
        store.hideJob(jobId)
    }

    const renderContent = () => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={styles.content}>
                <TouchableOpacity
                    onPress={onPress}
                    style={styles.minusButton}>
                    <MaterialCommunityIcons style={{ transform: [{ rotate: '-45deg' }] }} name="minus-circle" size={24} color={'#000'} />
                </TouchableOpacity>
                <View style={{ marginLeft: 15 }}>
                    <Text>Hide Job</Text>
                    <Text style={styles.lightText}>See fewer jobs like this in the future.</Text>
                </View>
            </TouchableOpacity>
        )
    };

    const renderShadow = () => {
        const animatedShadowOpacity = Animated.interpolate(fall, {
            inputRange: [0, 1],
            outputRange: [0.5, 0],
        })

        return (
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.shadowContainer,
                    {
                        opacity: animatedShadowOpacity,
                    },
                ]}
            >
            </Animated.View>
        )
    }

    return (
        <>
            <BottomSheet
                ref={sheetRef}
                callbackNode={fall}
                isBackDrop={true}
                enabledContentTapInteraction
                snapPoints={[100, 0]}
                initialSnap={1}
                renderContent={renderContent}
            />
            {renderShadow()}
        </>
    )
};
export default observer(ListItemOptions);

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#ffff',
        padding: 15,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    minusButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: LIGHTGREY,
        alignItems: 'center',
        justifyContent: 'center'
    },
    lightText: {
        color: 'grey'
    },
    shadowContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },

})