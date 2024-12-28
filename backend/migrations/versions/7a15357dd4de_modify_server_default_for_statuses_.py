"""modify server default for statuses column in watchlists table

Revision ID: 7a15357dd4de
Revises: f9ff38b1335c
Create Date: 2024-12-12 17:21:04.358550

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '7a15357dd4de'
down_revision: Union[str, None] = 'f9ff38b1335c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Modify the statuses column to update server default
    # op.execute("""
    # ALTER TABLE watchlists 
    # ALTER COLUMN statuses SET DEFAULT
    # SET statuses = ARRAY['completed', 'queued', 'on-hold', 'dropped', 'watching']
    # """)
    op.execute("""
        UPDATE watchlists
        SET statuses = ARRAY['completed', 'queued', 'on-hold', 'dropped', 'watching'];
    """)
    # Update only entries with the old quoted format
    # op.execute("""
    # UPDATE watchlists 
    # SET statuses = ARRAY[completed,queued,on-hold,dropped,watching];
    # """)

def downgrade() -> None:
    # Revert to the previous server default
    op.execute("""
    ALTER TABLE watchlists 
    ALTER COLUMN statuses SET DEFAULT '{"completed", "queued", "on-hold", "dropped", "watching"}';
    """)

    # Optionally, you might want to revert the data to its original state
    # This depends on how you want to handle potential data changes
    op.execute("""
    UPDATE watchlists 
    SET statuses = '{"completed", "queued", "on-hold", "dropped", "watching"}';
    """)
