defmodule CappBackendWeb.Router do
  use CappBackendWeb, :router

  pipeline :graphql do
    plug CappBackend.Context
  end

  scope "/v1" do
    pipe_through :graphql

    forward "/graphql", Absinthe.Plug,
            schema: CappBackend.Schema
  end

  forward "/playground", Absinthe.Plug.GraphiQL,
    schema: CappBackend.Schema,
    socket: CappBackendWeb.UserSocket,
    interface: :playground

  get "/", CappBackendWeb.APIController, :show
end
