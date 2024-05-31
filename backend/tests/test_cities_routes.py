def test_get_random_cities(client):
    response = client.get("/api/cities/random", query_string={"limit": 7})
    assert response.status_code == 200
    assert len(response.json) == 7
    for city in response.json:
        assert "insee_code" in city
        assert "name" in city
        assert isinstance(city["insee_code"], int)
        assert isinstance(city["name"], str)
        assert city["insee_code"] > 0
        assert city["name"]


def test_get_cities_search(client):
    response = client.get("/api/cities/search", query_string={"query": "paris", "limit": 2})
    assert response.status_code == 200
    assert len(response.json) >= 1
    paris = response.json[0]
    assert "insee_code" in paris
    assert "name" in paris
    assert "score" in paris
    assert isinstance(paris["insee_code"], int)
    assert isinstance(paris["name"], str)
    assert isinstance(paris["score"], float)
    assert paris["insee_code"] == 75056
    assert paris["name"] == 'Paris'
    assert paris["score"] > 0
