<template>
    <md-toolbar class="main-header" v-if="!isOnBasepage">
        <div class="md-toolbar-row">
                <a class="site-logo" href="/search">
                    <img src="../assets/get-the-research-logo.png" alt="">
                </a>
                <search-box/>
        </div>
    </md-toolbar>


</template>

<script>

    import SearchBox from "./SearchBox";
    export default {
        components: {SearchBox},
        name: 'MainHeader',
        computed: {
          isOnBasepage(){
              return window.location.pathname == "/"
          }
        }
    }
</script>

<style scoped lang="scss">
    a.site-logo {
        margin:0 20px 0;
        display:block;
    }

</style>

