from flask import Flask
app = Flask(__name__)
application = app

@app.route("/")
def hello():
    return "It works!\n"

if __name__ == "__main__":
    app.run()