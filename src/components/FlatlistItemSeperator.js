import React from "react";
import {
    View,
    StyleSheet,
} from "react-native";
import { BORDERCOLOR } from "../constants/Colors";
import { SCREEN_WIDTH } from "../constants/Layout";

const ItemSeperator = () => {
    return (
        <View style={styles.container} />
    )
}
export default ItemSeperator;

const styles = StyleSheet.create({
    container: {
        height: 0.5,
        backgroundColor: BORDERCOLOR,
        marginHorizontal: 15,
        width: SCREEN_WIDTH - 30
    }
})