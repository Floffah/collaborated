defmodule CappBackend.Resolvers.User do
  def authenticate(_parent, _args, _resolution) do
    {:ok, %{access: "abc", refresh: "abcd"}}
  end
end
