import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { BLUE, BORDERCOLOR } from "../constants/Colors";
import { Ionicons } from '@expo/vector-icons';

const Header = ({ title, textButton, textButtonOnPress }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Ionicons name="ios-arrow-back" size={26} color="#000" />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.headerText}>{title}</Text>
            {
                textButton ?
                    (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.textButtonContainer}
                            onPress={textButtonOnPress}
                        >
                            <Text style={styles.textButton}>{textButton}</Text>
                        </TouchableOpacity>
                    )
                    :
                    <View style={styles.textButtonContainer} />
            }
        </View>
    )
}
export default Header;

const styles = StyleSheet.create({
    header: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: BORDERCOLOR
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    backButton: {
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center'
    },
    textButtonContainer: {
        alignItems: 'flex-end'
    },
    textButton: {
        color: BLUE,
        fontWeight: 'bold'
    }
})