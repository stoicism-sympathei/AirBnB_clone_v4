#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place, PlaceReview
from flask import Flask, render_template
from uuid import uuid4

app = Flask(__name__)
app.url_map.strict_slashes = False


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/101-hbnb', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    # Sort cities inside each states
    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    values = {"states": states, "amenities": amenities,
              "places": places, "cache_id": uuid4()}
    return render_template('101-hbnb.html', **values)


@app.route('/101-hbnb/<place_id>', strict_slashes=False)
def place_reviews(place_id):
    """ Display reviews of a place """
    place = storage.get(Place, place_id)

    if place is None:
        return render_template('404.html')

    reviews = sorted(place.reviews, key=lambda k: k.created_at)

    values = {"place": place, "reviews": reviews, "cache_id": uuid4()}
    return render_template('101-hbnb_reviews.html', **values)


@app.route('/handle_review', methods=['POST'], strict_slashes=False)
def handle_review():
    """ Add a new review to a place """
    place_id = request.form['place_id']
    user_id = request.form['user_id']
    text = request.form['text']

    place = storage.get(Place, place_id)
    if place is None:
        return "Error: Invalid place ID"

    user = storage.get(User, user_id)
    if user is None:
        return "Error: Invalid user ID"

    review = PlaceReview(place_id=place_id, user_id=user_id, text=text)
    storage.new(review)
    storage.save()

    return redirect(url_for('place_reviews', place_id=place_id))


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000, debug=True)
