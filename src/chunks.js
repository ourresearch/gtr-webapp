


export const makeChunks = function(str, annotations) {

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