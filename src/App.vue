<template>

<v-app id="inspire">


  <v-content>
    <v-container fluid fill-height class="pa-0">
      <v-layout
        justify-center
      >

        <router-view></router-view>


      </v-layout>
    </v-container>
  </v-content>

  <main-footer></main-footer>

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
        title: 'Get The Research'
      }
  }
</script>

<style lang="scss">


  @import url("https://use.fontawesome.com/releases/v5.8.1/css/all.css");
  @import url("https://fonts.googleapis.com/css?family=Lato:300,400,700,400italic");




  html {
    &.noscroll {
      overflow: hidden !important;
    }
  }

  body {
    background: #fff;
    font-size: 16px;
    font-family: Lato, sans-serif;
    &.noscroll {
      overflow: hidden !important;
    }
  }
  .theme--light.application {
    background: #fff !important;
  }


</style>
