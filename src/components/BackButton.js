import React from "react";
import {
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BackButton = ({ onPress, top, left }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity
            onPress={onPress ? onPress : () => navigation.dispatch(CommonActions.goBack())}
            style={[styles.container, { top, left }]}>
            <Ionicons name="ios-arrow-back" size={26} color="#000" />
        </TouchableOpacity>
    )
};
export default BackButton;

const styles = StyleSheet.create({
    container: {
        height: 30,
        width: 30,
        borderRadius: 15,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        zIndex: 2000,
    }
})