class PostsController < ApplicationController
  before_action :set_post, only: %i[ show update destroy ]

  # GET /posts
  def index
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 9).to_i

    total_count = Post.count
    total_pages = (total_count.to_f / per_page).ceil

    @posts = Post.with_attached_images
                 .order(created_at: :desc)
                 .limit(per_page)
                 .offset((page - 1) * per_page)

    render json: {
      posts: @posts.map { |post| post_with_images(post) },
      meta: {
        current_page: page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end

  # GET /posts/1
  def show
    render json: post_with_images(@post)
  end

  # POST /posts
  def create
    @post = Post.new(post_params)
    if params[:post][:images].present?
      @post.images.attach(params[:post][:images])
    elsif params[:post][:external_image_url].present?
      # Download and attach image from external URL (e.g., DALL-E)
      attach_external_image(@post, params[:post][:external_image_url])
    end

    if @post.save
      render json: post_with_images(@post), status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    if params[:post][:images].present?
      @post.images.attach(params[:post][:images])
    elsif params[:post][:external_image_url].present?
      # Download and attach image from external URL (e.g., DALL-E)
      attach_external_image(@post, params[:post][:external_image_url])
    end

    if @post.update(post_params)
      render json: post_with_image(@post)
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    @post.destroy!
  end

  # POST /posts/generate
  def generate
    description = params[:description]

    if description.blank?
      render json: { error: 'Description is required' }, status: :bad_request
      return
    end

    # Rate limiting: Only allow one request every 10 seconds per IP
    cache_key = "generate_rate_limit:#{request.remote_ip}"
    last_request_time = Rails.cache.read(cache_key)

    if last_request_time && (Time.now - last_request_time) < 10.seconds
      wait_time = (10 - (Time.now - last_request_time)).ceil
      render json: { error: "Please wait #{wait_time} seconds before generating another post" }, status: :too_many_requests
      return
    end

    Rails.cache.write(cache_key, Time.now, expires_in: 10.seconds)

    begin
      # Generate title and content using OpenAI
      client = OpenAI::Client.new

      response = client.chat(
        parameters: {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates blog post titles and content. Return your response in JSON format with "title" and "content" fields.' },
            { role: 'user', content: "Generate a blog post based on this description: #{description}" }
          ],
          response_format: { type: 'json_object' }
        }
      )

      generated_data = JSON.parse(response.dig('choices', 0, 'message', 'content'))

      # Try to generate image using OpenAI DALL-E
      image_data = nil
      image_error_message = nil

      begin
        styles = [
          "Modern, minimalist illustration",
          "Vibrant, colorful digital art",
          "Professional photography style",
          "Abstract artistic representation",
          "Watercolor painting style",
          "Cinematic, dramatic lighting",
          "Flat design, geometric shapes",
          "3D rendered scene"
        ]

        random_style = styles.sample
        image_prompt = "#{random_style}: #{generated_data['title']}"

        # Try DALL-E 3 first (newer, better quality)
        begin
          Rails.logger.info "Attempting DALL-E 3 image generation..."
          image_response = client.images.generate(
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
          image_response = client.images.generate(
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
            alt: generated_data['title'],
            prompt: image_prompt
          }
          Rails.logger.info "Image generated successfully!"
        end
      rescue => image_error
        # Log the error but don't fail the entire request
        Rails.logger.error "DALL-E image generation failed: #{image_error.class} - #{image_error.message}"
        image_error_message = "Image generation unavailable. Please check OpenAI billing and DALL-E access."
      end

      render json: {
        title: generated_data['title'],
        content: generated_data['content'],
        image: image_data,
        image_error: image_error_message
      }
    rescue => e
      Rails.logger.error "Error generating post: #{e.class} - #{e.message}"
      Rails.logger.error e.backtrace.first(5).join("\n")
      render json: { error: "Failed to generate post: #{e.message}" }, status: :internal_server_error
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:title, :content, :scheduled, :external_image_url, :images)
    end

    def post_with_images(post)
      post.as_json.merge(
        image_urls: post.images.attached? ? post.images.map {|image| url_for(image)} : nil
      )
    end

    def attach_external_image(post, image_url)
      require 'open-uri'

      begin
        # Download image from URL
        downloaded_image = URI.open(image_url)

        # Extract filename from URL or use a default
        filename = File.basename(URI.parse(image_url).path)
        filename = "ai-generated-#{Time.now.to_i}.png" if filename.blank? || filename == '/'

        # Attach to post
        post.images.attach(
          io: downloaded_image,
          filename: filename,
          content_type: downloaded_image.content_type || 'image/png'
        )
      rescue => e
        Rails.logger.error "Failed to download external image: #{e.message}"
        # Fallback: keep the external_image_url if download fails
      end
    end
end
