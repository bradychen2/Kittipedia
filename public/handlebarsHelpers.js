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