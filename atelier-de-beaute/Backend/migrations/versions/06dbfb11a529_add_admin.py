"""add admin

Revision ID: 06dbfb11a529
Revises: 48eab6a0e2f5
Create Date: 2025-05-12 18:13:01.761000

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db


# revision identifiers, used by Alembic.
revision = '06dbfb11a529'
down_revision = '48eab6a0e2f5'
branch_labels = None
depends_on = None


def upgrade():
    admin = User(
        email=os.getenv('SUPERADMIN_EMAIL', 'superadmin@gmail.com'),
        username='SuperAdmin',
        role=UserRole.ADMIN
    )
    admin.set_password(os.getenv('SUPERADMIN_PASSWORD', 'SecureAdminPass123!'))
    db.session.add(admin)
    db.session.commit()



def downgrade():
    User.query.filter_by(email='superadmin@example.com').delete()
    db.session.commit()