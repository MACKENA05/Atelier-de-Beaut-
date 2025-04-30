from app import create_app
from app import db

# Create an instance of the Flask app
app = create_app()


if __name__ == '__main__':
    # Start the app in debug mode for development
    app.run(debug=True)
