<template>
    <div class="home">


        <div class="img">
            <img src="../assets/logo.png" alt="">

        </div>
        <h1 class="display-1 ma-3">
            Find and understand peer-reviewed research papers
        </h1>
        <div class="search-input mt-4">
            <search-box @submit="goSearch"></search-box>
        </div>
        <div class="try pa-2">
            Try: "vaccines and autism," "How safe is bicycling," or "chocolate"
        </div>


    </div>
</template>

<script>
    import SearchBox from "../components/SearchBox";
    import {search} from "../search"


    export default {
        name: 'home',
        components: {SearchBox},
        methods: {
            signup() {
                console.log("signup!")
                alert("signup opens July 9th!")
            },
            goSearch(){
                console.log("go search!")
                this.$router.push({
                    path: "search",
                    query: search.getQueryForUrl()
                })
                search.fetchResults(this.$vuetify.breakpoint.smAndUp)
            }
        }
    }
</script>


<style scoped lang="scss">

    div.home {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        h1 {
            max-width: 800px;
            text-align: center;
        }

        .search-input {
            width: 100%;
            max-width: 600px;
        }
    }


</style>
