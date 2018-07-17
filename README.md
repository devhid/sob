<h1 align="center">stack-overflow-bot (sob)</h1>
<p align="center">A slack bot that tracks tags from Stack Overflow.</p>

<br>
<p align="center"><a href="https://slack.com/oauth/authorize?scope=incoming-webhook,team%3Aread,bot,channels%3Aread,chat%3Awrite%3Abot&client_id=382846627254.393789273477"><img alt="Add to Slack" height="54" width="200" src="https://platform.slack-edge.com/img/add_to_slack@2x.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a></p>


## Overview
When working with certain technologies or software, you might run into a problem that you need help solving. Instead of asking someone in a slack channel for help, you can post your question on Stack Overflow with specific tags and the channel will be notified of your question. 

The bot aims to **encourage users to ask questions to Stack Overflow** instead of the slack chat, **reduce the clutter inside a slack channel** which is dedicated for team communications, and **prevent duplicate questions** from being asked.

## Built With
  * :high_brightness: [TypeScript](https://www.typescriptlang.org/)
  * :rocket: [Express](https://expressjs.com/)
  * :wrench: [Body-Parser](https://github.com/expressjs/body-parser)
  * :globe_with_meridians: [Request](https://github.com/request/request)
  * :trident: [Cheerio](https://cheerio.js.org/)

## Features
 * Specify multiple tags per channel.

## To-do:
 * Right now, the bot only handles one client. Need to handle multiple connections and store access tokens in some database.
 
