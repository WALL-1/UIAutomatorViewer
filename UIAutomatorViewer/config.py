
class Config:
    # Debug mode
    DEBUG = False

    # Static_folder
    STATIC_FOLDER = 'static'

    # CSRF secret key
    SECRET_KEY = "e456cc80ebd6409b90cb4c3ef70817b9"

    # Register blueprints
    URLS = [
        'UIAutomatorViewer.api.404',
        'UIAutomatorViewer.api.device'
    ]