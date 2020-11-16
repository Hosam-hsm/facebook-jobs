import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import React from "react";
import {
    StyleSheet,
    SafeAreaView,
} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Header } from "../components";
import { MARGIN_TOP } from "../constants/Layout";
import JobApplications from "./JobApplications";
import JobPosts from "./JobPosts";
import { BLUE } from "../constants/Colors";

const Tab = createMaterialTopTabNavigator();

function Tabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                labelStyle: {
                    textTransform: 'none',
                    fontSize: 15,
                    fontWeight: '600'
                },
                activeTintColor: BLUE,
                inactiveTintColor: 'grey'
            }}
            initialRouteName="JobPosts"
        >
            <Tab.Screen name="Applications" options={{ tabBarLabel: 'Applications' }} component={JobApplications} />
            <Tab.Screen name="JobPosts" options={{ tabBarLabel: 'Job posts' }} component={JobPosts} />
        </Tab.Navigator>
    );
}

const ManageJobs = ({ }) => {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <Header title={'Manage Jobs'} textButton={'Create'} textButtonOnPress={() => navigation.navigate('CreateJob')} />
            <Tabs />
        </SafeAreaView>
    )
};
export default observer(ManageJobs);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: MARGIN_TOP
    }
})