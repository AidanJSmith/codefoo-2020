<template>
  <div id="app" class="container">
    <div class="columns">
      <div class="column is-four-fifths player">
        <video controls>
          <source src="https://assets14.ign.com/videos/zencoder/2020/02/20/416/b7422245c865698feee05a1f809eeb4c-110000-1582191191.mp4" type="video/mp4">        <!-- fallback content here -->
        </video>
        <div class="columns">
          <b class="title is-size-1 column">World's Coolest Lorem Ipsum</b>
        </div>
        <div class="columns">
          <div class="body column">Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating>Look at all of this great, fascinating text that I'm goingok at all of this great, fascinating text that I'm goingok at all of this great, fascinating text that I'm goingok at all of this great, fascinating text that I'm goingok at all of this great, fascinating text that I'm goingok at all of this great, fascinating text that I'm going to read right now. I sure do love reading all of this text.</div>
        </div>
     </div>
    <div class="column playlist is-4">
      <UpcomingPlaylist/>
    </div>
    </div>
  
   
  </div>
</template>

<script>
import './../node_modules/bulma/css/bulma.css';
import UpcomingPlaylist from './components/UpcomingPlaylist';
export default {
  name: 'App',
  components: {
    UpcomingPlaylist
  }
}
</script>

<style>
#app {
  font-family:  'Open Sans', 'Helvetica Neue', sans-serif, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 10vh;
  text-rendering: optimizeLegibility;
  -moz-user-select: none;
}
video {
  width:130vh;
}

.body {
  font-size:1.5em;
  margin-top:-.2em;
  line-height:1.4;
}
.title {
  margin-top:.75em;
  font-family:  'Open Sans', 'Helvetica Neue', sans-serif, sans-serif;
  -webkit-text-stroke-width: .1vh;
  -webkit-text-stroke-color: rgb(#363636);

}

/* Small devices (landscape phones, 576px and up) */
  @media (min-width: 576px) {  }
    #app {
            margin-left:0;
          }
   /* Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) { 

   }

   /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {  
    #app {
                margin-left:0%;
              }
  }

   /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1200px) { 
    #app {
                margin-left:0%;
              }
   }
   @media (min-width: 1700px) { 
    #app {
                margin-left:10%;
              }
   }
</style>
