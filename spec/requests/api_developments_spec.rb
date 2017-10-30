require 'rails_helper'

RSpec.describe "ApiDevelopments", type: :request do

  def parsed_body
    JSON.parse(response.body)
  end

    describe "RDBMS-backed" do
      before(:each) {City.delete_all}
      after(:each) {City.delete_all}

      it "create RDBMS-backed model" do
        object=City.create(:name => "test")
        expect(City.find(object.id).name).to eq("test")
      end
      it "expose RDBMS-backed API resource" do
        object=City.create(:name=>"test")
        expect(cities_path).to eq("/api/cities")
        get cities_path(object.id)
        expect(response).to have_http_status(:ok)
        expect(parsed_body.first["name"]).to eq("test")
      end
    end

end
