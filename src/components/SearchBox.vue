<template>
    <v-layout class="searchbox">
            <v-autocomplete
                    v-model="select"
                    :loading="loading"
                    :items="items"
                    :search-input.sync="search"
                    @input="goSearch"
                    @keypress.enter="goSearch(search)"
                    class="mx-3"
                    flat
                    hide-no-data
                    hide-details
                    label="Get the research on..."
                    solo
            ></v-autocomplete>
    </v-layout>


</template>

<script>
    import _ from 'lodash'
    import axios from 'axios'

    export default {
        name: "SearchBox",
        data: () => ({
            select: "",
            loading: false,
            items: [],
            search: ""
        }),
        computed: {
            displayItems(){
                return this.items.slice(0, 6)
            }
        },
        methods: {
            goSearch(q) {
                console.log("searching!", q)
                // this.items = this.items.filter(x=>{
                //     let suggestion = (x || "").toLowerCase()
                //     let myQ = (q || "").toLowerCase()
                //     return suggestion.indexOf(myQ) > -1
                // })
                this.fetchSuggestions(q)
                

                this.$router.push({
                    name: "search",
                    params: {
                        q: _.snakeCase(q)
                    }
                })
            },
            fetchSuggestions(v) {
                this.loading = true

                let url = "https://gtr-api.herokuapp.com/autocomplete/" + v
                axios.get(url)
                    .then(resp => {
                        this.items = resp.data.results.slice(0, 6)
                        this.loading = false
                    })




            }
        },
        watch: {
            search(val) {
                val && val !== this.select && this.fetchSuggestions(val)
            }
        }
    }
</script>

<style lang="scss">
    .v-autocomplete__content {
        .v-list__tile {
            height: auto;
        }

        .v-list__tile__title {
            font-weight: bold !important;

        }

        .theme--light.v-list  {
            .v-list__tile__mask {
                background: #fff;
                color: #333;
                font-weight: normal;
            }
        }

    }

</style>