"""add admin

Revision ID: e28ac22d1754
Revises: 040168506613
Create Date: 2025-05-11 06:42:06.892538

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db



# revision identifiers, used by Alembic.
revision = 'e28ac22d1754'
down_revision = '040168506613'
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

