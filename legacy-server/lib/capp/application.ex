defmodule CappBackend.Application do
  @moduledoc false

  use Application
  require Logger

  @impl true
  def start(_type, _args) do
    children = [
      {CappBackend.Repo, []},
      {Plug.Cowboy, scheme: :http, plug: CappBackend.Router, options: [port: 80]}
    ]

    opts = [strategy: :one_for_one, name: CappBackend.Supervisor]

    Logger.info("Starting server...");

    Supervisor.start_link(children, opts)
  end
end
