"""statuses column to watchlist schema

Revision ID: 66297b47148c
Revises: 4cd71a6dac23
Create Date: 2024-12-12 11:22:48.335930

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

# revision identifiers, used by Alembic.
revision: str = '66297b47148c'
down_revision: Union[str, None] = '4cd71a6dac23'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('watchlists', sa.Column('statuses', sa.ARRAY(sa.String()), server_default="{'completed', 'queued', 'on-hold', 'dropped', 'watching'}", nullable=False))

    op.execute("UPDATE watchlists SET items = '[]' WHERE items IS NULL")

    op.alter_column(
        'watchlists',
        'items',
        existing_type=JSONB,
        nullable=False,
    )


def downgrade() -> None:
    op.drop_column('watchlists', 'statuses')

    op.alter_column(
        'watchlists',
        'items',
        existing_type=JSONB,
        nullable=True,
    )
    # ### end Alembic commands ###
