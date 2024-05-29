from flask import Flask


def create_app():
    app = Flask(__name__)

    from .routes import cities

    app.register_blueprint(cities.cities_bp)

    return app
