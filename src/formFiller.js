import webdriver from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import chromeDriver from 'chromedriver';
import faker from 'faker';
import fs from 'fs';
import path from 'path';
import data from './dataGen.js';
import { 
  transphobicBullshit,
  drTemplates,
  sillyTransphobia,
  drDescriptions,
  transPeopleGoodActually,
  justDirectlySayGoFuckYourself
} from './data/fillerText.js';
import { zipCodesByCity } from './data/moAddresses.js';
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
    'fullStringTransphobia': 0.05,
    'sillyTransphobia': 3.0,
    'drAndReplace': 0.75,
    'transPeopleGoodActually': 2.0,
    'justDirectlySayGoFuckYourself': 0.25,
  };
  const loremType = utils.weightedRand(loremTypes);
  if (loremType === 'fullStringTransphobia') {
    return utils.randomEntry(transphobicBullshit);
  } else if (loremType === 'sillyTransphobia') {
    return utils.randomEntry(sillyTransphobia);
  } else if (loremType === 'transPeopleGoodActually') {
    return utils.randomEntry(transPeopleGoodActually);
  } else if (loremType === 'justDirectlySayGoFuckYourself') {
    return utils.randomEntry(justDirectlySayGoFuckYourself)
  } else {
    const address = faker.address.streetAddress();
    const drName = faker.name.lastName();
    const unhingedRant = utils.randomEntry(drDescriptions);
    let result = utils.randomEntry(drTemplates);
    result = result.replace('{{city}}', city);
    result = result.replace('{{name}}', drName);
    result = result.replace('{{address}}', address);
    result = result.replace('{{unhingedRant}}', unhingedRant);
    return result;
  }
}

const solveCaptcha = async () => {
  return await driver.findElement(By.css(data.formInputs['captcha']))
    .then(async imgEl => {
      await driver.sleep(500);

      const imageSrc = await utils.waitFor(driver, async () => {
        const result = await imgEl.getAttribute('src')
        return result;
      }, 30000);
      
      if (typeof imageSrc === 'string' && imageSrc.length < 1) {
        return 'notLoading';
      }
      const originalWindow = await driver.getWindowHandle();
      await driver.switchTo().newWindow('tab');
      await driver.get(data.captchaCrackerUrl);
      await driver.sleep(500);
      const filepath = path.resolve("./src/data/images/captcha.png");
      const imageBuffer = new Buffer(imageSrc.replace("data:image/png;base64,", ""), "base64");
      fs.writeFileSync(filepath, imageBuffer);
      await driver.findElement(By.xpath(data.formInputs['imageCracker'])).sendKeys(filepath);
      await driver.sleep(3000);
      await driver.findElement(By.xpath(data.formInputs['imageCrackerSubmit'])).click();
      await driver.sleep(1000);
      
      let resultText = await utils.waitFor(driver, async () => {
        const result = await driver.findElement(By.xpath(data.formInputs['imageCrackerOutput'])).getText();
        return result;
      }, 30000);

      if (typeof resultText === 'string' && resultText.length < 1) {
        await driver.sleep(1000);
        return 'notLoading';
      } else if (typeof resultText === 'string' && resultText.length > 0) {
        resultText = resultText.replace(' ', '');
        resultText = resultText.replace('.', '');
        resultText = resultText.replace(',', '');
      }
      await driver.close();
      await driver.switchTo().window(originalWindow);
      return resultText;
    });
}

const fillOutForm = async () => {
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
      try {
        await driver.findElement(By.xpath(data.formInputs[key])).sendKeys(info)
      } catch (e) {
        throw "Error loading page";
      }
    }
  }

  // fill out dropdowns
  await driver.findElement(By.xpath(data.formInputs.state))
    .then(el => el.sendKeys('MO'));
  await driver.sleep(1000);
}

const fillCaptcha = async () => {
  let captchaText = '', i=0;
  while ((typeof captchaText !== 'string' || captchaText.length !== 5) && i < 3) {
    try {
      captchaText = await solveCaptcha();
      if (typeof captchaText !== 'string' || captchaText.length !== 5) {
        await driver.findElement(By.css(data.formInputs.newCaptcha)).click();
        await driver.sleep(1000);
      }
      if (captchaText === 'notLoading') {
        return 'notLoading';
      }
    } catch (e) {
      console.error(e);
    }
    i++;
  }
  if (typeof captchaText !== 'string' || captchaText.length !== 5) {
    console.dir('captcha failed');
    console.dir(captchaText);
    return 'notLoading';
  }
  console.dir(captchaText);

  await driver.findElement(By.xpath(data.formInputs.captchaInput)).sendKeys(captchaText);
  return captchaText;
}

let iters = 0;
while (iters < 10000) {
  try {
    await initDriver();
    try {
      await startDriver();
      try {
        await fillOutForm();
        let captchaResult = await fillCaptcha();
        if (captchaResult === 'notLoading') throw "not loading";
        
        await driver.findElement(By.css(data.formInputs.submit)).then(el => {
          el.click()
        });

        let foundText = '', i = 0;
        while (foundText.length < 1 && i < 100) {
          foundText = await driver.findElement(By.xpath(data.formInputs.successText)).getText();
          if (foundText.includes('Success')) {
            console.dir('count ' + iters);
            console.dir(`submitted application for ${userData.email}`)
            iters++;
            await driver.sleep(1000);
            break;
          } else {
            foundText = await driver.findElement(By.css(data.formInputs.invalidCaptcha1)).getText();
            let mainError;
            try {
              mainError = await driver.findElement(By.css(data.formInputs.invalidCaptcha)).getText();
            } catch (e) {}
            if (foundText.includes('Incorrect') || (typeof mainError === 'string' && mainError.includes('Incorrect'))) {
              await driver.findElement(By.css(data.formInputs.newCaptcha)).click();
              captchaResult = await fillCaptcha();
              if (captchaResult === 'notLoading') break;
              await driver.findElement(By.css(data.formInputs.submit)).then(el => {
                el.click()
              });
              i = 0;
            }
            if (typeof mainError === 'string' && mainError.includes('already submitted')) {
              break;
            }
            foundText = '';
            i++;
          }
          await driver.sleep(1000);
        }
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

