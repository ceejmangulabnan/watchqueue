"""tags column and validation for items object

Revision ID: f9ff38b1335c
Revises: 66297b47148c
Create Date: 2024-12-12 11:56:47.085209

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9ff38b1335c'
down_revision: Union[str, None] = '66297b47148c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('watchlists', sa.Column('all_tags', sa.ARRAY(sa.String()), server_default='{}', nullable=False))


def downgrade() -> None:
    op.drop_column('watchlists', 'all_tags')
