<template>
    <div class="row">
        <div class="image">
            <div class="img-wrapper">
                <img :src="result.image.url" alt="">
            </div>
            <div class="label">
                {{result.image.title}}
            </div>
        </div>

        <div class="content">
            <div class="line evidence">
                <span class="val" v-if="result.pubType">
                    {{result.pubType.pub_type_gtr}}
                </span>
            </div>
            <annotated-content
                    :content="result.title"
                    :annotations="result.annotations.using_article_title"
                    class="line title">
            </annotated-content>

            <annotated-content
                    v-if="result.abstract_short"
                    :content="result.abstract_short"
                    :annotations="result.annotations.using_article_abstract_short"
                    class="line short-abstract">
            </annotated-content>


            <div class="line source">
                <span class="date">{{ result.year }}</span>

                <span class="journal">{{ result.journal_name }}</span>
            </div>
            <div class="line oa" v-if="result.oa_url">
                <i class="fas fa-unlock"></i>
                Open Access
            </div>

            <div class="actions line">
                <v-btn @click="setArticleZoom(result.doi)">Learn more</v-btn>
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

        .title {
            font-size: 24px;
            margin-bottom: 5px;
            line-height: 1.4;
        }

        .summary {
            margin-bottom: 20px;
        }

        .source {
            font-size: 15px;

            .journal {
                margin-left: 5px;
                font-style: italic;
            }
        }

        .oa {
            line-height: 1;
            font-size: 15px;

            i {
                font-size: 80%;
            }
        }


    }
}

</style>














