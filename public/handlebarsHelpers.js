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
    let propText = prop

    if (prop.includes('_')) {
      propText = prop.replace('_', ' ')
    }

    if (Object.keys(checkbox).includes(prop)) {
      checkboxDisplay += `<label class="form-check-label" for="${prop}"><input class="form-check-input mx-1" type="checkbox" name="${prop}" id="${prop}" checked>${propText}</label>`
    } else {
      checkboxDisplay += `<label class="form-check-label" for="${prop}"><input class="form-check-input mx-1" type="checkbox" name="${prop}" id="${prop}">${propText}</label>`
    }
  }

  return checkboxDisplay
})

Handlebars.registerHelper('renderSortOption', (property, breeds) => {
  let numberPropList = []
  let breedsObject = breeds[0]
  let optionDisplay = ''

  for (let prop in breedsObject) {
    // Prop with number type is pushed into the list.
    // Exclude property name '__v'
    if (typeof breedsObject[prop] === 'number' && prop != '__v') {
      numberPropList.push(prop)
    }
  }

  for (let prop of numberPropList) {
    let propText = prop

    if (prop.includes('_')) {
      let propSplit = prop.split('_')
      for (let i = 0; i < 2; i++) {
        propSplit[i] = propSplit[i].charAt(0).toUpperCase() + propSplit[i].slice(1)
      }
      propText = propSplit[0].concat(' ', propSplit[1])
    } else {
      propText = propText.charAt(0).toUpperCase() + propText.slice(1)
    }

    if (prop === property) {
      optionDisplay += `<option selected value="${prop}">${propText}</option>`
    } else {
      optionDisplay += `<option value="${prop}">${propText}</option>`
    }
  }
  return optionDisplay
})

// Use handlebarsHelpers let script access data from the server
// From stackoverflow https://stackoverflow.com/questions/30767928/accessing-handlebars-variable-via-javascript
Handlebars.registerHelper('json', (content) => {
  return JSON.stringify(content);
})