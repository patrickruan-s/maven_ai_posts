class OpenAiClient
    def initialize
        @client = OpenAI::Client.new(
            access_token: ENV['OPENAI_ACCESS_TOKEN'],
            uri_base: "https://api.openai.com/v1"
        )
    end

    def generate_response(description)
        response = @client.chat(
            parameters: {
                model: 'gpt-5-nano',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that generates blog post titles and content. You MUST return your response as a valid JSON object with exactly these two fields: "title" and "content". Do not include any other text outside the JSON object.' },
                    { role: 'user', content: "Generate a blog post based on this description: #{description}" }
                ]
            }
        )
        JSON.parse(response.dig('choices', 0, 'message', 'content'))
    end

    def generate_image(prompt)
        begin
            styles = [
            "Cartoony Pixar Style"
            ]
            image_data = nil
            random_style = styles.sample
            image_prompt = "#{random_style}: #{prompt}"
            # Try DALL-E 3 first (newer, better quality)
            begin
            Rails.logger.info "Attempting DALL-E 3 image generation..."
            image_response = @client.images.generate(
                parameters: {
                prompt: image_prompt,
                size: "1024x1024",
                model: "dall-e-3",
                quality: "standard",
                n: 1
                }
            )
            rescue => e
            # DALL-E 3 failed, try DALL-E 2
            Rails.logger.warn "DALL-E 3 failed: #{e.message}. Trying DALL-E 2..."
            image_response = @client.images.generate(
                parameters: {
                prompt: image_prompt,
                size: "1024x1024",
                model: "dall-e-2",
                n: 1
                }
            )
            end

            if image_response.dig('data', 0, 'url')
            image_data = {
                url: image_response.dig('data', 0, 'url'),
                alt: prompt,
                prompt: image_prompt
            }
            Rails.logger.info "Image generated successfully!"
            end
        rescue => image_error
            # Log the error but don't fail the entire request
            Rails.logger.error "DALL-E image generation failed: #{image_error.class} - #{image_error.message}"
            image_error_message = "Image generation unavailable. Please check OpenAI billing and DALL-E access."
        end
      image_data
    end
end
