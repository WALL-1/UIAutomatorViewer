
def make(**kwargs):
    res = {
        'status':0,
        'code':200000,
        'message':'success',
        'data':None
    }
    res.update(**kwargs)
    return res