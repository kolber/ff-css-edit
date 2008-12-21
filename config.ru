require "minigems"
require "sinatra"
require 'ff-css-edit'

root_dir = File.dirname(__FILE__)

Sinatra::Application.default_options.merge!(
  :views    => File.join(root_dir, 'views'),
  :app_file => File.join(root_dir, 'ff-css-edit.rb'),
  :run => false,
  :env => ENV['RACK_ENV'].to_sym
)

log = File.new("./log/sinatra.log", "a")
STDOUT.reopen(log)
STDERR.reopen(log)

run Sinatra.application