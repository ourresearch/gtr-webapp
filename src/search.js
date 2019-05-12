import axios from 'axios'

export const search = {
    apiBaseUrl: "https://gtr-api.herokuapp.com/search/",
    loading: false,
    results: [],


    apiQueryUrl: function(){
        const urlParams = new URLSearchParams(window.location.search);

        return this.apiBaseUrl + urlParams.get("q")
            + "?page=" + urlParams.get("page")
            + "&oa=" + urlParams.get("oa")
    },



    fetchResults: function(){

        this.loading = true
        this.results = []
        let request = axios.get(this.apiQueryUrl())
            .then(resp => {
                console.log("got query results back", resp.data)
                this.results = resp.data.results
            })
            .catch(e=> {
                console.log("search error", e)
            })
            .finally(() =>{
                this.loading = false
            })

        return request

    }







}