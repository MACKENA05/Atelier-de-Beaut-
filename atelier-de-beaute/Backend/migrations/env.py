import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from models import db

# Add the project root to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Import your app and db
from app import create_app
from models import db  # <-- your models must be imported here!

# Alembic config
config = context.config
fileConfig(config.config_file_name)

# ✅ Set up logger
import logging
logger = logging.getLogger('alembic.env')

target_metadata = db.metadata

# ✅ Optional: Skip autogenerate if no schema changes
def process_revision_directives(context, revision, directives):
    if getattr(config.cmd_opts, 'autogenerate', False):
        script = directives[0]
        if script.upgrade_ops.is_empty():
            logger.info("No schema changes detected.")
            directives[:] = []

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    app = create_app()
    with app.app_context():
        connectable = db.engine

        with connectable.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                process_revision_directives=process_revision_directives,
                compare_type=True,
            )

            with context.begin_transaction():
                context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
