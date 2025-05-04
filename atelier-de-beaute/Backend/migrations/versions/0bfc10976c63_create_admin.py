"""create admin

Revision ID: 0bfc10976c63
Revises: 827027695836
Create Date: 2025-05-04 14:35:07.399228

"""
from alembic import op
import sqlalchemy as sa
import os
from models.user import User,UserRole
from extensions import db



# revision identifiers, used by Alembic.
revision = '0bfc10976c63'
down_revision = '827027695836'
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

