import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ItemSeperator } from "../components";
import { useStore } from "../store/store";
import { BLUE } from "../constants/Colors";

moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "s",
        m: "1 min",
        mm: "%d min",
        h: "1 h",
        hh: "%d h",
        d: "1 d",
        dd: "%d d",
        M: "1 mth",
        MM: "%d mth",
        y: "1 y",
        yy: "%d y"
    }
}); // to convert 'days ago' into 'd'

const ListItem = ({ application }) => {
    const store = useStore()
    const { applicationId, jobTitle, appliedOn, applicantDetails, contacted } = application
    const [alreadyContacted, setAlreadyContacted] = useState(contacted)
    const { name, city, email, phone } = applicantDetails

    const toggleContacted = () => {
        setAlreadyContacted(!alreadyContacted)
        alreadyContacted ? store.setAsNotContacted(applicationId) : store.setAsContacted(applicationId)
    }

    return (
        <View style={styles.listItem}>
            <View style={{ flex: 2 }}>
                <Text numberOfLines={1} style={styles.lightText}>{jobTitle}</Text>
                <Text style={styles.name}>{name}</Text>
                <Text>{moment(appliedOn, "YYYY-MM-DD").fromNow(true).split(' ').join('')} · {city}</Text>
                <Text>{phone}</Text>
                <Text>{email}</Text>
            </View>
            <TouchableOpacity
                onPress={toggleContacted}
                activeOpacity={0.8}
                style={styles.contactedButtonContainer}>
                <MaterialCommunityIcons
                    name={alreadyContacted ? "checkbox-marked-circle" : "checkbox-marked-circle-outline"}
                    size={20}
                    color={alreadyContacted ? BLUE : 'grey'}
                />
                <Text style={[styles.contactedButton, { color: alreadyContacted ? BLUE : 'grey' }]}>{alreadyContacted ? 'contacted' : 'set contacted'}</Text>
            </TouchableOpacity>
        </View>
    )
};


const JobApplications = ({ }) => {
    const store = useStore()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [hasMoreToLoad, setHasMoreToLoad] = useState(true)
    const [data, setData] = useState([])

    // useEffect(() => {
    // setLoading(true)
    // store.getApplications().then((response) => {
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
                data={store.applications}
                ItemSeparatorComponent={ItemSeperator}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <ListItem key={item.id} application={item} />}
            />
        </View>
    )
};
export default JobApplications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    lightText: {
        color: 'grey'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 15
    },
    contactedButtonContainer: {
        padding: 8,
        flex: 1.5,
        alignItems: 'center',
    },
    contactedButton: {
        marginHorizontal: 3
    }
})