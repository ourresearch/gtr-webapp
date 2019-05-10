<template>

  <v-app id="inspire">

    <main-header />




    <v-content>
      <v-container fluid fill-height class="pa-0">
        <v-layout
          justify-center
        >

          <router-view></router-view>


        </v-layout>
      </v-container>
    </v-content>
    <v-footer
    height="auto">
      <main-footer />
    </v-footer>
  </v-app>









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
        title: 'Get the research'
      }
  }
</script>

<style lang="scss">


  @import url("https://use.fontawesome.com/releases/v5.8.1/css/all.css");
  @import url("https://fonts.googleapis.com/css?family=Lato:300,400,700,400italic");







  $primary-color: #FF3D00;

  $screen-xsmall: 600px;
  $screen-small: 960px;


  html {
    &.noscroll {
      overflow: hidden
    }
  }

  body {
    background: #fff;
    font-size: 16px;
    font-family: Lato, sans-serif;
    &.noscroll {
      overflow: hidden
    }


    .container {
      line-height: 1.3;
      font-size: 16px;
    }

    hr {
      opacity: .1;
    }
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
    .md-button.md-primary {
     //   background-color: $primary-color !important;
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

  div.mc-banner {
    bottom: 0 !important;
    background: rgba(255,255,255, .95);
    top: auto;
  }

</style>
