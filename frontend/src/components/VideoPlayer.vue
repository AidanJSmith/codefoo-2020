<template>
  <div class="vid-container" @mouseup="dragging=false;volumedrag=false"  ref="root" :style="fullscreen ? `overflow-y: hidden;width:102vw;height:103.5vh;transform:translateY(-3%);margin-bottom:0%;overflow:hidden;`: null" >
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
     <video ref="video"   class=".showhover"  @click="changeVideoState('play')"> <!-- Click anywhere on the video to play/pause it --->
     </video>
     <div :style="fullscreen ? `zoom:1.3;-moz-transform: scale(1.3) translate(12%,20%)` : ``">
     <div id="video-controls" class="controls container showhover" :style="theatre ?'transform:translateY(2.5vh)': ``" data-state="hidden"> <!-- Bottom navbar progress and seeking--->
        <div class="progress-container columns is-mobile" ref="progress"  @mousemove="doDrag($event)"  @mousedown="dragging=true"  @click="setTime($event)">
          <span class="finished"  :style="`width:`+currentTime+'%;'"></span>
          <div class="currentplace"></div>
          <span  class="inmem" :style="`width:` + (((bufferedTime+currentTime)*endTime)/endTime>=100 ? 100-currentTime : bufferedTime) +`%;`"></span>
        </div>
        <div class="columns"> <!-- Bottom navbar buttons. The only ones what have been assigned values are play, pause, and the entirety of the volume container. --->
          <div class="columns is-mobile bottom container"> <!-- Is-mobile class prevents wrapping --->
            <i @click="changeVideoState('play')"  :class="'fas bottom-icon ' + (playing ? `fa-play` : `fa-pause`)"></i>
            <img v-if="!loop" src="../assets/Infinite.png" @click="loop=!loop" class="bar-image">
            <img v-else src="../assets/Infinite_after.png" @click="loop=!loop" class="bar-image">
            <div class="volume">
              <i @click="changeVideoState('mute')"  :class="'fas bottom-icon speaker fa-volume-up'"></i>
              <div class="volume-bar columns is-mobile" ref="volume" @mousemove="doDrag($event)"  @mousedown="volumedrag=true"  @click="setVolume($event)">
                <span class="finished"  :style="`width:`+(volume-10)+'%;'"></span>
                <div class="currentplace"></div>
              </div>
            </div>
          <div class="time-text">{{Math.floor(currentTime*endTime/100/60)}}:{{((((currentTime/100)*endTime)%60)/100).toFixed(3).slice(2,4)}} / {{Math.floor(endTime/60)}}:{{((endTime%60)/100).toFixed(3).slice(2,4)}}  </div>
          </div>
          <div class="container right-most is-mobile" :style="theatre? `transform:translate(9vw,-60.5%)` : null"> <!-- These were all made in photoshop based on your specifications. They may not be perfect, and would be replaced in a production version of the code. They are built like this to be mapped as individual buttons in the future.--->
              <img :src="qualityGeneral" @click="switchQuality()" class="bar-image right-paramters hd">
              <img :src="qualitySpecific" @click="switchQuality()" class="bar-image img4k">
              <img src="../assets/CC.png" class="bar-image right-paramters">
              <img src="../assets/Theatre.png" @click="theatreMode()" class="bar-image right-paramters">
              <img src="../assets/Fullscreen.png"  @click="toggleFullScreen()" class="bar-image right-paramters">
          </div>
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
    theatre: Boolean,
    fullscreen:Boolean,
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
      loop:false,
      volume:100,
      endTime:0,
      quality:1080,
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
      if (this.isMounted) {
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
        if(video.ended&&!this.loop) {
          this.$emit("nextVideo");
        }
        if(video.ended&&this.loop) {
          this.changeVideoState("play");
        }
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
   switchQuality() {
      for (let i=0;i<this.video.assets.length;i++) {
        if (this.video.assets[i].height==this.quality) { //Find a quality that fits, and ensure that you can safely decrement it.
            if(i+1<this.video.assets.length) {
              this.quality=this.video.assets[i+1].height;
              break;
            } else {
              this.quality=this.video.assets[0].height;
            }
        }
      }
      this.changeVideoSrc();
   },
  theatreMode() {
    this.$emit('theatre');
  },
  toggleFullScreen() {
    if ( this.$refs.root.exitFullscreen) {
           this.$refs.root.exitFullscreen();
        } else if ( this.$refs.root.msExitFullscreen) {
           this.$refs.root.msExitFullscreen();
        } else if ( this.$refs.root.mozCancelFullScreen) {
           this.$refs.root.mozCancelFullScreen();
        } else if ( this.$refs.root.webkitExitFullscreen) {
           this.$refs.root.webkitExitFullscreen();
        }
    
      
    this.$emit('toggleFullScreen');
    },
  changeVideoSrc() { //Sets the source to fit the quality
     let maxDif=Math.min();
    const video=this.$refs.video;
    let currentTime=video.currentTime;
    for (let item of this.video.assets) {
        if (Math.abs(item.height-this.quality)<maxDif) { //Find closest source to the given quality. I.e, if 480p does not exist, default to 540p.
            video.src=item.url;
            maxDif=Math.abs(item.height-this.quality);
        }
    }
    video.play();
    video.currentTime=currentTime;

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
   updateFullScreen() { //https://stackoverflow.com/questions/21280966/toggle-fullscreen-exit
      if (! this.$refs.root.fullscreenElement &&    // alternative standard method
          ! this.$refs.root.mozFullScreenElement && ! this.$refs.root.webkitFullscreenElement && ! this.$refs.root.msFullscreenElement ) {  // current working methods
        if ( this.$refs.root.requestFullscreen) {
           this.$refs.root.requestFullscreen();
        } else if ( this.$refs.root.msRequestFullscreen) {
           this.$refs.root.msRequestFullscreen();
        } else if ( this.$refs.root.mozRequestFullScreen) {
           this.$refs.root.mozRequestFullScreen();
        } else if ( this.$refs.root.webkitRequestFullscreen) {
           this.$refs.root.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      } else {
        if ( this.$refs.root.exitFullscreen) {
           this.$refs.root.exitFullscreen();
        } else if ( this.$refs.root.msExitFullscreen) {
           this.$refs.root.msExitFullscreen();
        } else if ( this.$refs.root.mozCancelFullScreen) {
           this.$refs.root.mozCancelFullScreen();
        } else if ( this.$refs.root.webkitExitFullscreen) {
           this.$refs.root.webkitExitFullscreen();
        }
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
        if (this.video!=undefined) {
          let maxDif=Math.min();
          //Find the closest height to the selected quality from the last video.
          for (let item of this.video.assets) {
            if (Math.abs(item.height-this.quality)<maxDif) {
                this.$refs.video.src=item.url;
                maxDif=Math.abs(item.height-this.quality);
            }
          }
          console.log(`Loaded: ${this.$refs.video.src}`);
          this.$refs.video.load()
          if(this.currentIndex!=0) this.changeVideoState("play");
          this.changeEndTime();
          this.title=this.video.metadata.title;
          this.updateFullScreen();
        }

  },destroyed () {
      this.isMounted=false;
  }, watch : {
      video() { //If the video object passed changes, load it, and start playing. (this only triggers on videos after the first.)
          let maxDif=Math.min();
          //Find the closest height to the selected quality from the last video.
          for (let item of this.video.assets) {
            if (Math.abs(item.height-this.quality)<maxDif) {
                this.$refs.video.src=item.url;
                maxDif=Math.abs(item.height-this.quality);
            }
          }
          console.log(`Loaded: ${this.$refs.video.src}`);
          this.$refs.video.load()
          if(this.currentIndex!=0) this.changeVideoState("play");
          this.changeEndTime();
          this.title=this.video.metadata.title;
      },
  }, computed : {
    qualityGeneral() {
        if (this.quality>=720) {
          //"../assets/HD.png" encoded in base 64.
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABJCAYAAADllaIuAAAFGklEQVR4nO2cPUxcRxDH/5yQj8ZA4ZMLIyEdUixc2FSkowsVcYPdUNmRJaeIkiZ0SUXSxGkcuXBkS6AgcGHZBVCZyq7iVNiFT4kUpChYMgoFJA2kmWhPs3hzftzd2xm/D5ifdLqvt2/2vXm7OzszuzAMwzAMwzAMwzAMwzAMwzgB9BCRv8oBAJMAhgHsAtgDsM//9QXHuM+/AXiifHu8/HEAg0EdHFUAB/zex78/45eEKQBnAPQHMv5OeT5fzvFvcA7/vqF3i/5PT08P4BRIRONEtELpmOOyGq9hIrqXUv4bIroRKXuUiFaJaD+lzLTsEdHvRPSEiOaJaJaIJoiopnHfmvCXnyIrOKGkwC8j5b8gooEIeXM6+onmTyJaIqIpqQIrAM4DuBrZij9W6g1iz3MRwKWIclOR8rQYAjADYBXAEoCPYs/rFHg2GOPSMqx0QZLznI0oUxfI02aG7YnvYupVCQyVGPYEZUMkdYgpm9ZQyYJZAE8BfJVGVkWohDdKF7adcdnXSvXWxnWtcwDudnte3wIlLUCDvOUXjZsA5gHUOtWrF8AfJ+72vJ23FZlrAE4B+KRdfSsluJBOxBhg1WyrGI0zcG63K3wcFHjcuckWaiIVxalAXpyE8dNZqBNJf1S4C4qdB2pRhjEpb64nye8VVkpL8WUZk0IaAF5x3WuBQ9w7x7VxRs0ygPXwvFIFanVfZWuBtwD8AGAr4b8xABdYkSPsJhtVkvt5kgL9PDCmNRXBE5M1a6zAv46Qu9ESQqqyIfKpgiKn+LXmf6gI54HnhRXyxPgzJUha/Hob5SVxwK11urX1RHItLCadRtwQRiSG2XWUaGEVlEZktVy5KwCeCy9rOrxf0jHQscLedB/B3+PuuJrQLW9zpL2PW+9FhWlM1t2vxOByTvSvFbIZRn02goYCwakQeZG1AXROWH6drckZwTku+A/micmHH4VSx/wHU2A+PBeMpeCwU5PjoMAyOgEOhMbMaR9qshaYHz8LJNfYUWAKzBFpVkDTXWcKzI8DoQXdHDpMgfkiHr9NgenRMpqk52m2XlNgfpwRSjYF5syIQLxT3g5MgblRFTrwX/tYpJYvdJUd1WGO6WDLMf6/bV5KdknJmV1GRoUKPAxnaSjwMiswBheR+IxfJwlp+OwwE0DahS4KlOf4FcA3/F4WpNGPfo7OSzh0w0kVqJHVvV2y7PAdYfk5hdSKQ0e4GTHZMsuJSRIami1QK5hapqy0sS6OaaXOK46OzLBOwV1tIyZvslb+DLeAtS6OrXMWmUZGGljuQviDVIFFcStlSZ0XnHwYjEXhThf9fMwIv2te23Lr4tSiZGbnndqflnralbQKbCSlYpgRUx5uJQ0XRVGgrdBtzyPuPt9BqkC78e+fTc4lTcS60GLTYKv3yAy2oigwayOmDFavM1q+6JS9dhzmgWVMK+zEJs8dO6YeFmWJddmmEe+TZzz57ypvtFe41VZrzC+WAUHZmDp03H8lB7Z4GdpCmuVrvcKnv6wT+VMZy2uHU9ZjDqslrfhtS4VjcbHxOOlaN88vkeX2I+uuVW8JfuHnJI93qZUHboEuHneHZ/ppWoK76Q+VLmYxWC+Yhm8j90p7wL7MoS6O1cSHgl7xWCd+kMItlyd539AP+HvSjfEGz0sA3ytH0sdZ/gQ/SLsJdejj8XKfH577AnnTrMQaLxbxO0tItlwGf/4nyLzeCpKQGpo7JTa3XDYMwzAMwzAMwzAMoyQA+A8NJOZvCuSi6QAAAABJRU5ErkJggg==";
        }
        //"../assets/SD.png" encoded in base 64.
        return "data:image/png;base64,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";
    },
    qualitySpecific() {
      switch(this.quality) { //All of the appropriate images in ../Assets encoded in base 64.
        case(360):
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABJCAYAAABbw/pzAAAFf0lEQVR4nO2cb0hdZRzHv4YORRvTuYnKRFuUNBeNtrzBppswpF60GM2ttVmwl5mB+C7qRdJmMaRZRKtGq6CYxl4NIgdNtjGu6VrGEvNFuoaT/Fu6pWG0+J7uc3rO8Vxz7p77HL2/D1w8997znOc8n/Pc3+93rufcJAD4Jns1PNgA4GsAeQCSvFYQ5uU2gGEA+6nYvWLF6BjuidK6GkAXgHwRv2joLQfAVwDqvDbiJZ8z/jiA1GCOacmxAkBjZEI78JIfFvExJwXA+wCy9A275TM2ZSzdMQaaNABt+g7q8ncBKE90Qz6ziblWdaHLfztKGBJiB/1+6CU/XyTHBduzkr8eQPLyHW+gWKF2RsnPkno+btBzGTT5act/zIHCKuWV/OlEtxFnZqDJ70yUUQcJKS0NIvLN4Ij5ggFEvkFEvkFEvkFEvkFEvhkcJ1mCAUS+QUS+QUS+GeQM1zQi3yAi3wxSaprG93+aFx49ijVl5cgoKrKezwwPY6K7G9eOHcN0R9izzeqD1cirqsKqjRuRnJ5uvTYaDuNGSwvGPvt0wf2MXLyIa0cOY3ZgwLHupnPtWFVSMu9+/3b1KiYud2Ggvn5R414I+lXKt2O98S3fdtoy3Px16xa6a17E5JkzjnfuP/4B1u3eHXWbfc3NGGx4/Y766dq713GgFyJfcbO/H99X7ZlzAO+SyorRsTbfwg5nohJCAZT2Q12dNRjCGb3hzbccbXJqX7bF62046xX3HTr0v/30NDQ4+ilubIy6n0Nnz1p9qAfb8jUFt51fUxMzLzq+hZ3Z3yfR/8lJ3PtgMaZ+6nXM1oebmqy/qWvXOtoUHDhgL/c1NeHX5mPW8uSF8yj5+CSmh4Ywc2MQaaUheybnPvGk3ebnEyfsfiY7OhCKfKo4y/U2OtyeO5RZ/X7+BXJ37rSeZz66GTGd9xF8k+8ODSSlsNCK5Yrrp0873tdDhxJP+JG/smO75/b0Azje9t91qBTNuK/eX1laGjXHmCJuV6kxPBQ9/4K1zPBw/ctWRzJjklUw2XF9zmolzyvhrtxW5ujDLVeXn1awznO/UvPyHX0nZ2YiMxSyZz1h4o0xVqkZN/kMP/YA09OtymTqYLVn9cIw4U6I2aGQ9egrLPT8VC0WStZFu2H896viiVud3/tSDc6tybaSGmc+Qwxjvz7rdJgwmfzcCfeB2lorfvsJ9499Mnn37n/Wt57iNvNVqcaZPrR1q13VMAfwtT/6+hzr6+Ud33/8xx47hOTseQYDHeE5bZgD9JJQnSMgUgB4waLAz1p+Pnyb+ayl+dgxMor8V1+Lul5yxr83wjBec8ZFg/HbjbtN1lO77GUeCD2BT135zodR3h2+yWdZqOJ2wb59dnjh39zKSns9PZkxCSuK33nXDi88eHoOGG9vt5dHLl2yl1mqsg3Frz98xH6dB859MhcEfDvDpYTNp045PvpuGNc7H9tiv0ppj7S0Rj1bRSQB6nF4If0wb+iJXT/DNRR2yitGx877N/M7wghvL3ecLSoYKjhoXTwieYGxnvW/OwSpNu4EyH749YGelBWc8W7xQcLX73Z0VNiZnRhfcAi40zb85Kjan8k4aCdVGtbMj5t8wUHSfLf/C3FA5JvBcU+WYACRb4aHIPLNIvINIvINIvLN0AORbxaRbwa5UNY0It8gIt8gIt8M1gVGIt8gIt8gIt8gIt8M8n2+QeQkyzQi3wwTcMn/M4EGb5JZ9YOCuvxfEk6DGQZVr7r89+TanbjwhurE/SviwbuUd3lxGcBHakTuhLuNV9oluiGfmI74tXHL5wqvAPh7OYw2QNBnvftnk73uTGH4uRnJASmJZskHWN08B6DVvelodT7j0tO8nXWpjTRgjAPgPaxzxAPAP181BNmkTI/cAAAAAElFTkSuQmCC";
        case(480):
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABJCAYAAABbw/pzAAAFm0lEQVR4nO2cb0hdZRzHv8Z1aHPSdTpTmegMEV2skcPLaBqDMYrRYpAjt1bsRb5IDZxvKuxF0mZhkBbRqkE12JiDvUmQJrQIGZpua5uMkJaucDX/Lt3SUFp8Tz7H5xzPvdvcPfc53vt84ML1/HnOeT7P7/ye37mee+MA4LvU1XCgCMC3ADIBxDltoAnJHQDDACqo2L7h1tExPBRk730AegFkafFLht7SAbQDqHVqxEk+I/4wgARv9mnZsQJA43xAW3CS36XFh514AJ8CSJEbtstnbkpavn30NIkATssnKMvfCaAs1g25zEbOteIQsvwPg6QhTfig38+d5GdpyRHB9Czk5wHwRW9/PcUKcTJCfoqu5yMGPZdCkp8Y/X32FEYpL+RPx7qNCDMDSX5PrPTaS+jSUiFavhosOV+jAC1fIVq+QrR8hWj5CtHy1WC5ydIoQMtXiJavEC1fDfoOVzVavkK0fDXoUlM1Ef+n+ePftMGX9P9zWVc/aMJkW5tlffKOHcis2AP/hg1IWLPGWDZ3+zZuXr6M4Y4O3Ghpdmw3p6kJaaVlSMrNNf6eGR7GSGcnrh06iNnBQcu2G898j0fWrw95njf7+jBxrheDdXUP1uEQRFR+wbHjSA0EzL/j/Zan55Be8zoK6+sX7edbudLYj69VRUX4pfJVy/pNP/aY0gUcuLW7diFj+3b07t6N6e6u+zpXDg5fHNCfyl9YNIAPSGSrnccOf4aMbdtCbrOustJ8P9rVhc5NxTiTloqBr740l1NoYsnCADLihXheIf0tLbjS0IBbAwPGMg5cQWNj0GP+0dGBS7W15ov7cpmAbWdVVS294yGISORn1b9tSLsbIs2Q662tZrTx0s99+RVz3cP5+WYkZzzzrLn81yNHMNTwjvF+srsbgfmUxgjmgDlF/8z1IYwd/dqyzEhtx46bweJ/shhhjft5XI/81S/tQ35NjfFeRGMwfj91ylyTWV6O+Jwc4z2jW8A2hCyulwds/PTCc6gUzbwvSC4pcbejS8DVyOfkWdjQYLynNObOp3p6g27PXD43NWlEM/O7vC1TysjZs7j65hsL7W8ptexvj2zKF4OTmL3W8ZgJmVlGgAh8fj/8gYAlRXLiDTNGqemafEZl0XvvGzmX4vqqq+86aXEf36pkSzQL2E5iRgZ86Y+GdfKj5FBzEfO/WxWPK2mHEp9oPWlIpPiLVa/dU7VR8NHH5tzATtsnXObu4hMnzHTkFjxnTvicvH+ueNG147gS+awO5NIv70AdcGBx9Kyrrkb2/v1GvT87MmopQ5le5AlX1PC8Atg+l/3d329pj4MiXxXcVjD716TjuXJg3azlQ+F6tUMBwW5oxACx3rfX/PbUwmi0w6uJy4XklOd2mjdhHAg5AKYunA9vx8KAK/KnLl6y1OYycsnI1MJSjxE8d+NPy3ascEREcuKWB5DtCzgJi5ydvXevUWKyrbyDh8xtOPHa76S9gCvyWQqOHXVeJ8sfaW+31NjMsaIs5XZMNYxsWTwHTN7nWnMz0jZvNqKfkR5wkNwf4iZLJZ76YI03SPLdKWUK8RwEXk32CZCphx8fcIK0w4jnXav9JsoryN9Av+OlE2POFnX87MT4PaUNeR+msvv9PCeClG0dHfvBs/KjnLhQX//XRAAtXw2W72RpFKDlq6EQWr5atHyFaPkK0fLVcAVavlq0fDXoB2VVo+UrRMtXiJavBuMBIy1fIVq+QrR8hWj5atCf5ytE32SpRstXwwRs8v+Joc6rZFb8oKAs/7eY06CGIXFUWf4n+tmdiPCuOIj9V8S99yhvdHEOwBeiR/YJdwuftIt1Qy4xPe/XxC6fG7wF4N9o6K2HoM86+88mOz0izvRza34OiI81Sy7A6mYPgJP2poPV+cxLz/PrrMutpx5jHMDTTuIB4D9EfML5dLgSawAAAABJRU5ErkJggg==";
        case(540):
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABJCAYAAABbw/pzAAAFWElEQVR4nO2cf2hVZRjHv4tNNpzSnT9iDu1ugxC3tFGxi+BmgkghGUJJZj/Af8U/1v6pWH8U6f5Y0mZFUZIpKGzhPw3GFFaU6JYzRSRiYJuOae6Ha5u2xUbG83Lfs/ece85d0733Odt9PnDZOfe+957zfs5znvd57865GQDQtnwZfCgB0ApgFYAMvwZCUu4D6AewmxR7G24ZHMIjAe9+A0AngAIR/8CQt8cAtACo8vsQP/kU8V8CyA5nn+YdiwDUxgPahZ/8dhE/52QB+AJAnvnBXvmUm3Lnbx9DTQ6A0+YOmvJ3AKhMd0OWKaOxVm/ClP9JQBoS5g7y+5Wf/AKRnBIcz1p+MYDMhdvfULFI74yWnyf1fMogzxUw5Ocs/D6HClXKa/nj6W4jxUzAkH8hXXodJqS0ZETk8+DK+QIDIp8Rkc+IyGdE5DMi8nlwTbIEBkQ+IyKfEZHPg8xwuRH5jIh8HqTU5MbqP82zolGUfnM0aZtrH9dhtLk58PWc8hjW1tY665ee2+zbLlpXhxUVlcgtLFTrE/39GDh7FtcPHsBkT4+rbdkPP+LR0tKk+/XX1asYvtiJnurqpO0eBqvy817cMWMnsyJ5wa/RwTt82BEaxLO/XEhok71yJVbv3In8bdvQuWsXxjvaZ7XvtN/0oAN6+ZWXEw7gQ6KqHavyl5SUOMtT9+7hbnd3QpvJ4TuB73+qsWlG8RTxug1t448jRzA1MoI1e/ao5zMXL1ZnTtAZc+vMGQy0tDjrmZEIIrEY8rduVev0GQX79lk5A6zKj5SVOcu93zXNqgNrT5ycUTyR//wLzjKJ7/vwA7U82tGBWDydUQRT+vKL/ombfRg6fsz13O2GeuDESecARJ5+BnMa93GsyaeUYcobv9GropSYHBlF//FjgacytdMdp7Ml6CDQNii9aO6cnr4OlURT3tevLy0vn3XqsY01+Us3VbjW19XUuNaL9u51RaqmoOZ9FL75llrTKWH9oUP/axteuab8nDWrfT8je1UBlr0+fem8N+0QNPDOMarUtCZ/yYb1rnUSQQ+dh+nxxP79Kj+r05xkbt+unkM84n/f/apLjA1IsinaCwWArYrHWp1PqaX726OqZKO/50vWqUHv5+jjGGyfjlAaGBEXv+HTz9QyiacKgwsauGkfuxoaVADYwlrk63Til9VvNjZieSymlnU+L367Wp0NBP3V8wP9nIZqdMTr/b+7ulyv0RhgjiPmeykY/KDAsFnLJ8Oa/Ce/b0ZuUZFapqg3yY5GnTWKMi+Up82B1MScN1COp/dryTSv0CnMO+CPXfrVVlcfGGvyJ8fGHIFUNl6vr1eyKIfTYKu51dqqlvrb2nwHNhoQzZxMkWoycO6c8zqlMCoxp27/ieIDB51WNNYkm0VzYU3+tXffwYqNG1VUBg1qlNtp+g8jTXmhg2W+15si6KDq7VCkx3wkdxlfT4QJewNuTw/aN1eqasELpYreU6fmZNpOZxN9fWAO4hqK+CtVVQmTqLBg3oF+3+Y+6ZKRvk6wlQIoz+vanwbjsE2qDCq3DA79lDL5gouMZLf/CylA5PPguidLYEDk86BmnSKfEZHPiMhnROTz8BtEPi8inwe5UJYbkc+IyGdE5POgLjAS+YyIfEZEPiMinwf5Pp8RmWRxI/J5GIZH/j9p1HlOJvUPCpryb6SdBh769FZN+Z/LtTsp4SO9Ee+viIfvUt6FxUUAX+seeQfcTXSlXbobssR43K+DVz41eA/AvwuhtyGCfFZ7fzbZ7xJxSj9342NAVrpZsgBVN68BaPJ+dFCdT3npJbqddb71NGTQHd5093WCeAD4D6MUoukQeN7YAAAAAElFTkSuQmCC";
        case(720):
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABJCAYAAABbw/pzAAAFQ0lEQVR4nO2cX2wURRzHvzUtaS1tbBFIaYpt2jSgjUjU9EJCqySEaKoYIhIB0Sd9sEJyNkrikxjhHniwDRhRiSixJJLwRNIISSWFkLYU+VM0eDH2UIpy/UdbsGfaiPltbsbZvb3rtb3d2d79PknD7t3M7sxn537zm2P3sgCg/eFFsOExAN8DWAYgy64Ak5D7AMIAtpJia8F1g0N4IE7tHQB6AJSy+FlD3pYCaAPgtzuInXwa8YcA5HqzT/OOBQAC0QFtwk5+J4tPOTkAPgNQrB7YKp9i08L520dPkwfglNpAVf5GAPWZbshhVtNcK06hyv8kThhiUgf5/cJOfilLdgXpWcivBJCdvv31FAtEY4T8Ys7nXYM810GRn5f+ffYURiov5E9kug2XiUCRfyFTeu0lOLXUCMvXgynmMxpg+Rph+Rph+Rph+Rph+XowLbIYDbB8jbB8jbB8PfAKVzcsXyMsXw+caurGsf80X/3DmaTKjQeD+PWtN+V+Tnk5ShsbsbiuHgsrKuTrd65dQ7i9Hf0f7bE9Tvn+/aY6kXAYA+fO4ca+vZgMhWLa9lBNTcJ20flGLvYg1NSUVD9mg2Pyp+ucHST+ie+Om6Srx6O/gpUrcX3rq6b3nu6+EFMnd8kSlG3ahJING9CzZQsmujpn3H76owt6+ZXNMRdwjhjZjmPyaeQk6piARrOgcu8+KXHq3j38dvgwIqEQClY9jorX3zBeL1m/HiM7d+F2S7OxTyPeWmdqdBTLt283Xs/Oz8eKQACXnn3Gti1/nj6NgbY2uZ9dVIQin884D0HHoE+iE58Ax+TH6+yK1mNSfrClxRRGFq9ZI7dJonhv6ChMISVveZksV/Lc87Z1xrq64Dt50tim8+XV+mxHf+RWP4aOfmN6zbiwrcfkBSh68imkdNxHcfVGKRqlokN/nDgRE7/Plj9iSHqwuhpjZzvMDc3Pl9uTo2PGvxSmKLwIhk/9fx8qiaa4L94vrK2dcehxGtfkL3pthwwdd/v6TJOsCgmySqKLJiSS0HB0pBaurYupq6LKVz8tKrnLSo22Caxhh6CJN8UYqaYr8mmEVu/eLfd/2fNh0nWrDn1uTJyIxvSf3n8vpZMfSVZFW6E5wamMxxX5NGGJEUidGYvG4kTQBav56oicH0j8lca3k6o7V+hcd3p7MdzdHTe1TQWuyC97ebPcvtX67bTlCxsasOrAQRnnBzs7cf2dxpgR/3cwaNqnC6aWsZsnrPR9fcTRXD4Rjq9wl+7cJSVQDJ5u5FJ5VTzJ6X2hwTbUUIynUSoofnGj3KYLoeb+45d+TFWXUobjI58mLwGtOBNBI77a75fiaWJGdMJVGb9yVaaHA+fPy5hNuT2lmFO3/zLWDIJkLroOHJdfUFUltydu3kxYtvLdJlOooJFrt9qlTwPl/sSN5mZjfUD1qKzPRnIwEJhbJxzC8bCjyoskyFIov5/NVxIUeujrA5oXrNCIv+r3xyyivIL6BPp9T7ZwBlCcF7k/TcZeW1Qp1K8bHOpIK/nziKxEj/8zLsDy9WB6JovRAMvXw6Ng+Xph+Rph+Rph+Xr4GSxfLyxfD3yjrG5YvkZYvkZYvh6MG4xYvkZYvkZYvkZYvh74+3yN8CJLNyxfDyOwyP8ngzqvk0nxg4Kq/N8zToMe+sVZVfmf8r07rvCxOIn1V8S9dytvenERwJeiR9YJdy3daZfphhxiIupXYpVPBT4A8G869NZDkM8m688m290iTuHnbnQOyMk0Sw5A2c02AMeth46X51NceokeZ51vPfUYwwDogeQY8QDwH2XxllYKIdnqAAAAAElFTkSuQmCC";
        case(1080):
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABJCAYAAABbw/pzAAAFzElEQVR4nO2cb0xVZRzHvzRwkMoS+RMw3SU35szF2iBuLpHYXKu5bL7QhfbnVbxR2hhvqtGLWMoL54KsxcqtP6/U5iurBVshOQdBtpRYYyVYsyb/NNCw4bJ9z+7z9JzDuVfiXs7vwn0+G+Pew3n+fe5zfs/vuZx70wDgq9y18OFBAF8CKAKQ5neCJSZ3AIwCqKVi74k14xO4J0rp5wH0Ayi24hcMvRUA+AJAg18lfvI549sBZCbnmJYcKwC0RCa0Cz/5PVZ8wskA8B6AHLNir3zGplVLd4xJTRaADrODpvydALaluqFF5mGutaoJU/5bUcKQJXHQ7/t+8out5EDQnpX8DQDSl+94k4oVqjNKfo7N5wODnqtgyM9a/mNOKpxUXsmfSXUbAXMLhvy+VBl1MmFTS0GsfBlcMd8igJUviJUviJUviJUviJUvg2uTZRHAyhfEyhfEypfB7nClsfIFsfJlsKmmNAn9p3lGKITyzz5HZn6+8/zrvNyo54YOH0Ze1TasKilxnt8aHcXY2bO4fOggZkdG5pyfvWMHimr3Yk1Zma7/9s2buH7xIkY7O3G1rdW3PxsOHnKVuTE8jLHuMxhpbJxz/uNj4zHHd7f2/i/mXcp34qmIA9349lHkhsP6WDT5Fd/2ael+A+zfswczvT36WEH9y9jU1BSz/d9OncLPdS/p51mVYZQfP470lSt9z+eL0PdIhevY3eSb/NHZiZ9qn533+R6eqBmf6Ig77FB6cdPrCHedcYmPBme8Ek/RQ21tGGxudmQQytrY0uIq/UBdnX483tODsxXlzgs7/NGH+vi6Xbsc4QrWocSzbrbBttgmYR/Yl2iw7gsNDfqHZa8PDOizC7dvd67GeIgr7LDxsqPv6EFyYNFmmu70k0/px5eOHcOV5jecx1O9vQifPu08vm/zZkekmv0qZJDfT5zQYYmho+SFF/Xf7i0tdcqwLOtQDBw44LqSSuvrdV/8wg+Z/uECJj752HWMfX30x0Hdn5zqakxF+rwQ4pr5GWtytGzOlKEjR2KfHwq5RE52/HffKOUw7iuyKyv1Y4YURdHu3U49iFxFCs5uJcssyzpN8Wab7IuqS4K4Zv7stUlH+tWTnzoDXPvcnFvQXWRvrXI9N6UoUerFyVq/Th9nLL89PeXMVIa2x/r69d94tY2dO4dfXn1FHzPLmi+oX5vs04TPAr+67CHXLfWZoRDya2rck6erK+Z4Y+CkmnHJ5yUXz2U3Xzg701dnuwau4JWXVViI9IL7fbOkhWKGMz+4BsQ79iWR5zOL4oKKSJbhXXAZ35nZLHYI4VXE9rkAq7UqHgK9OfavoSHXc8oyZ6u5WM/+OeX85uJpZlEML+aCq/YKLFu8f79zTJX11qnajNUnBQV7F9xEE+jMZ7xVqR7JeXqnfkwpZu4//f155zczGBNvaDHr85ZFJKU0hZttsqx3DQiSwMMOF0fF+n37nJmtdqIKXt4qnk590+0qb2Y4THXNlJLpISJrkbnQsm62wbbYpl9fJAj8nvzLra3I27LFCQeclWGfRWvI2GRxpnNxU7k5F0KGGs5aUzxjsRkmLrW3610xN0T8MWF5M0OSIPCZz8ucbx9wp+qFs9Uv1nJxM3fBfNGUeErkwuvd6vO9F9alyphwp8o+JDI7WggJe29nITAUqNyfC9984q9ZhvuM+aR7DDdq7WAYk5bODx7WjE90i8pPYdJiffzfEgBWvgyuz2RZBLDyZdgEK18WK18QK18QK1+GQVj5slj5MtgbZaWx8gWx8gWx8mVwbh6y8gWx8gWx8gWx8mWw7+cLYjdZ0lj5MlyDR/7fKTR4SWbVFwqa8n9NOQ0yXFGtmvLftffuBMKbqhHvt4ifl+lPyvAdgA/UYL0L7lbeuZfqhhaJmYhfjVc+T3gNwD/LYbRJBH02er822e8WcYafG5E1ICPVLC0CzG72AjjprTpans+49Axv6l1qI00yJgFU+4kHgH8B7XIJ5Dk9eD4AAAAASUVORK5CYII=";
        case(2160): //Couldn't find any 4k in the dataset, but including it anyways.
          return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAABJCAYAAABbw/pzAAAFQ0lEQVR4nO2cX2wURRzHvzUtaS1tbBFIaYpt2jSgjUjU9EJCqySEaKoYIhIB0Sd9sEJyNkrikxjhHniwDRhRiSixJJLwRNIISSWFkLYU+VM0eDH2UIpy/UdbsGfaiPltbsbZvb3rtb3d2d79PknD7t3M7sxn537zm2P3sgCg/eFFsOExAN8DWAYgy64Ak5D7AMIAtpJia8F1g0N4IE7tHQB6AJSy+FlD3pYCaAPgtzuInXwa8YcA5HqzT/OOBQAC0QFtwk5+J4tPOTkAPgNQrB7YKp9i08L520dPkwfglNpAVf5GAPWZbshhVtNcK06hyv8kThhiUgf5/cJOfilLdgXpWcivBJCdvv31FAtEY4T8Ys7nXYM810GRn5f+ffYURiov5E9kug2XiUCRfyFTeu0lOLXUCMvXgynmMxpg+Rph+Rph+Rph+Rph+XowLbIYDbB8jbB8jbB8PfAKVzcsXyMsXw+caurGsf80X/3DmaTKjQeD+PWtN+V+Tnk5ShsbsbiuHgsrKuTrd65dQ7i9Hf0f7bE9Tvn+/aY6kXAYA+fO4ca+vZgMhWLa9lBNTcJ20flGLvYg1NSUVD9mg2Pyp+ucHST+ie+Om6Srx6O/gpUrcX3rq6b3nu6+EFMnd8kSlG3ahJING9CzZQsmujpn3H76owt6+ZXNMRdwjhjZjmPyaeQk6piARrOgcu8+KXHq3j38dvgwIqEQClY9jorX3zBeL1m/HiM7d+F2S7OxTyPeWmdqdBTLt283Xs/Oz8eKQACXnn3Gti1/nj6NgbY2uZ9dVIQin884D0HHoE+iE58Ax+TH6+yK1mNSfrClxRRGFq9ZI7dJonhv6ChMISVveZksV/Lc87Z1xrq64Dt50tim8+XV+mxHf+RWP4aOfmN6zbiwrcfkBSh68imkdNxHcfVGKRqlokN/nDgRE7/Plj9iSHqwuhpjZzvMDc3Pl9uTo2PGvxSmKLwIhk/9fx8qiaa4L94vrK2dcehxGtfkL3pthwwdd/v6TJOsCgmySqKLJiSS0HB0pBaurYupq6LKVz8tKrnLSo22Caxhh6CJN8UYqaYr8mmEVu/eLfd/2fNh0nWrDn1uTJyIxvSf3n8vpZMfSVZFW6E5wamMxxX5NGGJEUidGYvG4kTQBav56oicH0j8lca3k6o7V+hcd3p7MdzdHTe1TQWuyC97ebPcvtX67bTlCxsasOrAQRnnBzs7cf2dxpgR/3cwaNqnC6aWsZsnrPR9fcTRXD4Rjq9wl+7cJSVQDJ5u5FJ5VTzJ6X2hwTbUUIynUSoofnGj3KYLoeb+45d+TFWXUobjI58mLwGtOBNBI77a75fiaWJGdMJVGb9yVaaHA+fPy5hNuT2lmFO3/zLWDIJkLroOHJdfUFUltydu3kxYtvLdJlOooJFrt9qlTwPl/sSN5mZjfUD1qKzPRnIwEJhbJxzC8bCjyoskyFIov5/NVxIUeujrA5oXrNCIv+r3xyyivIL6BPp9T7ZwBlCcF7k/TcZeW1Qp1K8bHOpIK/nziKxEj/8zLsDy9WB6JovRAMvXw6Ng+Xph+Rph+Rph+Xr4GSxfLyxfD3yjrG5YvkZYvkZYvh6MG4xYvkZYvkZYvkZYvh74+3yN8CJLNyxfDyOwyP8ngzqvk0nxg4Kq/N8zToMe+sVZVfmf8r07rvCxOIn1V8S9dytvenERwJeiR9YJdy3daZfphhxiIupXYpVPBT4A8G869NZDkM8m688m290iTuHnbnQOyMk0Sw5A2c02AMeth46X51NceokeZ51vPfUYwwDogeQY8QDwH2XxllYKIdnqAAAAAElFTkSuQmCC";
      }
      console.log("Error. Defaulting to 1080p");
      return "data:image/png;base64,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";

    }
  }
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
  align-content: right;
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
.vid-container:hover  .showhover{
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
