defmodule CappBackendWeb.UserSocket do
  use Phoenix.Socket

  use Absinthe.Phoenix.Socket,
    schema: CappBackend.Schema

  @impl true
  def connect(_params, socket) do
    {:ok, socket}
  end

  @impl true
  def id(_), do: nil
end
