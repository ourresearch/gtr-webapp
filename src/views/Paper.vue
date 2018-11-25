<template>
    <div class="root">

        <div class="loaded" v-if="!loading">
            <div class="paper-meta">
                <h1>{{paper.title}}</h1>
                <div class="metdata-row publication">
                    <span class="year">{{paper.year}}</span> in
                    <span class="journal-name">{{paper.journal_name}}</span>
                </div>
                <div class="metadata-row authors">
                    By <span class="author-lastnames">{{paper.author_lastnames.join(", ")}}</span>
                </div>
                <div class="metadata-row access">
                    <div class="paywalled linkout" v-if="!paper.best_version">
                        {{paper.doi_url}}

                        <a :href="paper.doi_url">
                            <i class="fas fa-lock"></i>
                            Full article on publisher site (paywalled)
                        </a>
                    </div>
                    <div class="oa linkout" v-if="paper.best_version">

                        <a :href="paper.oa_url" v-if="paper.best_host=='publisher'">
                            <i class="fas fa-unlock-alt"></i>
                            Full article on publisher site (open access)
                        </a>

                        <a :href="paper.oa_url" v-if="paper.best_host=='repository'">
                            <i class="fas fa-unlock-alt"></i>
                            Full article shared by author (open access)
                        </a>

                    </div>

                    <div class="extra">
                        <a :href="apiUrl">
                            <i class="fa fa-cogs"></i>
                            API
                        </a>
                    </div>
                </div>
            </div>


            <div class="paper-content">
                <div class="abstract">
                    <span class="abstract-chunk-container" v-for="chunk in abstractChunks">
                        <a class="chunk entity" v-html="chunk.rawName" v-if="chunk.nerd_selection_score > 0.5" href="" @click.prevent="selectEntity(chunk)"></a>
                        <span class="chunk plaintext" v-if="chunk.nerd_selection_score <= 0.5">{{chunk.rawName}}</span>
                    </span>
                </div>


                <div class="selected-entity" v-if="selectedEntity">
                    <div class="header">
                        <span class="term">
                            {{selectedEntity.preferredTerm}}
                        </span>
                        <span class="close" @click="selectedEntity=false">&times;</span>
                    </div>
                    <div class="body">
                        <img :src="selectedEntity.imgUrl" alt="">
                        <span class="definition" v-html="selectedEntity.definition">
                        </span>
                    </div>


                    <!--<span class="long">{{selectedEntity.longDefinition}}</span>-->
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
        name: "Paper",
        data: () => ({
            loading: true,
            paper: {},
            selectedEntity: false
        }),
        computed: {
            apiUrl(){
                let namespace = this.$route.params.namespace
                let id = this.$route.params.id
                let url = "https://gtr-api.herokuapp.com/paper/" + namespace + "/" + id
                return url
            },
            abstractChunks() {

                // make sure we have an abstract
                if (!this.paper || !this.paper.abstract) {
                    return ""
                }
                let abstract = this.paper.abstract

                // make sure we have entities
                if (!this.paper.nerd.entities.length) {
                    return this.paper.abstract
                }
                let entities = this.paper.nerd.entities

                // split the abstract into a bunch of chunks...some chunks are entities,
                // the other chunks are the text in between entities.
                let chunks = []
                let cursorIndex = 0
                entities.forEach(function(entity, index){

                    // between-entity chunks
                    if (entity.offsetStart > 0) {
                        let plaintextChunk = {
                            rawName: abstract.slice(cursorIndex, entity.offsetStart),
                            nerd_selection_score: 0
                        }
                        chunks.push(plaintextChunk)
                    }

                    // hydrate and save the entity chunks
                    // todo: centralize the > 0.5 stuff which is currently both here an in the templates
                    if (entity.nerd_selection_score > .5){
                        let nerdUrl = "http://cloud.science-miner.com/nerd/service/kb/concept/" + entity.wikipediaExternalRef + "?lang=en"
                        axios.get(nerdUrl)
                            .then(resp => {
                                console.log("got NERD entity response back", resp)
                                let def = resp.data.definitions[0].definition

                                // first we handle links where wiki markup is showing one thing
                                // but linking to another. they do that like this [[link_to_this|show_this]]
                                let re = /\[\[([^\]]+)\|([^\]]+)\]\]/gi
                                def = def.replace(
                                    re,
                                    "<a href='https://en.wikipedia.org/wiki/$1'>$2</a>"
                                )

                                // then we handle the simpler kind of link where the thing inside the
                                // square brackets is both what we show and what we link to

                                let reSimple = /\[\[([^\]]+)\]\]/gi
                                def = def.replace(
                                    reSimple,
                                    "<a href='https://en.wikipedia.org/wiki/$1'>$1</a>"
                                )
                                entity.definition = def

                                // for debugging
                                entity.longDefinition = resp.data.definitions[0].definition

                                // take note of the preferred term, we'll use this in the display.
                                entity.preferredTerm = resp.data.preferredTerm
                            })
                            .catch(e => {
                                console.log("error from NERD server", e)
                            })

                        let wikiImgUrl = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&origin=*&pithumbsize=200&pageids=" + entity.wikipediaExternalRef
                        axios.get(wikiImgUrl)
                            .then(resp => {
                                console.log("got wikipedia image URL back", resp)
                                let page = Object.values(resp.data.query.pages)[0] // there should only ever be one page
                                console.log("got this wiki page response:", page)


                                if (page.thumbnail){
                                    entity.imgUrl = page.thumbnail.source
                                }
                            })
                            .catch(e => {
                                console.log("error from wikipedia api", e)
                            })



                        chunks.push(entity)
                    }

                    // update the cursor
                    cursorIndex = entity.offsetEnd
                })

                if (cursorIndex < abstract.length){
                    chunks.push({
                        rawName: abstract.slice(cursorIndex, abstract.length),
                        nerd_selection_score: 0
                    })
                }

                return chunks
            }
        },
        methods: {
            selectEntity(entity){
                console.log("selecting entity", entity)
                this.selectedEntity = entity
                return false
            },
            doQuery(){
                console.log("doing query")
                this.loading = true
                axios.get(this.apiUrl)
                    .then(resp => {
                        console.log("got paper back", resp.data)
                        this.paper = resp.data
                        this.loading = false
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        this.loading = false
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
        min-height: 100vh;
    }

    .loaded {
        margin-left: 150px;
        margin-bottom: 100px;
        max-width: 1100px;
        font-size: 16px;
        .paper-meta {
            margin-bottom: 50px;
            line-height: 1.5;

            h1 {
                margin: 50px 0 0;
            }
            .publication {
                color: #1B5E20;
            }
            .metadata-row.access {
                display: flex;
                justify-content: space-between;

                .extra {
                    margin-right: 50px;
                    a {
                        color: #999;
                    }
                }
            }

        }
        .paper-content {
            display: flex;
            line-height: 1.5;
            font-size: 17px;
            .abstract {
                max-width: 600px;
                margin-right: 20px;
            }
            .selected-entity {
                max-width: 400px;
                .header {
                    font-weight: bold;
                    font-size: 120%;
                    color: #fff;
                    background: #555;
                    padding: 10px 20px;
                    display: flex;
                    justify-content: space-between;
                    .close {
                        cursor: pointer;
                    }
                }
                .body {
                    padding: 10px 20px;
                    img {
                        float: right;
                        margin: 10px;
                    }
                }

                margin: 0 20px;
                border: 1px solid #333;
            }
        }

    }

</style>














