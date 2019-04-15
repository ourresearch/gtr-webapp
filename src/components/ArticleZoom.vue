<template>
    <div class="article-zoom" v-if="paper">

        <div class="col closer"  @click="$emit('close')">
            <div class="close-button">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>

        <div class="col content">

            <div class="header">
                <h1>
                    <span class="chunk-container" v-for="chunk in titleChunks">
                        <span class="chunk entity" v-html="chunk.spot" v-if="chunk.abstract"
                           @click="toggleEntity(chunk)">

                        </span>
                        <span class="chunk text" v-if="!chunk.abstract">{{chunk.text}}</span>
                    </span>
                </h1>
                <div class="line source">
                    <span class="date">{{ paper.year }}</span> in
                    <span class="journal">{{ paper.journal_name }}</span>
                </div>
                <div class="line tag-thingies">
                    <div class="oa value" v-if="paper.oa_url">
                        <i class="fas fa-unlock"></i>
                        Open access
                    </div>

                    <div class="value" v-if="paper.pubType">
                        {{paper.pubType.pub_type_gtr}}
                    </div>
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
                <md-button class="md-raised">
                    <i class="fas fa-unlock"></i>
                    read full article
                </md-button>

            </div>


            <div class="extra">
                <div class="line authors" v-show="paper.displayAuthors">
                    <div class="label">
                        Authors:
                    </div>
                    <div class="items">
                        {{paper.displayAuthors}}
                    </div>
                </div>
                <div class="line topics">
                    <div class="label">Topics:</div>
                    <div class="items">
                        <router-link class="topic"
                                     :to="'/search/'+candidate.title.replace(' ', '_')"
                                     v-for="(candidate, index) in paper.picture_candidates">
                            {{candidate.title}}<span class="sep"
                                                     v-if="index+1 < paper.picture_candidates.length">;</span>
                        </router-link>

                    </div>
                </div>
            </div>
        </div>



        <div class="col anno">

            <div class="col-content">
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



        </div>




    </div>










        <!--<div class="section fulltext">-->
            <!--fulltext-->
        <!--</div>-->
        <!--<div class="section news">-->
            <!--news-->
        <!--</div>-->



        <!--<div class="footer">-->
            <!--<div class="tab-links">-->
                <!--<div class="tab-link"-->
                     <!--v-for="(tab, index) in tabs"-->
                     <!--@click="selectedTabIndex=index"-->
                <!--&gt;-->
                    <!--<div class="name">-->
                        <!--{{tab}}-->
                    <!--</div>-->
                    <!--<div class="selected-indicator" :class="{selected: selectedTabIndex===index}">-->

                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->




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
            selectedEntity: false,
            selectedTabIndex: 0,
            tabs: [
                "overview",
                "abstract",
                "full-text options",
                "news stories"
            ]
        }),
        computed: {
            abstractChunks() {
                return makeChunks(
                    this.paper.abstract,
                    this.paper.annotations.using_article_abstract
                )
            },
            shortAbstractChunks(){
                return makeChunks(
                    this.paper.short_abstract,
                    this.paper.annotations.using_article_short_abstract
                )
            },
            titleChunks(){
                return makeChunks(
                    this.paper.title,
                    this.paper.annotations.using_article_title
                )
            },
            selectedTab(){
                return this.tabs.find(tab => {
                    return tab.isSelected
                })
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
            },
            selectTab(name){
                console.log("select tab", name)

                this.tabs.forEach(tab => {
                    if (tab.name===name){
                        tab.isSelected = true
                    }
                    else {
                        tab.isSelected = false
                    }
                })
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
        background: #dadada;
        padding: 0;
        display: flex;
        box-shadow: 0 0 30px 20px rgba(0,0,0,.5);


        .closer {
            border-left: 1px solid #fff;
            background: #eee;
            padding: 10px;
            font-size: 40px;
            display: flex;
            align-items: center;
            color: #555;
            cursor: pointer;


        }



        .entity {
            background: rgba(0,200,100,.15);
            cursor: pointer;
            padding: 0 3px;
            white-space: nowrap;
            border-radius: 3px;
        }

        .col.content {
            flex: 2;
            padding: 30px;
            .close-button {
                font-size: 20px;
                color: dodgerblue;
                line-height: 1;
                cursor: pointer;
                margin-bottom: 10px;
            }
            .header {
                h1 {
                    margin: 0;
                }
                .line {
                    &.source {
                        font-weight: bold;
                        font-size: 18px;
                    }
                    &.tag-thingies {
                        display: flex;
                        padding-top: 5px;
                        .value {
                            padding: 2px 6px;
                            margin-right: 3px;
                            border-radius: 3px;
                            display: inline;
                            border: 1px solid #999;
                        }
                    }
                }
            }
            .abstract {
                line-height: 1.6;
                margin-top: 10px;
                padding-top: 20px;
                font-size: 20px;
            }

            .actions {

            }

            .extra {
                padding: 30px 0 100px;
                .line {
                    display: flex;
                    font-size: 16px;
                    .label {
                        font-weight: bold;
                        margin-right: 3px;
                    }
                }
            }

        }


        .col.anno {
            flex: 1;
            .col-header {
                display: flex;
                justify-content: flex-end;


            }
            .col-content {
                background: #fafafa;
                padding: 20px;
                height: 100%;
                .controls {
                    display: flex;
                    .close {
                        font-size: 38px;
                        cursor: pointer;
                    }
                    .spacer {
                        flex: 1;
                    }
                }

                .anno-empty {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 100%;
                    .content {
                        max-width: 250px;
                        display: flex;
                        align-items: center;
                        .text {
                        }
                        .image {
                            font-size: 24px;
                            margin-right: 10px;
                        }
                    }
                }

                .header {
                    font-weight: bold;
                    font-size: 120%;
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
                    }
                }
                .footer {
                    text-align: right;
                    font-size: 80%;
                    padding-right: 30px;
                }
            }






        }












        .footer {
            margin-top: 20px;
            .tab-links {
                display: flex;
                justify-content: center;
                .tab-link {
                    padding: 5px 20px 0;
                    text-transform: uppercase;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    .selected-indicator {
                        height: 5px;
                        margin-top: 5px;
                        background: transparent;
                        &.selected {
                            background: red;
                        }
                    }
                }
            }
        }

    }


</style>














