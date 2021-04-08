defmodule CappBackend.Router do
  use Plug.Router
  # import Plug.Conn

  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json, Absinthe.Plug.Parser],
    json_decoder: Jason

  forward "/v1",
    to: Absinthe.Plug,
    init_opts: [schema: CappBackend.APISchema]

  forward "/graphiql",
    to: Absinthe.Plug.GraphiQL,
    init_opts: [schema: CappBackend.APISchema, interface: :playground]

  plug :match
  plug :dispatch

  match _ do
    conn
    |> CappBackend.Errors.send(404, 1, "not found")
  end
end
