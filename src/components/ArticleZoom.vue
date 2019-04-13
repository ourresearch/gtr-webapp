<template>
    <div class="article-zoom">
        <div class="col about">
            <h1>
                <span class="chunk-container" v-for="chunk in titleChunks">
                    <span class="chunk entity" v-html="chunk.spot" v-if="chunk.abstract"
                       @click="toggleEntity(chunk)">

                    </span>
                    <span class="chunk text" v-if="!chunk.abstract">{{chunk.text}}</span>
                </span>


            </h1>
            <div class="meta">
                <div class="line source">
                    <span class="date">{{ paper.year }}</span> in
                    <span class="journal">{{ paper.journal_name }}</span>
                </div>


            </div>
            <div class="abstract">
                <span class="chunk-container" v-for="chunk in abstractChunks">
                    <span class="chunk entity" v-html="chunk.spot" v-if="chunk.abstract"
                       @click="toggleEntity(chunk)">

                    </span>
                    <span class="chunk text" v-if="!chunk.abstract">{{chunk.text}}</span>
                </span>
            </div>

            <div class="actions">

            </div>
            <div class="footer">
                <div class="line authors" v-show="paper.displayAuthors">
                    <strong>Authors:</strong> {{paper.displayAuthors}}
                </div>
                <div class="line topics">
                    <strong>Topics:</strong>
                    <router-link class="topic"
                       :to="'/search/'+candidate.title.replace(' ', '_')"
                       v-for="(candidate, index) in paper.picture_candidates">
                        {{candidate.title}}<span class="sep" v-if="index+1 < paper.picture_candidates.length">;</span>
                    </router-link>
                </div>
            </div>

        </div>

        <div class="col anno">
            <div class="controls">
                <div class="spacer"></div>
                <div class="close" @click="$emit('close')">&times;</div>
            </div>
            <div class="anno-empty" v-if="!selectedEntity">
                <div class="text">
                    <i class="fas fa-arrow-left"></i>
                    Click <span class="entity">highlighted words</span> to learn more!
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
    </div>


</template>

<script>
    import _ from 'lodash'
    
    function textChunk(str){
        return {text: str}
    }
    
    function makeChunks(str, annotations){
        if (!str){
            return textChunk("")
        }
        if (!annotations){
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
            if (entity.confidence < 0.7){
                // if it's low-confidence, treat is as a text chunk
                chunks.push(
                    textChunk(entity.spot)
                )
            }
            else {
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
        name: "ArticleZoom",
        props: ["paper"],
        data: () => ({
            loading: true,
            selectedEntity: false
        }),
        computed: {
            abstractChunks() {
                return makeChunks(
                    this.paper.abstract,
                    this.paper.annotations.using_article_abstract
                )
            },
            titleChunks(){
                return makeChunks(
                    this.paper.title,
                    this.paper.annotations.using_article_title
                )
            }
        },
        methods: {
            toggleEntity(entity) {
                console.log("toggling entity", entity)
                if (this.selectedEntity && entity.id === this.selectedEntity.id){
                    this.selectedEntity = null
                }
                else {
                    this.selectedEntity = entity
                }
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


        background: #dadada;
        padding: 20px 30px 30px;
        .entity {
            background: lightgoldenrodyellow;
            cursor: pointer;
            padding: 0 3px;
            white-space: nowrap;
            border-radius: 3px;
        }
        .col {
            &.about {
                flex: 2;
                font-size: 18px;


                margin-top: 20px;
                h1 {
                    margin: 0;
                    line-height: 1.3;
                }
                .meta {
                    margin-top: 5px;
                    font-weight: bold;
                    .source {
                        .date {
                        }
                        .journal {
                            font-style: italic;
                        }
                    }
                }
                .abstract {
                    line-height: 1.5;
                    margin-top: 10px;
                    padding-top: 20px;
                    font-size: 20px;

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

                flex: 1;

                margin-left: 30px;
                padding-left: 30px;
                /*display: flex;*/
                /*align-items: center;*/

                .controls {
                    display: flex;
                    .close {
                        font-size: 38px;
                        cursor: pointer;
                    }
                    .spacer{ flex: 1;}
                }

                .anno-empty {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 100%;
                }


                .header {
                    font-weight: bold;
                    font-size: 120%;
                    /*color: #fff;*/
                    /*background: #555;*/
                    padding: 10px 0;
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
                    img {
                        margin-top: 20px;
                        /*float: right;*/
                        /*margin: 10px;*/
                        /*max-width: 150px;*/
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














