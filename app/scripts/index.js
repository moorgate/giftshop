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
  if (modal && wrapper && body) {
    modal.addClass('active')
    wrapper.addClass('overlapped')
    body.addClass('overlapped')
  }
})

wrapper.click(function (e) {
  e.preventDefault()
  if (wrapper && modal && body && wrapper.hasClass('overlapped')) {
    modal.removeClass('active')
    wrapper.removeClass('overlapped')
    body.removeClass('overlapped')
  }
})
