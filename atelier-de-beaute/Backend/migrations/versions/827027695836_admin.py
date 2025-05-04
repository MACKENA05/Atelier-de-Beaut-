"""admin

Revision ID: 827027695836
Revises: 8f4410467238
Create Date: 2025-05-04 13:30:33.229608

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db


# revision identifiers, used by Alembic.
revision = '827027695836'
down_revision = '8f4410467238'
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


