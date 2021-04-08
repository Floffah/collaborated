defmodule CappBackend.Errors do
  import Plug.Conn

  def send(conn, status, id, msg) do
    send_resp(conn, status, Jason.encode!(
      %{
        error: msg,
        status: status,
        capp_error: id
      }
    ))
  end
end
