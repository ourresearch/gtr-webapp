<template>
    <div class="root">
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


</template>

<script>
    import axios from 'axios'

    export default {
        name: "Serp",
        data: () => ({
            foo: "bar",
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
            axios.get(this.apiUrl)
                .then(resp => {
                    this.results = resp.data.results
                })
                .catch(e => {
                    console.log("error from server", e)
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