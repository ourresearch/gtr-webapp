export const myStore = {
    data: {
        selectedEntity: null
    },
    selectEntity: function(entity){
        this.data.selectedEntity = entity
    },
    clearSelectedEntity: function(){
        this.data.selectedEntity = null
    }




}