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
  'submit': '//*[@id="MainContent_TF34D6EB7001_Col00"]/div/form/div[11]/button'
};

const formUrl = "http://ago.mo.gov/file-a-complaint/transgender-center-concerns";

export default {
  formInputs,
  formUrl
}