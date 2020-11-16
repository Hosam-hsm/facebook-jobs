import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import { ItemSeperator } from "../components";
import { BLUE, BORDERCOLOR, LIGHTGREY } from "../constants/Colors";
import { SCREEN_WIDTH } from "../constants/Layout";
import { useStore } from "../store/store";

const ListItem = ({ job }) => {
    const navigation = useNavigation();
    const store = useStore()
    const { id, imageUrl, jobTitle, newApplications } = job
    return (
        <View style={styles.listItem}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
            <View>
                <Text numberOfLines={1} style={styles.title}>{jobTitle}</Text>
                <Text style={styles.lightText}>{newApplications} new applications</Text>
            </View>
            <View style={{}}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => store.deleteJob(id)}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('CreateJob', { job })}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const JobPosts = ({ }) => {
    const store = useStore()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [hasMoreToLoad, setHasMoreToLoad] = useState(true)
    const [data, setData] = useState([])

    // useEffect(() => {
    // setLoading(true)
    // store.getJobPosts().then((response) => {
    //     setData([...data, ...response]);
    //     setLoading(false);
    // })
    //     .catch((error) => {
    //         setLoading(false)
    //     });
    // }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={store.jobPosts}
                ItemSeparatorComponent={ItemSeperator}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <ListItem key={item.id} job={item} />}
            />
        </View>
    )
};
export default observer(JobPosts);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionTitleContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 0.5,
        borderColor: BORDERCOLOR
    },
    sectionTitle: {
        fontWeight: 'bold',
    },
    listItem: {
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        paddingVertical: 10,
        backgroundColor: '#fff'
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: SCREEN_WIDTH / 2
    },
    lightText: {
        color: 'grey',
        fontSize: 13,
    },
    button: {
        padding: 8
    },
    buttonText: {
        color: BLUE,
        fontWeight: '600'
    }
})