<template>
    <div class=" root">
        <div v-if="screen>=1100">
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time" :style="styleTime">3:21</div>
                    <img class="card-image" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
                <div class="column playlist-header">
                    This is my attempt at writing a lot of example text.
                </div>
            </div>
            <div class="columns"> 
                <hr :v-if="val!=3"/>    
            </div>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time" :style="styleTime">3:21</div>
                    <img class="card-image" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
                <div class="column playlist-header">
                    This is my attempt at writing a lot of example text.
                </div>
            </div>
            <div class="columns"> 
                <hr :v-if="val!=3"/>    
            </div>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time" :style="styleTime">3:21</div>
                    <img class="card-image" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
                <div class="column playlist-header">
                    This is my attempt at writing a lot of example text.
                </div>
            </div>
            <div class="columns"> 
                <hr :v-if="val!=3"/>    
            </div>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time" :style="styleTime">3:21</div>
                    <img class="card-image" :ref="'cardImage'" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.0uIpcBNIlf72NCC4sDo5yQHaEK%26pid%3DApi%26h%3D160&f=1"/>
                </div>
                <div class="column playlist-header">
                    This is my attempt at writing a lot of example text.
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
                <hr :v-if="val!=3"/>    
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
                <hr :v-if="val!=3"/>    
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
                <hr :v-if="val!=3"/>    
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
        <button class="load-btn"> <b>Load More</b> </button>
    </div>
</template>

<script>
import './../../node_modules/bulma/css/bulma.css';
export default {
    'name':'UpcomingPlaylist',
    props: {
        cards: [],
        index: Number,
    }, data() {
        return {
        screen: 0,
        }
    },
    methods: {
        onResize() {
        this.screen=window.innerWidth; 
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

        return "right:"+window.innerWidth*.0076+5+"%;";
        },
    },

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
}
.card-image-lg {
    width:100%;
    max-height:100%; 
    max-width:100%;
}
.playlist-header {
    font-size:1.2em;
    -webkit-text-stroke-width: .03vh;
    -webkit-text-stroke-color:#3F4144;
    margin-top:.25em;
    line-height: 1.3;
    color:#3F4144;
}
.load-btn {
    background-color: #BF1313;
    width:103%;
    height:2.7em;
    color:white;
    border-radius:.4vw;
    border:none;
    font-size:1.25em;
    -webkit-text-stroke-width: .06vh;
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
    padding:.2em;
    padding-left:.4em;
    padding-right:.4em;
    -webkit-text-stroke-width: .06vh;
    -webkit-text-stroke-color: white;
    background-color:#3F4144;
    margin-top:32.5%;
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
   }

   /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {  
    #app {
                margin-left:5%;
              }
  }

   @media (min-width: 1220px) { 
       .root {
                width: 70%;
              }
    
   }
   @media (min-width: 1260px) { 
       .root {
                width: 100%;
              }
    
   }
   /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1400px) { 
       .root {
                width: 80%;
              }
    
   }
    @media (min-width: 1420) { 
    .root {
            width: 50%;
            }

    }
   @media (min-width: 1500px) { 
       .root {
                width: 100%;
              }
    
   }
</style>