"""admin

Revision ID: 1b84d0e026d4
Revises: 0f1f60bf04c6
Create Date: 2025-05-04 12:14:44.666577

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db



# revision identifiers, used by Alembic.
revision = '1b84d0e026d4'
down_revision = '0f1f60bf04c6'
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


