"""add an admin

Revision ID: ace88b721353
Revises: ca9b6105314d
Create Date: 2025-05-08 21:09:50.533116

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db


# revision identifiers, used by Alembic.
revision = 'ace88b721353'
down_revision = 'ca9b6105314d'
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