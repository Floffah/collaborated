defmodule CappBackend.Entities.User do
  use Ecto.Schema

  import Ecto.Changeset

  schema "user" do
    field :username, :string
    field :email, :string
    field :password, :string

    field :created, :utc_datetime

    field :access, :string
    field :refresh, :string
  end

  def changeset(user, params \\ %{}) do
    user
    |> cast(params, [:username, :email, :password])
    |> validate_required([:username, :email, :password])
    |> validate_format(:email, ~r/@/)
  end
end
