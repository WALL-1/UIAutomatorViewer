import os
import uiautomator2 as u2

from flask import Blueprint, current_app, request, url_for
from urllib.parse import urljoin
from adbutils import adb
from ..utils import response

bp_device = Blueprint('bp_device', __name__, url_prefix='/api/android/device')


def get_device():
    serial = request.get_json().get('serial')
    return current_app.devices.get(serial)


@bp_device.route('/list', methods=['GET'])
def device_list():
    return response.make(data=[d.serial for d in adb.device_list()])


@bp_device.route('/connect', methods=['POST'])
def connect():
    serial = request.get_json().get('serial')
    current_app.devices[serial] = u2.connect(serial)

    return response.make()


@bp_device.route('/dump', methods=['POST'])
def dump():
    device = get_device()
    if device is None:
        return response.make(status=-1,code=400000,message='Device offline')

    hierarchy_xml = device.dump_hierarchy()
    screenshot_dir = os.path.join(current_app.static_folder,'screenshots')
    if not os.path.exists(screenshot_dir):
        os.makedirs(screenshot_dir)
    screenshot_path = os.path.join('screenshots','window.png').replace('\\','/')
    screenshot_path_full = os.path.join(current_app.static_folder,screenshot_path)
    if os.path.exists(screenshot_path_full):
        os.remove(screenshot_path_full)
    device.screenshot(screenshot_path_full)

    info = device.info
    return response.make(data={
        'imageURL':urljoin(request.host_url,url_for('static',filename=screenshot_path)),
        'xml':hierarchy_xml,
        'width':info['displayWidth'],
        'height':info['displayHeight'],
        'rotation': info['displayRotation']%2
    })

@bp_device.route('/call/<func>',methods=['POST'])
def call(func):
    device = get_device()
    payload = request.get_json()
    # current_app.logger.debug(payload)
    func_obj = getattr(device,func)
    if callable(func_obj):
        selectors = payload.get('selectors',dict())
        args = payload.get('args',list())
        kwargs = payload.get('kwargs',dict())

        if len(selectors)==0:
            cmd='device.{}'.format(func)
        else:
            cmd='device(**{}).{}'.format(selectors,func)
        
        if len(args)==0:
            cmd += '(**{})'.format(kwargs)
        else:
            cmd += '(*{},**{})'.format(args,kwargs)

        result = eval(cmd)
    else:
        result = func_obj
    return response.make(data=result)


    
