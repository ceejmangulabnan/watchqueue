"""Add refresh_token column to users table

Revision ID: c18fbcddc111
Revises: 0cfbce1b2a50
Create Date: 2024-08-19 16:17:16.178411

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c18fbcddc111"
down_revision: Union[str, None] = "0cfbce1b2a50"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "users",
        sa.Column(
            "refresh_token", sa.String(), nullable=False, server_default="default"
        ),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("users", "refresh_token")
    # ### end Alembic commands ###
