<template>
    <div class="search-box">
    <md-field>
        <md-input v-model="query"></md-input>
        <router-link :to="serpUrlWithQuery">
            <md-icon>search</md-icon>
        </router-link>
    </md-field>


    </div>
</template>

<script>
    export default {
        name: "SearchBox",
        data: () => ({
            query:""
        }),
        computed: {
            serpUrlWithQuery(){
                return "/search/" + this.query
            }
        }
    }
</script>

<style scoped lang="scss">
    div.search-box {
        width: 100%;
        max-width: 500px;
        padding: 20px;
        div.md-field {
            input.md-input {
                border: 1px solid #333;
                border-radius: 3px;
            }
        }
    }
</style>