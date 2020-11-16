import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import BackButton from "./BackButton";
import { BORDERCOLOR, LIGHTGREY } from "../constants/Colors";
import { useStore } from "../store/store";
import { CATEGORIES } from "../constants/Lists";
import { observer } from "mobx-react";

const Search = ({ }) => {
    const [searchText, setSearchText] = useState(null)
    const [focused, setFocused] = useState(false)
    const [suggestions, setSuggestions] = useState()

    const Suggestion = ({ category }) => {
        const store = useStore()
        const onPress = () => {
            store.setCategory(category)
            Keyboard.dismiss()
            setSearchText('')
        }
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.suggestion}
                onPress={onPress}
            >
                <Text>{category}</Text>
                <Ionicons name={'ios-arrow-forward'} size={25} color={'grey'} />
            </TouchableOpacity>
        )
    }

    const SearchSuggestions = ({ }) => {
        return (
            <ScrollView
                keyboardShouldPersistTaps='always'
                style={styles.suggestions}
            >
                <View style={styles.headerContainer}><Text style={styles.headertext}>Category</Text></View>
                {
                    suggestions.map((category, index) => {
                        return <Suggestion category={category} key={index} />
                    })
                }
            </ScrollView>
        )
    }

    const onFocus = () => {
        setFocused(true)
    }

    const onBlur = () => {
        setFocused(false)
        setSearchText('')
    }

    const onTextChange = (text) => {
        let filteredSuggestions = CATEGORIES.filter(suggestion => suggestion.includes(searchText))
        setSuggestions(filteredSuggestions)
        setSearchText(text)
    }

    useEffect(() => {
        //load suggestions from backend
        setSuggestions(CATEGORIES)
    }, [focused])

    return (
        <>
            <View style={styles.placeholderContainer}>
                <BackButton onPress={() => Keyboard.dismiss()} top={20} left={8} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {focused ? null : <Ionicons name="ios-search" size={22} style={styles.searchIcon} color="grey" />}
                    <TextInput
                        placeholder={'Search jobs'}
                        placeholderTextColor={'grey'}
                        style={[styles.placeholder, { paddingLeft: !focused ? 40 : 10 }]}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        clearButtonMode={'while-editing'}
                        value={searchText}
                        onChangeText={onTextChange}
                    />
                </View>
            </View>
            {
                focused ?
                    <SearchSuggestions />
                    : null
            }
        </>
    )
};
export default observer(Search);

const styles = StyleSheet.create({
    placeholderContainer: {
        height: 60,
        width: '100%',
        padding: 14,
        borderBottomWidth: 0.3,
        borderBottomColor: BORDERCOLOR,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    searchIcon: {
        top: 8,
        left: 46,
        position: 'absolute',
        zIndex: 1000
    },
    placeholder: {
        backgroundColor: LIGHTGREY,
        marginLeft: 32,
        height: 35,
        flex: 1,
        fontSize: 16,
        borderRadius: 16
    },
    suggestions: {
        ...StyleSheet.absoluteFillObject,
        top: 70,
        backgroundColor: '#fff',
        zIndex: 1000,
    },
    suggestion: {
        padding: 15,
        marginHorizontal: 15,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: BORDERCOLOR,
        backgroundColor: "#fff"
    },
    headerContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: BORDERCOLOR
    },
    headertext: {
        fontSize: 14,
        fontWeight: 'bold',
    }
})