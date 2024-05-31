from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    # Enable CORS in dev
    if app.config.get('ENV', 'production') == "development" or app.config.get('DEBUG', False):
        CORS(app)

    from .routes import cities

    app.register_blueprint(cities.cities_bp)

    return app
