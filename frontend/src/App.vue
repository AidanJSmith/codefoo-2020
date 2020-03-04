<template>
  <div id="app" class="container">
    <div class="columns">
      <div class="column is-four-fifths player">
        <video controls>
          <source src="https://assets14.ign.com/videos/zencoder/2020/02/20/416/b7422245c865698feee05a1f809eeb4c-110000-1582191191.mp4" type="video/mp4">        <!-- fallback content here -->
        </video>
        <div class="columns">
        <b class="header column">World's Coolest Lorem Ipsum</b>
        </div>
        <div class="columns">
          <div class="body column">Look at all of this great, fascinating text that I'm going to read right now. I sure do love reading all of this text.</div>
        </div>
      </div>
      <div class="column">Eventually, playlist cards.</div>
    </div>
  </div>
</template>

<script>
import './../node_modules/bulma/css/bulma.css';

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
video {
  width:130vh;
}
.header {
  text-align: left;
  font-size:4em;
}
.body {
  text-align: left;
  font-size:3em;
  text-indent:3em;
  margin-top:-.5em;
}
</style>
