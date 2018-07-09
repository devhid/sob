<h1 align="center">stack-overflow-bot (sob)</h1>
<p align="center">A slack bot that tracks tags from Stack Overflow.</p>

<br>

## Overview
When working with certain technologies or software, you might run into a problem that you need help solving. Instead of asking someone in a slack channel for help, you can post your question on Stack Overflow with specific tags and the channel will be notified of your question. 

The bot aims to **encourage users to ask questions to Stack Overflow** instead of the slack chat, **reduce the clutter inside a slack channel** which is dedicated for team communications, and **prevent duplicate questions** from being asked.

## Installation
  1. Authorize the application on [Stack Overflow](https://stackoverflow.com/oauth?client_id=12765&scope=private_info&redirect_uri=http://178.128.152.177/stackoverflow/auth).
  2. <span>Authorize and install the application to your [Slack Workspace](https://slack.com/oauth/authorize?scope=incoming-webhook,team%3Aread&client_id=382846627254.393789273477).

## Built With
  * :high_brightness: [TypeScript](https://www.typescriptlang.org/)
  * :rocket: [Express](https://expressjs.com/)
  * :wrench: [Body-Parser](https://github.com/expressjs/body-parser)
  * :globe_with_meridians: [Request](https://github.com/request/request) 

## Features
 * Specify multiple tags per channel.

