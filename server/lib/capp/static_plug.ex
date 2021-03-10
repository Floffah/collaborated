defmodule CappBackend.StaticPlug do
  use Plug.Builder

  plug Plug.Static,
       at: "/",
       from: "../packages/web/build"
end
