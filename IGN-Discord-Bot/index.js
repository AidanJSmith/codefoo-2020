const Canvas = require('canvas');
const Discord = require('discord.js');
const {
    prefix,
    token
} = require('./credentials.json');
var Xray = require('x-ray')
var x = Xray()
const client = new Discord.Client();

function applyFilter(query, filter = "all") {
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
    message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
    const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id != message.author.id;
    };

    if (place == 1) {
        message.react(`➡️`).then(message.awaitReactions(filter, {
                max: 1,
                time: 1800000,
                errors: ['time']
            })
            .then(collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '➡️') {
                    wikiEmbed(originalmessage, place + 1, "edit", message);
                } else {
                    message.channel.send('you reacted with left');
                }
            })
            .catch(collected => {
                message.reply(`you reacted with neither a thumbs up, nor a thumbs down (${collected[0]})`);
            }));
    } else {
        if (max > 1) {
            message.react('⬅️').then(max != place ? message.react('➡️') : '').then(message.awaitReactions(filter, {
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
                    console.log(`Reaction: (${collected[0]})`);
                }));
        }
    }

}

function wikiEmbed(message, place = 1, mode = "default", editmessage = "null") {
    x(applyFilter(message.content.slice(8), "wiki").toString(), {
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
    })(function (err, obj) {
        const max = obj.props.length;
        obj = {
            props: obj.props[place - 1]
        };
        if (obj.props.title.url != undefined) {
            obj.props.title.url = obj.props.title.url.replace(/ /g, '_');
            if (mode == "edit") {
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
                        .setFooter('Bot by Aidan Smith. v1.1')
                    editmessage.edit(embed);
                    reactAwaitEdit(message, editmessage, place, max);
                }).catch(function () {
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
                        .setFooter('Bot by Aidan Smith. v1.1')
                    editmessage.edit(embed);
                    reactAwaitEdit(message, editmessage, place, max);
                })
            }
            if (mode == "default") {
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
                        .setFooter('Bot by Aidan Smith. v1.1')
                    message.channel.send(embed).then(function () {
                        while (message.channel.lastMessage == message) {
                            console.log("");
                        }
                        reactAwaitEdit(message, message.channel.lastMessage, place, max);
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
                            .setFooter('Bot by Aidan Smith. v1.1')).then(function () {
                            while (message.channel.lastMessage == message) {
                                console.log("");
                            }
                            reactAwaitEdit(message, message.channel.lastMessage, place, max);
                        });
                    }
                })
            }
        } else {
            message.channel.send("Query not found.");
        }


    })
}
function getScore(message) {
    console.log((message.content.slice(9) + " review").toString());
    x(applyFilter(message.content.slice(9) + " review").toString(), [".review-score"])(async function(err,obj) {
        let highest=-1;
        for (let item of obj) {
            highest=item.trim()>highest ? item.trim() : highest;
        }
        const canvas = Canvas.createCanvas(542, 614);
        const ctx = canvas.getContext('2d');
        // Since the image takes time to load, you should await it
        let img =  await Canvas.loadImage('./assets/ign.png');
         // This uses the canvas dimensions to stretch the image onto the entire canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = "240px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center"
        if(parseInt(highest,10)>0||"fifa" in message ||"madden" in message||"nba2k" in message) { // These games get -1s... I'm not biased?
        ctx.fillText(parseFloat(highest,10).toPrecision(2),  canvas.width/2, canvas.height/1.6)
            // Use helpful Attachment class structure to process the file for you
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
            message.channel.send(attachment);
            console.log(parseFloat(highest,10));
        } else {
            message.channel.send("Not found.");
        }
    })
}
client.once('ready', () => {
    console.log('Active.');
});
client.on('message', message => {
    if (message.content.startsWith(`${prefix}`)) {
        if (message.content.startsWith(`${prefix} wiki`)) {
            wikiEmbed(message); //Search the wiki for a message
        } else if (message.content.startsWith(`${prefix} rate`)) {
            getScore(message);
        } else if (message.content.startsWith(`${prefix} game`)) {
            message.channel.send('Just search the games');
        } else {
            message.channel.send('Make a sitewide query');
        }


    }

});

client.login(token);