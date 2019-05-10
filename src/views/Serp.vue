<template>
    <v-flex class="root">


            <div class="annotray pa-4 anno-tray">

                <div class="anno-empty" v-if="!myStore.data.selectedEntity">
                    <div class="content">
                        <div class="image">
                            <i class="far fa-hand-point-left"></i>
                        </div>
                        <div class="text">
                            Click <span class="entity">highlighted words</span> to learn more!
                        </div>
                    </div>
                </div>

                <div class="anno-full" v-if="myStore.data.selectedEntity">
                    <div class="header">
                            <span class="term">
                                {{myStore.data.selectedEntity.title}}
                                <span class="confidence">{{ myStore.data.selectedEntity.confidence.toFixed(2) }}</span>
                            </span>
                        <span class="close" @click="myStore.clearSelectedEntity()">&times;</span>
                    </div>
                    <div class="body">
                        <span class="definition" v-html="myStore.data.selectedEntity.abstract"></span>
                        <img :src="myStore.data.selectedEntity.image_url" alt="" v-if="myStore.data.selectedEntity.image_url">
                    </div>
                    <div class="footer">
                        via <a :href="myStore.data.selectedEntity.uri">Wikipedia</a>
                    </div>

                </div>
            </div>




            <div class="main-col">
                <div class="header">
                    <v-layout>
                        <search-box></search-box>
                    </v-layout>
                    <v-layout>
                        <a class="show-oa-only" href="" v-if="!showOnlyOa" @click.prevent="showOnlyOa=true">
                            (<i class="fas fa-unlock-alt"></i>
                            Show only free-to-read papers)
                        </a>
                        <a class="show-everything" href="" v-if="showOnlyOa" @click.prevent="showOnlyOa=false">
                            (Show all papers)
                        </a>
                        <v-spacer></v-spacer>
                        <a :href="apiUrl" class="api pa-2">View in API</a>
                        <a href="javascript:alert('This feature coming soon');" class="pa-2">Create alert</a>

                    </v-layout>
                </div>






                <div class="loaded" v-if="results.length">


                    <div class="error" v-if="error">
                        <em>Sorry, there were no results for that search.</em>
                    </div>



                    <div class="results-list" v-if="!error">

                        <template v-for="(result, index) of displayResults">
                            <result-row
                                    :key="index"
                                    :result="result"
                                    @selected="setArticleZoom(result.doi)"
                            ></result-row>


                        </template>


                    </div>
                    <div class="page-bottom">
                        <div class="controls">
                            <v-btn class="md-raised md-primary"
                                       v-show="currentPage < 6"
                                       @click="fetchNextPageOfResults">
                                See more results
                            </v-btn>
                        </div>
                        <div class="report">
                            <a href="mailto:team@impactstory.org">Report inappropriate images</a>
                        </div>
                    </div>

                </div>

                <transition name="slide">
                    <article-zoom
                            id="article-zoom"
                            :paper="zoomedResult"
                            @close="setArticleZoom(null)"
                            v-if="zoomedResult"
                            :class="{open: !!zoomedResult}"
                    >
                    </article-zoom>


                </transition>


            </div>
















    </v-flex>


</template>

<script>
    import axios from 'axios'
    import _ from 'lodash'
    import ArticleZoom from '../components/ArticleZoom'
    import SearchBox from "../components/SearchBox";
    import {myStore} from "../myStore";


    import ResultRow from "../components/ResultRow"


    export default {
        name: "Serp",
        data: () => ({
            results: [],
            myStore: myStore,
            queryElapsed: 0.0,
            showOnlyOa: false,
            zoomedResult: null,
            cardWidth: 280,
            rowWidth: null,
            currentPage: 0,
            error: null,
            selectedEntity: null

        }),
        components: {
            ArticleZoom,
            SearchBox,
            ResultRow
        },
        computed: {
            apiUrl() {
                let searchTerm = this.$route.params.q
                let url = "https://gtr-api.herokuapp.com/search/" + searchTerm
                return url
            },
            displayResults() {
                return this.results
            }
        },
        methods: {

            setArticleZoom(doi) {
                if (!doi || doi == this.$route.query.zoom) {
                    this.$router.push({query: {}})
                    this.zoomedResult = null
                    document.body.classList.remove("noscroll")
                } else {
                    this.$router.push({query: {zoom: doi}})
                    this.zoomArticle(doi)
                    document.body.classList.add("noscroll")

                }

            },

            zoomArticle(doi) {
                this.zoomedResult = this.results.find(result => {
                    return result.doi === doi
                })
                return !!this.zoomedResult
            },

            loadPage() {
                this.results.length = 0
                this.currentPage = 0
                this.zoomedResult = null
                this.error = null
                this.selectedEntity = null


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
                            } else {
                                // we still need a zoomedResult
                            }
                        } else {
                            // we've got results, and don't need a zoomedResult. halt.
                            console.log("load() halting: we've got our results and that's all we needed.")
                            return true
                        }
                    } else {
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
                            if (success) {
                                return load()
                            } else {
                                console.log("load(): we can't fetch more results, halting")
                                alert("API error!")
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
        },
        watch: {
            "$route": function (newVal, oldVal) {
            },
            "$route.params.q": function (newVal, oldVal) {
                console.log("change in search term", newVal)
                this.loadPage()
            }
        }

    }
</script>

<style scoped lang="scss">
    .root {
        .annotray {
            background: #eee;
            position: fixed;
            top:0;
            bottom:0;
            right:0;
            width: 25%;
            overflow: scroll;

            img {
                width: 100%;
            }
        }
        .main-col {
            width: 75%;
        }
    }

    div.results-list {
        max-width: 1140px;
        padding: 0;
        margin: 10px 0 0;
        margin: 10px 10px 100px;
    }

    .page-bottom {
        margin: 10px;
        .controls {
            display: flex;
            justify-content: center;
        }
    }

    /*.slide-enter-active, .slide-leave-active {*/
    /*    transition: transform 300ms;*/
    /*}*/

    /*.slide-leave, .slide-enter-to {*/
    /*    transform: translateX(75%);*/

    /*}*/

    /*.slide-enter, .slide-leave-to {*/
    /*    transform: translateX(0%);*/
    /*}*/

    #article-zoom {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        width: 75%;
        /*transform: translateX(100%);*/
        background: #fff;
        z-index: 999;
        overflow: scroll;
    }


</style>















