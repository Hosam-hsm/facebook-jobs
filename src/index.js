import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    CreateJob,
    ManageJobs,
    Apply,
    Location,
    YourJobs,
    JobDetails,
    JobsScreen
} from './screens';

const Stack = createStackNavigator();

function MainNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="Jobs" component={JobsScreen} />
                <Stack.Screen name="JobDetails" component={JobDetails} />
                <Stack.Screen name="ManageJobs" component={ManageJobs} />
                <Stack.Screen name="CreateJob" component={CreateJob} />
                <Stack.Screen name="YourJobs" component={YourJobs} />
                <Stack.Screen name="Location" component={Location} />
                <Stack.Screen name="Apply" component={Apply} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MainNavigator;
