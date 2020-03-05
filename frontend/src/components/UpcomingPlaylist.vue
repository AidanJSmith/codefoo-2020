<template>
    <div class=" root">
        <div v-for="val in Array(4).keys()" :key="val">
            <div class="columns">
                <div class="column card-image" style="background-image:">   
                    <div class="card-time">3:21</div>
                    <img class="card-image" src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpbs.bento.storage.s3.amazonaws.com%2Fhostedbento-prod%2Ffiler_public%2FBig%2520Pacific%2FPhotos%2FBigPacific_Promo_Thumb.jpg&f=1&nofb=1"/>
                </div>
                <div class="column playlist-header">
                    This is my attempt at writing a lot of example text.
                </div>
            </div>
            <div class="columns"> 
                <hr :v-if="val!=3"/>    
            </div>
        </div>
        <button class="load-btn"> <b>Load More</b></button>
    </div>
</template>

<script>
import './../../node_modules/bulma/css/bulma.css';
export default {
    'name':'UpcomingPlaylist',
    props: {
        cards: [],
        index: Number,
    },
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
    outline: none;
}
.load-btn :after {
    background-color: rgba(191, 19, 19, 0.876);
}
.card-time {
    position: absolute;
    z-index: 99;
    color:white;
    bottom:15%;
    left:75%;
    font-size:.8em;
}
</style>