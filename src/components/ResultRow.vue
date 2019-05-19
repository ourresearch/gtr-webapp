<template>
    <v-layout class="row">
        <v-flex sm3 hidden-xs-only class="image">
            <div class="img-wrapper">
                <img :src="result.image.image_url" alt="">
<!--                hack to fix autism example -->
                <img src="https://i.imgur.com/9JwcSuG.png" v-if="result.doi=='10.1586/14760584.3.1.19'" alt="">

            </div>
            <div class="label">
                {{result.image.title}}
            </div>
        </v-flex>

        <v-flex sm9 class="content" :class="{'px-5': $vuetify.breakpoint.mdAndUp}">
            <div class="line evidence">
                <span class="val" v-if="pubType">
                    <annotated-content
                        :content="pubType.pub_type_gtr"
                        :annotations="[inPlaceAnnotation(pubType.pub_type_gtr)]">
                    </annotated-content>



                </span>
            </div>
            <div class="line  article-title">

                <annotated-content
                        :content="result.title"
                        :annotations="result.title_annotations">
                </annotated-content>

            </div>



            <div class="line source">
                <span class="date">{{ result.year }}</span>

                <span v-html="result.journal_name" class="journal"></span>
            </div>
            <div class="line access-status body-1" v-if="false">
                <span class="is-oa" v-if="result.oa_url">
                    <i class="fas fa-lock-open oa-icon"></i>
                    Free to read
                </span>
            </div>
            <div class="space pt-2"></div>


            <annotated-content
                    v-if="summary"
                    :content="summary.text"
                    :annotations="summary.annotations"
                    class="line short-abstract">
            </annotated-content>


            <div class="actions line">
                <a class="learn-more" href="" @click.prevent="$emit('selected')">Learn more</a>
                <v-btn small depressed v-if="false && result.oa_url" class="learn-more full-article mx-2">
                    <span>
                        <i class="fas fa-lock-open"></i>
                        full article

                    </span>
                </v-btn>


            </div>


        </v-flex>


    </v-layout>


</template>

<script>
    import AnnotatedContent from "../components/AnnotatedContent";


    export default {
        name: "ResultRow",
        props: ["result"],
        components: {
            AnnotatedContent
        },
        data: () => ({
            selectedEntity: false,
        }),
        computed: {
            pubType(){
                this.result.pub_types.sort((a, b) => {
                    return a.evidence_level - b.evidence_level
                })
                return this.result.pub_types.find(x => {
                    return x.pub_type_gtr
                })
            },
            summary(){
                return this.result.abstract.find(x => {
                    return x.summary
                })
            }


        },
        methods: {
            inPlaceAnnotation(topic) {
                return {
                    confidence: 1.0,
                    end: topic.length,
                    start: 0,
                    spot: topic,
                    title: topic
                }
            }
        },
        watch: {
            paper: function (newVal, oldVal) {
                // this.selectedEntity = null
            }
        }
    }
</script>

<style scoped lang="scss">
div.row {
    display: flex;
    padding: 20px 0;
    margin: 20px 0;


    .image {

        .img-wrapper {
            background: #fafafa;
            min-height: 100px;
            padding: 10px;

            img {
                border-radius: 5px;
                /*border: 1px solid #333;*/
                max-width: 100%;

            }

        }

        .label {
            font-size: 11px;
            text-align: right;
            opacity: .7;
        }

    }

    .content {
        line-height: 1.5;
        flex: 1;

        .evidence {
            font-size: 15px;
            text-transform: capitalize;
            line-height: 1;
        }

        .article-title {
            line-height: 1.4;
            font-size: 20px;
            font-weight: 500;

        }
        .oa-icon {
            font-size: 70%;
            vertical-align: 1px;
            margin-right: 2px;
        }

        a.learn-more {
            height: auto;
            padding: 4px 0 3px;
            color: #333;
        }


        .source {
            font-size: 15px;

            .journal {
                margin-left: 5px;
                font-style: italic;
            }
        }


    }
}

</style>














