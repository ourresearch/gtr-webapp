<template>
    <div class="root">


        <h1>SERP {{ foo }}</h1>
        <ul>
            <li v-for="result of results">
                {{result.title}}
            </li>
        </ul>
    </div>


</template>

<script>
    import axios from 'axios'

    export default {
        name: "Serp",
        data: () => ({
            foo: "bar",
            results: []
        }),
        mounted() {
            console.log("hello dan")
            let queryRegex = /\?q=(.+)/
            let m = queryRegex.exec(document.location.href)
            let searchTerm = m[1]


            let url = "https://api.unpaywall.org/search/" + searchTerm
            axios.get(url)
                .then(resp => {
                    console.log("query response", resp.data.results)
                    this.results = resp.data.results
                })
                .catch(e => {
                    console.log("error from server", e)
                })
        }
    }
</script>

<style scoped>
</style>