<template>
    <div class="site-footer foo">
        <div class="content md-layout md-gutter">
            <div class="col md-layout-item md-size-30 md-xsmall-size-100 products">
                <div>

                </div>
                <div>
                    <ul class="contact-links">
                        <li>
                            <a href="https://twitter.com/gettheresearch">
                                <i class="fab fa-twitter"></i>
                                <span class="text">
                                    Twitter
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href="mailto:team@impactstory.org">
                                <i class="far fa-envelope"></i>
                                <span class="text">Email</span>
                            </a>

                        </li>
                        <li>
                            <a href="https://github.com/impactstory">
                                <i class="fab fa-github"></i>
                                <span class="text">
                                    GitHub
                                </span>
                            </a>

                        </li>
                    </ul>

                </div>
            </div>



            <div class="col md-layout-item md-xsmall-size-100 about">
            </div>

            <div class="col md-layout-item md-size-50 md-xsmall-size-100 about">
                <div>
                    Built with <i class="far fa-heart"></i> at <a href="http://impactstory.org">Impactstory.</a>
                </div>
                <hr>

                <div>
                    Made possible by the support of <a href="https://www.arcadiafund.org.uk/">Arcadia</a> – a charitable fund of Lisbet Rausing and Peter Baldwin.

                </div>
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
    .foo {
        display: none;
        color: red;

    }

</style>