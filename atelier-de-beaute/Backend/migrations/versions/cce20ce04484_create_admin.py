"""create admin

Revision ID: cce20ce04484
Revises: 06dbfb11a529
Create Date: 2025-05-13 09:55:04.803263

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db



# revision identifiers, used by Alembic.
revision = 'cce20ce04484'
down_revision = '06dbfb11a529'
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
