from flask import Flask
from flask_migrate import Migrate
from extensions import db
from app import create_app
import click

app = create_app()
migrate = Migrate(app, db)

@app.cli.command("db_migrate")
@click.argument("message")
def db_migrate(message):
    """Run database migration with message."""
    from flask_migrate import upgrade, migrate, init
    import os

    if not os.path.exists('migrations'):
        init()
    migrate(message=message)
    upgrade()

if __name__ == "__main__":
    app.run()
