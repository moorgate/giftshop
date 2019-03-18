import '../styles/main.scss'
import jQuery from 'jquery'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

var buttons = jQuery('button.buy-btn')
var modal = jQuery('#modal')
var wrapper = jQuery('#wrapper')
var body = jQuery('body')
buttons.click(function (e) {
  e.preventDefault()
  if (modal) {
    console.log(e, modal)
    modal.addClass('active')
    wrapper.addClass('overlapped')
    body.addClass('overlapped')
  }
})
