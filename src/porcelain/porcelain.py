import sys
import base64
import json
import _winreg as winreg

if __name__=='__main__':
    try:
        data = sys.argv[1]
        overrides = json.loads(base64.b64decode(data))
        background_color = overrides.get('background_color')
        if background_color:
            registry = winreg.ConnectRegistry(None, winreg.HKEY_CURRENT_USER)
            key = winreg.OpenKey(registry, r'SOFTWARE\SimonTatham\PuTTY\Sessions\sia', 0, winreg.KEY_WRITE)
            winreg.SetValueEx(key, 'Colour2', 0, winreg.REG_SZ, background_color)
    except Exception:
        sys.exit(1)
