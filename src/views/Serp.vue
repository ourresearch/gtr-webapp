<template>
    <div class="root">

        <div class="loaded" v-if="results.length">
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
                <span class="spacer"></span>
                <a :href="apiUrl" class="api">View in API</a>
            </div>


            <div class="results-list">

                <template v-for="(result, index) of displayResults">
                    <div class="card"
                         :style="{width: cardWidth+'px'}"
                         @click="setArticleZoom(result.doi)">
                        <div class="img">
                            <img :src="result.image.url" alt="" class="card-image">
                            <div class="label">
                                {{result.image.title}}
                            </div>
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


                    <article-zoom
                            :paper="zoomedResult"
                            v-if="result.insertZoomAfterMe">
                    </article-zoom>





                </template>


            </div>
            <div class="page-bottom">
                <md-button class="md-raised md-primary"
                           v-show="currentPage < 6"
                           @click="fetchNextPageOfResults">
                    See more results
                </md-button>
            </div>
        </div>

        <div class="loading" v-if="!results.length">
            <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        </div>
    </div>


</template>

<script>
    import axios from 'axios'
    import _ from 'lodash'
    import smartcrop from 'smartcrop'
    import ArticleZoom from '../components/ArticleZoom'


    export default {
        name: "Serp",
        data: () => ({
            results: [],
            queryElapsed: 0.0,
            showOnlyOa: false,
            zoomedResult: null,
            cardWidth: 260,
            rowWidth: null,
            currentPage: 0
        }),
        components: {
            ArticleZoom,
            smartcrop
        },
        computed: {
            apiUrl() {
                let searchTerm = this.$route.params.q
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


                // handle the article zooming
                ret.forEach(r => {
                    r.insertZoomAfterMe = false
                })
                if (this.zoomedResult){
                    let zoomedResultIndex = ret.findIndex(r => {
                        return r.doi === this.zoomedResult.doi
                    })
                    let cardsPerRow = 4
                    for (let i = 1; i < ret.length; i++) {
                        if (i % cardsPerRow === 0 && i > zoomedResultIndex) {
                            ret[i-1].insertZoomAfterMe = true
                            break
                        }
                    }
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
                    this.zoomedResult = null
                }
                else {
                    this.$router.push({query: {zoom: doi}})
                    this.zoomArticle(doi)
                }

            },

            zoomArticle(doi) {
                this.zoomedResult = this.results.find(result => {
                    return result.doi === doi
                })
                return !!this.zoomedResult
            },

            loadPage(){
                let that = this
                load()

                function load() {
                    console.log("load() starting")

                    // try to set the zoomedResult
                    that.zoomArticle(that.$route.query.zoom)
                    console.log("load(): zoomedResult is", that.zoomedResult)


                    // halt if we've got everything we need
                    if (that.results.length) {
                        // great, we've got results to show

                        if (that.$route.query.zoom) {
                            // but looks like we also need a zoomedResult.

                            if (that.zoomedResult) {
                                console.log("load() halting: we've got results AND zoomedResult.")
                                return true
                            }
                            else {
                                // we still need a zoomedResult
                            }
                        }
                        else {
                            // we've got results, and don't need a zoomedResult. halt.
                            console.log("load() halting: we've got our results and that's all we needed.")
                            return true
                        }
                    }
                    else {
                        // we still need to get results
                    }

                    // get some more results
                    console.log("load(): fetching a page of results")
                    that.fetchNextPageOfResults()
                        .then(success => {
                            console.log(
                                "load(): fetched a page of results!",
                                that.zoomedResult,
                                that.currentPage
                            )
                            if (success){
                                return load()
                            }
                            else {
                                console.log("load(): we can't fetch more results, halting")
                                return false
                            }
                        })
                }
            },


            fetchNextPageOfResults() {
                let pageToFetch = this.currentPage + 1
                let urlWithPage = this.apiUrl + "?page=" + pageToFetch

                console.log("fetchNextPageOfResults()", pageToFetch)
                return axios.get(urlWithPage)
                    .then(resp => {
                        console.log("got search results back", resp.data.results)

                        // use the nifty spread operator since push() requires multiple args
                        // rather than a single array https://stackoverflow.com/a/1374131/226013
                        this.results.push(...resp.data.results)

                        this.currentPage = pageToFetch // update the current page
                        return true
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        return false
                    })
            }
        },
        mounted() {
            this.loadPage()
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
        display: flex;
        align-items: center;
        .info {
            margin-right: 10px;
            font-size: 120%;
        }
        .spacer {
            flex: 1;
        }
        a {
            font-size: 14px;
        }

    }

    div.results-list {
        max-width: 1100px;
        padding: 0;
        margin: 10px 0 0;
        display: flex;
        flex-wrap: wrap;
        margin: 10px 10px 100px;



        div.card {
            padding: 20px;
            .img {
                overflow: hidden;
                max-height: 150px;
                img {
                }
                .label {
                    /*color: #fff;*/
                    /*background: rgba(0,0,0,.6);*/
                    padding: 1px 0;
                    font-size: 12px;
                    z-index: 999;
                }
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
        .article-zoom {
            width: 100%;

        }

    }
    .page-bottom {
        margin: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

    }


</style>















