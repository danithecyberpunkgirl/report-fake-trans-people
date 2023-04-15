# Report Fake Trans Panic
This is a selenium web crawler that floods anti-trans hotline forms with bogus data. Currently the only form it targets as a proof of concept 
is the Missouri AG's form for reporting the trans agenda. Its very annoying and I hope they spend all the money trying to fix security 
vulnerabilties while I patch my script to bypass whatever they try UwU

## NSFW warning about included files
The source files for the content description generation are some of the most vile transphobia on the internet. I used an AI model 
to spit out tons and tons of vile transphobia to make the generated submissions somewhat plausible. The goal is to make any authentic
submissions effectively useless because there will be so much bogus data. I apologize to all my fellow trans people for the crimes committed
in this repo.

# Installation and running
You'll need your matching chromedriver. I included one for windows chrome version 112.0. A fresh binary is just a google 
search away if chrome has updated recently.

Get node and yarn if you don't have them already, then run `yarn install` from the project root. If
everything works, that should download the required packages for you.

You should be able to just run `yarn start` from the root. I have a full time job IRL so I don't have
much time to help debug issues but if you post a bug I'll try to get to it.

I'm using a rotating residential proxy because the form has same IP protection. The config vars 
for that are in buildProxy.js. You can probably use any proxy you'd like but some of the forms 
have anti-proxy detection so ymmv.

# Support (only if you've got the funds)
## Mutual aid fund. 100% goes towards helping my trans friends not get evicted.
Monero: 8Ahgg4diJWZiWZS2jJSi2oBr82MkaMwzWEWfgEaS1zyJCoyYSrw94WxfiML45a44zJRki4Z5k7vZBbw8es5HN2PYHz2odub