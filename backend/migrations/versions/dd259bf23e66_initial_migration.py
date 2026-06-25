"""initial migration

Revision ID: dd259bf23e66
Revises: 
Create Date: 2026-05-17 11:40:54.927340

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd259bf23e66'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_table(
        'watchlists',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('items', sa.JSON(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column('is_private', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('statuses', sa.ARRAY(sa.String()), nullable=False, server_default=sa.text("ARRAY['completed','queued','on-hold','dropped','watching']")),
        sa.Column('all_tags', sa.ARRAY(sa.String()), nullable=False, server_default=sa.text("'{}'")),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('watchlists')
    op.drop_table('users')
