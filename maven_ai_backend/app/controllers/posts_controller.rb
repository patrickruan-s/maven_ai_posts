class PostsController < ApplicationController
  before_action :set_post, only: %i[ show update destroy ]

  # GET /posts
  def index
    @posts = Post.all

    render json: @posts.map { |post| post_with_image(post) }
  end

  # GET /posts/1
  def show
    render json: post_with_image(@post)
  end

  # POST /posts
  def create
    @post = Post.new(post_params)

    if params[:post][:image].present?
      @post.image.attach(params[:post][:image])
    end

    if @post.save
      render json: post_with_image(@post), status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    if params[:post][:image].present?
      @post.image.attach(params[:post][:image])
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

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:title, :content, :scheduled)
    end

    def post_with_image(post)
      post.as_json.merge(
        image_url: post.image.attached? ? url_for(post.image) : nil
      )
    end
end
