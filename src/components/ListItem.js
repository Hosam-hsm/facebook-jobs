import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { FORESTGREEN, LIGHTGREY } from "../constants/Colors";
import { observer } from "mobx-react";

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

const ListItem = ({ job, apply, status }) => {
    const navigation = useNavigation();
    const { imageUrl, title, type, salary, posted, center, location } = job

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('JobDetails', { job })}
            style={styles.container}>

            {(apply || status) ? (<View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>) : null}

            <View style={{ flex: 1, maxWidth: (apply || status) ? '40%' : '80%' }}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.lightText}>{type}</Text>
                    {
                        salary ?
                            <Text numberOfLines={1} style={styles.salary}> · {salary}</Text>
                            :
                            null
                    }
                </View>
                <View style={styles.row}>
                    <Text>{moment(posted, "YYYY-MM-DD").fromNow(true).split(' ').join('')}</Text>
                    <Text numberOfLines={1} style={styles.lightText}> · {center}</Text>

                </View>
                <Text numberOfLines={1} style={styles.lightText}>{location}</Text>
            </View>

            {
                apply ? (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Apply', { job })}
                        style={styles.applyButton}>
                        <Text>Apply</Text>
                    </TouchableOpacity> // for saved jobs
                )
                    :
                    status ? (
                        <View style={styles.status}>
                            <Text style={{ color: 'grey' }}>{status}</Text>
                        </View> // for applied jobs
                    ) : null
            }
        </TouchableOpacity>
    )
};
export default observer(ListItem);

const styles = StyleSheet.create({
    container: {
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
        fontWeight: 'bold'
    },
    lightText: {
        color: 'grey',
        fontSize: 13,
        maxWidth: '70%'
    },
    salary: {
        color: FORESTGREEN,
        maxWidth: 200
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1
    },
    options: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    applyButton: {
        padding: 8,
        borderRadius: 5,
        backgroundColor: LIGHTGREY
    }
})