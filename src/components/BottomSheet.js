import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import BottomSheet from 'reanimated-bottom-sheet';
import SelectMultiple from 'react-native-select-multiple'
import { BLUE, BORDERCOLOR, LIGHTGREY } from "../constants/Colors";
import { SCREEN_HEIGHT } from "../constants/Layout";
import { useStore } from "../store/store";
import { observer } from "mobx-react";
import Animated from "react-native-reanimated";

const Button = ({ disabled, title, onPress, bgColor, titleColor }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={[styles.button, { backgroundColor: bgColor }]}>
            <Text style={[styles.buttonTitle, { color: titleColor }]}>{title}</Text>
        </TouchableOpacity>
    )
}

const BottomSheetComponent = ({ type, handleRef, selectionList }) => { // 'type' is passed only to check whether to show categories or job types
    const sheetRef = useRef()
    const store = useStore()
    const [selectedCategories, setSelectedCategories] = useState()
    const [selectedJobTypes, setSelectedJobTypes] = useState()
    let fall = useRef(new Animated.Value(1)).current

    useEffect(() => {
        handleRef(sheetRef) // pass sheetRef to jobs page
        type == 'category' ? setSelectedCategories(store.categories) : setSelectedJobTypes(store.jobTypes)
    }, []);

    const onSelectionsChange = (selectedItems) => {
        type == 'category' ? setSelectedCategories(selectedItems) : setSelectedJobTypes(selectedItems)
    }

    const onPressCancel = () => {
        sheetRef.current.snapTo(1)
        type == 'category' ? setSelectedCategories(store.categories) : setSelectedJobTypes(store.jobTypes)
    }

    const onPressApply = () => {
        type == 'category' ? store.setCategories(selectedCategories) : store.setJobTypes(selectedJobTypes)
        sheetRef.current.snapTo(1)
    }

    const onPressReset = () => {
        type == 'category' ? setSelectedCategories([]) : setSelectedJobTypes([])
    }

    const renderHeader = () => (
        <View style={styles.header}>
            <Text onPress={onPressCancel} style={styles.textButton}>Cancel</Text>
            <Text onPress={onPressReset} style={[styles.textButton, { color: BLUE }]}>Reset</Text>
        </View>
    );

    const renderContent = () => {
        return (
            <View style={styles.content}>
                <View style={{ maxHeight: 200 }}>
                    <SelectMultiple
                        selectedCheckboxStyle={{ tintColor: "black" }}
                        checkboxStyle={{ tintColor: "black" }}
                        rowStyle={styles.rowStyle}
                        items={selectionList ? selectionList : []}
                        selectedItems={type == 'category' ? selectedCategories : selectedJobTypes}
                        onSelectionsChange={onSelectionsChange} />
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title='Apply'
                        titleColor={'#fff'}
                        bgColor={BLUE}
                        onPress={onPressApply}
                    />
                    <Button
                        title='Cancel'
                        titleColor={'#000'}
                        bgColor={LIGHTGREY}
                        onPress={onPressCancel}
                    />
                </View>
            </View>
        )
    };

    const renderShadow = () => {
        const animatedShadowOpacity = Animated.interpolate(fall, {
            inputRange: [0, 1],
            outputRange: [0.5, 0],
        })
        return (
            <Animated.View
                pointerEvents={'none'}
                style={[
                    styles.shadowContainer,
                    {
                        opacity: animatedShadowOpacity,
                    },
                ]}
            />

        )
    }

    return (
        <>
            <BottomSheet
                ref={sheetRef}
                callbackNode={fall}
                renderHeader={renderHeader}
                snapPoints={[SCREEN_HEIGHT - 20, 0]}
                initialSnap={1}
                renderContent={renderContent}
            />
            {renderShadow()}
        </>
    );
};
export default observer(BottomSheetComponent);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowStyle: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
    },
    content: {
        backgroundColor: '#ffff',
        padding: 16,
        height: SCREEN_HEIGHT - 20,
    },
    header: {
        backgroundColor: '#fff',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: BORDERCOLOR
    },
    textButton: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        padding: 10,
        paddingHorizontal: 40,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    buttonTitle: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    shadowContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
})