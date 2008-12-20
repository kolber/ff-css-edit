require "rubygems"
require "sinatra"
require "dm-core"
require "dm-timestamps"
require "digest"
require "cgi"

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


# new
get '/newnew' do
  erb :new
end

post '/newnew' do
  @user = User.new(:name => params[:user_name], :email => params[:user_email], :hash => Digest::SHA1.hexdigest([Time.now, rand].join), :css => "%2F%2A%0A%0A++Colours%2Ftypography%0A%0A%2A%2F%0A%0Abody+%7B+font-family%3A+helvetica%2C+arial%2C+sans-serif%3B+font-size%3A+150%25%3B+color%3A+%23000%3B+line-height%3A+1.35em%3B+%7D%0A%0Ah4+%7B+color%3A+%23B2B2B2%3B+%7D%0A%0Ap%2C%0Aa+%7B+color%3A+%23fff%3B+%7D%0A%0Ap+a%2C%0Ap+span+%7B+font-size%3A+1.0em%3B+color%3A+%23666%3B+%7D%0A%0Ah1%2C+%0Ah2%2C+%0Ah3+%7B+font-size%3A+1.4em%3B+line-height%3A+1.6em%3B+%7D%0A%0Ah1+a+%7B+color%3A+inherit%3B+text-decoration%3A+none%3B+font-weight%3A+bold%3B+%7D%0A%0Ah3%2C%0Ah3+a+%7B+font-weight%3A+normal%3B+color%3A+inherit%3B+%7D%0A%0Ah4%2C%0Ap%2C+%0Alabel%2C%0Ainput+%7B+font-size%3A+1.2em%3B+line-height%3A+1.6em%3B+font-weight%3A+normal%3B+padding%3A+0%3B+%7D%0A%0Ap.year+%7B+color%3A+%23B2B2B2%3B+%7D%0A%0A%23search-projects-container+label+%7B+color%3A+%23666%3B+%7D%0A%0A%23search-projects-container+label+span+%7B+color%3A+%23B2B2B2%3B+%7D%0A%0A%23search-projects-container+input+%7B+background-color%3A+%23D9D9D9%3B+color%3A+%23666%3B+border%3A+0px+solid%3B+border-right%3A+1px+solid+%23B2B2B2%3B+border-bottom%3A+1px+solid+%23B2B2B2%3B+padding%3A+4px%3B+line-height%3A+1em%3B+%7D%0A%0A%2F%2A+%0A%0A++General%2Flayout%0A%0A%2A%2F%0A%0Aa+img+%7B+border%3A+0%3B+%7D%0A%0A%23container+%7B+margin%3A+0+40px%3B+%7D%0A%0A%23header-information+%7B+padding-bottom%3A+10px%3B+border-bottom%3A+1px+dashed%3B+margin-bottom%3A+20px%3B+%7D%0A%0A%23header-information+p+%7B+margin%3A+0%3B+%7D%0A%0A%23search-projects-container+%7B+position%3A+absolute%3B+top%3A+28px%3B+left%3A+240px%3B+display%3A+none%3B+%7D%0A%0A%23search-projects-container+span+%7B+margin%3A+0px+8px%3B+%7D%0A%0A%23project-information+%7B+width%3A+310px%3B+float%3A+left%3B+%7D%0A%0A%23project-information+p.year%2C%0A%23project-information+p.month+%7B+clear%3A+none%3B+margin%3A+15px+0px+0px+0px%3B+%2Amargin%3A+5px+0px+0px+0px%3B+%7D%0A%0A%23project-information+img+%7B+clear%3A+both%3B+display%3A+block%3B+margin%3A+0px+0px+8px%3B+%7D%0A%0A%23project-information+.project-description%2C%0A%23container+%23project-information+h4+%7B+padding%3A+0px+20px+3px+0px%3B+%7D%0A%0A%23project-images+%7B+float%3A+left%3B+width%3A+550px%3B+margin-bottom%3A+7px%3B+%7D%0A%0A%23project-images+img+%7B+float%3A+left%3B+margin%3A+6px+12px+0px+0px%3B+%7D%0A%0A%23copyright+%7B+clear%3A+both%3B+margin%3A+10px+0px+0px+0px%3B+border-top%3A+1px+dashed%3B+%7D%0A%0A%23copyright+a+%7B+margin-left%3A+10px%3B+%7D%0A%0A%2F%2A+%0A%0A++Detailed+layout+%0A%0A%2A%2F%0A%0Ah1+%7B+margin%3A+0px%3B+%7D%0A%0Ah2+%7B+width%3A+170px%3B+float%3A+left%3B+%7D%0A%0Adiv.projects+%7B+float%3A+left%3B+%7D%0A%0Ap.year+%7B+display%3A+block%3B+width%3A+70px%3B+clear%3A+both%3B+float%3A+left%3B+margin%3A+14px+0px+0px+0px%3B+%2Amargin%3A+4px+0px+0px+0px%3B+%7D%0A%0Adiv.projects-by-year+%7B+float%3A+left%3B+%7D%0A%0Ap.month+%7B+width%3A+70px%3B+clear%3A+both%3B+float%3A+left%3B+display%3A+block%3B+margin%3A+14px+0px+0px+0px%3B+%2Amargin%3A+4px+0px+0px+0px%3B+%7D%0A%0Adiv.project+%7B+float%3A+left%3B+width%3A+750px%3B+margin-bottom%3A+7px%3B+%7D%0A%0Adiv.project+img+%7B+float%3A+left%3B+margin%3A+6px+12px+0px+0px%3B+%7D%0A%0Adiv.project+h3%2C%0Adiv.project+h4%2C%0Adiv.project+p%2C%0Adiv%23project-information+h3%2C%0Adiv%23project-information+h4%2C%0Adiv%23project-information+p+%7B+margin%3A+0px+0px+3px+0px%3B+padding%3A+0%3B+%7D%0A%0Adiv.project+h3+%7B+margin-top%3A+10px%3B+%7D%0A%0Ah4.empty-result+%7B+margin-top%3A+11px%3B+%7D%0A%0Adiv.project+h4+%7B+display%3A+block%3B+height%3A+1.35em%3B+overflow%3A+hidden%3B+%7D%0A%0Adiv.project+h4+span+%7B+display%3A+block%3B+%7D%0A%0Adiv%23project-information+p+%7B+margin-bottom%3A+4px%3B+%7D%0A")
  if @user.save
    redirect "/#{@user.hash}"
  else
    redirect '/newnew'
  end
end

# doesn't exist
get '/not-found' do
  "<h1>Sorry, that user doesn't exist</h1>"
end

# show
get '/:hash' do
  @user = User.first(:hash => params[:hash])
  if @user
    erb :index
  else
    redirect "/not-found"
  end
end

get '/:hash/projects/*' do
  @user = User.first(:hash => params[:hash])
  if @user
    erb :project
  else
    redirect "/not-found"
  end
end