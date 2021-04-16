defmodule CappBackend.Schema.UserTypes do
  use Absinthe.Schema.Notation

  object :auth_details do
    @desc "The main access code for the current session"
    field :access, :string
    @desc "The refresh code that should be used to generate a new access code after the current session has ended"
    field :refresh, :string
  end

  object :auth_queries do
    @desc "Authenticate with a email and password"
    field :authenticate, :auth_details do
      arg :email, non_null(:string)
      arg :password, non_null(:string)

      resolve &CappBackend.Resolvers.User.authenticate/3
    end
  end
end
