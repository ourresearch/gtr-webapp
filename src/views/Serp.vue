<template>
    <v-flex class="root">


        <div class="annotray pa-4 anno-tray">

            <div class="anno-empty" v-if="!search.selectedEntity && search.query.annotations">
                <div class="content">
                    <div class="image">
                        <i class="far fa-hand-point-left"></i>
                    </div>
                    <div class="text">
                        Click <span class="entity">highlighted words</span> to learn more!
                    </div>
                </div>
            </div>

            <div class="anno-full" v-if="search.selectedEntity && search.query.annotations">
                <div class="header headline">
                            <span class="term">
                                {{search.selectedEntity.title}}
                            </span>
                    <span class="close" @click="search.setSelectedEntity()">&times;</span>
                </div>
                <div class="body">
                    <span class="definition" v-html="search.selectedEntity.abstract"></span>
                    <img :src="search.selectedEntity.image_url" alt=""
                         v-if="search.selectedEntity.image_url">
                </div>
                <div class="footer" v-show="search.selectedEntity.uri">
                    via <a :href="search.selectedEntity.uri">Wikipedia</a>
                </div>

            </div>
        </div>


        <div class="main-col">
            <v-container class="serp-header">
                <v-layout>
                    <router-link to="/">
                        <img src="../assets/logo.png" alt="">
                    </router-link>
                    <search-box></search-box>
                </v-layout>


                <v-layout class="pa-2" align-center>
                    <v-flex shrink class="pr-3">
                        <v-switch
                                shrink
                                v-model="search.query.oa"
                                label="Show only free-to-read papers"
                        ></v-switch>

                    </v-flex>

                    <v-switch
                            v-model="search.query.annotations"
                            label="Show annotations"
                    ></v-switch>
                    <v-spacer></v-spacer>

                    <v-dialog v-model="dialog" persistent max-width="600px">
                        foobar
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">User Profile</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout>
                                        this is the workds
                                    </v-layout>
                                    <v-layout wrap>

                                        <v-flex xs12>
                                            <v-text-field label="Email" required></v-text-field>
                                        </v-flex>


                                    </v-layout>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat @click="dialog = false">Cancel</v-btn>
                                <v-btn flat @click="foo">Subscribe</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>


                </v-layout>
                <v-divider color="black"></v-divider>
            </v-container>

            <!--            <v-container>-->
            <!--                <pre>-->
            <!--                {{search.query}}-->
            <!--                </pre>-->
            <!--            </v-container>-->

            <v-container>

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
                                :length="10"
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


        </div>


    </v-flex>


</template>

<script>
    import ArticleZoom from '../components/ArticleZoom'
    import SearchBox from "../components/SearchBox";
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
            queryElapsed: 0.0,
            cardWidth: 280,
            rowWidth: null,
            currentPage: 0,
            error: null,
            selectedEntity: null,
            search: search,
            dialog: false,
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
                return search.apiQueryUrl()
            },
            zoomedResult() {
                return search.results.find(r => {
                    return r.doi === search.query.zoom
                })
            }
        },
        methods: {
            foo(){
                console.log("foo called")
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
                search.fetchResults()
            },
            "search.query.oa": function () {
                search.fetchResults()
            },
            "search.query.page": function () {
                search.fetchResults()
            }
        }

    }
</script>

<style scoped lang="scss">
    .root {
        .serp-header {
            img {
                height: 50px;
                margin-right: 20px;
            }
        }

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

            .header.headline {
                background: rgba(255, 127, 102, 1);
                color: #fff;
                padding: 5px;
                border-radius: 3px;
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















