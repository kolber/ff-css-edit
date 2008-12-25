default_run_options[:pty] = true

set :application, "ff-css-edit"
set :deploy_to, "/var/www/#{application}"

set :scm, :git
set :repository,  "git://github.com/kolber/ff-css-edit.git"

set :slice_url, "67.207.145.126"

role :app, slice_url
role :web, slice_url
role :db,  slice_url, :primary => true

namespace :deploy do
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
end