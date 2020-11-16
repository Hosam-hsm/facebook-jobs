import { observer } from "mobx-react";
import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    FlatList
} from "react-native";
import { MARGIN_TOP } from "../constants/Layout";
import { useStore } from "../store/store";
import { Ionicons } from '@expo/vector-icons';
import { Header, ListItem, ItemSeperator } from "../components";
import { BORDERCOLOR } from "../constants/Colors";

const ListHeaderComponent = ({ sectionTitle }) => {
    const getIcon = () => {
        if (sectionTitle == 'Interviews') return 'ios-calendar'
        if (sectionTitle == 'Applied Jobs') return 'ios-send'
        if (sectionTitle == 'Saved Jobs') return 'ios-bookmark'
    }
    return (
        <View style={styles.sectionTitleContainer}>
            <Ionicons name={getIcon()} size={25} color={'grey'} />
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        </View>
    )
}

const YourJobs = ({ }) => {
    const store = useStore()
    useEffect(() => {
        // store.getSavedjobs()
        // store.getAppliedjobs()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Header title={'Your Jobs'} />
            <ScrollView>
                {/* <FlatList
                    data={store.interviews}
                    contentContainerStyle={{ marginTop: 10 }}
                    ItemSeparatorComponent={ItemSeperator}
                    ListHeaderComponent={<ListHeaderComponent sectionTitle={'Interviews'} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => <ListItem key={item.id} job={item} />}
                /> */}
                <FlatList
                    data={store.appliedJobs}
                    contentContainerStyle={{ marginTop: 10 }}
                    ItemSeparatorComponent={ItemSeperator}
                    ListHeaderComponent={<ListHeaderComponent sectionTitle={'Applied Jobs'} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => <ListItem key={item.id} job={item} status={item.status} />}
                />
                <FlatList
                    data={store.savedJobs}
                    contentContainerStyle={{ marginTop: 10 }}
                    ItemSeparatorComponent={ItemSeperator}
                    ListHeaderComponent={<ListHeaderComponent sectionTitle={'Saved Jobs'} />}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => <ListItem key={item.id} job={item} apply />}
                />

            </ScrollView>
        </SafeAreaView>
    )
};
export default observer(YourJobs);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: MARGIN_TOP
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        paddingLeft: 15,
        borderBottomWidth: 0.5,
        borderColor: BORDERCOLOR
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginLeft: 8
    }

})