<template>
    <div class="row">
        <div class="image">
            <div class="img-wrapper">
                <img :src="result.image.image_url" alt="">
            </div>
            <div class="label">
                {{result.image.title}}
            </div>
        </div>

        <div class="content">
            <div class="line evidence">
                <span class="val" v-if="pubType">
                    {{pubType.pub_type_gtr}}
                </span>
            </div>
            <div class="line  article-title pb-2">
                <span class="is-oa" v-if="result.oa_url">
                    <i class="fas fa-unlock"></i>
                </span>
                <annotated-content
                        :content="result.title"
                        :annotations="result.title_annotations">
                </annotated-content>

            </div>

            <annotated-content
                    v-if="summary"
                    :content="summary.text"
                    :annotations="summary.annotations"
                    class="line short-abstract">
            </annotated-content>




            <div class="line source">
                <span class="date">{{ result.year }}</span>

                <span v-html="result.journal_name" class="journal"></span>
            </div>


            <div class="actions line">
                <v-btn small flat @click="$emit('selected')">Learn more</v-btn>
            </div>


        </div>


    </div>


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
    padding: 20px 30px;
    margin: 20px 30px;


    .image {
        flex: 0 0 200px;
        margin-right: 25px;

        .img-wrapper {
            background: #fafafa;
            min-height: 100px;
            padding: 10px;

            img {
                border-radius: 5px;
                /*border: 1px solid #333;*/
                width: 250px;

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
            .is-oa {
                font-size: 70%;
                vertical-align: 2px;
                margin-right: 5px;
            }
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














