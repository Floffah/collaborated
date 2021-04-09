defmodule CappBackendWeb.Router do
  use CappBackendWeb, :router

  forward "/v1/graphql", Absinthe.Plug,
    schema: CappBackend.API.Schema

  forward "/playground", Absinthe.Plug.GraphiQL,
    schema: CappBackend.API.Schema,
    socket: CappBackendWeb.UserSocket,
    interface: :playground

  get "/", CappBackendWeb.APIController, :show
end
