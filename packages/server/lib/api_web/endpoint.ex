defmodule CappBackendWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :api
  use Absinthe.Phoenix.Endpoint,
    schema: CappBackend.Schema

  if code_reloading? do
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :api
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Jason

  socket "/v1/socket", CappBackendWeb.UserSocket,
    websocket: true,
    longpoll: false

  # plug Plug.MethodOverride
  plug Plug.Head
  plug CappBackendWeb.Router
end
