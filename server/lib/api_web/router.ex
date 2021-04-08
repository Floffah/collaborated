defmodule CappBackendWeb.Router do
  use Phoenix.Router

  forward "/v1", Absinthe.Plug,
    schema: CappBackend.API.Schema

  forward "/playground", Absinthe.Plug.GraphiQL,
    schema: CappBackend.API.Schema,
    interface: :playground
end
