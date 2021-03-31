defmodule CappBackend.Router do
  use Plug.Router
  import Plug.Conn

  alias CappBackend.StaticPlug

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json, Absinthe.Plug.Parser],
    json_decoder: Jason

  plug Absinthe.Plug,
       schema: CappBackend.APISchema,
       at: "/api/v1"

  plug :match
  plug :dispatch

  match _ do
    IO.puts(conn.request_path)
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(404, "{\"error\": \"Not found\"}")
  end
end
