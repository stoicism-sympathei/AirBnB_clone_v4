// const host = 'localhost';
const host = '0.0.0.0';

const checkedAmenities = {};

const checkAmenities = function () {
  let displayAmenities = [];
  $('.amenities .popover input').change(function () {
    if ($(this).prop('checked')) {
      checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else if (!$(this).prop('checked')) {
      delete checkedAmenities[$(this).attr('data-id')];
    }
    displayAmenities = Object.values(checkedAmenities).sort();
    if (displayAmenities.length != 0)
      $('.amenities h4').text(displayAmenities.join(', '));
    else
      $('.amenities h4').html("&nbsp;");
  });
};

const checkApiStatus = function () {
  $.getJSON(`http://${host}:5001/api/v1/status`, (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
};

const fetchPlaces = function (amenitiesFilter = {}) {
  $.ajax({
    url: `http://${host}:5001/api/v1/places_search`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ amenities: Object.keys(amenitiesFilter) }),
    success: (data) => {
      data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      $('section.places').empty();
      for (const place of data) {
        const article = `
        <article>
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guests</div>
            <div class="number_rooms">${place.number_rooms} Bedrooms</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>`;
        $('section.places').append(article);
      }
    }
  });
};

const toggleReviews = function () {
  const button = $('div#toggle-reviews span');
  const placeId = $('section.places article').first().attr('data-id');
  if (button.text() === 'show') {
    $.getJSON(`http://${host}:5001/api/v1/places/${placeId}/reviews`, (data) => {
      const reviews = data.map((review) => {
        return `<article>
                  <h3>From ${review.user_first_name} ${review.user_last_name}</h3>
                  <p>${review.text}</p>
                </article>`;
      });
      $('section.reviews').empty().append(reviews.join(''));
      button.text('hide');
    });
  } else {
    $('section.reviews').empty();
    button.text('show');
  }
};

$(() => {
  checkAmenities();
  checkApiStatus();
  fetchPlaces(checkedAmenities);
  $('button').on('click', () => {
    fetchPlaces(checkedAmenities);
  });
  $('div#toggle-reviews span').on('click', toggleReviews);
});
