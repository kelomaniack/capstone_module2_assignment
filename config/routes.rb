Rails.application.routes.draw do

  scope :api, defaults: {format: :json} do
    resources :cities, except: [:new, :edit]
  end

  # get "/", :to => redirect("https://module2-cptwa-p.herokuapp.com")

  get '/ui' => 'ui#index'
  get '/ui#' => 'ui#index'
  root "ui#index"
end
