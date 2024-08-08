import json
import httpx as requests

# Replace with your Natrium API key
NATRIUM_API_KEY = "your_natrium_api_key_here"
NATRIUM_API_URL = "https://api.natrium.io/v1/geocode"

def get_lat_lon(location_name):
    params = {
        'q': location_name,
        'api_key': NATRIUM_API_KEY,
        'format': 'json'
    }
    response = requests.get(NATRIUM_API_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        if data and 'lat' in data and 'lon' in data:
            return data['lat'], data['lon']
    return None, None

def update_locations_with_lat_lon(json_file):
    with open(json_file, 'r+', encoding='utf-8') as file:
        locations = json.load(file)
        
        for location in locations:
            english_name = location.get('englishName')
            if english_name:
                lat, lon = get_lat_lon(english_name)
                if lat and lon:
                    location['location']['latitude'] = lat
                    location['location']['longitude'] = lon
                else:
                    print(f"Coordinates not found for: {english_name}")

        file.seek(0)
        json.dump(locations, file, ensure_ascii=False, indent=4)
        file.truncate()

if __name__ == "__main__":
    update_locations_with_lat_lon("locations.json")
