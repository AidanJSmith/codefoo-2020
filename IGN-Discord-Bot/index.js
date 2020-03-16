const Discord = require('discord.js');
const {prefix, token} = require('./credentials.json');
var Xray = require('x-ray')
var x = Xray()
const client = new Discord.Client();

function applyFilter(query,filter="all") {
    var url = new URL("https://www.ign.com/search");
    url.searchParams.set('q',query);
    url.searchParams.set('count',1);
    url.searchParams.set('filter',filter);    
    url.searchParams.set('type',filter);    
    return url;  
}
client.once('ready', () => {
	console.log('Active.');
});
client.on('message', message => {
    console.log(message.content);
    if (message.content.startsWith(`${prefix}`)) {
        // send back "Pong." to the channel the message was sent in
        if (message.content.startsWith(`${prefix} wiki`)) {
           x(applyFilter(message.content.slice(8),"wiki").toString(), {
                props:x('.search-item',{
                    title: x(".search-item-title", {
                        text:"a",
                        url:"a@href",
                    }),
                    subtitle: x(".search-item-sub-title",{
                        link:"a@href",
                        text:'a',
                    }),
                    description:".search-item-description"
                })
            })(function(err, obj) { 
                obj.props.title.url.replace(/ /g,'_')
                
                x(obj.props.title.url,".image@src").then(function(q) {   
                    console.log(q);
                    //let url = q!=null ? new URL(`https://`+new URL(q).hostname+new URL(q).pathname).toString() : '';
                    
                    message.channel.send(new Discord.MessageEmbed()
                    .setColor('#D3222A')
                    .setTitle(obj.props.title.text)
                    .setURL(obj.props.title.url)
                    .setDescription(obj.props.description)
                    .setImage('')
                    .addFields(
                        { name: 'Wiki', value: `[${obj.props.subtitle.text}](${obj.props.subtitle.link})`},
                    )
                    .setFooter('Bot by Aidan Smith. V1'))
                    
                }).catch(function(err) {
                    console.log(err) // handle error in promise
                  })
                
            })
             /*
              x(content,'search-item-sub-title')(function(err, callback) {
                return callback;
            });
             x(content,'search-item-description')(function(err, callback) {
                return callback;
            });
            */
        } else if (message.content.startsWith(`${prefix} video `)) {
            // send back "Pong." to the channel the message was sent in
            message.channel.send('Just search for video');
        } else if (message.content.startsWith(`${prefix} game`)) {
            // send back "Pong." to the channel the message was sent in
            message.channel.send('Just search the games');
        } else {
            message.channel.send('Make a sitewide query');
        }


    }
    
});

client.login(token);
