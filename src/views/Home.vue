<template>
  <div class="home">
    <div class="tagline">
      Read and understand peer-reviewed research about
      <vue-typer :text='["climate change", "self-driving cars", "probiotics", "colonizing Mars", "gene therapy", "low-carb diets", "clean energy", "head trauma", "quantum computers", "caffeine", "CRISPR", "vikings", "medical cannabis", "diabetes" ]'></vue-typer>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'home'
  }
</script>
