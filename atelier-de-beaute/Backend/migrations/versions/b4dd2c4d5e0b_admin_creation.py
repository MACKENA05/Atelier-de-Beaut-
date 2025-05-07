"""admin creation

Revision ID: b4dd2c4d5e0b
Revises: 49cfb3ae8274
Create Date: 2025-05-06 22:46:21.555230

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db


# revision identifiers, used by Alembic.
revision = 'b4dd2c4d5e0b'
down_revision = '49cfb3ae8274'
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


