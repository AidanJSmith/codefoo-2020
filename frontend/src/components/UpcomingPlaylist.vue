<template>
    <div class=" root">
        <div>
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time" :style="styleTime">3:21</div>
                    <img class="card-image" :ref="'cardImage'" src="../../goal.jpg"/>
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
                    <img class="card-image" :ref="'cardImage'" src="../../goal.jpg"/>
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
                    <img class="card-image" :ref="'cardImage'" src="../../goal.jpg"/>
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
                    <img class="card-image" :ref="'cardImage'" src="../../goal.jpg"/>
                </div>
                <div class="column playlist-header">
                    This is my attempt at writing a lot of example text.
                </div>
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
            isMounted: false
        }
    },
    computed : {
        styleTime() {
            let sw=screen.width;
            let bottom=0;
            switch (true) {
                
                case (sw>=1253):
                    bottom=0;
                    break;
                case (sw>=1210):
                    bottom=35;
                    break;
                case(sw>=1211):
                    bottom=35;
                    break;
                case(sw>=1095):
                    bottom=15;
                    break;
            }
            return "bottom:"+bottom+"%;right:"+screen.width*.005+5+"%;";
        },
    },
    mounted(){
        this.isMounted = true;
    }
}
</script>

<style scoped>
hr {
    margin-top:2.5%;
    height:.25vh;
    width:110%;
    margin-left:2%;
    margin-bottom:5%;
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
.playlist-header {
    font-size:1.2em;
    -webkit-text-stroke-width: .03vh;
    -webkit-text-stroke-color: #363636;
    margin-top:.25em;
    line-height: 1.3;
}
.load-btn {
    background-color: #BF1313;
    width:103%;
    height:2.7em;
    color:white;
    border-radius:.4vw;
    border:none;
    font-size:1.15em;
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
    color:black;
    line-height:6em;
    font-size:.8em;
    -webkit-text-stroke-width: .06vh;
    -webkit-text-stroke-color: white;
}
  @media (min-width: 576px) {  
    #app {
            margin-left:0;
          }
  }
   /* Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) { 

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