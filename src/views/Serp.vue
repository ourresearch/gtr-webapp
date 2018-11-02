<template>
    <div class="root">

        <div class="loaded" v-if="!loading">
            <div class="main-col">
                <div class="results-descr">
                    About {{ results.length }} results ({{ queryElapsed }} seconds)
                </div>
                <ul class="results-list">
                    <li v-for="result of cleanResults">
                        <div class="line title">
                            <a :href="result.doi_url" class="title">
                                {{result.title}}
                            </a>
                        </div>
                        <div class="line source">
                            <span class="date">{{ result.year }}</span>

                            <span class="journal">{{ result.journal_name }}</span>
                        </div>
                        <div class="line authors">
                            {{ result.displayAuthors }}
                        </div>
                        <div class="line abstract" v-if="result.displayAbstract">
                            {{ result.displayAbstract }}
                        </div>
                    </li>
                </ul>
                <div class="page-bottom">
                    <a :href="apiUrl">
                        View in API.
                    </a>
                </div>
            </div>
        </div>

        <div class="loading" v-if="loading">
            <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        </div>
    </div>


</template>

<script>
    import axios from 'axios'
    import _ from 'lodash'

    export default {
        name: "Serp",
        data: () => ({
            loading: true,
            results: [],
            queryElapsed: 0.0
        }),
        computed: {
            apiUrl(){
                let searchTerm = this.$route.params.q
                let url = "https://api.unpaywall.org/search/" + searchTerm
                return url
            },
            cleanResults() {
                let ret
                ret = this.results.map(result => {
                    if (result.title === result.title.toUpperCase()) {
                        // result.title = _.capitalize(result.title)
                    }
                    return result
                })

                ret = ret.filter(myResult => {
                    // example: http://localhost:8080/search/heart_disease
                    return myResult.title.length < 450
                })

                ret = ret.map(r => {
                    if (r.abstracts.length){
                        let abs = r.abstracts[0].abstract

                        r.displayAbstract = r.abstracts[0].abstract
                        // r.displayAbstract = _.truncate(
                        //     r.abstracts[0].abstract,
                        //     {
                        //         length: 250,
                        //         separator: /,? +/
                        //     }
                        // )
                    }
                    return r
                })

                ret = ret.map(r => {
                    let numAuths = r.author_lastnames.length
                    if (numAuths > 5){
                        let numHidden = numAuths - 5
                        r.displayAuthors = r.author_lastnames.slice(0, 5).join(", ") + `, and ${numHidden} others`
                    }
                    else {
                        r.displayAuthors = r.author_lastnames.join(", ")
                    }
                    return r
                })

                ret = ret.sort((a, b) => {
                    if (a.displayAbstract) {
                        return -1
                    }
                    else {
                        return 1
                    }
                })

                return ret



            }
        },
        methods: {
            doQuery(){
                console.log("doing query")
                this.loading = true
                axios.get(this.apiUrl)
                    .then(resp => {
                        this.results = resp.data.results
                        this.queryElapsed = resp.data.elapsed_seconds
                        this.loading = false
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        this.loading = false
                        this.queryElapsed = resp.data.elapsed_seconds
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

<style scoped lang="scss">
    .root {
        min-height: 90vh;
    }

    .main-col {
        max-width: 632px;
        margin-left: 150px;

        .results-descr {
            padding: 20px 0;
            font-size: 14px;
            color: #666;

        }
        ul.results-list {
            padding: 0;
            margin: 10px 0 0;
            li{
                list-style-type: none;
                margin-bottom: 50px;
                .line {
                    &.title {
                        font-size: 18px;
                        line-height: 1.3;
                    }
                    &.source {
                        color: #1B5E20;
                        font-size: 14px;
                        span.date {
                            margin-right: 5px;
                        }
                    }
                    &.authors {
                        font-size: 14px;
                        color: #666;
                    }
                    &.abstract {
                        font-size: 14px;
                    }
                }
            }
        }
    }
</style>















