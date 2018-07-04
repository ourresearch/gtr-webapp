<template>
  <div class="home">
    <div class="banner">
      <div class="banner-content">
        <div class="headline">
          Get the peer-reviewed research about
          <vue-typer :text='["climate change.", "self-driving cars.", "probiotics.", "life on Mars.", "gene therapy.", "low-carb diets.", "clean energy.", "head trauma.", "quantum computing.", "caffeine.", "CRISPR.", "vikings.", "medical marijuana.", "diabetes." ]'></vue-typer>
        </div>

        <div class="subheadline">
          <!--Search 20 million free-to-read scholarly papers to get the real facts on anything.-->

          <!--Find scholarly papers on any topic, read them for free, and understand them with an AI-powered research assistant.-->

          We're the personal research assistant for regular people, powered by AI and 20 million free-to-read scholarly articles.



        </div>
        <div class="cta">
          <md-button class="md-raised md-accent main" href="#" >
            Get advance access
          </md-button>

          <md-button v-scroll-to="'#about'">
            learn more
          </md-button>

        </div>
      </div>

    </div>

    <div id="about" class="landing-section">

      <div class="content">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis lobortis leo, ut lacinia lacus. Fusce hendrerit est tortor, nec vulputate elit rhoncus vel. Fusce varius imperdiet mauris quis feugiat. Duis lorem lorem, dapibus vitae scelerisque a, bibendum eu turpis. Etiam eu pulvinar orci. Mauris quis sapien eget sapien pulvinar ultrices. Phasellus eu dignissim felis. Fusce nec ligula eros. Donec at velit et nulla suscipit hendrerit. Phasellus maximus lobortis sapien, eget placerat enim. In non metus felis. Proin varius vehicula tempus. Suspendisse turpis erat, dignissim id venenatis eu, sagittis ac erat.

        </p>

        <p>
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean in nibh erat. Nunc suscipit accumsan posuere. Nam tincidunt tempus elit eu ornare. Phasellus pretium eleifend viverra. In ullamcorper leo sed nunc ultricies dignissim. Sed sodales ante at gravida tristique. Donec molestie dui in facilisis tristique. Curabitur eu gravida lorem.

        </p>

        <p>
          Nullam blandit libero ante, at imperdiet enim dapibus imperdiet. Etiam aliquam pharetra eleifend. Cras efficitur ante egestas dapibus pellentesque. Vestibulum tincidunt magna sed dui sagittis, nec eleifend elit convallis. Nulla tincidunt erat vitae faucibus convallis. Suspendisse iaculis dictum tempus. Vivamus auctor dictum orci sit amet lobortis. Sed id ante dui. Phasellus tempor placerat erat at vestibulum. Morbi ut fermentum nibh. Cras dignissim ornare neque, non venenatis nunc faucibus sit amet. Fusce lectus risus, vulputate vulputate convallis quis, faucibus quis erat.

        </p>

        <p>
            In mollis varius felis nec ultricies. Ut fringilla volutpat leo vel tristique. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In venenatis cursus velit non tincidunt. Nunc tristique vulputate risus sit amet vehicula. Vivamus vel mauris magna. Cras semper gravida ligula a dapibus. Aenean tincidunt lacus pretium elit pulvinar vulputate.

        </p>

      </div>
    </div>


    <div class="landing-section" id="partners">
      <div class="content">
        <div class="core-partners">
          <h2>Core partners</h2>
        </div>

        <div class="supporting-partners">
          <h2>supporting partners</h2>
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
    background-color: #fff;
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
        padding: 10px;
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
