import pathlib
from flask import Blueprint

static_bp = Blueprint('static', __name__)

dist_path = pathlib.Path(__file__).parent.parent.parent / 'dist'
static_bp.static_folder = str(dist_path)


@static_bp.route('/')
def index():
    return static_bp.send_static_file('index.html')


@static_bp.route('/<path:path>')
def static_proxy(path):
    return static_bp.send_static_file(path)
