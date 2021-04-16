defmodule CappBackendWeb.APIController do
  use CappBackendWeb, :controller

  def show(conn, _) do
    json(conn, %{
      common: %{
        playground: "/playground"
      },
      v1: %{
        api: "/v1/graphql",
        socket: "/v1/socket/websocket"
      }
    })
  end
end
