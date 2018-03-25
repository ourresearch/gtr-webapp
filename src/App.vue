<template>
  <div id="app" class="container">

    <main-header/>
    <div class="container-wrapper md-layout-row">
      <router-view/>
    </div>
    <main-footer/>


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
      }
  }
</script>

<style lang="scss">
  body {
    font-size: 16px;
  }


  #nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
