const Canvas = require('canvas');
const Discord = require('discord.js');
const {
    prefix,// "ign" by default
    token //For security's sake, if this code were to be made public, this stored in the easy to adapt config file.
} = require('./credentials.json');
var Xray = require('x-ray');
var x = Xray();
const client = new Discord.Client();

function applyFilter(query, filter = "all") { //Makes and sanitizes url queries to the site, which will eventually be parsed by X-Ray.
    var url = new URL("https://www.ign.com/search");
    url.searchParams.set('q', query);
    url.searchParams.set('count', 10);
    url.searchParams.set('filter', filter);
    if(filter!="all") {
     url.searchParams.set('type', filter);
    }
    return url;
}

function reactAwaitEdit(originalmessage, message, place, max) {
    message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error)); //Whenever one of the arrows is pressed, clear the preexisting ones.
    const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id == originalmessage.author.id; //Limits emote access to the original author and only interprets the used emotes.
    };

    if (place == 1) { //If they're at the first item in the wiki modal.
        message.react(`➡️`).then(message.awaitReactions(filter, {
                max: 1,
                time: 1800000,
                errors: ['time']
            })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '➡️') {
                    wikiEmbed(originalmessage, place + 1, "edit", message); //Edit the last message with its new place as a modifier.
                } else {
                    console.log("Index is already at 1.");
                }
            })
            .catch(collected => {
                console.log(`Not a valid reaction. Error: (${collected})`);
            }));
    } else {
        if (place > 1) { // Wiki modal position is greater than one and hence, requires multiple arrows.
            message.react('⬅️').then(max != place ? message.react('➡️') : '').then(message.awaitReactions(filter, { //Only react with the right arrow if the user isn't at the max index of the modal.
                    max: 1,
                    time: 1800000,
                    errors: ['time']
                })
                .then(collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name === '➡️') {
                        wikiEmbed(originalmessage, place + 1, "edit", message);
                    } else {
                        wikiEmbed(originalmessage, place - 1, "edit", message);
                    }
                })
                .catch(collected => {
                    console.log(`Error. Reaction: (${collected[0]})`);
                }));
        }
    }

}

function wikiEmbed(message, place = 1, mode = "default", editmessage = null) { //Set defaults such that this function can be used for updating and the initial embed.
    x(applyFilter(message.content.slice(8), "wiki").toString(), { //This is an X.js implementation of a scraper for the wiki. It follows links, and attempts grab relevant text and images based on distinct queries.
        props: x('.search-item', [{
            title: x(".search-item-title", {
                text: "a",
                url: "a@href",
            }),
            subtitle: x(".search-item-sub-title", {
                link: "a@href",
                text: 'a',
            }),
            description: ".search-item-description"
        }])
    })(function (err, obj) { //When the scraper is finished, start processing it.
        const max = obj.props.length;
        obj = {
            props: obj.props[place - 1] //Pare down the options to one for the initial embed.
        };
        if (obj.props.title.url != undefined) { //If the scraper doesn't work, Send an error message.
            obj.props.title.url = obj.props.title.url.replace(/ /g, '_'); //Parse the scraped URL. Some IGN links include spaces, which discord very much doesn't like.
            if (mode == "edit") { //Edit the existing modal.
                x(obj.props.title.url, ".image@src").then(function (q) { //Attempt to find bottom image.
                    let url = new URL(`https://` + new URL(q).hostname + new URL(q).pathname).toString();
                    const embed = new Discord.MessageEmbed()
                        .setColor('#D3222A')
                        .setTitle(obj.props.title.text)
                        .setURL(obj.props.title.url)
                        .setDescription(obj.props.description)
                        .setImage(url)
                        .addFields({
                            name: 'Wiki',
                            value: `[${obj.props.subtitle.text}](${obj.props.subtitle.link})`
                        }, )
                        .setFooter('Bot by Aidan Smith. v1.3')
                    editmessage.edit(embed);
                    if(max!=1) reactAwaitEdit(message, editmessage, place, max); //React, and reset up the modal controls. (same below)
                }).catch(function () { //Send and imageless modal if none is found.
                    console.log("No image found"); 
                    const embed = new Discord.MessageEmbed()
                        .setColor('#D3222A')
                        .setTitle(obj.props.title.text)
                        .setURL(obj.props.title.url)
                        .setDescription(obj.props.description)
                        .addFields({
                            name: 'Wiki',
                            value: `[${obj.props.subtitle.text}](${obj.props.subtitle.link})`
                        }, )
                        .setFooter('Bot by Aidan Smith. v1.3')
                    editmessage.edit(embed);
                    if(max!=1) reactAwaitEdit(message, editmessage, place, max);
                })
            }
            if (mode == "default") { //Send initial modal
                x(obj.props.title.url, ".image@src").then(function (q) {
                    let url = new URL(`https://` + new URL(q).hostname + new URL(q).pathname).toString();
                    const embed = new Discord.MessageEmbed()
                        .setColor('#D3222A')
                        .setTitle(obj.props.title.text)
                        .setURL(obj.props.title.url)
                        .setDescription(obj.props.description)
                        .setImage(url)
                        .addFields({
                            name: 'Wiki',
                            value: `[${obj.props.subtitle.text}](${obj.props.subtitle.link})`
                        }, )
                        .setFooter('Bot by Aidan Smith. v1.3')
                    message.channel.send(embed).then(function () {
                        while (message.channel.lastMessage == message) {
                            console.log("");
                        }
                        if(max!=1) reactAwaitEdit(message, message.channel.lastMessage, place, max);
                    });

                }).catch(function () {
                    console.log("No image found");
                    if (mode == "default") {
                        message.channel.send(new Discord.MessageEmbed()
                            .setColor('#D3222A')
                            .setTitle(obj.props.title.text)
                            .setURL(obj.props.title.url)
                            .setDescription(obj.props.description)
                            .addFields({
                                name: 'Wiki',
                                value: `[${obj.props.subtitle.text}](${obj.props.subtitle.link})`
                            }, )
                            .setFooter('Bot by Aidan Smith. v1.3')).then(function () {
                            while (message.channel.lastMessage == message) {
                                console.log("");
                            }
                            if(max!=1) reactAwaitEdit(message, message.channel.lastMessage, place, max);
                        });
                    }
                })
            }
        } else {
            message.channel.send("Query not found.");
        }


    })
}
function getScore(message) {//Returns an image of IGN's iconic scoring format with a scraped score from the site.
    console.log((message.content.slice(9) + " review").toString());
    x(applyFilter(message.content.slice(9) + " review").toString(), [".review-score"])(async function(err,obj) {
        let highest=-1;
        for (let item of obj) {
            highest=item.trim()>highest ? item.trim() : highest; //Be generous with the reviews. There may be multiple for certain games, such as League of Legends. It makes practical sense to give each game its highest score of any release.
        }
        const canvas = Canvas.createCanvas(135.5, 153.5); //1/4 the actual image dimensions.
        const ctx = canvas.getContext('2d');
        let img =  await Canvas.loadImage('./assets/ign.png'); //Image has load latency, so this must be awaited.
         // This uses the canvas dimensions to stretch the image onto the entire canvas... (or rather, shrink it)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = "60px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        if(parseInt(highest,10)>0) { 
        ctx.fillText(parseFloat(highest,10).toPrecision(2),  canvas.width/2, canvas.height/1.6) //Pseudo center the text on the canvas
            // Use  Attachment class structure to process the file
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'score.png');
            message.channel.send(attachment);
            console.log(parseFloat(highest,10));  //Log the score.
        } else {
            message.channel.send("Not found."); //Tell the user if no score was found.
        }
    })
}
client.once('ready', () => {
    console.log('Active.');
    client.user.setPresence({ activity: { name: 'on IGN.com' }, status: 'online' }) //Set status.
});
client.on('message', message => {
    if (message.content.startsWith(`${prefix}`)) { //Intialize the commands
        if (message.content.startsWith(`${prefix} wiki`)) {
            wikiEmbed(message); //Search the wiki for a message
        } else if (message.content.startsWith(`${prefix} rate`)) {
            getScore(message);
        } 
    }

});

client.login(token); 