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
                        <a class="chunk entity" v-html="chunk.spot" v-if="chunk.abstract" href=""
                           @click.prevent="selectEntity(chunk)">

                        </a>
                        <span class="chunk text" v-if="!chunk.abstract">{{chunk.text}}</span>
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
                            {{selectedEntity.title}}
                            <span class="confidence">{{ selectedEntity.confidence.toFixed(2) }}</span>
                        </span>
                    <span class="close" @click="selectedEntity=false">&times;</span>
                </div>
                <div class="body">
                    <img :src="selectedEntity.image_url" alt="" v-if="selectedEntity.image_url">
                    <span class="definition" v-html="selectedEntity.abstract"></span>
                </div>
                <div class="footer">
                    via <a :href="selectedEntity.uri">Wikipedia</a>
                </div>

            </div>
        </div>
    </div>


</template>

<script>
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
                    return [""]
                }

                // if no entities, return one big chunk
                if (!this.paper.annotations || !this.paper.annotations.using_article_abstract.length) {
                    return [this.paper.abstract]
                }

                // split the abstract into a bunch of chunks...some chunks are entities,
                // the other chunks are the text in between entities.
                let chunks = []
                let cursorIndex = 0
                this.paper.annotations.using_article_abstract.forEach(entity => {

                    // add any plaintext chunk before the current entity
                    if (entity.start > 0) {
                        let textChunk = this.paper.abstract.slice(cursorIndex, entity.start)
                        chunks.push({text: textChunk})
                    }

                    // this entity
                    if (entity.confidence < 0.7){
                        // if it's low-confidence, treat is as a text chunk
                        chunks.push({text: entity.spot})
                    }
                    else {
                        chunks.push(entity)
                    }

                    // update the cursor
                    cursorIndex = entity.end
                })

                // after the last entity, there's generally one last hanging text chunk. add it.
                if (cursorIndex < this.paper.abstract.length) {
                    let lastTextChunk = this.paper.abstract.slice(cursorIndex, this.paper.abstract.length)
                    chunks.push({text: lastTextChunk})
                }

                return chunks
            }
        },
        methods: {
            selectEntity(entity) {
                console.log("selecting entity", entity)
                this.selectedEntity = entity
                return false
            }
        },
        watch: {
            paper: function(newVal, oldVal){
                this.selectedEntity = null
            }
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

                border-left: 1px solid #ccc;
                margin-left: 20px;
                /*display: flex;*/
                /*align-items: center;*/

                @media (min-width: 600px) {
                    position: static;
                    max-width: 500px;
                }

                .header {
                    font-weight: bold;
                    font-size: 120%;
                    /*color: #fff;*/
                    /*background: #555;*/
                    padding: 10px 20px;
                    display: flex;
                    justify-content: space-between;
                    .close {
                        cursor: pointer;
                    }
                    .confidence {
                        font-weight: 100;
                        font-size: 50%;
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
                .footer {
                    text-align: right;
                    font-size: 80%;
                    padding-right: 30px;
                }

            }






        }

    }


</style>














