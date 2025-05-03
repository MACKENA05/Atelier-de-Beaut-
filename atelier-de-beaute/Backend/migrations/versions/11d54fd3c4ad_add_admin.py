"""add admin

Revision ID: 11d54fd3c4ad
Revises: 5aab57f1b7fe
Create Date: 2025-05-02 08:51:37.354584

"""
from alembic import op
import sqlalchemy as sa
from app import db
from models.user import User, UserRole
import os


# revision identifiers, used by Alembic.
revision = '11d54fd3c4ad'
down_revision = '5aab57f1b7fe'
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

