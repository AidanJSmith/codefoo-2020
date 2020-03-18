# IGN Comapnion Discord Bot (Code-Foo 2020 Optional Bonus)

### Background

I'd given some thought as to the way I consume content on a daily basis and how I could integrate more IGN content into that workflow aside from podcasts and simple article content. In my musings, I'd realized that, a large percentage of my communication is initiated on Discord, a platform conducive to IGN's vision and target audience. Synthesized, these drove me to write a discord bot that could bring IGN to gamers everywhere. 

## What does it do?

The implemented features of this bot are twofold:

- It can make queries to the wiki (Particularly useful for quest information, tutorials, or interjections about disputes within a conversation)
- It can rate games. (A big part of what IGN is known for, and something I've wanted to use often in casual banter)

### Queries to the Wiki

The bot's prefix is "ign", so ign wiki foobar can find you the top ten entries of the wiki. Here is how a typical interaction might go.
![Message 1](https://i.imgur.com/5ZFvrPC.png)
If a user utilizes the specified reaction, they can see further search queries. (or go back)
![Message 2](https://i.imgur.com/s5H4hIi.png)
There are up to ten results cached by the bot. If the spider finds any images, it'll include them as well.
![Message 3](https://i.imgur.com/ww7MD0A.png)

### Ratings

The rating function works in a similar way to the wiki, but interpolates the highest result for a game it can find into an image instead of an embed. (as the search ranking algorithm isn't perfect, it's best to err on the kind side)
![Message 4](https://i.imgur.com/OMpP2jr.png)
This is useful for game discussion on a daily basis.

This project is built written with Node.js, discord.js, x-ray (for lack of a better public API), and canvas.

## Setup

```shell
npm install
node index.js
```
