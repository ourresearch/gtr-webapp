<template>
  <div class="home">
    <div class="banner">
      <div class="banner-content">
        <div class="headline">
          <div class="static">
            Get the peer-reviewed research about
          </div>
          <div class="active">
            <vue-typer :text='["climate change.", "self-driving cars.", "probiotics.", "life on Mars.", "gene therapy.", "low-carb diets.", "clean energy.", "head trauma.", "quantum computing.", "caffeine.", "CRISPR.", "vikings.", "medical marijuana.", "diabetes." ]'></vue-typer>

          </div>
        </div>

        <div class="subheadline">
          <!--Search 20 million free-to-read scholarly papers to get the real facts on anything.-->

          <!--Find scholarly papers on any topic, read them for free, and understand them with an AI-powered research assistant.-->

Discover 20 million free-to-read scholarly papers, and understand them with our AI-powered Explanation Engine.



        </div>
        <div class="cta">
          <md-button class="md-raised md-accent main" v-on:click="signup">
            Get early access
          </md-button>

          <md-button v-scroll-to="'#about'">
            learn more
          </md-button>

        </div>
      </div>

    </div>

    <div id="about" class="landing-section">

      <div class="content">
        <div class="under-construction">
          The section below will be completed July 7th.
        </div>

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
          <h2>Partners</h2>
          <div class="core-partner">
            <h4>Internet Archive</h4>
            <div class="text">
              <div class="quote">"The Internet Archive shares Impactstory's mission of enabling open access to research outputs. Pairing our capacity for archiving at scale with Impactstory's fantastic discovery and OA services such as Unpaywall promises to enable free, easy access to published knowledge."
              </div>
              <div class="attr">
                &mdash;Jefferson Bailey, Director of Web Archiving & Data Services
              </div>
            </div>
          </div>


          <div class="core-partner">
            <h4>The British Library</h4>
            <div class="text">
              <div class="quote">"At the British Library we believe in making the world’s knowledge available to people from all backgrounds. We are excited to work with Impactstory to make scholarly publications more accessible."
              </div>
              <div class="attr">
                &mdash;Torsten Reimer, Head of Research Services.
              </div>
            </div>
          </div>
        </div>
        <h4>Open Knowledge Maps</h4>
        <h4>Iqaluit Action Lab</h4>
        <p><em>More coming soon&hellip;</em></p>



      </div>



    </div>




  </div>
</template>

<script>


  export default {
    name: 'home',
      methods:{
        signup() {
            console.log("signup!")
            alert("signup opens July 7th!")
        }
      }
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
      background: rgba(255,255,255,.9);
      color: #333;
      padding:  30px 70px;
      max-width: 700px;
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
        padding: 20px 0 30px;
        font-weight: 100;
        .static {
          display:inline;
        }
        .active {
          border-bottom: 3px solid;
            display: inline-block;
          min-width: 8em;
          line-height: .9;
          .vue-typer {
            font-weight: bold;
            /*@media (max-width: 600px) {*/
              /*display: block;*/
            /*}*/

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
        line-height: 1.3;
      }

      div.cta {
        padding: 20px 0;
        div {
          display:inline;
          @media (max-width: 600px) {
            display:block;
          }
        }
      }

    }

  }

  .landing-section {
    font-size: 16px;
    padding: 10px;
    margin-top: 30px;
    .content {
      max-width: 800px;
      margin: 0 auto;

    }

    &#partners {
      margin-bottom: 100px;
      h4 {
        margin-bottom: 0;
      }
      .attr {
        font-style: italic;
        margin-left: 10px;
      }
    }
  }

  .under-construction {
    text-style: italic;
    background: #eee;
    padding: 20px;
  }



</style>
