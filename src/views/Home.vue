<template>
  <div class="home">
    <div class="banner">
      <div class="banner-content">
        <div class="headline">
          Get the peer-reviewed research <br> about
          <vue-typer :text='["climate change.", "self-driving cars.", "probiotics.", "life on Mars.", "gene therapy.", "low-carb diets.", "clean energy.", "head trauma.", "quantum computing.", "caffeine.", "CRISPR.", "vikings.", "medical marijuana.", "diabetes." ]'></vue-typer>
        </div>

        <div class="subheadline">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        </div>
        <div class="cta">
          <md-button class="md-raised md-accent main" href="#" v-scroll-to="'#learn-more'">
            Sign up for the beta
          </md-button>
        </div>
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
    background: url("../assets/books.jpg") no-repeat;
    background-color: #111;
    background-size: cover;
    background-position: 50% 50%;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: left;

    .banner-content {
      background: rgba(0,0,0,.7);
      background: rgba(255,255,255,.9);
      color: #333;
      /*border: 5px solid #FF3658;*/
      // margin-top: -20vh;
      // margin-left: 10vh;
      max-width: 820px;
      padding:  30px 70px;
      @media (max-width: 600px) {
        margin: 10px;
      }

      div.headline {
        font-size: 40px;
        @media (max-width: 600px) {
          font-size: 30px;
        }
        line-height: 1.3;
        padding: 20px 0;
        /*text-shadow: 1px 1px 50px #000;*/
        font-weight: 100;
        .vue-typer {
          font-weight: bold;
          @media (max-width: 600px) {
            display: block;
          }
        }


      }
      div.subheadline {
        font-size: 20px;
        /*@media (max-width: 600px) {*/
          /*font-size: 30px;*/
        /*}      */
        max-width: 655px;
        padding: 0;
        /*text-shadow: 0 0 30px #000, 1px 1px 50px #000;*/
        line-height: 1.3;
      }

      div.cta {
        padding: 20px ;
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
          /*font-size: 120%;*/
          /*padding: 15px 8px;*/
          /*height: auto;*/
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

  }



</style>
