defmodule CappBackend.APISchema do
  use Absinthe.Schema

  query do
    @desc "hi"
    field :ping, :string do
      resolve fn _, _ ->
        {:ok, "pong"}
      end
    end
  end

end
