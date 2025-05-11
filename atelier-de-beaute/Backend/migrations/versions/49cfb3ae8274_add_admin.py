"""add admin

Revision ID: 49cfb3ae8274
Revises: 7eaf0f341fc2
Create Date: 2025-05-04 15:14:11.290562

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db

# revision identifiers, used by Alembic.
revision = '49cfb3ae8274'
down_revision = '7eaf0f341fc2'
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
