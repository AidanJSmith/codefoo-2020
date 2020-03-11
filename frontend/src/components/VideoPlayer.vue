<template>
  <div>
     <video ref="video"  @click="changeVideoState('play')">
     </video>
     <div id="video-controls" class="controls" data-state="hidden">
        <div class="progress-container columns is-mobile" ref="progress"  @mousemove="doDrag($event)" @mouseup="dragging=false"  @mousedown="dragging=true"  @click="setTime($event)">
          <span class="finished"  :style="`width:`+currentTime+'%;'"></span>
          <div class="currentplace"></div>
          <span  class="inmem" :style="`width:` + ((bufferedTime+currentTime)>=100 ? 100-currentTime : bufferedTime) +`%;`"></span>
        </div>
        <div class="columns">
          <div class="columns">
          <button id="playpause" @click="changeVideoState('play')" type="button" data-state="play">Play/Pause</button>
          <button id="stop" type="button" @click="changeVideoState('stop')">Stop</button>
          <button id="mute" type="button" data-state="mute">Mute/Unmute</button>
          <button id="volinc" type="button" data-state="volup">Vol+</button>
          <button id="voldec" type="button" data-state="voldown">Vol-</button>
          <button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
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
      bufferedTime:0,
    }
  },
  methods: {
    changeTime() {
      const video=this.$refs.video;
      this.currentTime= 100*video.currentTime/video.duration;
      let buff=video.buffered
      if(buff.length) {
        this.bufferedTime=100*(-1*buff.start(buff.length-1)+buff.end(buff.length-1))/video.duration;
      }
      setTimeout(this.changeTime,this.dragging ? 20 : 200);
    },
    setTime(event) {
      const video=this.$refs.video;
      console.log(event.clientX -  this.$refs.progress.getBoundingClientRect().left + "   " +this.$refs.progress.getBoundingClientRect().width);
      video.currentTime=video.duration*(event.clientX -  this.$refs.progress.getBoundingClientRect().left)/this.$refs.progress.getBoundingClientRect().width;
   },
   stopDrag() {
     this.dragging=false;
   },
   doDrag(event) {
      const video=this.$refs.video;
      if (this.dragging) {
        console.log(event.clientX -  this.$refs.progress.getBoundingClientRect().left + "   " +this.$refs.progress.getBoundingClientRect().width);
         video.currentTime=video.duration*(event.clientX -  this.$refs.progress.getBoundingClientRect().left)/this.$refs.progress.getBoundingClientRect().width;
      }
   },
    changeVideoState(state) {
      const video=this.$refs.video;
      if(state=="play") {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
      if(state=='stop') {
        video.currentTime=20;

      }
      }
    }, mounted () {
        setInterval(this.changeTime(),20);
        window.addEventListener('mouseup', this.stopDrag());
        this.isMounted=true;
        this.$refs.video.removeAttribute('controls');
        this.$refs.video.src="https://assets14.ign.com/videos/zencoder/2020/02/21/1920/25f4e16785788e3ba92bb23b563d1e06-3906000-1582298169.mp4";

  }, computed: {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.progress-container {
  width:100%;
  transform: translate(.5%,-4vh);
  height:.5vh;
  background: rgb(149, 149, 149);
	-moz-border-radius: 25px;
	-webkit-border-radius: 25px;
	border-radius: 25px;
  white-space: nowrap;
  flex-wrap: false;
}


.finished {
  display:inline-block;
  height: 100%;
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
  height: 1.5vh;
  transform: translateY(-25%);
  background-color:#BF1313;
  border-radius:100%;
  width:1.5vh;
  display:block;
  border: .5vh solid white;
  }

  .progress-container:hover .currentplace {
    height: 2.5vh;
    width:2.5vh;
    border: .7vh solid white;
    transform: translateY(-40%);

  }

</style>
