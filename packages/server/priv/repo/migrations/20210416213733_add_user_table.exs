defmodule CappBackend.Repo.Migrations.AddUserTable do
  use Ecto.Migration

  def change do
    create table("user") do
      add :username, :string
      add :email, :string
      add :password, :string

      add :created, :utc_datetime

      add :access, :string
      add :refresh, :string
    end
  end
end
