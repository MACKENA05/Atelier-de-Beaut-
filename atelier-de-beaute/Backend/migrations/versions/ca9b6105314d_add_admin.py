"""add admin

Revision ID: ca9b6105314d
Revises: 0917cef57c0a
Create Date: 2025-05-08 12:33:20.000732

"""
from alembic import op
import sqlalchemy as sa
from extensions import db
from models.user import User,UserRole
import os



# revision identifiers, used by Alembic.
revision = 'ca9b6105314d'
down_revision = '0917cef57c0a'
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

