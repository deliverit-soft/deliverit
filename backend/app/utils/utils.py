import unicodedata
import json
import numpy as np


def to_ascii(s):
    s = s.replace('\u009c', 'oe')  # process œ
    return unicodedata.normalize('NFD', s).encode('ASCII', 'ignore').decode()


def clamp(value, min_value, max_value):
    return max(min(value, max_value), min_value)


class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


def numpy_to_object(array):
    """
    Function to convert a numpy array to an object
    :param array: Numpy array
    :return: Object
    """
    return json.loads(json.dumps(array, cls=NumpyEncoder))
