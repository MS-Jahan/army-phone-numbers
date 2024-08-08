import json
import time
import httpx as requests

def get_lat_lon(english_name, bangla_name):
    # Define the base URL for the Nominatim API
    url = f"https://nominatim.openstreetmap.org/search?format=json&q={english_name},{bangla_name},Bangladesh"
    
    # Send a GET request to the Nominatim API
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200 and len(response.json()) > 0:
        data = response.json()[0]
        return data['lat'], data['lon']
    return None, None

def update_locations_with_lat_lon(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        locations = json.load(file)
    
    for location in locations:
        english_name = location['englishName']
        bangla_name = location['banglaName']
        
        print(f"Fetching lat/lon for {english_name} ({bangla_name})...")
        lat, lon = get_lat_lon(english_name, bangla_name)
        
        if lat and lon:
            location['location']['latitude'] = lat
            location['location']['longitude'] = lon
            print(f"Success: {lat}, {lon}")
            # save to file
            with open(output_file, 'w', encoding='utf-8') as file:
                json.dump(locations, file, ensure_ascii=False, indent=4)
        else:
            print(f"Failed to get lat/lon for {english_name} ({bangla_name})")
        
        # Sleep to avoid hitting the API rate limit
        time.sleep(1)
    
    # Save the updated locations to a new JSON file
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(locations, file, ensure_ascii=False, indent=4)
    print(f"Updated locations saved to {output_file}")

if __name__ == "__main__":
    input_file = 'data.json'
    output_file = 'locations_with_lat_lon.json'
    update_locations_with_lat_lon(input_file, output_file)
