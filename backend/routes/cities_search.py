from flask import request, jsonify
from utils.cities import index
from utils.utils import to_ascii


def cities_search():
    user_query = request.args.get("query")
    user_query = to_ascii(user_query)
    limit = int(request.args.get("limit", 10))

    searcher = index.searcher()
    query = index.parse_query(user_query)
    results = searcher.search(query, limit).hits
    hits = []
    for hit in results:
        doc = searcher.doc(hit[1])
        hits.append({
            "insee_code": int(doc.get_first("insee_code")),
            "name": doc.get_first("name"),
            "score": hit[0]
        })
    return jsonify(hits)
