<template>
 <!--Contains the version of the site in which the playlists are on the side.-->
  <div id="app" class="container" :style="fullscreen ? `margin-left:0;margin-top:0;margin-bottom:0;`: null">
    <div v-if="screen>=1100&&!theatreMode&&!fullscreen">
    <div class="columns vidart">
      <div class="column player">
        <VideoPlayer :theatre="theatreMode" :fullscreen="fullscreen" @toggleFullScreen="changeFullscreen"  :video="videos[currentIndex]" :currentIndex="currentIndex"  @theatre="theatre()" @nextVideo="nextVideo()"/>
        <div class="columns">
          <b class="title is-size-2 column">{{title}}</b>
        </div>
        <div class="columns">
          <div class="body column">{{body}}</div>
        </div>
     </div>
    <div class="column playlist is-4">
      <UpcomingPlaylist  :theatre="theatreMode" :cards="videos" @setVideo="setVideo" :index="currentIndex+1"/>
    </div>
    </div>
  </div>
  <!--Contains the version of the site in which the playlists are on the bottom. -->
    <div v-else-if="!fullscreen">
        <div class="columns vidart">
        <div class="column player">
          <VideoPlayer :theatre="theatreMode" :fullscreen="fullscreen"  @toggleFullScreen="changeFullscreen" :video="videos[currentIndex]" :currentIndex="currentIndex"   @theatre="theatre()" @nextVideo="nextVideo()"/>
          <div class="columns">
            <b class="title is-size-2 column">{{title}}</b>
          </div>
          <div class="columns">
            <div class="body column">{{body}}</div>
          </div>
      </div>
      </div>
      <UpcomingPlaylist  :theatre="theatreMode" :cards="videos" @setVideo="setVideo" :index="currentIndex+1"/>
    </div>
    <div v-else>

          <VideoPlayer :theatre="theatreMode||fullscreen" :fullscreen="fullscreen" @toggleFullScreen="changeFullscreen" :video="videos[currentIndex]" :currentIndex="currentIndex"   @theatre="theatre()" @nextVideo="nextVideo()"/>
          <div v-if="!fullscreen">
            <div class="columns">
              <b class="title is-size-2 column">{{title}}</b>
            </div>
            <div class="columns">
              <div class="body column">{{body}}</div>
            </div>
            <UpcomingPlaylist  :theatre="theatreMode" :cards="videos" @setVideo="setVideo" :index="currentIndex+1"/>
        </div>
      </div>
  </div>
  
</template>

<script>
import './../node_modules/bulma/css/bulma.css'; 
import UpcomingPlaylist from './components/UpcomingPlaylist';
import VideoPlayer from './components/VideoPlayer';


export default {
  name: 'App',
  components: {
    UpcomingPlaylist,
    VideoPlayer
  }, data() {
    return {
      screen: 0,
      currentIndex:0,
      videos:[],
      title:"Loading...",
      body:"Loading...",
      theatreMode:false,
      fullscreen:true,
    }
  },
  methods: {
    onResize() {
      this.screen=window.innerWidth; //This is used to determine whether or not to show the playlist on the bottom or side.
      if (this.screen<1100) {
        this.theatreMode=false;
      }
    },
    nextVideo() {
      if(this.currentIndex+1<this.videos.length) { //Updates the place 
        this.currentIndex++;
      }
    },
    setVideo(int) {
      this.currentIndex=int;
    },
    theatre() {
      this.theatreMode=!this.theatreMode;
    },
    changeFullscreen() {
      this.fullscreen=!this.fullscreen;
    },
  },
  mounted() {
    // Register an event listener when the Vue component is ready
    this.screen=window.innerWidth;
    window.addEventListener('resize', this.onResize);
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; //Proxy required, as it's hosted on Heroku.
    const url = "https://ign-apis.herokuapp.com/videos?startIndex=0&count=10";
    fetch(proxyurl + url) // Stackoverflow found me this proxy site... Last I worked with heroku, I forgot of this suffering.
    .then(response => (response.text()))
    .then(contents => {
      this.videos=JSON.parse(contents).data;
      this.title=this.videos[this.currentIndex].metadata.title; //Initialize the site. Replaces the default loading message.
      this.body=this.videos[this.currentIndex].metadata.description;
    })
    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))

  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener('resize', this.onResize)
  },
  watch : {
    currentIndex() {
      //If the index is ever changed, modify the "article" as well.
      this.title=this.videos[this.currentIndex].metadata.title;
      this.body=this.videos[this.currentIndex].metadata.description;
    }
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
  width: 100vw;
}


.body {
  font-size:1.3em;
  margin-top:-.2em;
  line-height:1.4;
  user-select:text;
}
::selection {/* Set the color to something other than contrasting blue. */
  background:#BF1313;
  color:white;
  -webkit-text-stroke-width: 0vh;
  -webkit-text-stroke-color: white;
}
.title {
  margin-top:.6em;
  font-family:  'Open Sans', 'Helvetica Neue', sans-serif, sans-serif;
  -webkit-text-stroke-width: .1vh;
  -webkit-text-stroke-color: rgb(#363636);
  user-select: text;

}

/* Small devices (landscape phones, 576px and up) */
  @media (min-width: 576px) {  }
    #app {
            margin-left:0%;
          }
    video {
      width:150%
    }
   /* Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) { 

   }

   /* Large devices (desktops, 992px and up) */
  @media (min-width: 1100) {  
    #app {
                margin-left:0%;
              }
  }

   /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1200 px) { 
    #app {
                margin-left:0%;
              
            }
    .player {
       width:0%;

     }
   }

   @media (min-width: 1700px) { 
    #app {
                margin-left:15%;
                margin-top:10vh;
              }
   }
</style>
