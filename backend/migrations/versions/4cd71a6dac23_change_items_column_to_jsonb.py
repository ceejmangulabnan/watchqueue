from typing import Sequence, Union
from alembic import op

revision: str = '4cd71a6dac23'
down_revision: Union[str, None] = 'c7b5a9779ed6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Directly modify column type
    op.execute("""
        ALTER TABLE watchlists 
        ALTER COLUMN items TYPE jsonb 
        USING (
            CASE 
                WHEN items IS NULL THEN '[]'::jsonb 
                ELSE (
                    SELECT json_agg(
                        json_build_object(
                            'media_type', 'movie', 
                            'id', item
                        )
                    )
                    FROM unnest(items) AS item
                )
            END
        );

        -- Set default to empty JSON array
        ALTER TABLE watchlists 
        ALTER COLUMN items SET DEFAULT '[]'::jsonb;
    """)

def downgrade():
    op.execute("""
        ALTER TABLE watchlists 
        ALTER COLUMN items TYPE integer[] 
        USING (
            SELECT array_agg((item->>'id')::int)
            FROM jsonb_array_elements(items) AS item
        );

        ALTER TABLE watchlists 
        ALTER COLUMN items SET DEFAULT '{}'::integer[];
    """)
