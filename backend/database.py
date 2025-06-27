from sqlalchemy import create_engine, MetaData
from databases import Database
DATABASE_URL = "postgresql://postgres.qudskngzqoxnglcvhprv:xiqzuq-9xinsI-judvix@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

database = Database(DATABASE_URL)
metadata = MetaData()

engine = create_engine(DATABASE_URL)

from sqlalchemy import Table, Column, Integer, String, Date, Enum

import enum

class StatusEnum(str, enum.Enum):
    applied = "Applied"
    interviewing = "Interviewing"
    offer = "Offer"
    rejected = "Rejected"
    accepted = "Accepted"

job_applications = Table(
    "job_applications",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("company", String, nullable=False),
    Column("position", String, nullable=False),
    Column("status", Enum(StatusEnum), nullable=False),
    Column("date_applied", Date, nullable=True),
    Column("notes", String, nullable=True),
)
