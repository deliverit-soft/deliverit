from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    if app.config.get('ENV', 'production') == "development" or app.config.get('DEBUG', False):
        # Enable CORS in dev
        CORS(app)
    else:
        # Serve static files in production
        from app.routes.static import static_bp
        app.register_blueprint(static_bp)

    from .routes import cities, logic

    app.register_blueprint(cities.cities_bp)
    app.register_blueprint(logic.logic_bp)

    return app
