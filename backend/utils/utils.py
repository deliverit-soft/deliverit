import unicodedata


def to_ascii(s):
    s = s.replace('\u009c', 'oe')  # process œ
    return unicodedata.normalize('NFD', s).encode('ASCII', 'ignore').decode()
