<template>
  <div class="home">
    <div class="banner">
      <div class="headline">
        Read and understand peer-reviewed research about
        <vue-typer :text='["climate change", "self-driving cars", "probiotics", "colonizing Mars", "gene therapy", "low-carb diets", "clean energy", "head trauma", "quantum computers", "caffeine", "CRISPR", "vikings", "medical marijuana", "diabetes" ]'></vue-typer>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'home'
  }
</script>


<style scoped lang="scss">

  div.banner {
    /*background: url("../assets/stars.jpg") no-repeat;*/
    background-color: #111;
    background-size: cover;
    background-position: 50% 50%;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    text-align: left;

    div.headline {
      font-size: 40px;
      @media (max-width: 600px) {
        font-size: 30px;
      }
      color: #fff;
      font-weight: bold;
      line-height: 1.3;
      padding: 30px;
      max-width: 800px;
      text-shadow: 1px 1px 50px #000;


    }
    div.subheadline {
      font-size: 20px;
      /*@media (max-width: 600px) {*/
        /*font-size: 30px;*/
      /*}      */
      color: #fff;
      max-width: 655px;
      padding: 0 30px;
      text-shadow: 0 0 30px #000, 1px 1px 50px #000;
    }

    div.cta {
      padding: 30px;
      div {
        display:inline;
        @media (max-width: 600px) {
          display:block;
        }
      }
      .md-button {
        /*background: rgba(255,255,255, .2);*/
        /*background: rgba(0,0,0, .4);*/
        color: #fff;
        margin:10px 20px 0 0;
        min-width: 150px;
      }
      a.secondary {
        text-shadow: 0 0 30px #000, 1px 1px 50px #000;
        color: #fff;
        text-transform: uppercase;
        padding: 18px 0;
        display: inline-block;
        font-size: 15px;
      }
    }
  }



</style>
