import 'slick-carousel'
import jQuery from 'jquery'

import '../styles/main.scss'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

jQuery(document).ready(function () {
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
      jQuery('.modal-examples').slick({
        dots: true,
        arrows: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 2,
        centerMode: true,
        variableWidth: true
      })
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
})
