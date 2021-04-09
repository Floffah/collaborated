defmodule CappBackendWeb do
  @moduledoc false

  def controller do
    quote do
      use Phoenix.Controller, namespace: CappBackendWeb

      import Plug.Conn
      alias CappBackendWeb.Router.Helpers, as: Routes
    end
  end

  def view do
    quote do
      import Phoenix.Controller,
        only: [get_flash: 1, get_flash: 2, view_module: 1, view_template: 1]
    end
  end

  def router do
    quote do
      use Phoenix.Router

      import Plug.Conn
      import Phoenix.Controller
    end
  end

  def channel do
    quote do
      use Phoenix.Channel
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
