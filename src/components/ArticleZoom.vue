<template>
    <div class="article-zoom" v-if="paper">

        <div class="col closer"  @click="$emit('close')">
            <div class="close-button">
                <!--<i class="fas fa-chevron-right"></i>-->
                &times;
            </div>
        </div>

        <div class="col content">

            <div class="header">
                <h1>
                    <span class="chunk-container" v-for="chunk in titleChunks">
                        <span class="chunk entity"
                              v-html="chunk.spot"
                              v-if="chunk.abstract"
                              @click="toggleEntity(chunk)">

                        </span>
                        <span class="chunk text"
                              v-html="chunk.text"
                              v-if="!chunk.abstract"></span>
                    </span>
                </h1>
                <div class="line source">
                    <span class="date">{{ paper.year }}</span> in
                    <span class="journal">{{ paper.journal_name }}</span>
                </div>
                <!--<div class="line tag-thingies">-->
                    <!--<div class="oa value" v-if="paper.oa_url">-->
                        <!--<i class="fas fa-unlock"></i>-->
                        <!--Open access-->
                    <!--</div>-->

                    <!--<div class="value" v-if="paper.pubType">-->
                        <!--{{paper.pubType.pub_type_gtr}}-->
                    <!--</div>-->
                <!--</div>-->
            </div>

            <div class="abstract">
                <span class="chunk-container" v-for="chunk in abstractChunks">
                    <span class="chunk entity"
                          v-html="chunk.spot"
                          v-if="chunk.abstract"
                          @click="toggleEntity(chunk)">
                    </span>
                    <span class="chunk text"
                          v-if="!chunk.abstract"
                          v-html="chunk.text"
                    ></span>
                </span>
            </div>

            <div class="actions">
                <md-button class="md-raised"
                           :href="paper.oa_url"
                           v-show="paper.oa_url">
                    full article (open access)
                    <i class="fas fa-external-link-alt"></i>
                </md-button>

            </div>


            <div class="extra" v-show="paper.picture_candidates.length || paper.displayAuthors.length">
                <div class="line authors" v-show="paper.displayAuthors.length">
                    <div class="label">
                        Authors:
                    </div>
                    <div class="items">
                        {{paper.displayAuthors}}
                    </div>
                </div>
                <div class="line topics" v-show="paper.picture_candidates.length">
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

                <div class="line fulltext">
                    <div class="label">Full text:</div>
                    <div class="items">
                        <span class="available" v-show="paper.oa_url">
                            Available for free <a :href="paper.oa_url">here</a>
                        </span>
                        <span class="available" v-show="!paper.oa_url">
                            Paywalled on the publisher site <a :href="paper.doi_url">here</a>
                        </span>
                    </div>
                </div>

                <div class="line article-type" v-show="paper.pubType.pub_type_gtr">
                    <div class="label">Type: </div>
                    <div class="items">
                        <em>{{paper.pubType.pub_type_gtr}}: </em>
                        <span class="explanation">
                            {{ pubTypeExplanation(paper.pubType.pub_type_gtr) }}
                        </span>
                    </div>


                </div>

            </div>
            
            <div class="news" v-show="paper.news_articles.length">
                <h2>News coverage</h2>
                <div class="news-article" v-for="newsArticle in paper.news_articles">
                    <span class="date">
                        {{ newsArticle.occurred_at | moment("MMM YYYY")}}
                    </span>
                    <a :href="newsArticle.news_url">
                        {{newsArticle.news_title}}
                        <i class="fas fa-external-link-alt"></i>
                    </a>
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
            pubTypeExplanation(type){
                let data = {
                    "case study": "An up-close, in-depth, and detailed explanation of one particular patient and their situation.  Because it only describes a single case, extreme caution should be used in applying its conclusions to any other patients or situations.",
                    "clinical trial": "An experiment or observation on a group of human participants, designed to answer specific questions about biomedical or behavioral interventions, including new treatments (such as novel vaccines, drugs, dietary choices, dietary supplements, and medical devices) and known interventions that warrant further study and comparison.",
                    "editorial content": "Discusses, supports, or disputes an article.  Editorial content is usually not peer-reviewed, even if published in an otherwise peer-reviewed journal.",
                    "guidelines": "A document written with the aim of guiding decisions regarding diagnosis, management, and treatment of healthcare.  Guidelines may be developed by government agencies, institutions, organizations such as professional societies or governing boards, or by a convening of experts.",
                    "meta-analysis": "A type of study that combines the results of multiple scientific studies, leading to a more robust conclusion than is possible from any single study.",
                    "news and interest": "Discusses, supports, or disputes an article. News and interest stories are usually not peer-reviewed, even if published in an otherwise peer-reviewed journal.",
                    "randomized controlled trial": "A clinical trial in which the decision about which patient receives which treatment is decided randomly.  This type of study eliminates some kinds of error, leading to a more trustworthy result than a non-randomized controlled trial.",
                    "research study": "A general scientific report on a topic, usually following the scientific method.  The research study may involve an experiment, or it may be an observational study in which the research observes but does not intervene.",
                    "review": "An article that summarizes previously published studies on a subject. It provides background and context for the results of these studies, and so is useful for learning about a subject and the strengths and weaknesses of studies in the area."
                }
                if (type){
                    return data[type]
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
        background: #dadada;
        padding: 0;
        display: flex;
        box-shadow: 0 0 30px 20px rgba(0,0,0,.5);


        .closer {
            border-left: 1px solid #fff;
            background: #fafafa;
            padding: 25px 15px;
            font-size: 40px;
            color: #333;
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
                a.md-button {
                    margin-left: 0px;
                }
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
            height: 100%;
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














