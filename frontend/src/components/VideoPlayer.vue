<template>
  <div class="vid-container" @mouseup="dragging=false;volumedrag=false" >
    <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
     <div class="topbar" data-state="hidden">
        <div class="columns is-mobile" ref="progress">
            <div class="toptitle column is-8">Lorem Ipsum Dolor Set Amit</div>
            <i class="fas fa-share share column is-4"></i>
        </div>
    </div>
     <video ref="video"  @click="changeVideoState('play')">
     </video>
     <div id="video-controls" class="controls" data-state="hidden">
        <div class="progress-container columns is-mobile" ref="progress"  @mousemove="doDrag($event)"  @mousedown="dragging=true"  @click="setTime($event)">
          <span class="finished"  :style="`width:`+currentTime+'%;'"></span>
          <div class="currentplace"></div>
          <span  class="inmem" :style="`width:` + ((bufferedTime+currentTime)>=100 ? 100-currentTime : bufferedTime) +`%;`"></span>
        </div>
        <div class="columns">
          <div class="columns is-mobile bottom">
            <i @click="changeVideoState('play')"  :class="'fas bottom-icon ' + (playing ? `fa-play` : `fa-pause`)"></i>
            <img src="../assets/Infinite.png" class="infinite bottom-icon">
            <div class="volume">
              <i @click="changeVideoState('mute')"  :class="'fas bottom-icon speaker fa-volume-up'"></i>
              <div class="volume-bar columns is-mobile" ref="volume" @mousemove="doDrag($event)"  @mousedown="volumedrag=true"  @click="setVolume($event)">
                <span class="finished"  :style="`width:`+(volume-10)+'%;'"></span>
                <div class="currentplace"></div>
              </div>
            </div>
          <div class="time-text">{{Math.round(currentTime/60)}}:{{(Math.round(currentTime%60)/100).toFixed(2).slice(2,4)}} / {{Math.round(endTime/60)}}:{{(Math.round(endTime%60)/100).toFixed(2).slice(2,4)}}  </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'VideoPlayer',
  props: {
    msg: String,
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
    }
  },
  methods: {
    changeTime() {
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
      setTimeout(this.changeTime,this.dragging ? 20 : 200);
    },
    setTime(event) {
      const video=this.$refs.video;
      video.currentTime=video.duration*(event.clientX -  this.$refs.progress.getBoundingClientRect().left)/this.$refs.progress.getBoundingClientRect().width;
   },
   stopDrag() {
     this.dragging=false;
     this.volumedrag=false;
   },
   doDrag(event) {
      const video=this.$refs.video;
      if (this.volumedrag) {
        this.volume=100*(Math.abs(this.$refs.volume.getBoundingClientRect().left - event.clientX)/this.$refs.volume.getBoundingClientRect().width).toFixed(1);
        video.volume=this.volume/100;
      }
      if (this.dragging) {
        console.log(event.clientX -  this.$refs.progress.getBoundingClientRect().left + "   " +this.$refs.progress.getBoundingClientRect().width);
         video.currentTime=video.duration*(event.clientX -  this.$refs.progress.getBoundingClientRect().left)/this.$refs.progress.getBoundingClientRect().width;
      }
   },
   setVolume(event) {
     const video=this.$refs.video;
     this.volume=100*(Math.abs(this.$refs.volume.getBoundingClientRect().left - event.clientX)/this.$refs.volume.getBoundingClientRect().width).toFixed(1);
     video.volume=this.volume/100;
   },
    changeVideoState(state) {
      const video=this.$refs.video;
      if(state=="play") {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      } else if(state=='stop') {
        video.currentTime=20;
      } else if(state=='mute') {
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
      changeEndTime() {
        this.endTime=this.$refs.video.duration-60-6;
      }
    }, mounted () {
        setInterval(this.changeTime(),20);
        window.addEventListener('mouseup', this.stopDrag());
        this.isMounted=true;
        this.$refs.video.removeAttribute('controls');
        this.$refs.video.src="https://assets14.ign.com/videos/zencoder/2020/02/21/1920/25f4e16785788e3ba92bb23b563d1e06-3906000-1582298169.mp4";
        this.changeEndTime()
  }, computed: {
    speakerType() {
      switch(true) {
        case(this.volume>=50):
          return "fa-volume-up";
        case(this.volume==10):
          return "fa-volume-mute";
        default:
          return "fa-volume-down";
      }
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  font-size:1.3em;
  transform:translate(120%,12%);
  cursor:pointer;
  display:inline-block;

}
.time-text {
  color:white;
  font-size:.8em;
  transform:translate(250%,40%);
}
.speaker {
  font-size:1.5em;
}

.fa-volume-down {
  transform:translate(200%,10%) !important;
  font-size:1.75em;
}
.infinite {
  width:5%;
  height:100%;
  font-size:.2em !important;
  transform:translate(90%,10%);
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
    .infinite {
      width:16em;
      font-size:.2em !important;
      transform:translate(80%,10%);
    }
   }
    @media (min-width: 763px) { 
      .toptitle {
        font-size:1.25em;
        
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
   @media (min-width: 1274px) { 
      .toptitle {
        font-size:1.1em;
        
      }
      .share {
        font-size:1.5em;
      }
   }
</style>
