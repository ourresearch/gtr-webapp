<template>
    <div class="main-header" v-if="!(isOnBasepage | isOnSearchPage)">
        <div class="logo">
                <a class="site-logo" href="/search">
                    <img src="../assets/get-the-research-logo.png" alt="">
                </a>
        </div>
    </div>


</template>

<script>

    export default {
        name: 'MainHeader',
        computed: {
          isOnBasepage(){
              return window.location.pathname == "/"
          },
          isOnSearchPage(){
              return window.location.pathname.indexOf("/search") === 0
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

