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
