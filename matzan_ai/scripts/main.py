from flask import Flask
from predict import matzan_blueprint

app = Flask(__name__)
app.register_blueprint(matzan_blueprint)

if __name__ == '__main__':
    app.run(debug=True)