import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chromeDriver from 'chromedriver';
import faker from 'faker';
import fs from 'fs';
import path from 'path';
import data from './dataGen.js';
import { zipCodesByCity } from './moAddressData.js';
import utils from './utils.js';
import { addProxyExtension } from './buildProxy.js';
const { Builder, By, until } = webdriver;

const dataDir = path.resolve('./src/chromeUserDir');
const timeout = 1000;
let driver;
let userData = {};

const initDriver = async () => {
  const chromeOptions = new chrome.Options();
  chromeOptions.excludeSwitches('disable-extensions');
  chromeOptions.addArguments(
    // '--headless',
    '--disable-dev-shm-usage',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process',
    '--allow-running-insecure-content',
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--mute-audio',
    '--window-size=1920,1080',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--enable-webgl',
    '--ignore-certificate-errors',
    '--disable-software-rasterizer',
    '--disable-background-timer-throttling',
    '--disable-infobars',
    '--disable-breakpad',
    '--disable-canvas-aa',
    '--disable-2d-canvas-clip-aa',
    '--disable-gl-drawing-for-tests',
    '--enable-low-end-device-mode',
    '--user-data-dir=' + dataDir
  );
  await addProxyExtension(chromeOptions);

  driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();
}

const startDriver = async () => {
  try {
    userData = {};
    driver.get(data.formUrl);
    await driver.sleep(500);
  } catch (e) {
    console.error(e)
  }
}

const getConcernDetails = (city) => {
  const loremTypes = {
    'fullString': 1.50,
    'drAndReplace': 1.50,
    'transPeopleGoodActually': 1.25
  };
  const loremType = utils.weightedRand(loremTypes);
  if (loremType === 'fullString') {
    return utils.randomEntry(data.transphobicBullshit);
  } else if (loremType === 'transPeopleGoodActually') {
    return utils.randomEntry(data.transPeopleGoodActually);
  } else {
    const address = faker.address.streetAddress();
    const drName = faker.name.lastName();
    const unhingedRant = utils.randomEntry(data.drDescriptions);
    let result = utils.randomEntry(data.drTemplates);
    result = result.replace('{{city}}', city);
    result = result.replace('{{name}}', drName);
    result = result.replace('{{address}}', address);
    result = result.replace('{{unhingedRant}}', unhingedRant);
    return result;
  }
}

const fillOutAndSubmitForm = async () => {
  if (!driver) return;
  await driver.sleep(timeout);
  //Get random data
  userData.firstName = faker.name.firstName();
  userData.lastName = faker.name.lastName();
  userData.address = faker.address.streetAddress();
  userData.city = utils.randomEntry(Object.keys(zipCodesByCity));
  userData.zip = utils.randomEntry(zipCodesByCity[userData.city]);
  userData.name = userData.firstName + " " + userData.lastName;
  userData.email = utils.randomEmail(userData.name);
  userData.phoneNumber = faker.phone.phoneNumber('##########');
  userData.concernDetails = getConcernDetails(userData.city);
  //fill out form
  for (const key in data.formInputs) {
    let info;
    switch (key) {
      case 'firstName':
        info = userData.firstName;
        break;
      case 'lastName':
        info = userData.lastName;
        break;
      case 'address':
        info = userData.address;
        break;
      case 'city':
        info = userData.city;
        break;
      case 'zip':
        info = userData.zip;
        break;
      case 'email':
        info = userData.email;
        break;
      case 'phone':
        info = userData.phoneNumber;
        break;
      case 'concernDetails':
        info = userData.concernDetails;
      default:
        break;
    }
    if (info) {
      await driver.findElement(By.xpath(data.formInputs[key])).sendKeys(info)
    }
  }

  // fill out dropdowns
  await driver.findElement(By.xpath(data.formInputs.state))
    .then(el => el.sendKeys('MO'));
  await driver.findElement(By.xpath(data.formInputs.submit)).then(el => el.click());
  await driver.sleep(utils.randomRange(1000, 5000));
  console.dir(`submitted application for ${userData.email}`)
}


let iters = 0;
while (iters < 10000) {
  try {
    await initDriver();
    try {
      await startDriver();
      try {
        await fillOutAndSubmitForm();
        await driver.sleep(250);

        await driver.findElement(By.xpath('//*[@id="MainContent_TF34D6EB7001_Col00"]')).then(el => {
          console.dir('count ' + iters);
          iters++;
        });

      } catch (e) {
        console.dir('form submission failed')
        console.error(e);
      }
    } catch (e) {
      console.dir('could not start webdriver')
      console.error(e);
    }
  } catch (e) {
    console.dir('could not init webdriver')
    console.error(e);
  }
  if (driver) {
    driver.close();
    //remove files that break restarting chrome
    const deletable = [
      path.resolve('./src/chromeUserDir/Local State'),
      path.resolve('./src/chromeUserDir/Default/Preferences'),
      path.resolve('./src/proxyAuthPlugin.zip')
    ];
    deletable.forEach(fp => {
      try {
        fs.unlinkSync(fp);
      } catch (e) {
        console.dir('error deleting file');
        console.error(e);
      }
    });
  }
}

