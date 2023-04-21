const formInputs = {
  'firstName': '//*[@id="Textbox-1"]',
  'lastName': '//*[@id="Textbox-2"]',
  'address': '//*[@id="Textbox-3"]',
  'city': '//*[@id="Textbox-4"]',
  'state': '//*[@id="Dropdown-1"]',
  'zip': '//*[@id="Textbox-5"]',
  'email': '//*[@id="Textbox-6"]',
  'phone': '//*[@id="Textbox-7"]',
  'concernDetails': '//*[@id="Textarea-1"]',
  'captcha': 'img[data-sf-role="captcha-image"]',
  'imageCracker': '//*[@id="file"]',
  'imageCrackerSubmit': '//*[@id="jsShadowRoot"]',
  'imageCrackerOutput': '//*[@id="result-sec"]/div[1]',
  'captchaInput': '//*[@id="Textbox-8"]',
  'invalidCaptcha': '#MainContent_TF34D6EB7001_Col00 > div > div',
  'invalidCaptcha1': '[data-sf-role="invalid-captcha-input"]',
  'alreadySubmitted': '#MainContent_TF34D6EB7001_Col00 > div > div',
  'newCaptcha': '[data-sf-role="captcha-refresh-button"]',
  'emptyCaptcha': '//*[@id="MainContent_TF34D6EB7001_Col00"]/div/form/div[11]/div[2]/label',
  'submit': 'button[type="submit"]',
  'successText': '//*[@id="MainContent_TF34D6EB7001_Col00"]'
};

const formUrl = "http://ago.mo.gov/file-a-complaint/transgender-center-concerns";
const captchaCrackerUrl = "http://www.imagetotext.info/"

export default {
  formInputs,
  formUrl,
  captchaCrackerUrl
}