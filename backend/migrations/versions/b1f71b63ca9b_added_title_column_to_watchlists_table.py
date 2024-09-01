"""Added title column to watchlists table

Revision ID: b1f71b63ca9b
Revises: 7b4e4873aed2
Create Date: 2024-08-26 09:05:28.852853

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1f71b63ca9b'
down_revision: Union[str, None] = '7b4e4873aed2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('watchlists', sa.Column('title', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('watchlists', 'title')
    # ### end Alembic commands ###