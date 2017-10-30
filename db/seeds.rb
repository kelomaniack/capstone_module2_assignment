# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
City.destroy_all
City.create!([{name: "Thessaloniki"}])
City.create!([{name: "Athens"}])
p "Created #{City.count} cities"
p "Created #{State.count} states"


