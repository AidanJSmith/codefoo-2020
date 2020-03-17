<template>
    <div class="root">
        <div v-if="screen>=1100">
            <div v-for="card in currentcards.slice(0,currentcards.length-1)" :key="card.contentId">
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time" :style="styleTime">{{Math.round(card.metadata.duration/60)}}:{{(card.metadata.duration%60/100).toFixed(2).slice(2)}}</div>
                    <img class="card-image"  @click="setVideo(card.contentId)" :ref="'cardImage'" :src="card.thumbnails[card.thumbnails.length-1].url"/>
                </div>
                <div @click="setVideo(card.contentId)" class="column playlist-header">
                    {{truncate(card.metadata.title)}}
                </div>
            </div>
            <div class="columns"> 
                <hr :v-if="0!=3"/>    
            </div>
            </div>
            <div v-for="card in currentcards.slice(currentcards.length-1)" :key="card.contentId">
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time" :style="styleTime">{{Math.round(card.metadata.duration/60)}}:{{(card.metadata.duration%60/100).toFixed(2).slice(2)}}</div>
                    <img class="card-image" @click="setVideo(card.contentId)" :ref="'cardImage'" :src="card.thumbnails[card.thumbnails.length-1].url"/>
                </div>
                <div @click="setVideo(card.contentId)" class="column playlist-header">
                    {{truncate(card.metadata.title)}}
                </div>
            </div>
            </div>
        </div>
        <div v-else>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time-lg">3:21</div>
                    <img class="card-image-lg" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
            </div>
                <div class="column playlist-header" style="text-align:center">
                    This is my attempt at writing a lot of example text.
                </div>
            <div class="columns"> 
                <hr :v-if="0!=3"/>    
            </div>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time-lg">3:21</div>
                    <img class="card-image-lg" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
            </div>
                <div class="column playlist-header" style="text-align:center">
                    This is my attempt at writing a lot of example text.
                </div>
            <div class="columns"> 
                <hr :v-if="0!=3"/>    
            </div>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time-lg">3:21</div>
                    <img class="card-image-lg" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
            </div>
                <div class="column playlist-header" style="text-align:center">
                    This is my attempt at writing a lot of example text.
                </div>
            <div class="columns"> 
                <hr :v-if="0!=3"/>    
            </div>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time-lg">3:21</div>
                    <img class="card-image-lg" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
            </div>
                <div class="column playlist-header" style="text-align:center">
                    This is my attempt at writing a lot of example text.
                </div>
            <div class="columns"> 
            </div>

        </div>
        
        <br/>
        <br/>
        <button class="load-btn" @click="currentloaded+=1;" v-if="index+3<cards.length"> <b>Load More</b> </button>
    </div>
</template>

<script>
import './../../node_modules/bulma/css/bulma.css';
export default {
    name:'UpcomingPlaylist',
    props: {
        cards: Array,
        index: Number,
    }, data() {
        return {
            screen: 0,
            currentcards:[],
            currentloaded:4,
        }
    },
    methods: {
        onResize() {
        this.screen=window.innerWidth; 
        },
        truncate(string) {
            if(string.length<=80) {
                return string
            } else {
                return string.split('').slice(0,77).join('')+"...";
            }
        },
        setVideo(key) {
            let found=false;
            for(let i=0;i<this.cards.length;i++) {
                if(this.cards[i].contentId==key){
                    this.$emit('setVideo',i);
                    found=true;
                }
            }
            if(!found) {
                console.log("Error. Video not found");
                this.$emit('setVideo',-1);
            }

        },
        update() {
            if(this.index+4<=this.cards.length) {
                this.currentcards=this.cards.slice(this.index,this.index+this.currentloaded);
            } else {
                for(let i=this.index;i<this.cards.length;i++) {
                    this.currentcards.append(this.cards[i]);
                }
            }
        }
    },
    mounted() {
        // Register an event listener when the Vue component is ready
        this.screen=window.innerWidth;
        window.addEventListener('resize', this.onResize)
    },
    beforeDestroy() {
        // Unregister the event listener before destroying this Vue instance
        window.removeEventListener('resize', this.onResize)
    },
    computed : {
        styleTime() {

        return "right:"+window.innerWidth*.008+5+"%;";
        },
    },
    watch : {
        cards() {
           this.update();
        },
        currentloaded() {
           this.update();
        },
        index() {
            this.update();
        }
     
    }

}
</script>

<style scoped>
hr {
    margin-top:2.35%;
    height:.25vh;
    width:110%;
    margin-left:2%;
    margin-bottom:2.35%;
    background-color:lightgray;

}
.root {
    position: sticky;
    top:0;

}
.card-image {
    border-radius: .5vw;
    max-height:100%; 
    max-width:100%;
    cursor: pointer;

}
.card-image-lg {
    width:100%;
    max-height:100%; 
    max-width:100%;
    cursor: pointer;
}
.playlist-header {
    font-size:1.1em;
    -webkit-text-stroke-width: .03vh;
    -webkit-text-stroke-color:#3F4144;
    margin-top:.25em;
    line-height: 1.3;
    cursor: pointer;
    color:#3F4144;
}
.load-btn {
    background-color: #BF1313;
    transform: translateY(-40%);
    width:110%;
    height:2.5em;
    color:white;
    border-radius:.2vw;
    border:none;
    font-size:1em;
    -webkit-text-stroke-width: .01vh;
    -webkit-text-stroke-color: white;
    user-select: none;
    outline: none;
    display: inline-block; 
    cursor: pointer;
}
.load-btn:active {
    background-color: rgb(172, 18, 18);
}
.card-time {
    position: absolute;
    z-index: 99;
    color:white;
    font-size:.65vw;
    padding:-.2em;
    padding-left:.4em;
    padding-right:.4em;
    -webkit-text-stroke-width: .06vh;
    -webkit-text-stroke-color: white;
    background-color:rgba(63, 65, 68, 0.651);
    margin-top:20.5%;
}
.card-time-lg {
    position: absolute;
    z-index: 99;
    color:white;
    font-size:4vw;
    padding:.2em;
    padding-left:.4em;
    padding-right:.4em;
    -webkit-text-stroke-width: .06vh;
    -webkit-text-stroke-color: white;
    background-color:#3F4144;
    top:80%;
    left:80%;
}
  @media (min-width: 200px) {  
    .card-time-lg {
        top:70%;
        left:80%;
    }
  }
   /* Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) { 
    .card-time-lg {
            top:80%;
            left:80%;
        }
    .card-time {
        position: absolute;
        z-index: 99;
        color:white;
        font-size:.85vw;
        padding:.2em;
        padding-left:.4em;
        padding-right:.4em;
        -webkit-text-stroke-width: .06vh;
        -webkit-text-stroke-color: white;
        background-color:#3F4144;
        margin-top:32.5%;
    }
   }

   /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {  
    #app {
                margin-left:5%;
              }
  }

   @media (min-width: 1220px) { 
       .root {
                width: 80%;
              }
    .card-time {
        position: absolute;
        z-index: 99;
        color:white;
        font-size:.85vw;
        padding:.2em;
        padding-left:.4em;
        padding-right:.4em;
        -webkit-text-stroke-width: .06vh;
        -webkit-text-stroke-color: white;
        background-color:#3F4144;
        margin-top:32.5%;
    }
    
   }
   @media (min-width: 1260px) { 
       .root {
                width: 80%;
              }
    
   }
   /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1400px) { 
       .root {
                width: 80%;
              }
        .card-time {
        position: absolute;
        z-index: 99;
        color:white;
        font-size:.9vw;
        padding:.2em;
        padding-left:.4em;
        padding-right:.4em;
        -webkit-text-stroke-width: .06vh;
        -webkit-text-stroke-color: white;
        background-color:#3F4144;
        margin-top:32.5%;
      }
   }
    @media (min-width: 1420) { 
    .root {
            width: 80%;
            }

    }
   @media (min-width: 1500px) { 
       .root {
                width: 88%;
              }
    .card-time {
        position: absolute;
        z-index: 99;
        color:white;
        font-size:.65em;
        padding:.1em;
        padding-left:.4em;
        padding-right:.4em;
        -webkit-text-stroke-width: .06vh;
        -webkit-text-stroke-color: white;
        background-color:#3F4144;
        margin-top:32.5%;
    }
   }
</style>