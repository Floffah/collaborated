defmodule CappBackend.Repo do
  use Ecto.Repo,
    otp_app: :capp,
    adapter: Ecto.Adapters.Postgres
end
