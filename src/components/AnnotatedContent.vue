<template>
    <span class="annotated-content">
        <span class="chunk-container"
              :key="index"
              v-for="(chunk, index) in chunks">
        <span class="chunk entity"
              v-html="chunk.spot"
              v-if="chunk.abstract"
              @click="myStore.selectEntity(chunk)">

        </span>
        <span class="chunk text"
              v-html="chunk.text"
              v-if="!chunk.abstract"></span>
        </span>
    </span>
</template>

<script>
    import {myStore} from "../myStore";


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

            // this entity
            if (entity.confidence < 0.7) {
                // if it's low-confidence, treat is as a text chunk
                chunks.push(
                    textChunk(entity.spot)
                )
            } else {
                chunks.push(entity)
            }

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
            myStore: myStore
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
        background: rgba(255,127,102, .15);
        cursor: pointer;
        padding: 0 3px;
        white-space: nowrap;
        border-radius: 3px;
    }
</style>