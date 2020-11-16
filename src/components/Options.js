import React, { useEffect, useState } from "react";
import {
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useStore } from "../store/store";
import { observer } from "mobx-react";


const OPTIONS = [
    {
        "title": "Save Job",
        "icon": "bookmark-outline"
    },
    {
        "title": "Share",
        "icon": "share-outline"
    },
    {
        "title": "More",
        "icon": "dots-horizontal-circle-outline"
    },
]

const Option = observer(({ title, icon, displayedJob }) => {
    const [saved, setSaved] = useState(false)
    const [selectedShareIndex, setSelectedShareIndex] = useState(null)
    const [selectedMoreIndex, setSelectedMoreIndex] = useState(null)
    const store = useStore()
    const { showActionSheetWithOptions } = useActionSheet();

    const updateShareIndex = (selectedIndex) => setSelectedShareIndex(selectedIndex); //Do actions with selected index from share action sheet

    const updateMoreIndex = (selectedIndex) => setSelectedMoreIndex(selectedIndex); //Do actions with selected index from more action sheet

    const onOpenActionSheet = (title) => {
        const options = title == 'Share' ? ['Send in Messenger', 'Write post', 'Send on Whatsapp', 'Copy link', 'Share QR code', 'Cancel'] : ['Visit Page', 'Report job', 'Cancel']
        const destructiveButtonIndex = title == 'Share' ? null : 1;
        const cancelButtonIndex = title == 'Share' ? 5 : 2;
        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
            },
            buttonIndex => {
                title == 'Share' ? updateShareIndex(buttonIndex) : updateMoreIndex(buttonIndex)
            }
        );
    };

    const toggleBookmark = () => {
        if (saved) {
            store.unsaveJob(displayedJob.id)
            setSaved(false)
        }
        else {
            store.saveJob(displayedJob.id)
            setSaved(true)
        }
    }

    useEffect(() => {
        if (displayedJob.saved) setSaved(true)
    }, [])

    if (title == 'Save Job') {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleBookmark()}
                style={styles.option}>
                <MaterialCommunityIcons name={saved ? 'bookmark' : 'bookmark-outline'} size={30} color={'grey'} />
                <Text style={styles.optionTitle}>{saved ? 'Saved' : title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onOpenActionSheet(title)}
            style={styles.option}>
            <MaterialCommunityIcons name={icon} size={30} color={'grey'} />
            <Text style={styles.optionTitle}>{title}</Text>
        </TouchableOpacity>
    )
})

const Options = ({ displayedJob }) => {
    return (
        <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{ flex: 1, justifyContent: 'space-around' }}
            style={styles.container}>
            {
                OPTIONS.map(({ title, icon }, index) => {
                    return (
                        <Option key={index} title={title} icon={icon} displayedJob={displayedJob} />
                    )
                })
            }

        </ScrollView>
    )
};
export default observer(Options);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    option: {
        margin: 5,
        alignItems: 'center'
    },
    optionTitle: {
        fontSize: 12,
        color: 'grey'
    }
})