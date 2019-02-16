import uuid as uuid_library
import hmac
import json
import hashlib
import requests
import six.moves.urllib as urllib

#########
# Consts

USERNAME, PASSWORD = '***USERNAME***', '***PASSWORD***'

API_URL = 'https://i.instagram.com/api/v1/'
LOGIN_URL = API_URL + 'accounts/login/'

# I have more devices here:
# https://github.com/instagrambot/instabot/blob/72d10447986db39ac95f3d0980936d9c08428b02/instabot/api/devices.py
# idk which to use, let's for now use this one, because it is just works
DEVICE = {
    'instagram_version': '26.0.0.10.86',
    'android_version': 24,
    'android_release': '7.0',
    'dpi': '640dpi',
    'resolution': '1440x2560',
    'manufacturer': 'HUAWEI',
    'device': 'LON-L29',
    'model': 'HWLON',
    'cpu': 'hi3660'
}

REQUEST_HEADERS = {
    'Connection': 'Keep-Alive',
    'X-IG-Capabilities': '3brTBw==',  # base64.b64encode(struct.pack('<i', 131316445)).decode('ascii')
    'X-IG-Connection-Type': 'WIFI',
    'X-FB-HTTP-Engine': 'Liger',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip,deflate',
    'Accept-Language': 'en-US',
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Cookie2': '$Version=1',
}

IG_SIG_KEY = '99e16edcca71d7c1f3fd74d447f6281bd5253a623000a55ed0b60014467a53b1'

print(" ---> Preparing consts:")

USER_AGENT_BASE = (
    'Instagram {instagram_version} '
    'Android ({android_version}/{android_release}; '
    '{dpi}; {resolution}; {manufacturer}; '
    '{device}; {model}; {cpu}; en_US)'
)

user_agent = USER_AGENT_BASE.format(**DEVICE)  # just insert params
print("USER_AGENT:", user_agent)

def generate_uuid():
    return str(uuid_library.uuid4())

phone_id = generate_uuid()
print("PHONE_ID (just another uuid):", phone_id)
uuid = generate_uuid()
print("UUID:", uuid)


################################################
# device_id = properly hashed login and password
def hex_digest(*args):
    m = hashlib.md5()
    m.update(b''.join([arg.encode('utf-8') for arg in args]))
    return m.hexdigest()

def generate_device_id(seed):
    volatile_seed = "12345"  # Important ! :) :)
    m = hashlib.md5()
    m.update(seed.encode('utf-8') + volatile_seed.encode('utf-8'))
    return 'android-' + m.hexdigest()[:16]

device_id = generate_device_id(hex_digest(USERNAME, USERNAME))
print("DEVICE_ID:", device_id)


##############################################
# The hardest part - sign data the proper way
data = json.dumps({
    'phone_id': phone_id,
    'username': USERNAME,
    'guid': uuid,
    'device_id': device_id,
    'password': PASSWORD,
    'login_attempt_count': '0',
})

def generate_signature(data):
    body = hmac.new(IG_SIG_KEY.encode('utf-8'), data.encode('utf-8'),
                    hashlib.sha256).hexdigest() + '.' + urllib.parse.quote(data)
    signature = 'ig_sig_key_version=4&signed_body={body}'
    return signature.format(body=body)


print()
print("Final POST DATA before signing:\n", data)
data = generate_signature(data)

print()
print("Final POST DATA after signing:\n", data)

print()
print(" ---> POSTing to url:", LOGIN_URL)
session = requests.Session()
session.headers.update(REQUEST_HEADERS)
session.headers.update({'User-Agent': user_agent})
response = session.post(LOGIN_URL, data=data)

print()
print("---> Details of what is happened:")
print(" - BODY:\n", response.request.body)
print(" - HEADERS:\n", response.request.headers)
print(" - RESPONSE:\n", response.status_code, response.text)
