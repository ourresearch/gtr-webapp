<template>
    <v-container class="article-zoom" v-if="paper">


        <v-layout class="header">
            <v-flex>
                <annotated-content
                        :content="paper.title"
                        :annotations="paper.annotations.using_article_title"
                        class="line  display-1">
                </annotated-content>

                <div class="line source">
                    <span class="date">{{ paper.year }}</span> in
                    <span class="journal font-italic">{{ paper.journal_name }}</span>
                    by
                    <span class="authors">{{displayAuthors}}</span>
                </div>
                <div class="line topics" v-if="false" v-show="paper.picture_candidates.length">
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

            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink>
                <v-btn large depressed class="close-button" @click="$emit('close')">
                    <span>
                        <i class="fas fa-times"></i> close

                    </span>
                </v-btn>
            </v-flex>

        </v-layout>


        <div class="header">
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


<!--        <div class="extra" v-if="false" v-show="paper.picture_candidates.length || paper.displayAuthors.length">-->
<!--            <div class="line authors" v-show="paper.displayAuthors.length">-->
<!--                <div class="label">-->
<!--                    Authors:-->
<!--                </div>-->
<!--                <div class="items">-->
<!--                    {{paper.displayAuthors}}-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="line topics" v-if="paper.picture_candidates.length">-->
<!--                <div class="label">Topics:</div>-->
<!--                <div class="items">-->
<!--                    <router-link class="topic"-->
<!--                                 :to="'/search/'+candidate.title.replace(' ', '_')"-->
<!--                                 v-for="(candidate, index) in paper.picture_candidates">-->
<!--                        {{candidate.title}}<span class="sep"-->
<!--                                                 v-if="index+1 < paper.picture_candidates.length">;</span>-->
<!--                    </router-link>-->

<!--                </div>-->
<!--            </div>-->

<!--            <div class="line fulltext">-->
<!--                <div class="label">Full text:</div>-->
<!--                <div class="items">-->
<!--                        <span class="available" v-show="paper.oa_url">-->
<!--                            Available for free <a :href="paper.oa_url">here</a>-->
<!--                        </span>-->
<!--                    <span class="available" v-show="!paper.oa_url">-->
<!--                            Paywalled on the publisher site <a :href="paper.doi_url">here</a>-->
<!--                        </span>-->
<!--                </div>-->
<!--            </div>-->

<!--            <div class="line article-type" v-if="paper.pubType && paper.pubType.pub_type_gtr">-->
<!--                <div class="label">Type:</div>-->
<!--                <div class="items">-->
<!--                    <em>{{paper.pubType.pub_type_gtr}}: </em>-->
<!--                    <span class="explanation">-->
<!--                            {{ pubTypeExplanation(paper.pubType.pub_type_gtr) }}-->
<!--                        </span>-->
<!--                </div>-->


<!--            </div>-->

<!--        </div>-->

<!--        <div class="news" v-show="paper.news_articles.length">-->
<!--            <h2>News coverage</h2>-->
<!--            <div class="news-article" v-for="newsArticle in paper.news_articles">-->
<!--                    <span class="date">-->
<!--                        {{ newsArticle.occurred_at | moment("MMM YYYY")}}-->
<!--                    </span>-->
<!--                <a :href="newsArticle.news_url">-->
<!--                    {{newsArticle.news_title}}-->
<!--                    <i class="fas fa-external-link-alt"></i>-->
<!--                </a>-->
<!--            </div>-->
<!--        </div>-->


    </v-container>


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
            displayAuthors(){


                let ret
                let numAuths = this.paper.author_lastnames.length
                if (numAuths > 5) {
                    let numHidden = numAuths - 5
                    ret = this.paper.author_lastnames.slice(0, 5).join(", ") + `, and ${numHidden} others`
                } else {
                    this.paper.displayAuthors = this.paper.author_lastnames.join(", ")
                }
                return ret
            }
        },
        methods: {},
        watch: {}
    }
</script>

<style scoped lang="scss">
    .article-zoom {


        .closer {
            border-left: 1px solid #fff;
            background: #fafafa;
            padding: 25px 15px;
            font-size: 40px;
            color: #333;
            cursor: pointer;


        }

        .abstract {
            line-height: 1.6;
            margin-top: 10px;
            padding-top: 20px;
            font-size: 20px;
        }


    }


</style>














