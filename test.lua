scriptId = 'com.thalmic.examples.outputeverything'
scriptTitle = "Output Everything"
scriptDetailsUrl = "" -- We don't have this until it's submitted to the Myo Market

function onPoseEdge(pose, edge)
	if(pose == "fist" and edge == "on") then
		myo.mouse("left","down")
	end
	if(pose == "fist" and edge == "off") then
		myo.mouse("left","up")
	end
    myo.debug("onPoseEdge: " .. pose .. ", " .. edge)
end

function onPeriodic()
end

function onLock()
	myo.controlMouse(true)
end

function onForegroundWindowChange(app, title)
    myo.debug("onForegroundWindowChange: " .. app .. ", " .. title)
    return true
end

function activeAppName()
    return "Output Everything"
end

function onActiveChange(isActive)
    myo.debug("onActiveChange")
end