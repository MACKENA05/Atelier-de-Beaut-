from flask import jsonify
import logging

logger = logging.getLogger(__name__)

def handle_404(error):
    """Handle 404 Not Found error."""
    response = {
        "error": "Not Found",
        "message": "The resource you are looking for does not exist."
    }
    return jsonify(response), 404

def handle_500(error):
    """Handle 500 Internal Server Error."""
    response = {
        "error": "Internal Server Error",
        "message": "Something went wrong on the server."
    }
    return jsonify(response), 500

def handle_validation_error(error):
    """Handle marshmallow validation errors."""
    logger.warning(f"Validation error: {error.messages}")
    response = {
        "error": "Validation Error",
        "messages": error.messages,
        "status": 422
    }
    return jsonify(response), 422
