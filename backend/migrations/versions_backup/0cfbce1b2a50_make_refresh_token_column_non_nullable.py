"""Make refresh_token column non-nullable

Revision ID: 0cfbce1b2a50
Revises: 5800ffdeee1b
Create Date: 2024-08-19 15:08:22.694167

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0cfbce1b2a50"
down_revision: Union[str, None] = "5800ffdeee1b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("refresh_token", sa.String(), nullable=False))


def downgrade() -> None:
    # Remove the refresh_token column
    op.drop_column("users", "refresh_token")
