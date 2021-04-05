defmodule CappBackend.Router do
  use Plug.Router
  import Plug.Conn


  plug :match
  plug :dispatch

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json, Absinthe.Plug.Parser],
    json_decoder: Jason

  forward "/api/v1",
    to: Absinthe.Plug,
    init_opts: [schema: CappBackend.APISchema]

  match _ do
    conn
    |> CappBackend.Errors.send(404, 1, "not found")
  end
end
