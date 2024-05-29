from flask import Flask
from routes.cities_search import cities_search
from routes.random_cities import random_cities

app = Flask(__name__)


@app.route("/api/cities/search")
def get_cities_search():
    return cities_search()


@app.route("/api/cities/random")
def get_random_cities():
    return random_cities()


if __name__ == "__main__":
    app.run(host="0.0.0.0")
