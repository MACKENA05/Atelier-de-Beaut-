from flask import jsonify

def handle_404(error):
    """Handle 404 Not Found error."""
    response = {
        "error": "Not Found",
        "message": "The resource you are looking for does not exist."
    }
    return jsonify(response), 404
