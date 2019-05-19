<template>
    <v-flex class="root">


        <div
                class="annotray anno-tray"
                v-if="selectedEntity && search.query.annotations"
                :class="{full:selectedEntity, 'annotations-active': search.query.annotations}">

            <div class="anno-full">
                <v-layout class="header headline pl-5 pr-4 font-weight-bold">
                    <v-flex class="term">
                        {{selectedEntity.title}}
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex shrink>
                        <span class="close" @click="search.setSelectedEntity()">&times;</span>

                    </v-flex>
                </v-layout>
                <div class="body pl-5 pr-5 py-3">
                    <span class="definition" v-html="selectedEntity.abstract"></span>
                    <img :src="selectedEntity.image_url" alt=""
                         class="pt-3"
                         v-if="selectedEntity.image_url">
                </div>
                <div class="footer px-5" v-show="selectedEntity.uri">
                    via <a :href="selectedEntity.uri">Wikipedia</a>
                </div>

            </div>
        </div>


        <div class="main-col" :class="{'annotations-active': search.query.annotations && $vuetify.breakpoint.smAndUp }">


            <v-container grid class="serp-header pa-0">
                <v-layout class="pt-5 pl-5 pr-5">
                    <v-flex xs3 hidden-xs-only class="text-xs-center">
                        <router-link to="/">
                            <img src="../assets/logo.png" alt="">
                        </router-link>
                    </v-flex>

                    <v-flex xs12 sm9 class="pl-4">
                        <v-layout>
                            <search-box></search-box>
                        </v-layout>
                        <v-layout hidden-xs-only class="px-2 controls" align-top>
                            <v-flex shrink class="pr-3 pl-2">
                                <v-switch
                                        color="primary"
                                        class="pa-0 ma-2"
                                        shrink
                                        v-model="search.query.oa"
                                        label="Open Access only"
                                ></v-switch>

                            </v-flex>

                            <v-switch
                                    color="primary"
                                    class="pa-0 ma-2"
                                    v-model="search.query.annotations"
                                    label="Highlight terms"
                            ></v-switch>
                            <v-spacer></v-spacer>

                            <v-dialog v-model="dialogs.subscribe.show" persistent max-width="600px">
                                <template v-slot:activator="{ on }">
                                    <v-btn flat small color="primary subscribe" dark v-on="on">
                                        <i class="far fa-envelope mr-1"></i>
                                        Subscribe to feed
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Subscribe to feed</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <p>
                                            Get email alerts when new articles are published related to this search.
                                        </p>
                                        <div>
                                            <v-text-field v-model="dialogs.subscribe.email" label="Email"
                                                          required></v-text-field>
                                        </div>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn flat @click="dialogs.subscribe.show = false">Cancel</v-btn>
                                        <v-btn color="primary" @click="subscribe">Subscribe</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>


                        </v-layout>

                    </v-flex>


                </v-layout>


            </v-container>

            <!--            <v-container>-->
            <!--                <pre>-->
            <!--                {{search.query}}-->
            <!--                </pre>-->
            <!--            </v-container>-->

            <v-container>
                <v-layout hidden-xs-only class="query-entities" v-if="search.queryEntities.length && search.query.annotations">
                    <v-flex xs3 class="label text-xs-right pt-2">
                        <div class="search-term-label">
                            Search terms:
                        </div>
                        <div class="extra" v-if="false">
                            <small>(Click for more info)</small>
                        </div>
                    </v-flex>
                    <v-flex xs9 class="pl-5">
                        <span class="query-entity headline mr-2" v-for="queryEntity in search.queryEntities">
                            <annotated-content
                                :content="queryEntity"
                                :annotations="[inPlaceAnnotation(queryEntity)]">
                            </annotated-content>
                        </span>
                    </v-flex>
                </v-layout>

                <div class="results-list" v-if="!search.loading">
                    <div class="no-results" v-if="query.q && !search.results.length">
                        <em>Sorry, there were no results for that search.</em>
                    </div>
                    <template v-for="(result, index) of search.results">
                        <result-row
                                :key="index"
                                :result="result"
                                @selected="search.setZoom(result.doi)"
                        ></result-row>
                    </template>
                </div>


                <div class="page-bottom" v-if="search.results.length">
                    <div class="text-xs-center">
                        <v-pagination
                                v-model="search.query.page"
                                :length="numResultsPages"
                                v-show="numResultsPages > 1"
                        ></v-pagination>
                    </div>
                    <div class="report text-xs-center pt-2">
                        <a href="mailto:team@impactstory.org">Report inappropriate images</a>
                    </div>
                    <div class="text-xs-center pt-2">
                        <a :href="apiUrl">View page in API</a>
                    </div>
                </div>

            </v-container>


            <transition name="slide">
                <article-zoom
                        id="article-zoom"
                        :result="zoomedResult"
                        @close="search.setZoom(null)"
                        v-if="zoomedResult"
                        :class="{open: !!zoomedResult}"
                >
                </article-zoom>


            </transition>
            <v-snackbar top v-model="snackbar.show">
                {{ snackbar.text }}
                <v-btn flat color="primary" @click="snackbar.show=false">close</v-btn>
            </v-snackbar>


        </div>


    </v-flex>


</template>

<script>
    import axios from 'axios';
    import ArticleZoom from '../components/ArticleZoom'
    import SearchBox from "../components/SearchBox";
    import {search} from "../search"
    import AnnotatedContent from "../components/AnnotatedContent";


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
            queryElapsed: 0.0,
            cardWidth: 280,
            rowWidth: null,
            currentPage: 0,
            error: null,
            search: search,
            dialogs: {
                subscribe: {
                    show: false,
                    email: null
                }
            },
            snackbar: {
                text: "",
                show: false
            },
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
            ResultRow,
            AnnotatedContent
        },
        computed: {
            apiUrl() {
                return search.apiQueryUrl()
            },
            zoomedResult() {
                return search.results.find(r => {
                    return r.doi === search.query.zoom
                })
            },
            numResultsPages() {
                return Math.ceil(search.totalResultsCount / 10)
            },
            selectedEntity() {
                return search.getSelectedEntity()
            }
        },
        methods: {
            subscribe() {
                this.dialogs.subscribe.show = false
                console.log("user subscribing with email", this.dialogs.subscribe.email)
                let url = "https://gtr-api.herokuapp.com/notifications/signup"
                let data = {
                    email: this.dialogs.subscribe.email,
                    query: search.query.q
                }
                axios.post(url, data)
                    .then(r => {
                        console.log("subscribed!", r)
                        this.snackbar.text = "You're subscribed!"
                        this.snackbar.show = true
                    })
                    .catch(e => {
                        alert("sorry, there was a bug! Please let us know at team@impactstory.org")
                    })
            },
            inPlaceAnnotation(topic) {
                return {
                    confidence: 1.0,
                    end: topic.length,
                    start: 0,
                    spot: topic,
                    title: topic
                }
            }
        },
        mounted() {
            search.setQuery(this.$route.query)
        },
        watch: {
            // when *any* user input changes, update the URL
            "search.query": {
                handler: function (to, from) {
                    this.$router.push({
                        query: search.getQueryForUrl()
                    });
                },
                deep: true
            },

            // changes that require a server refresh
            "search.query.q": function () {
                search.fetchResults(this.$vuetify.breakpoint.smAndUp)
            },
            "search.query.oa": function () {
                search.fetchResults(this.$vuetify.breakpoint.smAndUp)
            },
            "search.query.page": function () {
                search.fetchResults(this.$vuetify.breakpoint.smAndUp)
            }
        }

    }
</script>

<style scoped lang="scss">
    .root {
        .serp-header {
            img {
                height: 60px;
                margin-right: 20px;
                margin-top: -5px;
            }

            .controls {
                margin-top: -10px;

                .v-btn.subscribe {
                    margin-top: -30px;
                }

            }
        }

        .annotray {
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            width: 30%;

            z-index: 9999;
            @media screen and (max-width: 600px){
                width: 100%;
            }

            &.annotations-active {
                display: block;
            }

            display: none;

            overflow: scroll;
            font-size: 15px;
            /*border-left: 3px solid rgba(255, 127, 102, 1);*/

            background: #555;
            color: #fff;


            background: #fff;
            color: #333;


            &.full {
                /*background: rgba(255, 127, 102, .1);*/
                border-left: 1px solid #ddd;
            }

            img {
                width: 100%;
            }


            .header.headline {
                background: #8c9eff;
                background: rgba(255, 127, 102, 1);
                color: #fff;
                margin-top: 50px;


                color: rgba(255, 127, 102, 1);
                color: #fff;
                color: #333;
                background: transparent;

                padding: 5px;

                .close {
                    cursor: pointer;
                }
            }

            .body {
            }
        }

        .main-col.annotations-active {
            width: 70%;
        }
    }

    .search-term-label {
        opacity: .5;
    }

    div.results-list {
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
        width: 70%;
        border-right: 1px solid #333;

        /*transform: translateX(100%);*/
        background: #fff;
        z-index: 9;
        overflow: scroll;
        @media screen and (max-width: 600px) {
            width: 100%;
        }
    }


</style>















