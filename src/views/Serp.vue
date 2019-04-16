<template>
    <div class="root">

        <div class="loaded" v-if="results.length">
            <div class="results-descr">
                    <span class="info">
                        Showing {{ displayResults.length }}
                        <span v-if="showOnlyOa" class="filter">free-to-read</span>
                        papers for "{{displaySearchTerm}}"
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
                <a href="javascript:alert('This feature coming soon');">Create alert</a>
            </div>


            <div class="error" v-if="error">
                <em>Sorry, there were no results for that search.</em>
            </div>

            <div class="results-list" v-if="!error">

                <template v-for="(result, index) of displayResults">
                    <div class="row"
                         :class="{selected: result.isSelected}"
                         @click="setArticleZoom(result.doi)">


                        <div class="image">
                            <div class="img-wrapper">
                                <img :src="result.image.url" alt="" class="card-image">
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
                            <div class="line title" v-html="result.title"></div>

                            <div class="summary" v-if="result.abstract_short" v-html="result.abstract_short"></div>



                            <div class="line source">
                                <span class="date">{{ result.year }}</span>

                                <span class="journal">{{ result.journal_name }}</span>
                            </div>
                            <div class="line oa" v-if="result.oa_url">
                                <i class="fas fa-unlock"></i>
                                Open Access
                            </div>



                        </div>


                    </div>


                </template>


            </div>
            <div class="page-bottom">
                <div class="controls">
                    <md-button class="md-raised md-primary"
                               v-show="currentPage < 6"
                               @click="fetchNextPageOfResults">
                        See more results
                    </md-button>
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
            currentPage: 0,
            error: null

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
            displaySearchTerm(){
                if (this.$route.params.q){
                    return this.$route.params.q.replace("_", " ")
                }
                else return null

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

            setArticleZoom(doi) {
                if (!doi || doi == this.$route.query.zoom) {
                    this.$router.push({query: {}})
                    this.zoomedResult = null
                    document.body.classList.remove("noscroll")
                }
                else {
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
                            if (success) {
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
            "$route": function (newVal, oldVal) {
            },
            "$route.params.q": function(newVal, oldVal){
                console.log("change in search term", newVal)
                this.loadPage()
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
        padding: 0 20px 5px;
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
            &:hover {
                box-shadow: 0px 3px 6px 2px rgba(0, 0, 0, 0.1);
                cursor: pointer;
            }
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
                    i {font-size: 80%;}
                }
            }
        }





        div.card {
            display: none;
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

                .top-line {
                    display: flex;
                    justify-content: space-between;
                    opacity: .8;
                    background: #eee;
                    border-radius: 5px 5px 0 0;
                    padding: 3px;
                    .value {
                        text-transform: capitalize;
                        font-size: 12px;
                        display: flex;
                        align-items: center;

                        .num {
                            display: flex;
                            justify-content: center;
                            font-weight: bold;
                            align-items: center;
                            /*background: #555;*/
                            /*border-radius: 30px;*/
                            width: 16px;
                            height: 16px;
                            font-size: 11px;
                            padding-top: 1px;
                        }

                    }
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
                    /*border-top: 1px solid #ddd;*/
                    padding: 5px 0;
                    margin: 5px 0;

                    .mesh, .entity {
                        display: none;
                    }

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
        margin: 10px;
        .controls {
            display: flex;
            justify-content: center;
        }

    }

    .slide-enter-active, .slide-leave-active {
        transition: transform 300ms;
    }

    .slide-leave, .slide-enter-to {
        transform: translateX(5%);

    }

    .slide-enter, .slide-leave-to {
        transform: translateX(100%);
    }

    #article-zoom {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 5%;
        width: 95%;
        /*transform: translateX(100%);*/
        background: #fff;
        z-index: 999;
        overflow: scroll;
    }


</style>















