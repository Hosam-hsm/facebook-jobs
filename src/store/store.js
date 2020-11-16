import React from "react";
import { observable, action, computed, makeObservable } from 'mobx'
import axios from 'axios'

const API_URL = 'xyz.com' //should be an environment variable

export default class Store {

    constructor() {
        makeObservable(this)
    }

    @observable user = {
        "id": "84564",
        "name": "Creator Name",
        "email": "hvkk@gmail.com",
        "savedJobs": [],
        "appliedJobs": [],
        "interviews": [],
        "preferences": []
    }
    @observable gettingJobs = false
    @observable jobs = []
    @observable jobDetails = {
        "id": "45758758",
        "title": "Health Care Assistant",
        "category": "Healthcare",
        "center": "Evanshi Nutrition Center",
        "location": "Quilandy",
        "type": "Part-time",
        "salary": "₹1,000/day",
        "posted": "2020-10-01",
        "saved": true,
        "applied": true,
        "coordinates": {
            "latitude": "11.4429",
            "longitude": "75.6976",
        },
        "imageUrl": "https://picsum.photos/200/300",
        "details": "Free training. No investment. Just 2 or 3 hours work. Need Internet and android mobile. Communication skill.",
        "creator": {
            "id": "4646464",
            "imageUrl": "https://picsum.photos/30/30",
            "title": "Evanshi Nutrition Center",
            "category": "Health/beauty"
        },
    }
    @observable location = {}
    @observable categories = []
    @observable jobTypes = []
    @observable interviews = []
    @observable appliedJobs = []
    @observable savedJobs = []
    @observable jobPosts = [
        {
            "id": "1",
            "jobTitle": "Personal Assistant",
            "imageUrl": "https://picsum.photos/30/30",
            "newApplications": 2,
            creatorName: "abc",
            description: "fsdfsdf sadfsd sadf ",
            location: {
                "latitude": "11.4429",
                "longitude": "75.6976"
            },
            salaryType: "per hour",
            minimumSalary: "2000",
            maximumSalary: "4000",
            jobType: "Full-time",
            email: "abc@gmail.com"
        },
        {
            "id": "2",
            "jobTitle": "Personal Assistant",
            "imageUrl": "https://picsum.photos/30/30",
            "newApplications": 2,
            creatorName: "abc",
            description: "fsdfsdf sadfsd sadf ",
            location: {
                "latitude": "11.4429",
                "longitude": "75.6976"
            },
            salaryType: "per hour",
            minimumSalary: "2000",
            maximumSalary: "4000",
            jobType: "Full-time",
            email: "abc@gmail.com"
        },
    ]

    @observable applications = [
        {
            "applicationId": "1",
            "jobTitle": "PERSONAL ASSISTANT",
            "appliedOn": "2020-10-01",
            "contacted": true,
            "applicantDetails": {
                "name": "Ella Micek",
                "city": "Bangalore",
                "email": "fsfg@gmail.com",
                "phone": "987654321"
            },
        },
        {
            "applicationId": "2",
            "jobTitle": "PERSONAL ASSISTANT",
            "appliedOn": "2020-10-01",
            "contacted": false,
            "applicantDetails": {
                "name": "Ella Micek",
                "city": "Bangalore",
                "email": "fsfg@gmail.com",
                "phone": "987654321"
            },
        },
    ]

    @action async getJobs(offset) {
        this.gettingJobs = true
        let url = `https://${API_URL}/getJobs?location=${this.location}&categories=${this.categories}&jobTypes=${this.jobTypes}&offset=${offset}`;
        await axios.get(url)
            .then(response => {
                this.jobs = response.data
                this.gettingJobs = false
            }).catch(error => {
                console.log(error)
                this.gettingJobs = false
            })
    }

    @action getJobDetails(userId, jobId) {

    }

    @action setLocation(region, radius) {
        const { latitudeDelta, longitudeDelta, ...restData } = region //only need latitude and longitude
        restData.radius = radius
        this.location = restData
        this.getJobs(1) //to refresh first page with new conditions
    }

    @action setCategory(category) {
        let selectedList = []
        selectedList.push(category)
        this.categories = selectedList
        this.getJobs(1)
    } // for search suggestion - only one category

    @action setCategories(categories) {
        let selectedList = []
        categories.map(category => {
            selectedList.push(category.value)
        })
        this.categories = selectedList
        this.getJobs(1)
    }

    @action setJobTypes(jobTypes) {
        let selectedList = []
        jobTypes.map(jobType => {
            selectedList.push(jobType.value)
        })
        this.jobTypes = selectedList
        this.getJobs(1)
    }

    @action getInterviews(userDetails) {

    }

    @action getAppliedJobs(userId) {

    }

    @action getSavedJobs(userId) {

    }

    @action getJobPosts(userId) {

    }

    @action getApplications(userId) {

    }

    @action updateJob(jobId, jobDetails) {

    }

    @action deleteJob(jobId) {
        this.jobPosts = this.jobPosts.filter(job => job.id !== jobId)
    }

    @action setAsContacted(id) {

    }

    @action setAsNotContacted(id) {

    }

    @action applyJob(userId, jobId, userDetails) {

    }

    @action hideJob(jobId) {
        this.jobs = this.jobs.filter(job => job.id !== jobId)
    }

    @action saveJob(displayedJob) {
        this.savedJobs.push(displayedJob)
    }

    @action unsaveJob(displayedJob) {
        this.savedJobs = this.savedJobs.filter(job => job.id !== displayedJob.id)
    }

    @action postJob(jobDetails) {
        //post job with userId and jobDetails

    }

    @computed get getCategoriesTitle() {
        if (this.categories.length == 0) return 'Category'
        let count = (this.categories.length - 1)
        if (count > 0) return this.categories[0] + '+' + count
        else return this.categories[0]
    }

    @computed get getJobTypesTitle() {
        if (this.jobTypes.length == 0) return 'Job Type'
        let count = (this.jobTypes.length - 1)
        if (count > 0) return this.jobTypes[0] + '+' + count
        else return this.jobTypes[0]
    }
}

const StoreContext = React.createContext();

export const StoreProvider = ({ children, store }) => {
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

/* Hook to use store in any functional component */
export const useStore = () => React.useContext(StoreContext);


