require "minigems"
require "sinatra"
require "dm-core"
require "dm-timestamps"
require "digest/sha1"
require "cgi"
require "diff/lcs"

DataMapper.setup(:default, "sqlite3://#{Dir.pwd}/ffcssedit.sqlite3")

class User
  include DataMapper::Resource

  property :id,         Integer, :serial => true    # primary serial key
  property :name,       String
  property :email,      String
  property :hash,       String
  property :css,        Text
  property :created_at, DateTime
  property :updated_at, DateTime

end

DataMapper.auto_upgrade!

#default

get '/' do
  erb :not_found
end

# new
get '/newnew' do
  erb :new, :layout => false
end

post '/newnew' do
  @user = User.new(:name => params[:user_name], :email => params[:user_email], :hash => Digest::SHA1.hexdigest([Time.now, rand].join), :css => "/*%0A%0A%20%20Colours/typography%0A%0A*/%0A%0Abody%20%7B%20font-family%3A%20helvetica%2C%20arial%2C%20sans-serif%3B%20font-size%3A%2062.5%25%3B%20color%3A%20%23000%3B%20line-height%3A%201.35em%3B%20%7D%0A%0Ah4%20%7B%20color%3A%20%23B2B2B2%3B%20%7D%0A%0Ap%2C%0Aa%20%7B%20color%3A%20%23666%3B%20%7D%0A%0Ap%20a%2C%0Ap%20span%20%7B%20font-size%3A%201.0em%3B%20color%3A%20%23666%3B%20%7D%0A%0Ah1%2C%20%0Ah2%2C%20%0Ah3%20%7B%20font-size%3A%201.4em%3B%20line-height%3A%201.6em%3B%20%7D%0A%0Ah1%20a%20%7B%20color%3A%20inherit%3B%20text-decoration%3A%20none%3B%20font-weight%3A%20bold%3B%20%7D%0A%0Ah3%2C%0Ah3%20a%20%7B%20font-weight%3A%20normal%3B%20color%3A%20inherit%3B%20%7D%0A%0Ah4%2C%0Ap%2C%20%0Alabel%2C%0Ainput%20%7B%20font-size%3A%201.2em%3B%20line-height%3A%201.6em%3B%20font-weight%3A%20normal%3B%20padding%3A%200%3B%20%7D%0A%0Ap.year%20%7B%20color%3A%20%23B2B2B2%3B%20%7D%0A%0A%23search-projects-container%20label%20%7B%20color%3A%20%23666%3B%20%7D%0A%0A%23search-projects-container%20label%20span%20%7B%20color%3A%20%23B2B2B2%3B%20%7D%0A%0A%23search-projects-container%20input%20%7B%20background-color%3A%20%23D9D9D9%3B%20color%3A%20%23666%3B%20border%3A%200px%20solid%3B%20border-right%3A%201px%20solid%20%23B2B2B2%3B%20border-bottom%3A%201px%20solid%20%23B2B2B2%3B%20padding%3A%204px%3B%20line-height%3A%201em%3B%20%7D%0A%0A/*%20%0A%0A%20%20General/layout%0A%0A*/%0A%0Aa%20img%20%7B%20border%3A%200%3B%20%7D%0A%0A%23container%20%7B%20margin%3A%200%2040px%3B%20%7D%0A%0A%23header-information%20%7B%20padding-bottom%3A%2010px%3B%20border-bottom%3A%201px%20dashed%3B%20margin-bottom%3A%2020px%3B%20%7D%0A%0A%23header-information%20p%20%7B%20margin%3A%200%3B%20%7D%0A%0A%23search-projects-container%20%7B%20position%3A%20absolute%3B%20top%3A%2028px%3B%20left%3A%20240px%3B%20display%3A%20none%3B%20%7D%0A%0A%23search-projects-container%20span%20%7B%20margin%3A%200px%208px%3B%20%7D%0A%0A%23project-information%20%7B%20width%3A%20310px%3B%20float%3A%20left%3B%20%7D%0A%0A%23project-information%20p.year%2C%0A%23project-information%20p.month%20%7B%20clear%3A%20none%3B%20margin%3A%2015px%200px%200px%200px%3B%20*margin%3A%205px%200px%200px%200px%3B%20%7D%0A%0A%23project-information%20img%20%7B%20clear%3A%20both%3B%20display%3A%20block%3B%20margin%3A%200px%200px%208px%3B%20%7D%0A%0A%23project-information%20.project-description%2C%0A%23container%20%23project-information%20h4%20%7B%20padding%3A%200px%2020px%203px%200px%3B%20%7D%0A%0A%23project-images%20%7B%20float%3A%20left%3B%20width%3A%20550px%3B%20margin-bottom%3A%207px%3B%20%7D%0A%0A%23project-images%20img%20%7B%20float%3A%20left%3B%20margin%3A%206px%2012px%200px%200px%3B%20%7D%0A%0A%23copyright%20%7B%20clear%3A%20both%3B%20margin%3A%2010px%200px%200px%200px%3B%20border-top%3A%201px%20dashed%3B%20%7D%0A%0A%23copyright%20a%20%7B%20margin-left%3A%2010px%3B%20%7D%0A%0A/*%20%0A%0A%20%20Detailed%20layout%20%0A%0A*/%0A%0Ah1%20%7B%20margin%3A%200px%3B%20%7D%0A%0Ah2%20%7B%20width%3A%20170px%3B%20float%3A%20left%3B%20%7D%0A%0Adiv.projects%20%7B%20float%3A%20left%3B%20%7D%0A%0Ap.year%20%7B%20display%3A%20block%3B%20width%3A%2070px%3B%20clear%3A%20both%3B%20float%3A%20left%3B%20margin%3A%2014px%200px%200px%200px%3B%20*margin%3A%204px%200px%200px%200px%3B%20%7D%0A%0Adiv.projects-by-year%20%7B%20float%3A%20left%3B%20%7D%0A%0Ap.month%20%7B%20width%3A%2070px%3B%20clear%3A%20both%3B%20float%3A%20left%3B%20display%3A%20block%3B%20margin%3A%2014px%200px%200px%200px%3B%20*margin%3A%204px%200px%200px%200px%3B%20%7D%0A%0Adiv.project%20%7B%20float%3A%20left%3B%20width%3A%20550px%3B%20margin-bottom%3A%207px%3B%20%7D%0A%0Adiv.project%20img%20%7B%20float%3A%20left%3B%20margin%3A%206px%2012px%200px%200px%3B%20%7D%0A%0Adiv.project%20h3%2C%0Adiv.project%20h4%2C%0Adiv.project%20p%2C%0Adiv%23project-information%20h3%2C%0Adiv%23project-information%20h4%2C%0Adiv%23project-information%20p%20%7B%20margin%3A%200px%200px%203px%200px%3B%20padding%3A%200%3B%20%7D%0A%0Adiv.project%20h3%20%7B%20margin-top%3A%2010px%3B%20%7D%0A%0Ah4.empty-result%20%7B%20margin-top%3A%2011px%3B%20%7D%0A%0Adiv.project%20h4%20%7B%20display%3A%20block%3B%20height%3A%201.35em%3B%20overflow%3A%20hidden%3B%20%7D%0A%0Adiv.project%20h4%20span%20%7B%20display%3A%20block%3B%20%7D%0A%0Adiv%23project-information%20p%20%7B%20margin-bottom%3A%204px%3B%20%7D%0A")
  if @user.save
    redirect "/#{@user.hash}"
  else
    redirect '/newnew'
  end
end

# list
get '/listlist' do
  @users = User.all
  if @users
    erb :list
  else
    erb :not_found
  end
end

# show
post '/:hash/save-css' do
  @user = User.first(:hash => params[:hash])
  if @user
    @user.attributes = { :css => CGI.escape(params[:customcss]) }
    @user.save
    "complete"
  else
    "fail"
  end
end

get '/:hash/projects/*' do
  @user = User.first(:hash => params[:hash])
  if @user
    erb :project
  else
    erb :not_found
  end
end

get '/:hash' do
  @user = User.first(:hash => params[:hash])
  if @user
    erb :index
  else
    erb :not_found
  end
end

get '/stylesheets/:hash/application-custom.css' do
  @user = User.first(:hash => params[:hash])
  if @user
    content_type 'text/css', :charset => 'utf-8'
    erb :application_custom, :layout => false
  end
end