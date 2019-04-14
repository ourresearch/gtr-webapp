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
                         :class="{selected: result.isSelected}"
                         :style="{width: cardWidth+'px'}"
                         @click="setArticleZoom(result.doi)">


                        <div class="card-content" :class="{selected: result.isSelected}">
                            <div class="card-header">
                                <div class="img-wrapper">
                                    <img :src="result.image.url" alt="" class="card-image">
                                </div>
                                <div class="label">
                                    {{result.image.title}}
                                </div>
                            </div>

                            <div class="card-body">
                                <div class="line pub-type">
                                    <div class="oa value" v-if="result.oa_url">
                                        <i class="fas fa-unlock" ></i>
                                        Open access
                                    </div>
                                    <div class="value"  v-if="result.pubType">
                                        {{result.pubType.pub_type_gtr}}
                                    </div>
                                </div>


                                <div class="line title">
                                    {{result.title}}
                                </div>
                                <div class="line source">
                                    <span class="date">{{ result.year }}</span>

                                    <span class="journal">{{ result.journal_name }}</span>
                                </div>

                            </div>
                            <div class="card-footer">
                                <div class="mesh tags" v-if="result.mesh.length">
                                    <strong>MESH: </strong>
                                    <span class="tag" v-for="(meshTerm, index) in result.mesh">
                                        {{meshTerm.descriptor}}<span class="sep" v-show="index+1 < result.mesh.length">;</span>
                                    </span>
                                </div>

                                <div class="entity tags" v-if="result.picture_candidates.length">
                                    <strong>Entities: </strong>
                                    <span class="tag" v-for="(candidate, index) in result.picture_candidates">
                                        {{candidate.title}}<span class="sep" v-show="index+1 < result.picture_candidates.length">;</span>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                </template>


            </div>
            <div class="page-bottom">
                <md-button class="md-raised md-primary"
                           v-show="currentPage < 600"
                           @click="fetchNextPageOfResults">
                    See more results
                </md-button>
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
    const bodyScrollLock = require('body-scroll-lock');


    function chunk(array, size) {
      const chunked_arr = [];
      let index = 0;
      while (index < array.length) {
        chunked_arr.push(array.slice(index, size + index));
        index += size;
      }
      return chunked_arr;
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
            cardRows() {
                let rowSize = 4
                let rows = [];
                let index = 0;
                while (index < this.displayResults.length) {
                    let myRow = {
                        containsSelected: false,
                        results: []
                    }
                    myRow.results.push(this.displayResults.slice(index, rowSize + index));
                    rows.push(myRow)
                    index += rowSize;
                }
                return rows;
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
                    r.isSelected = false
                })


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
                let zoomPane = document.querySelector("#article-zoom");
                if (!doi || doi == this.$route.query.zoom) {
                    console.log("remove doi from URL")
                    this.$router.push({query: {}})
                    this.zoomedResult = null
                    bodyScrollLock.clearAllBodyScrollLocks();
                }
                else {
                    this.$router.push({query: {zoom: doi}})
                    this.zoomArticle(doi)
                    bodyScrollLock.disableBodyScroll(zoomPane);

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
            "$route": function(newVal, oldVal){
                console.log("route change", newVal)
                // if (!newVal.query.zoom){
                //     console.log("new search")
                //     this.results.length = 0
                //     this.currentPage = 0
                //     this.loadPage()
                // }
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


    /*.slide {*/
        /*transition: height 5s;*/

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
        max-width: 1140px;
        padding: 0;
        margin: 10px 0 0;
        display: flex;
        flex-wrap: wrap;
        margin: 10px 10px 100px;



        div.card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            &.selected {
            }


            .card-content {
                padding: 15px;
                margin: 10px;
                cursor: pointer;
                border-radius: 3px;
                transition: box-shadow 300ms;
                flex: 1;
                &:hover {
                    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
                    /*background: #fafafa;*/
                }
                &.selected {
                    box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
                    /*border: 1px solid #ddd;*/
                    /*background: #333;*/
                    /*color: #fff;*/
                }
                .card-header {
                    .img-wrapper {
                        min-height: 150px;
                        background: #fafafa;
                        max-height: 200px;
                        overflow: hidden;
                        border-radius: 3px;


                    }
                    .label {
                        padding: 1px 0;
                        font-size: 12px;
                        text-align: right;
                    }
                }
                .card-body {
                    margin-top: 5px;
                    .pub-type {
                        padding-bottom: 10px;
                        font-size: 12px;
                        display: flex;
                        .fas {
                        }
                        .value {
                            padding: 2px 6px;
                            margin-right: 3px;
                            border-radius: 3px;
                            display: inline;
                            border: 1px solid #999;

                        }
                    }
                    .source {

                        color: #999;
                        font-size: 12px;
                        .journal {
                            margin-left: 3px;
                            font-style: italic;
                        }
                    }
                }
                .card-footer {
                    display: none;
                    .tags {
                        font-size: 12px;
                        padding: 5px 0;
                        border-top: 1px solid #ddd;
                        margin: 5px 0;
                    }

                }
            }

        }

    }
    .page-bottom {
        margin: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

    }




    .slide-enter-active, .slide-leave-active {
        transition:transform 300ms;
    }
    .slide-leave, .slide-enter-to{
        transform: translateX(0);

    }
    .slide-enter, .slide-leave-to {
        transform: translateX(100%);
    }

    #article-zoom {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        /*transform: translateX(100%);*/
        background: #fff;
        z-index: 999;
    }


</style>















