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

                </div>

            </div>


            <div class="paper-content">
                <div class="main-col">
                    <div class="abstract">
                        <span class="abstract-chunk-container" v-for="chunk in abstractChunks">
                            <a class="chunk entity" v-html="chunk.rawName" v-if="chunk.nerd_selection_score > 0.5" href="" :click="selectEntity(chunk)"></a>
                            <span class="chunk plaintext" v-html="chunk.rawName" v-if="chunk.nerd_selection_score <= 0.5"></span>
                        </span>
                    </div>

                </div>

                <div class="selected-entity">
                    {{selectedEntity}}
                </div>

            </div>

        </div>


        <div class="page-bottom">
            <a :href="apiUrl">
                View in API.
            </a>
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
            selectedEntity: {}
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
                                entity.about = resp.data
                            })
                            .catch(e => {
                                console.log("error from NERD server", e)
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

                        // temp hack while we wait for author names to come back from server.
                        this.paper.author_lastnames = ["Piwowar", "Priem", "Campbell"]

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
        min-height: 90vh;
    }

    .main-col {
        max-width: 632px;
        margin-left: 150px;

        .paper-meta {

            h1 {
                margin: 50px 0 0;
            }

        }

        .abstract {
            .chunk {
                &.entity {
                    text-decoration: underline;
                }
            }
        }

    }
</style>















