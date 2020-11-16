import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    SafeAreaView,
    Alert,
    Text
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react";
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Header } from "../components";
import { BORDERCOLOR, LIGHTGREY } from "../constants/Colors";
import { MARGIN_TOP, SCREEN_WIDTH } from "../constants/Layout";
import { useStore } from "../store/store";
import { GOOGLEAPIKEY } from "../constants/Keys";

const SALARYTYPES = [
    { label: 'per hour', value: 'per hour' },
    { label: 'per day', value: 'per day' },
    { label: 'per month', value: 'per month' },
]

const JOBTYPES = [
    { label: 'Full-time', value: 'Full-time' },
    { label: 'Part-time', value: 'Part-time' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Volunteer', value: 'Volunteer' },
    { label: 'Contract', value: 'Contract' },
]

const CreateJob = ({ route }) => {
    const job = route.params ? route.params.job : null //for editing a job 
    const store = useStore()
    const navigation = useNavigation()
    const [creatorName, setCreatorName] = useState(job ? job.creatorName : store.user.name);
    const [salaryType, setSalaryType] = useState(job?.salaryType ? job.salaryType : null);
    const [jobType, setJobType] = useState(job?.jobType ? job.jobType : null);
    const [jobTitle, setJobTitle] = useState(job ? job.jobTitle : null);
    const [description, setDescription] = useState(job ? job.description : null);
    const [reversedLoc, setReversedLoc] = useState(null);
    const [loc, setLoc] = useState(null);
    const [email, setEmail] = useState(job?.email ? job.email : null);
    const [minimumSalary, setMinimumSalary] = useState(job?.minimumSalary ? job.minimumSalary : null);
    const [maximumSalary, setMaximumSalary] = useState(job?.maximumSalary ? job.maximumSalary : null);
    const [isVisibleA, setIsVisibleA] = useState(false)
    const [isVisibleB, setIsVisibleB] = useState(false)

    const onPost = () => {
        if (
            jobTitle !== null &&
            description !== null &&
            loc !== null
        ) {
            let location = {
                "latitude": loc.lat,
                "longitude": loc.lng
            }
            let jobDetails = {
                creatorName,
                jobTitle,
                description,
                location,
                salaryType,
                minimumSalary,
                maximumSalary,
                jobType,
                email
            }
            job ? store.updateJob(job.id, jobDetails) : store.postJob(jobDetails)
            navigation.navigate('ManageJobs')
        }
        else {
            Alert.alert('Some fields are missing')
        }
    }

    const changeVisibility = (state) => {
        if (state === "A") {
            setIsVisibleB(false);
            setIsVisibleA(true);
        }
        if (state === "B") {
            setIsVisibleA(false);
            setIsVisibleB(true);
        }
    } // for toggling the dropdown picker

    useEffect(() => {
        if (job) {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${job.location.latitude},${job.location.longitude}&key=${GOOGLEAPIKEY}`)
                .then((response) => response.json())
                .then((responseJson) => {
                    let fetchedLoc = responseJson.results[0].address_components[2].long_name
                    setReversedLoc(fetchedLoc)
                })
        }// reverese geocoding for setting location of a job
    }, [job])

    return (
        <SafeAreaView style={styles.container}>
            <Header title={job ? 'Edit Job' : 'Create Job'} textButton={job ? 'Update' : 'Post'} textButtonOnPress={onPost} />

            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={{ paddingBottom: 120 }}
                style={styles.formContainer}>
                <Text style={styles.textInputTitle}>Creator Name</Text>
                <TextInput
                    style={[styles.textInput, { backgroundColor: LIGHTGREY }]}
                    editable={false}
                    placeholder='Posted by'
                    value={creatorName} //should be creator or page name
                />
                <Text style={styles.textInputTitle}>Job Title</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Job Title'
                    value={jobTitle}
                    onChangeText={(text) => setJobTitle(text)}
                />
                <Text style={styles.textInputTitle}>Description</Text>
                <TextInput
                    multiline
                    style={[styles.textInput, { height: 100 }]}
                    placeholder='Job Description'
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                />
                <Text style={styles.textInputTitle}>Location</Text>
                <GooglePlacesAutocomplete
                    fetchDetails
                    placeholder={reversedLoc ? reversedLoc : 'Location'}
                    onPress={(data, details = null) => {
                        setLoc(details.geometry.location)
                    }}
                    query={{
                        key: GOOGLEAPIKEY,
                        language: 'en',
                    }}
                    styles={{
                        textInput: styles.textInput
                    }}
                />
                <Text style={styles.textInputTitle}>Salary Type</Text>
                <DropDownPicker
                    items={SALARYTYPES}
                    zIndex={5000}
                    dropDownStyle={{ backgroundColor: '#fff' }}
                    defaultIndex={0}
                    defaultValue={salaryType}
                    placeholder="Salary Type"
                    containerStyle={styles.dropdown}
                    style={{ padding: 4 }}
                    onChangeItem={item => setSalaryType(item.value)}
                    isVisible={isVisibleA}
                    onOpen={() => changeVisibility("A")}
                    onClose={() => setIsVisibleA(false)}
                />

                <View style={styles.salaryContainer}>
                    <View>
                        <Text style={styles.textInputTitle}>Minimum Salary</Text>
                        <TextInput
                            style={styles.salaryTextInput}
                            keyboardType={'number-pad'}
                            placeholder='Minimum Salary'
                            value={minimumSalary}
                            onChangeText={(text) => setMinimumSalary(text)}
                        />
                    </View>
                    <View>
                        <Text style={styles.textInputTitle}>Maximum Salary</Text>
                        <TextInput
                            style={styles.salaryTextInput}
                            keyboardType={'number-pad'}
                            placeholder='Maximum Salary'
                            value={maximumSalary}
                            onChangeText={(text) => setMaximumSalary(text)}
                        />
                    </View>
                </View>

                <Text style={styles.textInputTitle}>Job Type</Text>
                <DropDownPicker
                    items={JOBTYPES}
                    defaultIndex={0}
                    defaultValue={jobType}
                    zIndex={4000}
                    dropDownStyle={{ backgroundColor: '#fff' }}
                    placeholder="Job Type"
                    containerStyle={styles.dropdown}
                    style={{ padding: 4 }}
                    onChangeItem={item => setJobType(item.value)}
                    isVisible={isVisibleB}
                    onOpen={() => changeVisibility("B")}
                    onClose={() => setIsVisibleB(false)}
                />
                <Text style={[styles.textInputTitle, { marginTop: 15 }]}>Email</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Receive Applications by email'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
            </KeyboardAwareScrollView>

        </SafeAreaView>
    )
};
export default observer(CreateJob);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: MARGIN_TOP
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15
    },
    dropdown: {
        marginTop: 5,
    },
    textInputTitle: {
        fontWeight: '600',
        paddingHorizontal: 3
    },
    textInput: {
        padding: 10,
        marginBottom: 15,
        marginTop: 5,
        borderWidth: 1,
        borderColor: BORDERCOLOR,
        borderRadius: 10
    },
    salaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    salaryTextInput: {
        marginVertical: 5,
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: BORDERCOLOR,
        borderRadius: 10,
        width: SCREEN_WIDTH / 2 - 20,
    },
    predictionsContainer: {
        // height: 100,
        // width: '100%',
        // backgroundColor: 'red'
    },
    prediction: {
        padding: 15,
        marginHorizontal: 15,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: BORDERCOLOR,
        backgroundColor: "#fff"
    },
    predictionText: {
        marginHorizontal: 5,
        fontWeight: 'bold'
    }
})