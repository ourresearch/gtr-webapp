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
                    <img :src="myStore.data.selectedEntity.image_url" alt=""
                         v-if="myStore.data.selectedEntity.image_url">
                </div>
                <div class="footer">
                    via <a :href="myStore.data.selectedEntity.uri">Wikipedia</a>
                </div>

            </div>
        </div>


        <div class="main-col">
            <v-container class="header">
                <v-layout>
                    <search-box @query="setQ"></search-box>
                </v-layout>


                <v-layout class="pa-2" align-center>
                    <v-flex shrink class="px-3">
                        <v-switch
                                shrink
                                v-model="query.oa"
                                label="Show only free-to-read papers"
                        ></v-switch>

                    </v-flex>

                    <v-switch
                            v-model="query.annotations"
                            label="Show annotations"
                    ></v-switch>
                    <v-spacer></v-spacer>
                    <v-btn small flat :href="apiUrl">
                        View in API
                    </v-btn>
                    <v-btn small flat>
                        Create alert
                    </v-btn>
                </v-layout>
                <v-divider color="black"></v-divider>
            </v-container>
            <v-container>

                <div class="results-list" v-if="!search.loading">
                    <div class="no-results" v-if="query.q && !search.results.length">
                        <em>Sorry, there were no results for that search.</em>
                    </div>
                    <template v-for="(result, index) of search.results">
                        <result-row
                                :key="index"
                                :result="result"
                                @selected="setArticleZoom(result.doi)"
                        ></result-row>
                    </template>
                </div>


                <div class="page-bottom" v-if="search.results.length">
                    <div class="report">
                        <a href="mailto:team@impactstory.org">Report inappropriate images</a>
                    </div>
                </div>

            </v-container>


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
    import {search} from "../search"


    import ResultRow from "../components/ResultRow"

    // https://stackoverflow.com/a/1714899/226013
    function urlSerialize(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        return str.join("&");
    }

    export default {
        name: "Serp",
        data: () => ({
            results: [],
            myStore: myStore,
            queryElapsed: 0.0,
            zoomedResult: null,
            cardWidth: 280,
            rowWidth: null,
            currentPage: 0,
            error: null,
            selectedEntity: null,
            search: search,
            query: {
                q: "",
                oa: false,
                annotations: true,
                page: 1,
                zoom: null
            }

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
            }
        },
        methods: {
            setQ(q){
                this.query.q = _.snakeCase(q.toLowerCase())
            },

            setArticleZoom(doi) {
                this.query.zoom = doi
            },
            doArticleZoom(){
                console.log("article zoom, using DOI from URL", this.$route.query.zoom)
                document.body.classList.remove("noscroll")
                this.zoomedResult = search.results.find(result => {
                    return result.doi === this.$route.query.zoom
                })
                if (this.zoomedResult){
                    console.log("we have a zoomed results")
                    document.body.classList.add("noscroll")
                }
            },
            setQueryFromUrl(){

            }

        },
        mounted() {
            Object.keys(this.query).forEach(k => {
                this.query[k] = this.$route.query[k]
            })
            search.fetchResults()
            this.doArticleZoom()
        },
        watch: {
            // when the user input changes, update the URL
            "query": {
                handler: function (to) {
                    this.$router.push({query: to})
                },
                deep: true
            },

            // for some URL changes, we need to hit the server
            "$route.query.q": function (to) {
                search.fetchResults()
            },
            "$route.query.oa": function (to) {
                search.fetchResults()
            },


            // for some URL changes we just need to move stuff around on the client
            "$route.query.zoom": function (to) {
                this.doArticleZoom()
            },
            "$route.query.annotations": function (to) {
                console.log("dude its the cops, hide the annotations!")
            }
        }

    }
</script>

<style scoped lang="scss">
    .root {
        .annotray {
            background: #eee;
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
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















