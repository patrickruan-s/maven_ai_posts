class AddExternalImageUrlToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :external_image_url, :string
  end
end
