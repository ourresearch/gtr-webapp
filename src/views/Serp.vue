<template>
    <div class="root">

        <div class="loaded" v-if="!loading">
            <ul>
                <li v-for="result of results">
                    {{result.title}}
                </li>
            </ul>
            <div class="page-bottom">
                <a :href="apiUrl">
                    View in API
                </a>
            </div>
        </div>

        <div class="loading" v-if="loading">
            <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        </div>
    </div>


</template>

<script>
    import axios from 'axios'

    export default {
        name: "Serp",
        data: () => ({
            loading: true,
            results: []
        }),
        computed: {
            apiUrl(){
                let searchTerm = this.$route.params.q
                let url = "https://api.unpaywall.org/search/" + searchTerm
                return url
            }
        },
        methods: {
            doQuery(){
                console.log("doing query")
                this.loading = true
                axios.get(this.apiUrl)
                    .then(resp => {
                        this.results = resp.data.results
                        this.loading = false
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        this.loading = false
                    })
            }
        },
        mounted() {
            this.doQuery()
        },
        watch: {
            "$route"(to, from){
                console.log("route change", to, from)
                this.doQuery()
            }
        }
    }
</script>

<style scoped>
</style>