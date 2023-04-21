import path from 'path';
import fs from 'fs';
import JSZip from 'jszip';
import utils from './utils.js';

const PROXY_HOST = 'premium-residential.geonode.com';
const PROXY_PORT_RANGE = [9000, 9100];
const PROXY_USER = 'geonode_eZSs6cZdKE';
const PROXY_PASS = '2df594b5-9bcf-4bf0-8e3a-f5278031edea';

// const PROXY_HOST = 'proxy ip';
// const PROXY_PORT_RANGE = [8080, 8081];
// const PROXY_USER = 'user';
// const PROXY_PASS = 'pass';

const manifest_json = "" +
"{" +
    '"version": "1.0.0",' +
    '"manifest_version": 2,' +
    '"name": "Chrome Proxy",' +
    '"permissions": [' +
        '"proxy",' +
        '"tabs",' +
        '"unlimitedStorage",' +
        '"storage",' +
        '"<all_urls>",' +
        '"webRequest",' +
        '"webRequestBlocking"' +
    '],' +
    '"background": {' +
        '"scripts": ["background.js"]' +
    '},' +
    '"minimum_chrome_version":"22.0.0"' +
'}';

const background_js = "" +
'var config = {' +
        'mode: "fixed_servers",' +
        'rules: {' +
        'singleProxy: {' +
            'scheme: "http",' +
            'host: "${PROXY_HOST}",' +
            'port: parseInt(${PROXY_PORT})' +
        '},' +
        'bypassList: ["localhost"]' +
        '}' +
    '};' +
'' +
'chrome.proxy.settings.set({value: config, scope: "regular"}, function() {});' +
'' +
'function callbackFn(details) {' +
    'return {' +
        'authCredentials: {' +
            'username: "${PROXY_USER}",' +
            'password: "${PROXY_PASS}"' +
        '}' +
    '};' +
'}' +
'' +
'chrome.webRequest.onAuthRequired.addListener(' +
            'callbackFn,' +
           '{urls: ["<all_urls>"]},' +
            "['blocking']" +
');';

export const addProxyExtension = async (chromeOptions) =>{
    const localPath = path.resolve('./src/');
    const pluginFile = "/proxyAuthPlugin.zip";
    const zip = new JSZip();
    const portNum = utils.randomInt(PROXY_PORT_RANGE[0], PROXY_PORT_RANGE[1]).toString();
    let backgroundJs = background_js.replace("${PROXY_HOST}", PROXY_HOST);
    backgroundJs = backgroundJs.replace("${PROXY_PORT}", portNum);
    backgroundJs = backgroundJs.replace("${PROXY_USER}", PROXY_USER);
    backgroundJs = backgroundJs.replace("${PROXY_PASS}", PROXY_PASS);

    zip.file("manifest.json", manifest_json);
    zip.file("background.js", backgroundJs);
    return new Promise((resolve, reject) => {
         zip.generateNodeStream({streamFiles:true})
            .pipe(fs.createWriteStream(localPath + pluginFile))
            .on('finish', function () {
                console.dir('created extension with proxy port ' + portNum);
                chromeOptions.addExtensions([localPath + pluginFile]);
                resolve();
            });
    });
}