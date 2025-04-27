# models/token.py
from datetime import datetime
from app import db

class TokenBlacklist(db.Model):
    __tablename__ = 'token_blacklist'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)  # JWT ID
    token_type = db.Column(db.String(10), nullable=False)       # 'access' or 'refresh'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))   # Reference to user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)         # When token expires

    def __repr__(self):
        return f'<BlacklistedToken {self.jti}>'