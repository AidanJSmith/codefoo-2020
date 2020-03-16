import requests

headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}

params = (
    ('startIndex', '0'),
    ('count', '10'),
)
data  = open("data.JSON", "w") 
response = requests.get('https://ign-apis.herokuapp.com/videos', headers=headers, params=params)

data.write(response.text);
print("FINISHED");
