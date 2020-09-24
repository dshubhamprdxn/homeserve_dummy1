let email_regex = /^[\w]{1,}[\w.+-]{0,}@[\w-]{1,}([.][a-zA-Z]{2,}|[.][\w-]{2,}[.][a-zA-Z]{2,})$/,
    alphabet_regex = /^[A-Za-z]+$/,
    num_regex = /^[0-9]+$/,
    ph_regex = /^\(?\(\d{3}\)\)?[- ]?(\d{3})[\- ]?(\d{4})$/,
    sp_regex = /^[a-z-A-Z\d\&\#\-\.\`\\\/\'\(\) ]+$/,
    phoneAdded = false;

/**
  setCookie : Function used to store state/city/zip code information in cookie
  city : String - City name
  state : String - State name
  zip : String - Zip code value
  return type : none
*/
function setCookie(city,state,zip,exdays) {
  let date = new Date();
  date.setTime(date.getTime() + 1 * 1 * 1 * exdays * 1000);
  let expires = "";
  let obj = {
    city: city,
    state: state,
    zip: zip
  };

  expires = "; Path=/; expires=" + date.toGMTString();
  let value1 = "addr=" + JSON.stringify(obj) + expires;
  document.cookie = value1;
}

/**
  setCartCookie : Function used to store product information in cookie
  productObj : String - Stores product information in cart.
  return type : none
*/
function setCartCookie(productObj,exdays) {
  document.cookie = "cart=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  let date = new Date();
  date.setTime(date.getTime() + 1 * 1 * 1 * exdays * 1000);
  let expires = "";
  expires = "; Path=/; expires=" + date.toGMTString();
  let value1 = "cart=" + JSON.stringify(productObj) + expires;
  document.cookie = value1;
}

/**
  getCookie : Function used to retrieve cookie information
  cname : String - Cookie name
  return type : String
*/
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
  getData : Function used to lookup for address details based on zipcode provided
  className : String - Error holder class name.
  inputBox : String - Zip code input holder.
  deleteCookie : Boolean - Whether to delete the cookie stored or not.
  redirect : Boolean - Whether to redirect the page to product listing or not.
  return type : none
*/
function getData(zip_value, className, inputBox, deleteCookie, redirect) {
    var numbers = /\b\d{5}\b/g;
    if(zip_value == "" || !zip_value.match(numbers)) {
      $(className).show();
      $(inputBox).addClass('error');
    } else {
      $(className).hide();
      $(inputBox).removeClass('error');

      var request = $.ajax({
        url: "https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q="+zip_value,
        method: "GET"
      });
       
      request.done(function( msg ) {
        if(msg.records.length > 0) {
          if(deleteCookie) {
            document.cookie = "addr=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
          var addrData = msg.records[0].fields;
          setCookie(addrData.city, addrData.state, addrData.zip,1800);
          if(redirect) {
            window.location.href = "/coverages/";
          }
          else {
            $('.city-name,.data-city').html(addrData.city+",");
            $('.state-name,.data-state').html(addrData.state);
            $('.zip-code').html(addrData.zip);
          }
        }
        else
        {
          $('.popup').removeClass('display-popup');
          $('.zip-issue').html(zip_value);
          $('#myModal').show();
          $('.popup-form input').val('');
          $('body').css('overflow','hidden');
        }
        
      });
       
      request.fail(function( jqXHR, textStatus ) {
        $('.popup').removeClass('display-popup');
        $('.zip-issue').html(zip_value);
        $('#myModal').show();
        $('.popup-form input').val('');
        $('body').css('overflow','hidden');
      });

      // var addrData = zipcodes.lookup(Number(zip_value));
      // if(addrData !== undefined) {
      //   setCookie(addrData.city, addrData.state, addrData.zip,1800);
      //   if(redirect) {
      //     window.location.href = "/coverages/";
      //   }
      //   else {
      //     $('.city-name,.data-city').html(addrData.city+",");
      //     $('.state-name,.data-state').html(addrData.state);
      //     $('.zip-code').html(addrData.zip);
      //   }
      // }
      // else {
      //   $('.popup').removeClass('display-popup');
      //   $('.zip-issue').html(zip_value);
      //   $('#myModal').show();
      //   $('body').css('overflow','hidden');
      // }
    }
  }

/**
  onPopupShow : Function used to show popup on click of "Enter Zip" link
*/
function onPopupShow() {
  $('.popup').addClass('display-popup');
  $('.cart-popup').hide();
  $('.popup').show();
}

/**
  onPopupHide : Function used to hide popup, opened on click of "Enter Zip" link
*/
function onPopupHide() {
  $('.popup').removeClass('display-popup');
}

/**
  onModalClick : Function used to open a modal, when entered zip code is invalid/no coverage in that area.
*/
function onModalClick(event) {
  if ($(event.target)[0] == $('#myModal')[0] || $(event.target)[0] == $('.close')[0]) {
    $('#myModal').hide();
    $('body').css('overflow','auto');
  }
}

/**
  onAccordionClick : Function used to manage accordion behaviour on product listing page.
*/
function onAccordionClick(event) {
  $(this).children('.accordion-icon').toggleClass('rotate-icon');
  $(this).next('.hide-content').slideToggle();
}

/**
  onAccordionClick : Function used to manage accordion behaviour on product details page.
*/
function onFaqAccordionClick() {
  $(this).next('.faq-content').slideToggle();
  $(this).toggleClass('rotate-arrow');
}

/**
  onSeeMoreLessClick : Function used to manage see more/less behaviour on product details page.
*/
function onSeeMoreLessClick() {
  $(this).parent().toggleClass('show-full-content');
  if ($(this).text().trim() == "Additional limitations apply. See more.") {
    $(this).text("See less");
  }
  else {
    $(this).text("Additional limitations apply. See more.");
  }
}

/**
  onAddToCartBtnClick : Function used to add products in cart.
*/
function onAddToCartBtnClick(e) {
  $(e.currentTarget).hide();
  var prodId = $(e.currentTarget).attr('data-prod-id'),
      btnParent = $(e.currentTarget).parents('article'),
      prodTitleHolder = $(btnParent).find('.prod-title'),
      prodTitle = $(btnParent).find('.prod-title').text(),
      prodPrice = $(btnParent).find('.price').text().trim(),
      imgSrc = $(btnParent).find('.post-image img').attr('src'),
      cartCookieData = [];

  $('.add-to-cart[data-prod-id="'+prodId+'"]').hide();
  $('.proceed-to-checkout[data-checkout-id="'+prodId+'"]').show();

  let cartCookie = getCookie('cart');

  if(prodTitleHolder.length > 1) {
    prodTitle = $(prodTitleHolder[0]).text();
  }

  if(cartCookie !== "") {
    cartCookieData = JSON.parse(cartCookie);
  }

  var productObj = {
    title : prodTitle,
    price : prodPrice,
    prodId : prodId,
    img : imgSrc
  };
  
  cartCookieData.push(productObj);
  $('.count-prod').html(cartCookieData.length);
  setCartCookie(cartCookieData, 1800);
}

/**
  onCartButtonClick : Function used open cart popup
*/
function onCartButtonClick(e) {

  $('.mobile-cart').parents('body').css('overflow','hidden');

  $('.display-popup').hide();
  $('.cart-popup').show();
  $('.cart-prod-details').empty();
  var prodDetails = getCookie('cart'),
      totalprice = 0;
  if(prodDetails !== '') {
    prodData = JSON.parse(prodDetails);
    
    for(var i=0; i<prodData.length; i++) {
      addProdData(prodData[i].title,prodData[i].price,prodData[i].prodId,prodData[i].img,i);
      totalprice += Number(prodData[i].price.slice(1,prodData[i].price.indexOf("/")));
    }

    if(prodData.length == 0) {
      $('.empty-cart').show();
      $('.cart-footer').hide();
    }
    else
    {
      $('.empty-cart').hide();
      $('.cart-footer').show();
    }
  }
  else {
    $('.empty-cart').show();
    $('.cart-footer').hide();
  }
  $('.cart-popup').show();
  $('.btn-remove-prod').on('click', showConfirmRemove);
  $('.ghost').on('click', hideConfirmRemove);
  $('.remove-sure').on('click',onRemoveProdClick);
  $('.price-val').html(Math.round(totalprice * 100) / 100);

  if(prodData.length == 1) {
    $('.single').show();
    $('.plural').hide();
  }
  else {
    $('.single').hide();
    $('.plural').show();
  }
  let cartCookie = getCookie('cart');
  cartCookieData = JSON.parse(cartCookie);
  $('.prod-count').html(cartCookieData.length);
}

/**
  onCartCloseButtonClick : Function used hide cart popup
*/
function onCartCloseButtonClick(e) {
  $('.cart-popup').hide();
  $('.mobile-cart').parents('body').css('overflow','auto');
}

/**
  addProdData : Function used add product information in cart popup
  title : String - Product Name
  price : String - Product price
  prodId : String - Unique product Id
  img : String - Product image
  index : Number - Product position in cart
*/
function addProdData(title,price,prodId,img,index) {
  $('.cart-prod-details').append("\
    <div class='prod-data'>\
      <div class='prod-info'>\
        <div class='prod-img'>\
          <img src="+img+"/>\
        </div>\
        <div class='prod-name'>"+title+"</div>\
        <button class='btn-remove-prod'><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M23 3.541L20.459 1l-8.457 8.462L3.541 1 1 3.541l8.462 8.461L1 20.459 3.541 23l8.461-8.461L20.459 23 23 20.459l-8.461-8.457z'></path></svg></button>\
      </div>\
      <div class='prod-price'>"+price+"</div>\
      <div class='sure' style=''>\
        <div class='desc'>Are you sure you want to remove this product?</div>\
        <div class='actions'>\
            <button class='button remove-sure' data-prod-id="+prodId+" data-arr-no="+index+">Remove</button>\
            <button class='button ghost'>Keep</button>\
        </div>\
      </div>\
    </div>");
}

/**
  showConfirmRemove : Function used to display confirm remove slide.
*/
function showConfirmRemove(e) {

  for(var i=0; i<$('.remove-sure').length; i++) {
    $($('.remove-sure')[i]).attr('data-arr-no',i);
  }

  $(this).parent().siblings('.sure').slideToggle();
}

/**
  hideConfirmRemove : Function used to hide confirm remove slide.
*/
function hideConfirmRemove(e) {
  $(this).parents().find('.sure').slideUp();
}

/**
  onRemoveProdClick : Function used remove product from cart.
*/
function onRemoveProdClick(e) {
  var prodId = $(e.currentTarget).attr('data-prod-id'),
      index = $(e.currentTarget).attr('data-arr-no'),
      price = $(e.currentTarget).parents('.prod-data').find('.prod-price').text(),
      totalprice = Number($('.price-val').text());
      let cartCookie = getCookie('cart');

  if(cartCookie != "") {
    cartCookieData = JSON.parse(cartCookie);
    cartCookieData.splice(index,1);

    $('.prod-count').html(cartCookieData.length);
    $('.count-prod').html(cartCookieData.length);

    if(cartCookieData.length == 0) {
      $('.empty-cart').show();
      $('.contact-detail-holder').addClass('checkout-disabled');
      $('.cart-footer').hide();
    }
    setCartCookie(cartCookieData, 1800);
  }

  $('.proceed-to-checkout[data-checkout-id="'+prodId+'"]').hide();
  $('.add-to-cart[data-prod-id="'+prodId+'"]').show();
  $(e.currentTarget).parents('.prod-data').remove();

  totalprice -= Number(price.slice(1,price.indexOf("/")));
  $('.price-val').html(Math.round(totalprice * 100) / 100);
}

/**
  validateDetails : Validate form data on checkout page
  field : String - Field input field
  message : String - Message to be displayed when field is empty
  regex : String - To evaluate entered data
  validMessage : String - Message to be displayed when field data is invalid
  confirmEmail : Boolean - Whether it is a confirm email field
  email : String - If confirm email is true, email input needs to be send.
*/
function validateDetails(field,message,regex,validMessage,confirmEmail,email) {
  if(confirmEmail) {
    if (field.val() == '') {
      emptyField(message, field);
    } else if (email.val() !== field.val()) {
      emptyField(validMessage, field);
    }
  }
  else
  {
    if (field.val() == '') {
      emptyField(message, field);
    } else {
      fieldValidation(field, regex, validMessage);
    }
  }
}

/**
  onSubmitFormData : Function used submit checkout page form.
*/
function onSubmitFormData() {
  $('.phone').removeAttr('novalidate');
  $('.phone').attr('required','required');
  var email = $('#email'),
      confirm_email = $('#confirm-email'),
      fname = $('#fname'),
      lname = $('#lname'),
      houseno = $('#houseno'),
      home_phone = $('#home-phone'),
      cell_phone = $('#cell-phone'),
      work_phone = $('#work-phone'),
      phone = $('.phone'),
      counter = 0,
      otherCounter = 0;

  for(var i=0; i<phone.length; i++) {
    if($(phone[i]).val().match(ph_regex)) {
      counter++;
    }
    else if($(phone[i]).hasClass('val-error')) {
      otherCounter++;
    }
  }
  
  validateDetails(email,'The Email field is required.',email_regex,'Please enter a valid email address.');
  validateDetails(confirm_email,'The Confirm Email field is required.',email_regex,'The Confirm Email field does not match the Email field.',true,email);
  validateDetails(fname,'The First Name field is required.',alphabet_regex,'Please enter valid First Name.');  
  validateDetails(lname,'The Last Name field is required.',alphabet_regex,'Please enter valid Last Name.');  
  validateDetails(houseno,'The House Number and Street field is required.',num_regex, 'Please enter a valid House Number and Street field.');  
  if(counter == 0) {
    $('.phone').removeAttr('novalidate');
    $('.phone').attr('required','required');
    validateDetails(home_phone,'At least one contact number is required.',ph_regex, 'Please enter a valid phone number.');  
    validateDetails(cell_phone,'At least one contact number is required.',ph_regex, 'Please enter a valid phone number.');  
    validateDetails(work_phone,'At least one contact number is required.',ph_regex, 'Please enter a valid phone number.');    
  }
  else if(otherCounter == 0)
  {
    $('.phone').removeAttr('required');
    $('.phone').attr('novalidate','');
  }
}

/**
  onEmailFocusOut : Function used to validate data on focus out
*/
function onEmailFocusOut(e) {
  if ($(this).val() != '') {
    if ($(this).val() == $('#confirm-email').val()) {
      $('#confirm-email').removeClass('val-error');
      $('#confirm-email').next().html('');
      fieldValidation($('#confirm-email'), email_regex, 'Please enter a valid email address.');
    }
    fieldValidation($(this), email_regex, 'Please enter a valid email address.');
  }
}

/**
  onConfirmEmailFocusOut : Function used to validate data on focus out
*/
function onConfirmEmailFocusOut(e) {
  if ($(this).val() != $('#email').val()) {
    emptyField('The Confirm Email field does not match the Email field.', $(this));
  } else {
    $('#confirm-email').removeClass('val-error');
    $('#confirm-email').next().html('');
  }
}

/**
  onNameFocusOut : Function used to validate data on focus out
*/
function onNameFocusOut(e) {
  if ($(this).val() != '') {
    fieldValidation($(this), sp_regex, 'Special characters other than "-" not allowed in First Name.');
  }
}

/**
  onPhoneKeyUp : Function used to validate data on keyup event
*/
function onPhoneKeyUp(e,input) {
  // if (e.which !== 9) {
    fieldValidation(input, ph_regex, 'Please enter a valid phone number.');
  // }
}

/**
  emptyField : Function used to display error if field is empty
  err_msg : String - Message to be displayed when field is empty
  fieldName : String - Field with error
*/
function emptyField(err_msg, fieldName) {
  fieldName.addClass('val-error');
  fieldName.next().text(err_msg);
}

/**
  fieldValidation : Function used to display error if field is empty
  inputtxt : String - Field with error
  regex : String - To evaluate entered data
  err_msg : String - Message to be displayed when field is empty
*/
function fieldValidation(inputtxt, regex, err_msg) {
  inputtxt.removeClass('val-error');
  inputtxt.next().text('');
  if(!inputtxt.val().match(regex)) {
    inputtxt.addClass('val-error');
    inputtxt.next().text(err_msg);
  }
}

/**
  myLoader : Function used to hide loader
*/
function myLoader() {
  $('#loader').fadeOut();
  $('#myContent').fadeIn();
}

/**
  onViewPlansClick : Function used on View Plans button click
*/
function onViewPlansClick() {
  window.location.href = "/coverages/";
}

/**
  onBackToTop : Function used on back to top click
*/
var lastScrollTop = 0;

$(window).scroll(function() {

  var st = $(this).scrollTop();
  if ($(window).scrollTop() > 300) {
    $('.back-to-top').fadeIn();
    $('.product-ribbon').addClass('sticky-ribbon');
  } else {
    $('.back-to-top').fadeOut();
  }
  if (st < lastScrollTop) {
    $('.product-ribbon').removeClass('sticky-ribbon');
  }
  lastScrollTop = st;
});

function onBackToTop(e) {
  $("html, body").animate({scrollTop: 0}, 1000);
}

/**
  onDisclosureClose : Function used on Cookie disclosure close click
*/
function onDisclosureClose() {
  $('.cookie-disclosure').hide();
  localStorage.setItem('cookieSeen', 'shown');
}

const isNumericInput = (event) => {
  const key = event.keyCode;
  return ((key >= 48 && key <= 57) || // Allow number line
    (key >= 96 && key <= 105) // Allow number pad
  );
};

/*
** Returns the caret (cursor) position of the specified text field (oField).
** Return value range is 0-oField.value.length.
*/
function doGetCaretPosition (oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange();

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.value.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionDirection=='backward' ? oField.selectionStart : oField.selectionEnd;

  // Return results
  return iCaretPos;
}

const isModifierKey = (event) => {
  const key = event.keyCode;
  if((key===8 && doGetCaretPosition(event.target) == 10) || (key===46 && doGetCaretPosition(event.target) == 9)) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
    (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
    (key > 36 && key < 41) || // Allow left, up, right, down
    (
      // Allow Ctrl/Command + A,C,V,X,Z
      (event.ctrlKey === true || event.metaKey === true) &&
      (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
    )
};

const enforceFormat = (event) => {
  // Input must be of a valid number format or a modifier key, and not longer than ten digits
  if(!isNumericInput(event) && !isModifierKey(event)){
    event.preventDefault();
  }
};

const formatToPhone = (event) => {
  var phone = $('.phone');
  for(var i=0 ; i< phone.length; i++) {
    if(($(phone[i]).val()=='' && $(phone[i]).next().text().indexOf('At least') > -1) || ($(phone[i]).val()=='' && $(phone[i]).next().text().indexOf('valid') > -1)) {
      $(phone[i]).removeClass('val-error');
      $(phone[i]).next().text('');
    }
  }
  
  if(isModifierKey(event)) {return;}
  onPhoneKeyUp(event,$(event.target));

  const target = event.target;
  const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
  const zip = input.substring(0,3);
  const middle = input.substring(3,6);
  const last = input.substring(6,10);

  if(input.length > 6){target.value = `(${zip}) ${middle}-${last}`;}
  else if(input.length > 3){target.value = `(${zip}) ${middle}`;}
  else if(input.length > 0){target.value = `(${zip}`;}
};

$(document).ready(function() {

  var isMobile = false; //initiate as false
  // device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
      isMobile = true;
      $('.slot .cart-popup').addClass('mobile-cart');
  }

  $('.go-btn').on("click", function() {
    var zip_value = $('.zip-value').val();
    getData(zip_value, '.top-error', '.zip-value',false, true);
  });

  $('.zip-form button').on("click", function(e) {
    e.preventDefault();  
    var zip_value = $('.zip-form input').val();
    getData(zip_value, '.bottom-error', '.zip-form input',false,true);
  });

  $('.popup-form button').on("click", function(e) {
    e.preventDefault();
    var zip_value = $('.popup-form input').val();
    getData(zip_value, '.head-error', '.poopup-form input',true,true);
    // location.reload(true);
  });

  let linkTag = $( ".cart-button .new-add-to-cart" ),
      productId = linkTag.attr('data-prod-id');
  linkTag.removeAttr('href');
  $( ".cart-button .new-add-to-cart" ).wrap( "<button class='add-to-cart' data-prod-id='"+productId+"'>");
  $( ".cart-button .new-proc-to-chk" ).wrap( "<button class='proceed-to-checkout' data-checkout-id='"+productId+"'>");      


  /* on View Plans button click */
  $('.view-plans,.view-plans-down').on("click",onViewPlansClick);

  /* on Add to cart button click */
  $('.add-to-cart').on("click",onAddToCartBtnClick);

  /* on Enter Zip link click */
  $('.enter-zip-data').on("click", onPopupShow);

  /* on Enter Zip popup close click */
  $('.close-popup').on("click", onPopupHide);

  /* on Cart button click */
  $('.header-cart').on('click',onCartButtonClick);

  /* on Close Cart button click */
  $('.btn-close-cart').on('click',onCartCloseButtonClick);
  $('.close-data').on('click',onCartCloseButtonClick);

  /*Product listing accordion*/
  $('.accordion-trigger').on("click", onAccordionClick);

  //Important coverage information
  $('.see-more-less').on("click", onSeeMoreLessClick);
  
  /*FAQ section accordion*/
  $('.faq-heading').on("click", onFaqAccordionClick);

  /*Submit form data on checkout page*/
  $('.pay-type-btn').on("click", onSubmitFormData);

  /* On email focusout event */
  $('#email').on('focusout', onEmailFocusOut);

  /* On confirm email focusout event */
  $('#confirm-email').on('focusout', onConfirmEmailFocusOut);

  /* On fname focusout event */
  $('#fname').on('focusout', onNameFocusOut);

  /* On lname focusout event */
  $('#lname').on('focusout', onNameFocusOut);

  /* On house no focusout event */
  $('#houseno').on('focusout', onNameFocusOut);

  /* On phone key up event */
  $('#home-phone, #cell-phone, #work-phone').on('keyup', formatToPhone);

  $('#home-phone, #cell-phone, #work-phone').on('keydown', enforceFormat);

  /* On disclosure close click */
  $('.disclosure-close').on('click', onDisclosureClose);

  /* On back to top click */
  $('.back-to-top').on('click', onBackToTop);
});

$(window).on('load',function(e) {
  // call loader function
  myLoader();

  $('#myModal,.close').on('click',onModalClick);

  var sectionPosition = window.location.href.split("#");
  // $('html, body').animate({
  //   scrollTop : $('#'+sectionPosition[1]).offset().top
  // }, 1000);

  if($('#'+sectionPosition[1]).length > 0) {
    if (navigator.userAgent.match(/(iPod|iPad)/)) {
      $('html, body').animate({
        scrollTop : $('#'+sectionPosition[1]).offset().top + 190
      }, 1000);
    } else if (navigator.userAgent.match(/(iPhone|Android)/)) {
      $('html, body').animate({
        scrollTop : $('#'+sectionPosition[1]).offset().top + 440
      }, 1000);
    } else {
      $('html,body').animate({
        scrollTop : $('#'+sectionPosition[1]).offset().top + 100
      }, 1000, function(){
        $('html,body').clearQueue();
      });
    }
  }
  
  
  let cookieVal = getCookie('addr');
  if(window.location.pathname.indexOf('coverages')>-1 || 
      window.location.pathname.indexOf('checkout')>-1 ) {
    if(cookieVal !== "") {

      $('.covered-content ul').addClass('covered-details');
      $('.choose-panel-holder ul').addClass('choose-plan-details');
      $('.det-holder h2').addClass('prod-title');
      $('.money-back h2').addClass('money-title');
      $('.prod-head').parents('.product-faq').addClass('prod-list');

      let cookieData = JSON.parse(cookieVal);
      $('.city-name,.data-city').html(cookieData.city+",");
      $('.state-name,.data-state').html(cookieData.state);
      $('.zip-code').html(cookieData.zip);

      let cartCookie = getCookie('cart');

      if(cartCookie !== "") {
        cartCookieData = JSON.parse(cartCookie);
        for(var i=0 ; i<cartCookieData.length; i++) {
          var prodData = cartCookieData[i];
          $('.add-to-cart[data-prod-id="'+prodData.prodId+'"]').hide();
          $('.proceed-to-checkout[data-checkout-id="'+prodData.prodId+'"]').show();
        }

        if(window.location.pathname.indexOf('checkout')>-1) {
          phoneAdded = false;
          onCartButtonClick();

          $('.city-data,.hidden-city').val(cookieData.city);
          $('.state-data,.hidden-state').val(cookieData.state);
          $('.zip-data,.hidden-zip').val(cookieData.zip);

          $('.added-products').val(cartCookie);
        }
      }
    }
    else
    {
      window.location.href = "/";
      document.cookie = "cart=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }
  else if(window.location.pathname == '/' || window.location.pathname == '/mikerow/') {
      if(cookieVal !== "") {
        let cookieData = JSON.parse(cookieVal);
        $('.zip-input-holder,.zip-form').hide();
        $('.existing-zip,.existing-zip-down').show();
        $('.existing-zip-down').css('display','inline-block');
        console.log("ZIP IS "+cookieData.zip);
        $('.home-city').html(cookieData.city+",");
        $('.home-state').html(cookieData.state);
        $('.home-zip').html(cookieData.zip);
      }
      else
      {
        $('.zip-input-holder,.zip-form').show();
        $('.existing-zip,.existing-zip-down').hide();
      }
  }
  else if(window.location.pathname.indexOf('thankyou')>-1) {
    document.cookie = "cart=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "addr=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  let cartCookie = getCookie('cart');
  cartCookieData = JSON.parse(cartCookie);
  $('.count-prod').html(cartCookieData.length);

});


// Cookie consent form
if (localStorage.getItem('cookieSeen') != 'shown') {
  $('.cookie-disclosure').delay(1000).show();
}