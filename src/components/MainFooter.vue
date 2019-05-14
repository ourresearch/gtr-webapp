<template>
    <v-footer dark height="auto" class="site-footer d-block pa-4">
        <div class="headline pb-2">
            <a class="mr-3" href="https://twitter.com/gettheresearch">
                <i class="fab fa-twitter"></i>
            </a>
            <a class="mx-3" href="mailto:team@impactstory.org">
                <i class="far fa-envelope"></i>
            </a>
            <a class="mx-3" href="https://github.com/impactstory">
                <i class="fab fa-github"></i>
            </a>
            <a class="faq ml-1" href="https://github.com/impactstory">
                FAQ
            </a>

        </div>




        <div>
            Built with <i class="far fa-heart"></i> at <a href="http://impactstory.org">Impactstory.</a>
        </div>

        <div>
            Made possible by the support of <a href="https://www.arcadiafund.org.uk/">Arcadia</a> – a charitable fund of Lisbet Rausing and Peter Baldwin.

        </div>


    </v-footer>
</template>

<script>
    export default {
        name: "MainFooter"
    }
</script>

<style scoped lang="scss">
    .v-footer {
        font-size: 14px;
    }
    a {
        color: #fff;
        &.faq {
            text-decoration: none;
            font-weight: bold;
            font-size: 75%;
        }
    }

</style>