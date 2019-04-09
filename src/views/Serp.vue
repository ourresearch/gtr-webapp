<template>
    <div class="root">

        <div class="loaded" v-if="!loading">
            <div class="results-descr">
                    <span class="info">
                        Showing {{ displayResults.length }}
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

                <template v-for="(result, index) of displayResults">
                    <div class="card"
                         :style="{width: cardWidth+'px'}"
                         @click="setArticleZoom(result.doi)">
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
                    <div class="zoom" v-if="zoomedResult && result.insertZoomAfterMe">
                        <div class="col about">
                            <h1>{{zoomedResult.title}}</h1>
                            <div class="line authors" v-show="zoomedResult.displayAuthors">
                                {{zoomedResult.displayAuthors}}
                            </div>
                            <div class="line source">
                                <span class="date">{{ zoomedResult.year }}</span>
                                <span class="journal">{{ zoomedResult.journal_name }}</span>
                            </div>
                            <div class="abstract">
                                {{ zoomedResult.displayAbstract }}
                            </div>


                        </div>
                        <div class="col anno">
                            <div class="instructions">
                                Click underlined words to learn more.
                            </div>
                        </div>

                    </div>


                </template>


            </div>
            <div class="page-bottom">
                <a :href="apiUrl">
                    View in API.
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
    import _ from 'lodash'
    import {searchResp} from "../searchResp";

    export default {
        name: "Serp",
        data: () => ({
            loading: true,
            results: [],
            queryElapsed: 0.0,
            showOnlyOa: false,
            zoomedResult: null,
            cardWidth: 260,
            rowWidth: null
        }),
        computed: {
            apiUrl() {
                let searchTerm = this.$route.params.q
                // let url = "https://api.unpaywall.org/search/" + searchTerm
                let url = "https://gtr-api.herokuapp.com/search/" + searchTerm
                return url
            },
            displayResults() {
                let ret = this.results

                if (this.showOnlyOa) {
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
                    if (numAuths > 5) {
                        let numHidden = numAuths - 5
                        r.displayAuthors = r.author_lastnames.slice(0, 5).join(", ") + `, and ${numHidden} others`
                    }
                    else {
                        r.displayAuthors = r.author_lastnames.join(", ")
                    }
                    return r
                })


                return ret


            }
        },
        methods: {

            setArticleZoom(doi){
                if (doi == this.$route.query.zoom) {
                    console.log("remove doi from URL")
                    this.$router.push({query: {}})
                }
                else {
                    this.$router.push({query: {zoom: doi}})
                }

            },

            zoomArticle() {
                // get rid of existing zooms
                this.results.forEach(r => {
                    r.insertZoomAfterMe = false
                })


                let doi = this.$route.query.zoom
                if (!doi){
                    return
                }


                console.log("setting article zoom", doi)
                this.zoomedResult = this.results.find(result => {
                    return result.doi === doi
                })
                this.zoomedResult.myIndex = this.results.findIndex(result => {
                    return result.doi === doi
                })

                console.log("gonna zoom in on this article:", this.zoomedResult)

                let cardsPerRow = 4
                for (let i = 1; i < this.results.length; i++) {
                    console.log("checking result")
                    if (i % cardsPerRow === 0 && i > this.zoomedResult.myIndex) {
                        this.results[i-1].insertZoomAfterMe = true
                        console.log("found the place to put the zoomed article", i)
                        break
                    }
                }
            },

            doSearch() {
                this.loading = true
                axios.get(this.apiUrl)
                    .then(resp => {
                        console.log("got resuls back", resp.data.results)
                        this.results = resp.data.results
                        this.queryElapsed = resp.data.elapsed_seconds
                        this.loading = false
                        this.zoomArticle()
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        this.loading = false
                    })
            }
        },
        mounted() {
            this.doSearch()
        },
        watch: {
            "$route"(to, from) {
                console.log("route change", to, from)
                this.zoomArticle()
            }
        }
    }
</script>

<style scoped lang="scss">
    .root {
        min-height: 90vh;
    }

    /*@media (min-width: 600px) {*/
    /*margin-left: 150px;*/
    /*}*/

    .results-descr {
        padding: 0 20px 20px;
        color: #666;
        border-bottom: 1px solid #ccc;
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
        max-width: 1100px;
        margin: 10px 10px 100px;



        div.card {
            padding: 20px;
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
            padding: 20px;
            display: flex;
            h1 {
                margin: 0;
            }
            .col {
                flex: 1;
            }
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
</style>















