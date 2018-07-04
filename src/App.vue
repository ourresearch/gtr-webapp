<template>
  <div id="app" class="container">

    <div class="container-wrapper md-layout-row">
      <router-view/>
    </div>

    <main-footer />


  </div>






</template>

<script>
  import MainHeader from './components/MainHeader'
  import MainFooter from './components/MainFooter'
  export default {
      name: 'App',
      components: {
          MainHeader,
          MainFooter
      },
      metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'FindScience.org',
        // all titles will be injected into this template
        titleTemplate: '%s | FindScience.org',
          link: [
            { rel: 'favicon', href: 'favicon.png' }
          ]
      }
  }
</script>

<style lang="scss">

  @import url("https://use.fontawesome.com/releases/v5.0.10/css/all.css");

    $screen-xsmall: 600px;
    $screen-small: 960px;

  body {
    background: #fff;
    font-size: 16px;
    code {
      padding: 2px 5px;
      border: 1px solid #ddd;
      border-radius: 3px;
      font-size: 90%;
    }
    h1 {
      margin-top: 50px;
    }
    h2 {
      margin-top: 50px;
    }
  }
  div.page {
    font-size: 18px;
    line-height: 1.5;
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: 100px;
    min-height: 80vh;
  }


  .vue-typer {
    .custom.char {
      /*color: #fff;*/
    }
  }

</style>
