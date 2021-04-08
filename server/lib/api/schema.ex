defmodule CappBackend.API.Schema do
  use Absinthe.Schema

  query do
    field :ping, :string do
      resolve fn _, _ ->
        {:ok, "pong"}
      end
    end
  end
end
