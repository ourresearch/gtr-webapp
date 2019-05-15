



<template>
    <v-footer color="white" height="auto" class="site-footer d-block pa-5">
        <div class="pb-2 pt-4 title">
            <a class="mr-2" href="https://twitter.com/gettheresearch">
                <i class="fab fa-twitter"></i>
            </a>
            <a class="mx-2" href="mailto:team@impactstory.org">
                <i class="far fa-envelope"></i>
            </a>
            <a class="mx-2" href="https://github.com/impactstory">
                <i class="fab fa-github"></i>
            </a>
            <router-link class="faq ml-1" to="./faq">
                FAQ
            </router-link>

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
        color: #555;
    }
    a {
        color: #555;
        &.faq {
            text-decoration: none;
            font-weight: bold;
            font-size: 75%;
        }
    }

</style>