<template>
    <md-toolbar class="main-header" v-if="!isOnBasepage">
        <div class="md-toolbar-row">
                <h1>
                    OpenAlex
                </h1>
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
    h1 {
        width: 140px;
        margin:0;
        display:block;
        font-size: 20px;
        text-align: center;
    }

</style>