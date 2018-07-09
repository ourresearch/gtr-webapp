<template>
  <div class="welcome page">
    <div class="content">
        <h2>Success!</h2>
        <p>
            Welcome to the cutting edge&hellip;you'll be getting the first look at new features and beta versions.
        </p>
        <md-button class="md-primary md-raised" to="/">
            Back to homepage
        </md-button>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'welcome'
  }
</script>


<style scoped lang="scss">

  @import "~vue-material/dist/theme/engine";
  @include md-register-theme("default", (
    primary: md-get-palette-color(deeporange, A400),
    accent: md-get-palette-color(blue, A400)
  ));
  @import "~vue-material/dist/theme/all";
  $primary-color: #FF3D00;



    .page {
        padding: 50px 10px;
        font-size: 22px;
        .content {
            max-width: 600px;
            margin: 0 auto;
        }
    }


</style>


