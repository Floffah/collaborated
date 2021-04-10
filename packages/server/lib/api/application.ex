defmodule CappBackend.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      CappBackend.Repo,
      CappBackendWeb.Telemetry,
      {Phoenix.PubSub, name: CappBackend.PubSub},
      CappBackendWeb.Endpoint,
      {Absinthe.Subscription, CappBackendWeb.Endpoint}
    ]

    opts = [strategy: :one_for_one, name: CappBackend.Supervisor]
    Supervisor.start_link(children, opts)
  end

  def config_change(changed, _new, removed) do
    CappBackendWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
