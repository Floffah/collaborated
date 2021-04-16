defmodule CappBackend.Schema do
  use Absinthe.Schema

  import_types CappBackend.Schema.UserTypes

  query do

    field :ping, :string do
      resolve fn _, _ ->
        {:ok, "pong"}
      end
    end

    import_fields :auth_queries

  end
end
