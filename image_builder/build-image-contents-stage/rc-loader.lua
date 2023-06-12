-- If LuaRocks is installed, make sure that packages installed through it are
-- found (e.g. lgi). If LuaRocks is not installed, do nothing.
pcall(require, "luarocks.loader")

-- Needed for the DBus bridge to come alive
local awful = require('awful')

awesome.connect_signal('load-rc-lua', function()
    local awesomePath = '/root/.config/awesome/'
    dofile(awesomePath .. 'rc.lua')
    awful.spawn('touch ' .. awesomePath .. 'awesomeInitialized')
end)
