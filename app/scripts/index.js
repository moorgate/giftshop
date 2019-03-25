import 'slick-carousel'
import jQuery from 'jquery'

import '../styles/main.scss'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

jQuery(document).ready(function () {
  var buttons = jQuery('button.buy-btn')
  var modal = jQuery('#modal')
  var paymentModal = jQuery('#payment-modal')
  var wrapper = jQuery('#wrapper')
  var body = jQuery('body')
  var callbackButton = jQuery('.callback-btn')
  var callbackModal = jQuery('#callback-modal')

  if (callbackButton) {
    callbackButton.click(function (e) {
      e.preventDefault()
      if (
        wrapper &&
        callbackModal
      ) {
        if (!wrapper.hasClass('overlapped')) {
          wrapper.addClass('overlapped')
        } else {
          paymentModal.removeClass('active')
          modal.removeClass('active')
        }

        callbackModal.addClass('active')
      }
    })
  }

  function closeModals (e) {
    if (e) e.preventDefault()
    if (wrapper && modal && body && wrapper.hasClass('overlapped')) {
      modal.removeClass('active')
      wrapper.removeClass('overlapped')
      body.removeClass('overlapped')
      paymentModal.removeClass('active')
      callbackModal.removeClass('active')
    }
  }

  jQuery(document).keyup(function (e) {
    if (e.key === 'Escape') {
      closeModals(e)
    }
  })
  if (screen.width < 512) {
    jQuery('.comments').slick({
      infinite: true,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1
    })
  } else {
    jQuery('.comments').slick({
      infinite: true,
      arrows: false,
      slidesToShow: 3,
      slidesToScroll: 3
    })
  }

  buttons.click(function (e) {
    e.preventDefault()
    if (
      modal &&
      wrapper &&
      body &&
      paymentModal
    ) {
      modal.addClass('active')
      wrapper.addClass('overlapped')
      body.addClass('overlapped')
      jQuery('.modal-examples').slick({
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true
      })
      modal.find('button.proceed-payment').click(function (e) {
        e.preventDefault()
        modal.removeClass('active')
        paymentModal.addClass('active')
      })
    }
  })

  wrapper.click(function (e) {
    closeModals(e)
  })
})
