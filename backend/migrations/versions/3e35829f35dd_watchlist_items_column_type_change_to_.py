"""watchlist items column type change to WatchlistItem array

Revision ID: 3e35829f35dd
Revises: 7a15357dd4de
Create Date: 2024-12-18 11:13:54.782115

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision: str = '3e35829f35dd'
down_revision: Union[str, None] = '7a15357dd4de'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Ensure the 'items' column is of type JSONB
    op.alter_column('watchlists', 'items', type_=JSONB)

    # Update all entries in the 'items' column
    connection = op.get_bind()
    connection.execute(
        sa.text("""
            WITH updated_items AS (
                SELECT
                    id,
                    jsonb_agg(
                        jsonb_build_object(
                            'id', (item->>'id')::INTEGER,  -- Cast id to integer
                            'media_type', item->>'media_type',
                            'status', COALESCE(item->>'status', 'queued'),
                            'tags', COALESCE(item->'tags', '[]'::jsonb)
                        )
                    ) AS new_items
                FROM (
                    SELECT id, jsonb_array_elements(items) AS item
                    FROM watchlists
                ) subquery
                GROUP BY id
            )
            UPDATE watchlists
            SET items = updated_items.new_items
            FROM updated_items
            WHERE watchlists.id = updated_items.id;
        """)
    )


def downgrade():
    # Revert the changes (optional)
    connection = op.get_bind()
    connection.execute(
        sa.text("""
            WITH reverted_items AS (
                SELECT
                    id,
                    jsonb_agg(
                        jsonb_build_object(
                            'id', (item->>'id')::INTEGER,  -- Ensure id is cast back to integer
                            'media_type', item->>'media_type'
                        )
                    ) AS original_items
                FROM (
                    SELECT id, jsonb_array_elements(items) AS item
                    FROM watchlists
                ) subquery
                GROUP BY id
            )
            UPDATE watchlists
            SET items = reverted_items.original_items
            FROM reverted_items
            WHERE watchlists.id = reverted_items.id;
        """)
    )
