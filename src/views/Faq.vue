<template>
    <v-flex>
        <v-layout class="pa-4" align-center>
            <v-flex shrink class="">
                <router-link to="/">
                    <img src="../assets/logo.png" alt="">
                </router-link>
            </v-flex>
            <v-flex grow class="pl-5">
                <h1 class="display-2">Frequently Asked Questions</h1>

            </v-flex>
        </v-layout>

        <v-container>
            <div>
                <p>
                    Thanks for checking out this Early Release of Get The Research!  Here are answers to a few frequently asked questions and comments:
                </p>

                <h3 class="title pb-2 pt-5">I found an offensive picture!</h3>
                <p>
                    We're very sorry!  The pictures are assigned automatically, using AI to find the best choice for topic and interest, based on pictures in Wikipedia.  We've tried to make sure we aren't displaying any offensive ones. If you see one though, please report it to team@impactstory.org and we'll fix it ASAP.
                </p>

                <h3 class="title pb-2 pt-5">What areas of research does this site include?
</h3>
                <p>
There is research of all types on Get The Research.  In this early release it specializes in research in biology and medicine (papers indexed by
                    <a href="https://www.ncbi.nlm.nih.gov/pubmed/">PubMed</a>) -- this will be widened further in the future.
                </p>

                <h3 class="title pb-2 pt-5">Some of the definitions for highlighted words seem wrong...</h3>
                <p>
The annotations use artificial intelligence techniques to try to take the words and context into account, but sometimes it makes a mistake.  We're making this better all the time -- stay tuned!
                </p>

                <h3 class="title pb-2 pt-5">Is all of the research on this site peer reviewed?</h3>
                <p>
All of the research on this site appears in academic research journals, and the vast majority of this content is peer reviewed.  To learn more about peer review, see
                    <a href="https://www.medicalnewstoday.com/articles/281528.php">this article</a>.
                </p>

                <h3 class="title pb-2 pt-5">How do I know what research I can trust?
</h3>
                <p>
This is a great question.  Get The Research flags each article with its "level of evidence" when we know it -- is the article just a report about a single patient (a "case study") or a more trustworthy analysis combining the results of many studies (a "meta-analysis")?  Click on the tags above the article titles to learn more.  We rank articles with higher levels of evidence higher in the search results to make these easier to find.  Reading the news studies about a paper (linked to from the "Learn More" page when we've found news articles) is a great way to find out what others think about the results.
                </p>

                <h3 class="title pb-2 pt-5">How do I figure out what scientific papers are trying to say?</h3>
                <p>
                    Although scholarly papers can be intimidating, they can also be surprisingly accessible, once you know a few tips on how to read them. Our goal with Get The Research is to help with that, but that's just the beginning.
We recommend these articles for the basics of how to read scientific papers:
                    <a href="https://www.huffpost.com/entry/how-to-read-and-understand-a-scientific-paper_b_5501628">How
                        to Read and Understand a Scientific Paper: A Step-by-Step Guide for Non-Scientists</a>
and <a href="https://www.universityaffairs.ca/career-advice/career-advice-article/read-understand-scientific-article/">How
                    to read and understand a scientific article</a>.
                </p>



                <h3 class="title pb-2 pt-5">Is this broken on mobile?</h3>
                <p>
                    Yes :). For now. We're still improving mobile support...in particular, clicking on highlighted words doesn't show their definitions on mobile.

                </p>



                <h3 class="title pb-2 pt-5">Who funded Get The Research?</h3>
                <p>
                    Get The Research was made possible by the support of Arcadia – a charitable fund of Lisbet Rausing and Peter Baldwin.
                </p>

                <h3 class="title pb-2 pt-5">I have other feedback! And questions!</h3>
                <p>
We'd love to hear from you!  This is a very early release, and so feedback is really valuable. Drop us a line at team@impactstory.org
                </p>


            </div>

        </v-container>





    </v-flex>
</template>

<script>
    export default {
        name: "Faq"
    }
</script>

<style scoped>

</style>