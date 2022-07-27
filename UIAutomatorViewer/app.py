from flask import Flask,Blueprint
from importlib_metadata import import_module
from .extends import init as init_extends


app = Flask(__name__)
app.config.from_pyfile("config.py")

init_extends(app)

for bp in app.config.get('URLS'):
    if isinstance(bp,Blueprint):
        app.register_blueprint(bp)
    elif isinstance(bp,str):
        m = import_module(bp)
        for key in dir(m):
            item = getattr(m,key)
            if isinstance(item,Blueprint):
                app.register_blueprint(item)

