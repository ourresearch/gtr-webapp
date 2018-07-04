<template>
    <div class="site-footer">
        <div class="content md-layout md-gutter">
            <div class="col md-layout-item md-size-30 md-xsmall-size-100 products">
                <div>
                    Built with <i class="far fa-heart"></i> at <a href="http://impactstory.org">Impactstory.</a>
                </div>
                <div>
                    <a href="https://twitter.com/gettheresearch">Twitter</a> |
                    <a href="mailto:team@impactstory.org">Email</a>

                </div>
            </div>



            <div class="col md-layout-item md-xsmall-size-100 user-guides">
            </div>

            <div class="col md-layout-item md-size-50 md-xsmall-size-100 about">
                Made possible by the support of <a href="https://www.arcadiafund.org.uk/">Arcadia</a> – a charitable fund of Lisbet Rausing and Peter Baldwin.
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        name: "MainFooter"
    }
</script>

<style scoped lang="scss">
    .site-footer {
        background: #333;
        display: flex;
        padding: 0 50px 50px 50px;
        font-size: 14px;

        .content {
            width: 800px;
            margin: 0 auto;
        }

        .col {
            color: #fff;
            margin-top: 50px;
            a {
                color: #fff;
                text-decoration: underline;
                &:hover {
                    color: #fff;
                }
            }
        }


    }


</style>