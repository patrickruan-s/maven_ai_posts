require 'ostruct'
require 'unsplash'

Unsplash.configure do |config|
  config.application_access_key = ENV.fetch('UNSPLASH_ACCESS_KEY', nil)
  config.application_secret = ENV.fetch('UNSPLASH_SECRET_KEY', nil)
  config.application_redirect_uri = "urn:ietf:wg:oauth:2.0:oob"
  config.utm_source = "maven_ai_posts"
end
