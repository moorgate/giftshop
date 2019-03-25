import 'slick-carousel'
import jQuery from 'jquery'

import '../styles/main.scss'

if (process.env.NODE_ENV !== 'production') {
  require('../index.pug')
}

var promoCodeUrl = 'https://us-central1-nouvo-5b54a.cloudfunctions.net/promoCode'

function isBlank (obj) {
  return (!obj || jQuery.trim(obj) === '')
}

jQuery(document).ready(function () {
  var order = new Order()
  var buttons = jQuery('button.buy-btn')
  var modal = jQuery('#modal')
  var paymentModal = jQuery('#payment-modal')
  var wrapper = jQuery('#wrapper')
  var body = jQuery('body')
  var callbackButton = jQuery('.callback-btn')
  var callbackModal = jQuery('#callback-modal')
  var promoForm = jQuery('#promo')
  var promoInput = promoForm.find('input[type="text"]')
  var promoButton = promoForm.find('input[type="submit"]')
  var promoOK = promoForm.find('.ok')
  var promoErr = promoForm.find('.err')
  var sizesButtons = jQuery('#item-sizes')
  var sizes = sizesButtons.find('.size')

  function disablePromoCode () {
    promoInput.val(order.promoCode)
    promoInput.attr('disabled', true)
    promoButton.attr('disabled', true)
  }

  /**
   * для выбора размеров
   */
  sizes.click(function (e) {
    var target = jQuery(e.target)
    order.selectedSize = target.attr('value')
    target.addClass('active')
    sizes.each(function (index) {
      var size = jQuery(this)
      if (size.attr('value') !== order.selectedSize) {
        size.removeClass('active')
      }
    })
  })

  if (order.promoCode) {
    disablePromoCode()
  }

  promoButton.click(function (e) {
    e.preventDefault()
    order.promoCode = promoInput.val()
    if (!isBlank(order.promoCode)) {
      jQuery.post(promoCodeUrl, {promoCode: order.promoCode})
        .done(function (data) {
          promoOK.addClass('active')
          promoErr.removeClass('active')
          window.localStorage.setItem('promoCode', order.promoCode)
          disablePromoCode()
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          promoOK.removeClass('active')
          promoErr.addClass('active')
          window.localStorage.removeItem('promoCode')
        })
    }
  })

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

  /**
   * При закрытии модального окна необходимо сбросить выбранный размер
   */
  function closeModals (e) {
    if (e) e.preventDefault()
    if (wrapper && modal && body && wrapper.hasClass('overlapped')) {
      modal.removeClass('active')
      wrapper.removeClass('overlapped')
      body.removeClass('overlapped')
      paymentModal.removeClass('active')
      callbackModal.removeClass('active')

      order.selectedSize = null
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

// eslint-disable-next-line no-unused-vars
class Order {
  constructor () {
    this.finished = false
    this.size = null
    this.userinfo = null
    this.promoCode = window.localStorage.getItem('promoCode')
  }
}
