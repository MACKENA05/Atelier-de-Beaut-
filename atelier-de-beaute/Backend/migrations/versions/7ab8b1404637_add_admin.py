"""add admin

Revision ID: 7ab8b1404637
Revises: dc77b2dcc51e
Create Date: 2025-05-03 11:01:24.922891

"""
from alembic import op
import sqlalchemy as sa
from models.user import User,UserRole
import os
from extensions import db


# revision identifiers, used by Alembic.
revision = '7ab8b1404637'
down_revision = 'dc77b2dcc51e'
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
