<template>
    <div class="root"  v-if="result">
        <v-toolbar dark>
            <v-layout >
                <v-flex shrink>
                    <v-btn  dark  depressed class="close-button" @click="$emit('close')">
                        <span>
                            <i class="fas fa-arrow-left"></i> back to results

                        </span>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-toolbar>
        <v-container class="article-zoom">


            <v-layout row class="header">
                <v-flex>
                    <annotated-content
                            :content="result.title"
                            class="display-1"
                            :annotations="result.title_annotations">
                    </annotated-content>

                    <div class="line source py-1">
                        <span class="date">{{ result.year }}</span> in
                        <span v-html="result.journal_name" class="journal font-italic"></span>
                        by
                        <span class="authors">{{displayAuthors}}</span>
                    </div>
                    <div class="line topics pt-3"  v-show="result.topics.length">
                        <div class="items">
                            <span class="topic"
                                  @click="searchTopic(topic)"
                                         :to="'/search?q='+ topic.replace(' ', '_')"
                                         v-for="(topic, index) in result.topics">
                                {{topic}}
                            </span>

                        </div>
                    </div>

                </v-flex>

            </v-layout>

            <div class="abstract">
                <div class="abstract-section pa-2" v-for="section in result.abstract">
                    <div class="font-weight-bold text-capitalize" v-html="section.heading"></div>
                    <annotated-content
                            :content="section.text"
                            :annotations="section.annotations"
                            class="abstract">
                    </annotated-content>

                </div>
            </div>

            <div class="actions pt-2">
                <v-btn class="primary"
                       :href="result.oa_url"
                       v-show="result.oa_url">
                    full article
                    <i class="fas fa-external-link-alt pl-2"></i>
                </v-btn>

                <v-btn depressed
                       :href="result.doi_url"
                       v-show="!result.oa_url">
                    full article (paywalled)
                    <i class="fas fa-external-link-alt pl-2"></i>
                </v-btn>

            </div>


            <div class="news-articles" v-show="result.news_articles.length">
                <h2 class="headline">News coverage</h2>
                <div class="news-article py-2" v-for="newsArticle in result.news_articles">
                        <span class="date">
                            {{ newsArticle.occurred_at | moment("MMM YYYY")}}:
                        </span>
                    <a :href="newsArticle.news_url">
                        {{newsArticle.news_title}}
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
            <div class="px-2 mt-5">
                <small>
                    <a :href="apiUrl" class="grey--text">View this page in API</a>
                    |
                    <a class="grey--text" href="mailto:team@impactstory.org">Report issue</a>
                </small>
            </div>
        </v-container>

    </div>



</template>

<script>
    import _ from 'lodash'
    import AnnotatedContent from "../components/AnnotatedContent";
    import {search} from "../search";


    export default {
        name: "ArticleZoom",
        props: ["result"],
        components: {
            AnnotatedContent
        },
        data: () => ({
            answer: 42
        }),
        computed: {
            displayAuthors(){

                let ret
                let numAuths = this.result.author_lastnames.length
                if (numAuths > 5) {
                    let numHidden = numAuths - 5
                    ret = this.result.author_lastnames.slice(0, 5).join(", ") + `, and ${numHidden} others`
                } else {
                    ret = this.result.author_lastnames.join(", ")
                }
                return ret
            },
            apiUrl(){
                return "https://gtr-api.herokuapp.com/paper/doi/"
                    + this.result.doi
            }
        },
        methods: {
            searchTopic(topic){
                console.log("search topic", topic)
                search.setQ(_.snakeCase(topic))
            }
        },
        watch: {}
    }
</script>

<style scoped lang="scss">
    .article-zoom {

        .display-1 {
            @media screen and (max-width: 600px) {
                font-size: 22px !important;
                font-weight: bold;
                line-height: 1.3 !important;
            }
        }

        .closer {
            border-left: 1px solid #fff;
            background: #fafafa;
            padding: 25px 15px;
            font-size: 40px;
            color: #333;
            cursor: pointer;
        }
        span.topic {
            border: 1px solid;
            margin-right: 5px;
            margin-top: 5px;
            border-radius: 20px;
            text-decoration: none;
            padding: 3px 10px;
            white-space: nowrap;
            display:inline-block;
            cursor: pointer;
            color: #555;
        }

        .abstract {
            line-height: 1.5;
            margin-top: 20px;
            font-size: 18px;
        }


    }


</style>














