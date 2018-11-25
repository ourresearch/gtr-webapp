<template>
    <div class="root">

        <div class="loaded" v-if="!loading">
            <div class="main-col">
                <div class="results-descr">
                    <span class="info">
                        Showing {{ cleanResults.length }}
                        <span v-if="showOnlyOa" class="filter">free-to-read</span>
                        papers
                    </span>
                    <a class="show-oa-only" href="" v-if="!showOnlyOa" @click.prevent="showOnlyOa=true">
                        (<i class="fas fa-unlock-alt"></i>
                        Show only free-to-read papers)
                    </a>
                    <a class="show-everything" href="" v-if="showOnlyOa" @click.prevent="showOnlyOa=false">
                        (Show all papers)
                    </a>
                </div>
                <ul class="results-list">
                    <li v-for="result of cleanResults">
                        <div class="line title">
                            <a :href="'/paper/pmid/' + result.pmid" class="title">
                                {{result.title}}
                            </a>
                        </div>
                        <div class="line source">
                            <span class="date">{{ result.year }}</span>

                            <span class="journal">{{ result.journal_name }}</span>
                        </div>
                        <div class="line authors">
                            <!-- HAP see what it looks like with no authors
                            {{ result.displayAuthors }}
                            -->
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
            queryElapsed: 0.0,
            showOnlyOa: false
        }),
        computed: {
            apiUrl(){
                let searchTerm = this.$route.params.q
                // let url = "https://api.unpaywall.org/search/" + searchTerm
                let url = "https://gtr-api.herokuapp.com/search/" + searchTerm
                return url
            },
            cleanResults() {
                let ret = this.results

                if (this.showOnlyOa){
                    ret = ret.filter(myResult => {
                        return myResult.is_oa
                    })
                }


                ret = ret.map(result => {
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

                    r.displayAbstract = _.truncate(
                        r.short_abstract,
                        {
                            length: 500,
                            separator: /,? +/
                        }
                    )
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

                // HAP taking this out, i think it messes up the sorting, and
                // now the backend only returns things with abstracts
                // ret = ret.sort((a, b) => {
                //     if (a.displayAbstract) {
                //         return -1
                //     }
                //     else {
                //         return 1
                //     }
                // })

                return ret



            }
        },
        methods: {
            doQuery(){
                console.log("doing query")
                this.loading = true
                axios.get(this.apiUrl)
                    .then(resp => {
                        console.log("got resuls back", resp.data.results)
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
            padding: 30px 0;
            color: #666;
            .info {
                margin-right: 10px;
                font-size: 120%;
            }
            a {
                font-size: 14px;
            }

        }
        ul.results-list {
            padding: 0;
            margin: 10px 0 0;
            li{
                list-style-type: none;
                margin-bottom: 50px;
                .line {
                    &.title {
                        color: #1B5E20;
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
                        margin-top: 7px;
                    }
                }
            }
        }
    }
</style>















