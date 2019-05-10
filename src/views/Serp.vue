<template>
    <v-flex class="root">


            <div class="annotray pa-4 anno-tray">

                <div class="anno-empty" v-if="!selectedEntity">
                    <div class="content">
                        <div class="image">
                            <i class="far fa-hand-point-left"></i>
                        </div>
                        <div class="text">
                            Click <span class="entity">highlighted words</span> to learn more!
                        </div>
                    </div>
                </div>

                <div class="anno-full" v-if="selectedEntity">
                    <div class="header">
                            <span class="term">
                                {{selectedEntity.title}}
                                <span class="confidence">{{ selectedEntity.confidence.toFixed(2) }}</span>
                            </span>
                        <span class="close" @click="selectedEntity=false">&times;</span>
                    </div>
                    <div class="body">
                        <span class="definition" v-html="selectedEntity.abstract"></span>
                        <img :src="selectedEntity.image_url" alt="" v-if="selectedEntity.image_url">
                    </div>
                    <div class="footer">
                        via <a :href="selectedEntity.uri">Wikipedia</a>
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
                            <div class="row"
                                 :key="index"
                                 :class="{selected: result.isSelected}">


                                <div class="image">
                                    <div class="img-wrapper">
                                        <img :src="result.image.url" alt="">
                                    </div>
                                    <div class="label">
                                        {{result.image.title}}
                                    </div>
                                </div>

                                <div class="content">
                                    <div class="line evidence">
                                        <span class="val" v-if="result.pubType">
                                            {{result.pubType.pub_type_gtr}}
                                        </span>
                                    </div>
                                    <div class="line title">
                                        <span class="chunk-container"
                                              :key="index"
                                              v-for="(chunk, index) in result.titleChunks">
                                            <span class="chunk entity"
                                                  v-html="chunk.spot"
                                                  v-if="chunk.abstract"
                                                  @click="toggleEntity(chunk)">

                                            </span>
                                            <span class="chunk text"
                                                  v-html="chunk.text"
                                                  v-if="!chunk.abstract"></span>
                                        </span>
                                    </div>

                                    <div class="summary" v-if="result.abstract_short">
                                        <span class="chunk-container"
                                              :key="index"
                                              v-for="(chunk, index) in result.shortAbstractChunks">
                                            <span class="chunk entity"
                                                  v-html="chunk.spot"
                                                  v-if="chunk.abstract"
                                                  @click="toggleEntity(chunk)">

                                            </span>
                                            <span class="chunk text"
                                                  v-html="chunk.text"
                                                  v-if="!chunk.abstract"></span>
                                        </span>
                                    </div>


                                    <div class="line source">
                                        <span class="date">{{ result.year }}</span>

                                        <span class="journal">{{ result.journal_name }}</span>
                                    </div>
                                    <div class="line oa" v-if="result.oa_url">
                                        <i class="fas fa-unlock"></i>
                                        Open Access
                                    </div>

                                    <div class="actions line">
                                        <v-btn @click="setArticleZoom(result.doi)">Learn more</v-btn>
                                    </div>


                                </div>


                            </div>


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



    function textChunk(str) {
        return {text: str}
    }

    function makeChunks(str, annotations) {

        if (!str) {
            return textChunk("")
        }
        if (!annotations) {
            return textChunk(str)
        }

        // split the str into a bunch of chunks...some chunks are entities,
        // the other chunks are the text in between entities.
        let chunks = []
        let cursorIndex = 0
        annotations.forEach(entity => {

            // add any plaintext chunk before the current entity
            if (entity.start > 0) {
                chunks.push(
                    textChunk(str.slice(cursorIndex, entity.start))
                )
            }

            // this entity
            if (entity.confidence < 0.7) {
                // if it's low-confidence, treat is as a text chunk
                chunks.push(
                    textChunk(entity.spot)
                )
            } else {
                chunks.push(entity)
            }

            // update the cursor
            cursorIndex = entity.end
        })

        // after the last entity, there's generally one last hanging text chunk. add it.
        if (cursorIndex < str.length) {
            chunks.push(
                textChunk(
                    str.slice(cursorIndex, str.length)
                )
            )
        }

        return chunks

    }


    export default {
        name: "Serp",
        data: () => ({
            results: [],
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
            SearchBox
        },
        computed: {
            apiUrl() {
                let searchTerm = this.$route.params.q
                let url = "https://gtr-api.herokuapp.com/search/" + searchTerm
                return url
            },
            displaySearchTerm() {
                if (this.$route.params.q) {
                    return this.$route.params.q.replace("_", " ")
                } else return null

            },

            displayResults() {
                let ret = this.results

                if (this.showOnlyOa) {
                    ret = ret.filter(myResult => {
                        return myResult.is_oa
                    })
                }


                // pick best pubtype
                ret = ret.map(r => {
                    r.pub_types.sort((a, b) => {
                        return a.evidence_level - b.evidence_level
                    })

                    r.pubType = r.pub_types.find(x => {
                        return x.pub_type_gtr
                    })
                    return r
                })


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
                    } else {
                        r.displayAuthors = r.author_lastnames.join(", ")
                    }
                    return r
                })


                // add abstract and title chunks
                ret = ret.map(r => {
                    r.titleChunks = makeChunks(
                        r.title,
                        r.annotations.using_article_title
                    )
                    r.shortAbstractChunks = makeChunks(
                        r.abstract_short,
                        r.annotations.using_article_abstract_short
                    )
                    return r
                })


                return ret


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
            toggleEntity(entity) {
                console.log("toggling entity", entity)
                if (this.selectedEntity && entity.id === this.selectedEntity.id){
                    this.selectedEntity = null
                }
                else {
                    this.selectedEntity = entity
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

    /*@media (min-width: 600px) {*/
    /*margin-left: 150px;*/
    /*}*/

    /*.slide {*/
    /*transition: height 5s;*/

    /*}*/

    .results-descr {
        padding: 0 20px 5px;
        color: #666;
        /*color: #FF7F66;*/
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
            padding: 0 10px;
        }

    }

    div.results-list {
        max-width: 1140px;
        padding: 0;
        margin: 10px 0 0;
        margin: 10px 10px 100px;


        div.row {
            display: flex;
            padding: 20px 30px;
            margin: 20px 30px;


            .image {
                flex: 0 0 200px;
                margin-right: 25px;

                .img-wrapper {
                    background: #fafafa;
                    min-height: 100px;
                    padding: 10px;

                    img {
                        border-radius: 5px;
                        /*border: 1px solid #333;*/
                        width: 250px;

                    }

                }

                .label {
                    font-size: 11px;
                    text-align: right;
                    opacity: .7;
                }

            }

            .content {
                line-height: 1.5;
                flex: 1;

                .evidence {
                    font-size: 15px;
                    text-transform: capitalize;
                    line-height: 1;
                }

                .title {
                    font-size: 24px;
                    margin-bottom: 5px;
                    line-height: 1.4;
                }

                .summary {
                    margin-bottom: 20px;
                }

                .source {
                    font-size: 15px;

                    .journal {
                        margin-left: 5px;
                        font-style: italic;
                    }
                }

                .oa {
                    line-height: 1;
                    font-size: 15px;

                    i {
                        font-size: 80%;
                    }
                }

                .entity {
                    background: rgba(255,127,102, .15);
                    cursor: pointer;
                    padding: 0 3px;
                    white-space: nowrap;
                    border-radius: 3px;
                }
            }
        }
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















