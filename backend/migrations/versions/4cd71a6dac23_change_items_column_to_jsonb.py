from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB  # Import JSONB from PostgreSQL dialect
from alembic import op
from sqlalchemy.sql import text

# Rest of the migration script remains the same
revision: str = '4cd71a6dac23'
down_revision: Union[str, None] = 'c7b5a9779ed6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Add the new JSONB column
    op.add_column('watchlists', 
        sa.Column('items_new', JSONB(), nullable=True, server_default='[]')
    )
    
    # Migration script to convert existing integer array to JSONB array of objects
    connection = op.get_bind()
    connection.execute(text("""
        UPDATE watchlists 
        SET items_new = 
            (
                SELECT json_agg(
                    json_build_object(
                        'media_type', 'movie', 
                        'id', item
                    )
                )
                FROM unnest(items) AS item
            )
    """))
    
    # Drop the old column
    op.drop_column('watchlists', 'items')
    
    # Rename the new column to 'items'
    op.alter_column('watchlists', 'items_new', new_column_name='items')

def downgrade():
    # Add back the old Array(Integer) column
    op.add_column('watchlists', 
        sa.Column('items_old', sa.ARRAY(sa.Integer()), nullable=True, server_default='{}')
    )
    
    # Convert JSONB back to integer array
    connection = op.get_bind()
    connection.execute(text("""
        UPDATE watchlists 
        SET items_old = 
            (
                SELECT array_agg(
                    (item->>'id')::int
                )
                FROM jsonb_array_elements(items) AS item
            )
    """))
    
    # Drop the JSONB column
    op.drop_column('watchlists', 'items')
    
    # Rename the old column back to 'items'
    op.alter_column('watchlists', 'items_old', new_column_name='items')
