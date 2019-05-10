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
                    <annotated-content
                        :content="paper.title"
                        :annotations="paper.annotations.using_article_title"
                        class="line title">
                    </annotated-content>

                </h1>
                <div class="line source">
                    <span class="date">{{ paper.year }}</span> in
                    <span class="journal">{{ paper.journal_name }}</span>
                </div>
            </div>

            <annotated-content
                    v-if="paper.abstract"
                    :content="paper.abstract"
                    :annotations="paper.annotations.using_article_abstract"
                    class="abstract">
            </annotated-content>

            <div class="actions">
                <v-btn class="md-raised"
                           :href="paper.oa_url"
                           v-show="paper.oa_url">
                    full article (open access)
                    <i class="fas fa-external-link-alt"></i>
                </v-btn>

            </div>


            <div class="extra" v-if="false" v-show="paper.picture_candidates.length || paper.displayAuthors.length">
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

                <div class="line article-type" v-if="paper.pubType && paper.pubType.pub_type_gtr">
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
    </div>






</template>

<script>
    import _ from 'lodash'
    import AnnotatedContent from "../components/AnnotatedContent";


    export default {
        name: "ArticleZoom",
        props: ["paper"],
        components: {
            AnnotatedContent
        },
        data: () => ({
            answer: 42
        }),
        computed: {
        },
        methods: {
        },
        watch: {
        }
    }
</script>

<style scoped lang="scss">
    .article-zoom {
        background: #dadada;
        padding: 0;
        display: flex;


        .closer {
            border-left: 1px solid #fff;
            background: #fafafa;
            padding: 25px 15px;
            font-size: 40px;
            color: #333;
            cursor: pointer;


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
                padding: 30px 0;
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














