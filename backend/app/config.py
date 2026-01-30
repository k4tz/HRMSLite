from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    app_name: str = "HRMS Lite API"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS (comma-separated list of allowed origins)
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # MySQL
    mysql_host: str = Field(alias="MYSQLHOST")
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "hrmslite"
    mysql_url: str = Field(alias="MYSQL_URL")

    @property
    def database_url(self) -> str:
        if self.mysql_url:
            return self.mysql_url
        else:
            return (
                f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}"
                f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_database}"
            )


settings = Settings()
