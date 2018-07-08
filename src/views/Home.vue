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

        <h3>🤔 Another search engine? Really?</h3>
        <p>
          Really. But this one's a little different: there are already a lot of ways for <em>academic researchers</em> to find academic literature&hellip;we’re building one for <em>everyone else.</em>
        </p>

        <p>
          We're aiming to meet the information needs of citizen scientists, patients, K-12 teachers, medical practitioners, social workers, community college students, policy makers, and millions more. What they all have in common: they're folks who'd benefit from access to the scholarly record, but they've historically been locked out. They've had no access to the <strong>content</strong> or the <strong>context</strong> of the scholarly conversation.
        </p>

        <h3>📑 Access to <em>content</em></h3>

        <p>
          Traditionaly, the scholarly literature was paywalled, cutting off access to the content. The Open Access movement is on the way to solving this: <a href="https://peerj.com/articles/4375/">Half of new articles</a> are now free to read somewhere, and that number is growing. The only catch is that there are more than 50,000 different "somewheres" on web servers around the world, so we need a central index to find it. No one's done a good job of this yet (Google Scholar gets close, but it's aimed at specialists, not regular people. It's also 100% proprietary, closed-source, closed-data, and
          <a href="https://www.wordstream.com/articles/retired-google-projects">subject to disappearing at Google’s whim.</a>)
        </p>

        <h3>🌍 Access to <em>context</em></h3>
        <p>
          We're further from solving access to <em>context</em>: the stuff that makes an article comprehensible for a specialist, but gobbledegook for everyone else. So that includes everything from field-specific jargon, to strategies for on how to skimming to find key findings, to knowledge of key concepts like p-values. We like to use the example of Hamlet: easy for an educated 16-century English speaker to understand and enjoy, but much harder for us these days. We don’t have the context.
        </p>

        <h3>💡 The solution </h3>

        <p>
            Our plan: provide access to both <em>content</em> and <em>context,</em> for free, in one place. To do that, we’re going to bring together an open a database of OA papers with a suite AI-powered support tools we're calling an Explanation Engine.
        </p>

        <p>
          We’ve already finished the database of OA papers. So that's good. With the free <a href="https://unpaywall.org">Unpaywall</a> database, we’ve now got 20 million OA articles from 50k sources, built on
          <a href="https://github.com/Impactstory">open source</a>, available as open data, and with a working nonprofit sustainability model.
        </p>

        <p>
          We’re building the "AI-powered support tools" now. What kind of tools? Well, let’s go back to the Hamlet example...today, publishers solve the context problem for readers of Shakespeare by adding notes to the text that define and explain difficult words and phrases. We're gonna do the same thing for 20 million scholarly articles. And that’s just the start&hellip;we're also working on concept maps, automated plain-language translations (think automatic
          <a href="https://simple.wikipedia.org/wiki/Main_Page">Simple Wikipedia</a>), structured abstracts, topic guides, and more. Thanks to recent progress in AI, all this can be automated, so we can do it at scale. That’s new. And it's big.
        </p>

        <h3>🙌 The payoff</h3>

        <p>
          When Microsoft launched <a href="https://en.wikipedia.org/wiki/Altair_BASIC?oldformat=true">Altair BASIC</a> for the new "personal computers," there were already plenty of programming environments for experts. But here was one accessible to <em>everyone else</em>. That was new. And ultimately it launched the PC revolution, bringing computing  the lives of regular folks. We think it's time that same kind of movement happened in the world of knowledge.
        </p>

          <p>
          From a business perspective, you might call this a <a
                href="https://en.wikipedia.org/wiki/Blue_Ocean_Strategy?oldformat=true">blue ocean strategy.</a> From a social perspective (ours), this is a chance to finally cash the cheques written by the Open Access movement. It’s a chance to open up access to the cutting edge of human knowledge to <em>all humans.</em> 🔓😀
        </p>

      </div>
    </div>


    <div class="landing-section" id="partners">
      <div class="content">
        <div class="core-partners">
          <h1>Our Partners</h1>
          <p class="subhead">
            We're working with some great partners for this project. Want to join in? <a
                  href="mailto:team@impactstory.org">Drop us a line!</a> Here's the team so far:
          </p>


          <div class="partner core-partner">
            <h3>The British Library</h3>
            <div class="linkout">
              <a href="https://www.bl.uk/">
                https://www.bl.uk
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
            <div class="text">
              <div class="quote">"At the British Library we believe in making the world’s knowledge available to people from all backgrounds. We are excited to work with Impactstory to make scholarly publications more accessible."
              </div>
              <div class="attr">
                &mdash;Torsten Reimer, Head of Research Services.
              </div>
            </div>
          </div>

          <div class="partner core-partner">
            <h3>Internet Archive</h3>
            <div class="linkout">
              <a href="https://www.bl.uk/">
                https://www.bl.uk
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
            <div class="text">
              <div class="quote">"The Internet Archive shares Impactstory's mission of enabling open access to research outputs. Pairing our capacity for archiving at scale with Impactstory's fantastic discovery and OA services such as Unpaywall promises to enable free, easy access to published knowledge."
              </div>
              <div class="attr">
                &mdash;Jefferson Bailey, Director of Web Archiving & Data Services
              </div>
            </div>
          </div>
        </div>

        <div class="partner">
          <h3>Open Knowledge Maps</h3>
          <div class="linkout">
            <a href="https://www.bl.uk/">
              https://www.bl.uk
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>

        <div class="partner">
          <h3>Iqaluit Action Lab</h3>
          <div class="linkout">
            <a href="https://www.bl.uk/">
              https://www.bl.uk
              <i class="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>




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
    font-size: 20px;
    line-height: 1.5;
    padding: 10px;
    margin-top: 30px;
    h3 {
      margin: 70px 0 10px;
    }
    .content {
      max-width: 800px;
      margin: 0 auto;

    }

    &#partners {
      padding: 50px 0 100px;
      margin: 50px 0 0;
      background: #eee;
      h1 {
        margin-bottom: 0;
        padding-bottom: 0;
      }
      h2 {
        margin: 0;
      }
      .partner {
        margin: 20px 0;
        padding: 20px 0;
        border-bottom: 1px solid #ccc;
      }
      p.subhead {
        margin-top: 0;
      }
      .quote {
        font-size: 80%;
      }
      h3 {
        margin: 0;
      }
      .linkout {
        font-size: 80%;
      }
      .attr {
        font-style: italic;
        margin-left: 10px;
        font-size: 80%;
      }
    }
  }

  .under-construction {
    text-style: italic;
    background: #eee;
    padding: 20px;
  }



</style>
