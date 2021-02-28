const Handlebars = require('handlebars')

Handlebars.registerHelper('rateProperty', (property) => {
  const score = property
  let stars = ''
  for (let i = 0; i < score; i++) {
    stars += `<i class="fas fa-star"></i>`
  }
  for (let i = 0; i < (5 - score); i++) {
    stars += `<i class="fal fa-star"></i>`
  }
  return stars
})

Handlebars.registerHelper('searchByName', (searchBy) => {
  if (searchBy === 'name') {
    return 'selected'
  }
  return
})

Handlebars.registerHelper('searchByAltNames', (searchBy) => {
  if (searchBy === 'alt_names') {
    return 'selected'
  }
  return
})

Handlebars.registerHelper('searchByOrigin', (searchBy) => {
  if (searchBy === 'origin') {
    return 'selected'
  }
  return
})

Handlebars.registerHelper('renderCheckbox', (checkbox) => {
  const properties = ['natural', 'hairless', 'short_legs']
  let checkboxDisplay = ''

  for (let prop of properties) {
    if (Object.keys(checkbox).includes(prop)) {
      checkboxDisplay += `<label class="form-check-label" for="${prop}"><input class="form-check-input mx-1" type="checkbox" name="${prop}" id="${prop}" checked>${prop}</label>`
    } else {
      checkboxDisplay += `<label class="form-check-label" for="${prop}"><input class="form-check-input mx-1" type="checkbox" name="${prop}" id="${prop}">${prop}</label>`
    }
  }

  return checkboxDisplay
})

// Use handlebarsHelpers let script access data from the server
// From stackoverflow https://stackoverflow.com/questions/30767928/accessing-handlebars-variable-via-javascript
Handlebars.registerHelper('json', function (content) {
  return JSON.stringify(content);
})