<template>
    <div class="search-box">
    <md-field>
        <md-input v-model="query" @keyup.enter="goSearch"></md-input>
        <div class="icon" @click="goSearch">
            <md-icon>search</md-icon>

        </div>
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
        },
        methods: {
            goSearch(){
                let cleanQuery = this.query  // todo clean

                this.$router.push({
                    name: "search",
                    params: {
                        q: cleanQuery
                    }
                })

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