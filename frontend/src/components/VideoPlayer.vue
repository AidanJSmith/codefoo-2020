<template>
  <div class="vid-container" @mouseup="dragging=false;volumedrag=false" >
    <!-- Some FA assets are used... as they are provincial, I have used a traditional stylesheet here. --->
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
     <div class="topbar tophover">
        <div class="columns is-mobile" ref="progress">
            <div class="toptitle column is-8">{{truncate(title)}}</div>
            <i class="fas fa-share share column is-4"></i>
        </div>
    </div>
     <video ref="video"   @click="changeVideoState('play')"> <!-- Click anywhere on the video to play/pause it --->
     </video>
     <div id="video-controls" class="controls container showhover" data-state="hidden"> <!-- Bottom navbar progress and seeking--->
        <div class="progress-container columns is-mobile" ref="progress"  @mousemove="doDrag($event)"  @mousedown="dragging=true"  @click="setTime($event)">
          <span class="finished"  :style="`width:`+currentTime+'%;'"></span>
          <div class="currentplace"></div>
          <span  class="inmem" :style="`width:` + (((bufferedTime+currentTime)*endTime)/endTime>=100 ? 100-currentTime : bufferedTime) +`%;`"></span>
        </div>
        <div class="columns"> <!-- Bottom navbar buttons. The only ones what have been assigned values are play, pause, and the entirety of the volume container. --->
          <div class="columns is-mobile bottom container"> <!-- Is-mobile class prevents wrapping --->
            <i @click="changeVideoState('play')"  :class="'fas bottom-icon ' + (playing ? `fa-play` : `fa-pause`)"></i>
            <img src="../assets/Infinite.png" class="bar-image">
            <div class="volume">
              <i @click="changeVideoState('mute')"  :class="'fas bottom-icon speaker fa-volume-up'"></i>
              <div class="volume-bar columns is-mobile" ref="volume" @mousemove="doDrag($event)"  @mousedown="volumedrag=true"  @click="setVolume($event)">
                <span class="finished"  :style="`width:`+(volume-10)+'%;'"></span>
                <div class="currentplace"></div>
              </div>
            </div>
          <div class="time-text">{{Math.floor(currentTime*endTime/100/60)}}:{{((((currentTime/100)*endTime)%60)/100).toFixed(3).slice(2,4)}} / {{Math.floor(endTime/60)}}:{{((endTime%60)/100).toFixed(3).slice(2,4)}}  </div>
          </div>
          <div class="container right-most is-mobile"> <!-- These were all made in photoshop based on your specifications. They may not be perfect, and would be replaced in a production version of the code. They are built like this to be mapped as individual buttons in the future.--->
              <img src="../assets/HD.png" class="bar-image right-paramters hd">
              <img src="../assets/4K.png" class="bar-image img4k">
              <img src="../assets/CC.png" class="bar-image right-paramters">
              <img src="../assets/Theatre.png" class="bar-image right-paramters">
              <img src="../assets/Miniplayer.png" class="bar-image right-paramters">
          </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'VideoPlayer',
  props: {
    video: {},
    currentIndex:Number,
  },
  data() {
    return {
      isMounted:false,
      currentTime:0,
      dragging:false,
      volumedrag:false,
      bufferedTime:0,
      lastvolume:100,
      playing:false,
      volume:100,
      endTime:0,
      title:"Loading..." //Default the title to loading in order to avoid state-based issues.
    }
  },
  methods: {
     truncate(string) { //Truncate the title to a max of 60 characters. 
            if(string.length<=60) {
                return string
            } else {
                return string.split('').slice(0,57).join('')+"...";
            }
    },
    changeTime() { //This is the pulse event that updates the status bar & makes changes that depend on time conditions.
      if(!this.endTime) {
        this.changeEndTime()
      }
      const video=this.$refs.video;
      this.currentTime= 100*video.currentTime/video.duration;
      let buff=video.buffered
      this.playing=video.paused;
      if(buff.length) {
        let x= this.bufferedTime
        this.bufferedTime= 100*(-1*buff.start(buff.length-1)+buff.end(buff.length-1))/video.duration;
        if (this.bufferedTime<=2) {
          this.bufferedTime=x;
        }
      }
      if(video.ended) {
        this.$emit("nextVideo");
      }
      setTimeout(this.changeTime,this.dragging ? 20 : 200); //Make this loop run faster if they're dragging for a smoother feel.
    },
    setTime(event) {  //Converts the current time to a timecode based on how far along the progress bar they pressed
      const video=this.$refs.video;
      video.currentTime=video.duration*(event.clientX -  this.$refs.progress.getBoundingClientRect().left)/this.$refs.progress.getBoundingClientRect().width;
   },
   stopDrag() {
     this.dragging=false;
     this.volumedrag=false;
   },
   doDrag(event) { //Similar to set time, but accounts for the audio slider as well.
      const video=this.$refs.video;
      if (this.volumedrag) {
        this.volume=100*(Math.abs(this.$refs.volume.getBoundingClientRect().left - event.clientX)/this.$refs.volume.getBoundingClientRect().width).toFixed(1);
        video.volume=this.volume/100;
      }
      if (this.dragging) {
         video.currentTime=video.duration*(event.clientX -  this.$refs.progress.getBoundingClientRect().left)/this.$refs.progress.getBoundingClientRect().width;
      }
   },
   setVolume(event) { //Round the volume to a multiple of ten for consistency. Set the volume.
     const video=this.$refs.video;
     this.volume=100*(Math.abs(this.$refs.volume.getBoundingClientRect().left - event.clientX)/this.$refs.volume.getBoundingClientRect().width).toFixed(1);
     video.volume=this.volume/100;
   },
  changeVideoState(state) { //A general function to handle state actions. This would be built upon, if the other unused buttons are to be given function.
    const video=this.$refs.video;
    if(state=="play") {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }else if(state=='mute') { //Caches last volume for persistence. If the end user presses the mute button again (the speaker), it'll return them to their last set volume.
      if(video.volume==.1) {
        this.volume=this.lastvolume;
        video.volume=this.volume/100;
      } else {
        this.lastvolume=this.volume;
        this.volume=10;
        video.volume=.1;
      }

    }
    },
    changeEndTime() { // Whenever the video is changed, the endtime needs to as well, as many functions depend on it for their percentages.
      this.endTime=this.$refs.video.duration;
    }
  }, mounted () { //Initial set up when the video is mounted.
      setInterval(this.changeTime(),20);
      window.addEventListener('mouseup', this.stopDrag());
      this.isMounted=true;
      this.$refs.video.removeAttribute('controls');
      this.changeEndTime()
  }, watch : {
      video() { //If the video object passed changes, load it, and start playing. (this only triggers on videos after the first.)
          console.log(`Loaded ${this.video.assets[this.video.assets.length-1].url}`);
          this.$refs.video.src=this.video.assets[this.video.assets.length-1].url;
          this.$refs.video.load()
          if(this.currentIndex!=0) this.changeVideoState("play");
          this.changeEndTime();
          this.title=this.video.metadata.title;
      }
  },
}
</script>

<style scoped>

.vid-container {
  transform: translateY(-5%);
  margin-bottom: -3.5%;
}
.controls {
  z-index:9;
  width:95%;
  margin-left:2.5%;
  height:20%;
  margin-top:-5%;
}
button {
  font-size:90%;
  width:90%;
  height:90%;
}
.bottom-icon {
  color:white;
  font-size:1.55em;
  transform:translate(120%,13%);
  cursor:pointer;
  display:inline-block;

}
.right-most {
  transform:translateY(-60%);
  right:-5em;
  width:6%;
  height:2%;
  font-size:.7em;
}
.right-paramters {
  margin-left:5%;
  cursor: pointer;
}
.img4k {
    margin-left:1%;
}

.time-text {
  color:white;
  font-size:.8em;
  transform:translate(300%,40%);
}
.speaker {
  font-size:1.5em;
}

.fa-volume-down {
  transform:translate(200%,10%) !important;
  font-size:1.75em;
}
.bar-image {
  width:0%;
  height:80%;
  font-size:.1em;
  transform:translate(90%,10%);
  cursor:pointer;

}
.volume {
  transform: translate(120%,10%);
}
.volume-bar .fa-volume-downmod {
    transform: translate(290%,-40%) !important;
}
.volume-bar {
  width:300%;
  transform: translate(100%,-40%);
  height:10%;
  background: rgb(149, 149, 149);
	-moz-border-radius: 25px;
	-webkit-border-radius: 25px;
	border-radius: 25px;
  white-space: nowrap;
  flex-wrap: false;  
  cursor:pointer;
  
}
.bottom {
  transform:translate(0%,-10%);
}

.toptitle {
  color:white;    
  font-size:1.1em;
  transform: translate(-3%, -375%);
  -webkit-text-stroke-width: .01vh;
  -webkit-text-stroke-color: #B0AFAF;
  
}
.share {
  color:white;    
  font-size:1.5em;
  transform: translate(60%,-375%);
  -webkit-text-stroke-width: .04vh;
  -webkit-text-stroke-color: white;
  cursor:pointer;
}
.progress-container {
  width:100%;
  transform: translate(.5%,-4vh);
  height:.3vh;
  background: rgb(149, 149, 149);
	-moz-border-radius: 25px;
	-webkit-border-radius: 25px;
	border-radius: 25px;
  white-space: nowrap;
  flex-wrap: false;
}

.topbar {

  transform: translate(5%,485%);
  width:100%;
}
video {
  border-radius:.6em;
}
.showhover {
  opacity: 0%;
  transition: opacity .25s;
}
video:hover + .showhover{
  opacity: 100%;
}
.showhover:hover{
  opacity: 100%;
}

.finished {
  display:inline-block;
  height: 200%;
  transform:translateY(-30%);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color:rgb(255, 255, 255);
  position: relative;
  overflow: hidden;
}
.inmem {
  display:inline-block;
  height: 100%;
  transform:translateX(-2%);
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color:#BF1313;
  position: relative;
  overflow: hidden;
}
.currentplace {
  display:inline-block;
  z-index:10;
  height: 1.75vh;
  transform: translate(-7%,-40%);
  background-color:#BF1313;
  border-radius:100%;
  width:1.75vh;
  display:block;
  cursor:pointer;
  border: .51vh solid white;
  }

  .progress-container:hover .currentplace {
    height: 2.5vh;
    width:2.5vh;
    border: .7vh solid white;
    transform: translateY(-40%);

  }

   @media (min-width: 0px) { 
    .toptitle {
      font-size:1em;
      transform: translate(-3%, -390%);
    }
    .share {
      font-size:1.25em;
      transform: translate(30%,-390%);

    }
    .bottom {
        transform:translate(0%,-80%);
    }
    .bar-image {
      width:16em;
      font-size:.2em !important;
      transform:translate(80%,10%);
    }
    .right-most {
      font-size:0em;
    }
   }
    @media (min-width: 773px) { 
      .toptitle {
        font-size:1.25em;
        
      }
      .right-most {
        transform:translateY(-60%);
        right:-5em;
        width:6%;
        height:2%;
        font-size:.7em;
      }
      .share {
        font-size:1.5em;
        transform: translate(60%,-390%);

      }
      .bottom {
        transform:translate(0%,-20%);
      }
    }
   @media (min-width: 1025px) { 
      .toptitle {
        font-size:1.5em;
        
      }
      .share {
        font-size:1.75em;
      }
   }
   @media (min-width: 1100px) {
     .right-most {
        right:2em;
      }
   }
   @media (min-width: 1274px) { 
      .toptitle {
        font-size:1.1em;
        
      }
      .right-most {
        transform:translateY(-60%);
        right:-3.5em;
        width:6%;
        height:2%;
        font-size:.7em;
      }
      .share {
        font-size:1.5em;
      }
   }
    @media (min-width: 1416px) {
     .right-most {
        right:-7.2em;
      }
   }
</style>
