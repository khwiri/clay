import sys
import base64
import json
import _winreg as winreg

if __name__=='__main__':
    try:
        data = sys.argv[1]
        overrides = json.loads(base64.b64decode(data))
        background_color = overrides.get('background_color', '0,0,0')
        text_color = overrides.get('text_color', '255,255,255')
        if background_color:
            registry = winreg.ConnectRegistry(None, winreg.HKEY_CURRENT_USER)
            key = winreg.OpenKey(registry, r'SOFTWARE\SimonTatham\PuTTY\Sessions\clay-default', 0, winreg.KEY_WRITE)
            winreg.SetValueEx(key, 'Colour2', 0, winreg.REG_SZ, background_color)
            winreg.SetValueEx(key, 'Colour0', 0, winreg.REG_SZ, text_color)

            # The default blue is annoying, so changing that to something more pleasant.  Eventually,
            # this should be an optional parameter.
            winreg.SetValueEx(key, 'Colour14', 0, winreg.REG_SZ, '120,120,187')
    except Exception:
        sys.exit(1)
