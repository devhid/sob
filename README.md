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
  
## Setup
1. Clone this repository into your webserver.
  ```
  git clone https://github.com/devhid/sob.git
  ```
  
2. Enter the project directory and set the read/write permissions for `auth_setup.sh`.
  ```
  cd sob
  chmod 755 auth_setup.sh # Allows the script to be read, edited, and executed (permissions).
  ```
3. Edit `auth_setup.sh` with your favorite text editor.
  ```
  # URI for your server where the application is being run on. (Example: http://localhost:3000)
  export SOB_WEBSERVER=''

  # [Important] Since this app is not being distributed (yet?), you will need to create a Slack App
  # and provide your own Client ID, Client Secret, and State (Signing Secret).
  # [Note] The Redirect URI should be the value for SOB_WEBSERVER with '/slack/auth' at the end.

  # Follow the documentation here: https://api.slack.com/slack-apps
  export SLACK_CLIENT_ID=''
  export SLACK_CLIENT_SECRET=''
  export SLACK_REDIRECT_URI=`$SOB_WEBSERVER/slack/auth`
  export SLACK_STATE=''

  # [Important] Since this app is not being distributed (yet?), you will need to create a Stack App
  # and provide your own API Key and Access Token.

  # Create your application here: https://stackapps.com/apps/oauth/register
  export SO_API_KEY=''
  export SO_ACCESS_TOKEN=''
  ```
4. Install dependencies.
  ```
  npm install
  ```
5. Run the auth script and start the server.
  ```
  source auth_setup.sh
  npm run prod
  ```
## Features
  * Specify multiple tags per channel.
  * [Future] Mention someone once a question is posted.

## To-do:
  * Tag a specific person in slack once a question is posted.
 
