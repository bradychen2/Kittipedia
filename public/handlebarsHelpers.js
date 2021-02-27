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
      checkboxDisplay += `<input class="form-check-input" type="checkbox" name="${prop}" id="${prop}" checked><label class="form-check-label" for="${prop}">${prop}</label>`
    } else {
      checkboxDisplay += `<input class="form-check-input" type="checkbox" name="${prop}" id="${prop}"><label class="form-check-label" for="${prop}">${prop}</label>`
    }
  }

  return checkboxDisplay
})

Handlebars.registerHelper('json', function (content) {
  return JSON.stringify(content);
})