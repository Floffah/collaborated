defmodule CappBackend.Router do
  use Plug.Router

  alias CappBackend.StaticPlug

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json, Absinthe.Plug.Parser],
    json_decoder: Jason

  plug StaticPlug

  plug Absinthe.Plug,
       schema: CappBackend.APISchema,
       at: "/api/v1"

  plug :match
  plug :dispatch

  match _ do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(404, "{\"error\": \"Not found\"}")
  end
end
