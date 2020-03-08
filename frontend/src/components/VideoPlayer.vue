<template>
  <div>
    <video ref="video"></video>
    <div id="video-controls" class="controls" data-state="hidden">
      <button id="playpause" @click="changeVideoState('play')" type="button" data-state="play">Play/Pause</button>
      <button id="stop" type="button" @click="changeVideoState('stop')">Stop</button>
      <div class="progress">
          <progress id="progress" value="1444" min="0" max="14444">
            <span id="progress-bar"></span>
          </progress>
      </div>
      <button id="mute" type="button" data-state="mute">Mute/Unmute</button>
      <button id="volinc" type="button" data-state="volup">Vol+</button>
      <button id="voldec" type="button" data-state="voldown">Vol-</button>
      <button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    msg: String
  },methods: {
    changeVideoState(state) {
      let video=this.$refs.video;
      console.log(video.paused)
      if (state==`play`) {
        if (video.paused) {
          video.play();
        }
        else {
          video.pause();
        }
      if (state=='stop') {
        console.log()
        video.pause()      }
      }

      console.log(this.$refs.video.play());
    }
  }, mounted () {
    this.$refs.video.removeAttribute('controls');
    this.$refs.video.src="https://assets14.ign.com/videos/zencoder/2020/02/21/1920/25f4e16785788e3ba92bb23b563d1e06-3906000-1582298169.mp4";
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
