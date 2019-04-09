<template>
    <div class="article-zoom">
        <div class="col about">
            <h1>{{paper.title}}</h1>
            <div class="line source">
                Published
                <span class="date">{{ paper.year }}</span>
                in
                <span class="journal">{{ paper.journal_name }}</span>
            </div>
            <div class="line authors" v-show="paper.displayAuthors">
                By {{paper.displayAuthors}}
            </div>
            <div class="abstract">
                <span class="abstract-chunk-container" v-for="chunk in abstractChunks">
                        <a class="chunk entity" v-html="chunk.rawName" v-if="chunk.nerd_selection_score > 0.5" href=""
                           @click.prevent="selectEntity(chunk)"></a>
                        <span class="chunk plaintext" v-if="chunk.nerd_selection_score <= 0.5">{{chunk.rawName}}</span>
                    </span>
            </div>
        </div>

        <div class="col anno">
            <div class="anno-empty" v-if="!selectedEntity">
                Click underlined words to learn more.
            </div>

            <div class="anno-full" v-if="selectedEntity">
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

            </div>
        </div>
    </div>


</template>

<script>
    import axios from 'axios'
    import _ from 'lodash'

    export default {
        name: "ArticleZoom",
        props: ["paper"],
        data: () => ({
            loading: true,
            selectedEntity: false
        }),
        computed: {
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
                entities.forEach(function (entity, index) {

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
                    if (entity.nerd_selection_score > .5) {
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


                                if (page.thumbnail) {
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

                if (cursorIndex < abstract.length) {
                    chunks.push({
                        rawName: abstract.slice(cursorIndex, abstract.length),
                        nerd_selection_score: 0
                    })
                }

                return chunks
            }
        },
        methods: {
            selectEntity(entity) {
                console.log("selecting entity", entity)
                this.selectedEntity = entity
                return false
            },
        }
    }
</script>

<style scoped lang="scss">
    .article-zoom {
        display: flex;


        background: #ddd;
        padding: 20px;
        .col {
            flex: 1;
            &.about {
                h1 {
                    margin: 0;
                }
                .authors {
                }
                .source {
                    .date {
                    }
                    .journal {
                        font-style: italic;
                    }
                }
                .abstract {
                    margin-top: 10px;
                }
            }

            &.anno {
                /*position: fixed;*/
                /*top: 0;*/
                /*left: 0;*/
                /*right: 0;*/
                /*bottom: 0;*/
                /*background: #fff;*/
                /*z-index: 9999;*/
                /*border: 1px solid #333;*/
                @media (min-width: 600px) {
                    position: static;
                    max-width: 500px;
                }
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
                        max-width: 150px;
                    }
                }

            }






        }

    }


</style>














