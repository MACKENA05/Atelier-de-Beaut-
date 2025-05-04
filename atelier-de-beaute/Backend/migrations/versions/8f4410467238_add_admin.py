"""add admin

Revision ID: 8f4410467238
Revises: 1b84d0e026d4
Create Date: 2025-05-04 12:30:46.318423

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db


# revision identifiers, used by Alembic.
revision = '8f4410467238'
down_revision = '1b84d0e026d4'
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

