export const myStore = {
    data: {
        selectedEntity: null,
        annotations: [],
        showAnnotations: true
    },
    selectEntity: function(entity){
        this.data.selectedEntity = entity
    },
    clearSelectedEntity: function(){
        this.data.selectedEntity = null
    }




}