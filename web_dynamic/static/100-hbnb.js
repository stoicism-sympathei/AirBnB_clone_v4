let articles = function (data) {
  $('article').remove();
  data = data.sort((a, b) => (a.name > b.name) ? 1 : -1);
  $.each(data, function (k, v) {
    $(`<article>
      <div class="title">
      <h2>${v.name}</h2>
      <div class="price_by_night">
      ${v.price_by_night}
      </div>
      </div>
      <div class="information">
      <div class="max_guest">
      <i class="fa fa-users fa-3x" aria-hidden="true"></i>
      <br />
      ${v.max_guest} Guests
      </div>
      <div class="number_rooms">
      <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
      <br />
      ${v.number_rooms} Bedrooms
      </div>
      <div class="number_bathrooms">
      <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
      <br />
      ${v.number_bathrooms} Bathroom
      </div>
      </div>
      <div class="user">
      <strong>Owner: PLACEHOLDER</strong>
      </div>
      <div class="description">
      ${v.description}
      </div>
      </article>`).appendTo('.places');
  });
};

$(document).ready(function () {
  $('.places h1').css('display', 'none');
  $('.amenities UL LI INPUT').css('margin-right', '10px');
  $('.locations input').css('margin-right', '10px');
  let amDict = {};
  let stDict = {};
  let ctDict = {};
  $('.locations input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      if ($(this).parent().attr('class') === 'statename') {
        stDict[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        ctDict[$(this).attr('data-id')] = $(this).attr('data-name');
      }
    } else if ($(this).is(':not(:checked)')) {
      if ($(this).parent().attr('class') === 'statename') {
        delete stDict[$(this).attr('data-id')];
      } else {
        delete ctDict[$(this).attr('data-id')];
      }
    }
    let alist = [];
    for (let k in stDict) {
      alist.push(stDict[k]);
    }
    for (let k in ctDict) {
      alist.push(ctDict[k]);
    }
    $('.locations h4').text(alist.join(', '));
  });
  $('.amenities input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      amDict[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if ($(this).is(':not(:checked)')) {
      delete amDict[$(this).attr('data-id')];
    }
    let alist = [];
    for (let k in amDict) {
      alist.push(amDict[k]);
    }
    $('.amenities h4').text(alist.join(', '));
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').toggleClass('available');
    }
  });
  $('button').click(function () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ 'amenities': Object.keys(amDict), 'states': Object.keys(stDict), 'cities': Object.keys(ctDict) }),
      success: function (data) {
	$('.places h1').css('display', 'flex');
        articles(data);
      }
    });
  });
});
