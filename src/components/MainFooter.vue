<template>
    <div class="site-footer">
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
    .site-footer {
        background: #333;
        display: flex;
        padding: 0 40px 40px 40px;
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
                &:hover {
                    text-decoration: underline;
                    color: #fff;
                }
            }
            &.about {
                div {
                    margin: 5px 0;
                    padding: 5px 0;
                    /*border-bottom: 1px solid #666;*/
                }
            }
        }

        ul.contact-links {
            margin: 0;
            padding: 0;
            li {
                font-size: 22px;
                display: inline-block;
                list-style-type: none;
                a {
                    padding: 5px 10px;
                }
                span.text {
                    display: none;
                }
            }
        }


    }


</style>