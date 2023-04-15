# Report Fake Trans Panic
This is a selenium web crawler that floods anti-trans hotline forms with bogus data. Currently the only form it targets as a proof of concept 
is the Missouri AG's form for reporting the trans agenda. Its very annoying and I hope they spend all the money trying to fix security 
vulnerabilties while I patch my script to bypass whatever they try UwU

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