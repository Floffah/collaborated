defmodule CappBackendWeb.UserSocket do
  use Phoenix.Socket

  use Absinthe.Phoenix.Socket,
    schema: CappBackend.API.Schema

  @impl true
  def connect(_params, socket) do
    {:ok, socket}
  end

  @impl true
  def id(socket), do: socket.assigns.user_id
end
