import webbrowser

from UIAutomatorViewer import app

def start():
    webbrowser.open('http://127.0.0.1:5000/static/ui/index.html')
    app.run()

if __name__ == "__main__":
    app.run()