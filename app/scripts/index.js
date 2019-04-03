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
  // var modal = jQuery('#modal')
  var paymentModal = jQuery('#payment-modal')
  var wrapper = jQuery('#wrapper')
  var body = jQuery('body')
  var callbackButton = jQuery('.callback-btn')
  var callbackModal = jQuery('#callback-modal')
  // var buttonProceedPayment = modal.find('button.proceed-payment')

  /**
   * При закрытии модального окна необходимо сбросить выбранный размер
   */
  function closeModals (modal) {
    return function (e) {
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
  }

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
          body.find("[id^='modal']").removeClass('active')
        }

        callbackModal.addClass('active')
      }
    })
  }

  jQuery(document).keyup(function (e) {
    if (e.key === 'Escape') {
      closeModals(body.find('[id^=modal]'))(e)
    }
  })

  if (screen.width < 512) {
    jQuery('.comments').slick({
      infinite: false,
      arrows: false,
      slidesToShow: 1,
      slidesToScroll: 1
    })
  } else {
    jQuery('.comments').slick({
      infinite: false,
      arrows: false,
      slidesToShow: 3,
      slidesToScroll: 3
    })
  }

  buttons.click(function (e) {
    e.preventDefault()

    var modalId = jQuery(e.target).attr('set-id')

    var promoForm = jQuery(`#promo-${modalId}`)
    var promoInput = promoForm.find('input[type="text"]')
    var promoButton = promoForm.find('input[type="submit"]')
    var promoOK = promoForm.find('.ok')
    var promoErr = promoForm.find('.err')
    var sizesButtons = jQuery(`#item-sizes-${modalId}`)
    var sizes = sizesButtons.find('.size')
    var modal = body.find(`#modal-${modalId}`)
    var buttonProceedPayment = modal.find('button.proceed-payment')

    /**
     * выключение формы ввода промо кода
     */
    function disablePromoCode () {
      promoInput.val(order.promoCode)
      promoInput.attr('disabled', true)
      promoButton.attr('disabled', true)
    }

    /**
     * Обработчик нажатия на размер
     */
    function onSizeClick (e) {
      var target = jQuery(e.target)
      order.selectedSize = target.attr('value')
      target.addClass('active')
      sizes.each(function (index) {
        var size = jQuery(this)
        if (size.attr('value') !== order.selectedSize) {
          size.removeClass('active')
        }
      })
    }

    /**
     * для выбора размеров
     */
    sizes.click(onSizeClick)

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

      buttonProceedPayment.click(function (e) {
        e.preventDefault()
        modal.removeClass('active')
        paymentModal.addClass('active')
      })
    }
  })

  wrapper.click(function (e) {
    closeModals(body.find('[id^=modal]'))(e)
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
