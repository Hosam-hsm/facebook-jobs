// Main screen containing list of jobs and options 

import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
} from "react-native";
import * as data from "../../TEST.json";
import { MARGIN_TOP } from "../constants/Layout";
import Animated from "react-native-reanimated";
import { observer } from "mobx-react";
import { useStore } from "../store/store";
import { BottomSheet, ItemSeperator, ListItem, ListHeader, Search } from "../components";
import { CATEGORIES, JOB_TYPES } from "../constants/Lists";

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList)

const JobsScreen = ({ }) => {
    const store = useStore()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [hasMoreToLoad, setHasMoreToLoad] = useState(true)
    const [dataSource, setDataSource] = useState([])
    const [offset, setOffset] = useState(1);
    const [bottomSheetRef, setBottomSheetRef] = useState(null)
    const [selectedHeaderButton, setSelectedHeaderButton] = useState(null)
    const scrollY = useRef(new Animated.Value(0)).current

    const refresh = () => {
        setRefreshing(true)
        store.getJobs(1).then((response) => {
            setDataSource([...response]);
            setOffset(1)
            setHasMoreToLoad(true)
            setRefreshing(false);
        })
            .catch((error) => {
                setRefreshing(false);
            });
    }

    const handleLoadMore = () => {
        setLoading(true)
        setOffset(offset + 1)
        store.getJobs(offset).then((response) => {
            if (response.length == 0) {
                setHasMoreToLoad(false)
            }
            setDataSource([...dataSource, ...response]);
            setLoading(false);
        })
            .catch((error) => {
                setLoading(false);
            });
    };

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={{ height: 40, width: '100%' }}>
                <ActivityIndicator animating size="small" color={'grey'} />
            </View>
        );
    };

    useEffect(() => {
        // setLoading(true)
        // store.getJobs(offset).then((response) => {
        //     setDataSource([...dataSource, ...response]);
        //     setLoading(false);
        // })
        //     .catch((error) => {
        //         setLoading(false)
        //     });
    }, []);

    const handleBottomSheetRef = (sheetRef) => {
        setBottomSheetRef(sheetRef)
    }

    const handleHeaderButtonClick = (button) => {
        setSelectedHeaderButton(button)
        bottomSheetRef?.current.snapTo(0)
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Search />
                <View style={{}}>
                    <AnimatedFlatlist
                        data={data.jobs}
                        stickyHeaderIndices={[0]}
                        contentContainerStyle={{ paddingBottom: 60 }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }]
                        )}
                        // onRefresh={refresh}
                        // refreshing={refreshing}
                        ItemSeparatorComponent={ItemSeperator}
                        ListHeaderComponent={() => <ListHeader scrollY={scrollY} handleClick={handleHeaderButtonClick} />}
                        ListFooterComponent={renderFooter}
                        // onEndReached={hasMoreToLoad ? handleLoadMore : null}
                        onEndReachedThreshold={0.5}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => <ListItem key={item.id} job={item} />}
                    />
                </View>
            </SafeAreaView>

            <BottomSheet
                handleRef={handleBottomSheetRef}
                type={selectedHeaderButton == 'category' ? 'category' : 'jobType'}
                selectionList={selectedHeaderButton == 'category' ? CATEGORIES : JOB_TYPES} />
            {/* for category and job type selection */}

        </>
    )
};
export default observer(JobsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: MARGIN_TOP
    },

})