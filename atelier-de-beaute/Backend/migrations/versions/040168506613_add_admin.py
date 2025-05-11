"""add admin

Revision ID: 040168506613
Revises: ace88b721353
Create Date: 2025-05-11 06:21:51.294510

"""

from alembic import op
import sqlalchemy as sa
from extensions import db
from models.user import User,UserRole
import os

revision = '040168506613'
down_revision = 'ace88b721353'
branch_labels = None
depends_on = None



def upgrade():
    admin = User(
        email=os.getenv('SUPERADMIN_EMAIL', 'superadmin@gmail.com'),
        username='Super Admin',
        role=UserRole.ADMIN
    )
    admin.set_password(os.getenv('SUPERADMIN_PASSWORD', 'SecureAdminPass123!'))
    db.session.add(admin)
    db.session.commit()



def downgrade():
    User.query.filter_by(email='superadmin@example.com').delete()
    db.session.commit()


