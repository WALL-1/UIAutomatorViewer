from flask import Blueprint
from ..utils import response

bp_404 = Blueprint('bp_404',__name__)

@bp_404.app_errorhandler(404)
def handler_404(err):
    return response.make(status=-1,code=400000,message=str(err))

@bp_404.app_errorhandler(Exception)
def handler_errors(err):
    return response.make(status=-1,code=500000,message=str(err))
