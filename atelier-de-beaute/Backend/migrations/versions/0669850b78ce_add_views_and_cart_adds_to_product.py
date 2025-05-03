"""Add views and cart_adds to Product

Revision ID: 0669850b78ce
Revises: 4a3564eaf9ec
Create Date: 2025-05-04 01:10:31.166975

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0669850b78ce'
down_revision = '4a3564eaf9ec'
branch_labels = None
depends_on = None


def upgrade():
    # Add columns as nullable
    op.add_column('products', sa.Column('views', sa.Integer, nullable=True))
    op.add_column('products', sa.Column('cart_adds', sa.Integer, nullable=True))
    
    # Update existing rows to set default values
    op.execute('UPDATE products SET views = 0 WHERE views IS NULL')
    op.execute('UPDATE products SET cart_adds = 0 WHERE cart_adds IS NULL')
    
    # Alter columns to NOT NULL
    op.alter_column('products', 'views', nullable=False)
    op.alter_column('products', 'cart_adds', nullable=False)

def downgrade():
    # Drop the columns
    op.drop_column('products', 'cart_adds')
    op.drop_column('products', 'views')
    # ### end Alembic commands ###
