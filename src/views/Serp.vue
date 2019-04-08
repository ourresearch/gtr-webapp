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
                <div class="results-list">

                    <template v-for="(result, index) of cleanResults">
                        <div class="result">
                            <div class="card" @click="articleZoom(result)">
                                <div class="img">
                                    <img src="https://picsum.photos/300/200?random" alt="">
                                </div>
                                <div class="content">
                                    <div class="line title">
                                        {{result.title}}
                                    </div>
                                    <div class="line source">
                                        <span class="date">{{ result.year }}</span>

                                        <span class="journal">{{ result.journal_name }}</span>
                                    </div>

                                </div>

                            </div>






                            <!--<div class="line authors">-->
                                <!--&lt;!&ndash; HAP see what it looks like with no authors-->
                                <!--{{ result.displayAuthors }}-->
                                <!--&ndash;&gt;-->
                            <!--</div>-->
                            <!--<div class="line abstract" v-if="result.displayAbstract">-->
                                <!--{{ result.displayAbstract }}-->
                            <!--</div>-->
                        </div>
                        <div class="zoom" v-if="zoomedResult && insertZoomAfterIndex(index)">
                            <h1>zoom: {{zoomedResult.title}}</h1>

                        </div>




                    </template>


                </div>
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
            showOnlyOa: false,
            zoomedResult: null
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
            articleZoom(resultToZoomOn) {
                this.zoomedResult = resultToZoomOn
                this.zoomedResult.index = 2

                console.log("zoom!", resultToZoomOn)
            },
            insertZoomAfterIndex(indexToTest){
              if (indexToTest == 3) {
                  return true
              }
            },
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
        max-width: 1100px;
        margin: 10px 10px 100px;
        @media (min-width: 600px) {
            margin-left: 150px;
        }

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
        div.results-list {
            padding: 0;
            margin: 10px 0 0;
            display: flex;
            flex-wrap: wrap;
            div.result{
                list-style-type: none;
                margin: 10px;
                padding: 10px;



                div.card {
                    width: 200px;
                    .img {

                    }
                    .content {
                        margin-top: 10px;
                        .source {
                            color: #999;
                            font-size: 12px;
                            .journal {
                                margin-left: 3px;
                                font-style: italic;
                            }
                        }
                    }

                }
                .zoom {
                    width: 100%;
                    background: #ddd;
                }



                /*margin-bottom: 50px;*/
                /*.line {*/
                    /*&.title {*/
                        /*color: #1B5E20;*/
                        /*font-size: 18px;*/
                        /*line-height: 1.3;*/
                    /*}*/
                    /*&.source {*/
                        /*color: #1B5E20;*/
                        /*font-size: 14px;*/
                        /*span.date {*/
                            /*margin-right: 5px;*/
                        /*}*/
                    /*}*/
                    /*&.authors {*/
                        /*font-size: 14px;*/
                        /*color: #666;*/
                    /*}*/
                    /*&.abstract {*/
                        /*font-size: 14px;*/
                        /*margin-top: 7px;*/
                    /*}*/
                /*}*/
            }
        }
    }
</style>















