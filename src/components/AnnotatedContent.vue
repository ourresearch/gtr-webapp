<template>
    <span class="annotated-content">
        <span class="chunk-container"
              :key="index"
              v-for="(chunk, index) in chunks">

            <span class="chunk entity clickable"
                  v-html="chunk.spot"
                  v-if="chunk.spot && search.query.annotations"
                  :class="{selected: search.selectedEntityId && chunk.title===search.selectedEntityId}"
                  @click="search.setSelectedEntity(chunk.title)">
            </span>

            <span class="chunk entity hidden"
                  v-html="chunk.spot"
                  v-if="chunk.spot && !search.query.annotations">
            </span>

            <span class="chunk text"
                  v-html="chunk.text"
                  v-if="!chunk.abstract">
            </span>

        </span>
    </span>
</template>

<script>
    import {search} from "../search";


    function makeChunks(str, annotations) {

        if (!str) {
            return textChunk("")
        }
        if (!annotations) {
            return textChunk(str)
        }

        // split the str into a bunch of chunks...some chunks are entities,
        // the other chunks are the text in between entities.
        let chunks = []
        let cursorIndex = 0
        annotations.forEach(entity => {

            // add any plaintext chunk before the current entity
            if (entity.start > 0) {
                chunks.push(
                    textChunk(str.slice(cursorIndex, entity.start))
                )
            }

            chunks.push(entity)

            // update the cursor
            cursorIndex = entity.end
        })

        // after the last entity, there's generally one last hanging text chunk. add it.
        if (cursorIndex < str.length) {
            chunks.push(
                textChunk(
                    str.slice(cursorIndex, str.length)
                )
            )
        }

        return chunks

    }

    function textChunk(str) {
        return {text: str}
    }


    export default {
        name: "AnnotatedContent",
        props: ['content', 'annotations'],
        data: () => ({
            answer: 42,
            search: search
        }),
        computed: {
            chunks() {
                return makeChunks(this.content, this.annotations)
            }
        }
    }
</script>

<style scoped lang="scss">
    .entity {
        white-space: nowrap;
        &.clickable {
            background: rgba(255, 255, 0, .15);
            background: rgba(141, 157, 250, .15);
            background: rgba(255, 127, 102, .15);

            /*background: transparent;*/
            /*color: #0645ad;*/

            cursor: pointer;
            padding: 0 3px;
            border-radius: 3px;
            /*border-bottom: 1px dashed;*/
            &.selected {
                background: rgba(255, 127, 102, 1);
                /*background: #8c9eff;*/
                color: #fff;
            }
        }

    }

</style>