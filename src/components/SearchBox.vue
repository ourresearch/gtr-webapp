<template>
    <div class="search-box">
    <md-field>
        <md-input v-model="query"></md-input>
        <md-icon>search</md-icon>
    </md-field>


    </div>
</template>

<script>
    export default {
        name: "SearchBox",
        data: () => ({
            query: ""
        })
    }
</script>

<style scoped lang="scss">
    div.search-box {
        width: 100%;
        padding: 20px;
        div.md-field {
            input.md-input {
                border: 1px solid #333;
                border-radius: 3px;
            }
        }
    }
</style>