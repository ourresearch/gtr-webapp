<template>
    <div class="main-header" v-if="!isOnBasepage">
        <div class="logo">
                <a class="site-logo" href="/search">
                    <img src="../assets/get-the-research-logo.png" alt="">
                </a>
        </div>
        <search-box/>
    </div>


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
    .main-header {
        padding: 10px;
        display: flex;
        align-items: center;
        .logo {
            margin-right: 20px;
        }
    }


</style>

