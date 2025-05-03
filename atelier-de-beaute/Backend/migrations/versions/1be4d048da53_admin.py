"""admin

Revision ID: 1be4d048da53
Revises: 0e5116db8629
Create Date: 2025-05-03 20:18:06.092000

"""
from alembic import op
import sqlalchemy as sa
from extensions import db
from models.user import User,UserRole
import os


# revision identifiers, used by Alembic.
revision = '1be4d048da53'
down_revision = '0e5116db8629'
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

