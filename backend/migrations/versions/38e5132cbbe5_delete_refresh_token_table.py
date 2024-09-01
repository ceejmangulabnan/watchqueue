"""delete refresh token table

Revision ID: 38e5132cbbe5
Revises: b1f71b63ca9b
Create Date: 2024-09-01 10:36:07.338149

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '38e5132cbbe5'
down_revision: Union[str, None] = 'b1f71b63ca9b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('refresh_tokens')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('refresh_tokens',
    sa.Column('refresh_token', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='refresh_tokens_user_id_fkey'),
    sa.PrimaryKeyConstraint('refresh_token', name='refresh_tokens_pkey')
    )
    # ### end Alembic commands ###
