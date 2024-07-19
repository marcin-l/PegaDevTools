PDT.isTracerEnabled().then(isTracerEnabled => {
	if(!isTracerEnabled) {
        console.log("PDT tracer disabled");
    } else {
        console.log("PDT tracer.js");
        messageServiceWorker("registerTracer"); //register with Service Worker
        PDT.alterFavicon();

        PDT.settings().then(settings => {
            if(settings?.tracer?.restorePosition) {
                // restore window state on load
                restoreWindowState();
            }
        });
    }
});

// FEATURE: save and restore window size and position
let windowState;

function restoreWindowState() {
    browser.storage.local.get('windowStateTracer', (data) => {
        if (data.windowStateTracer) {
            let { width, height, left, top } = data.windowStateTracer;

            // apply the window size and position
            window.resizeTo(width, height);
            window.moveTo(left, top);

            windowState = data.windowStateTracer;
            console.log('PDT window state restored:', windowState);			
        } else {
            console.log('PDT window state could not be restored');		
        }
    });

    setTimeout(addScreenChangeListeners, 1000);
}


function saveWindowState() {
    const newWindowState = {
        height: window.outerHeight,
        left: window.screenX,
        top: window.screenY,
        width: window.outerWidth,
    };
    if(windowState != newWindowState) {
        browser.storage.local.set({ windowStateTracer: newWindowState }, () => {
            console.log('PDT window state saved:', [windowState, newWindowState]);
        });
        windowState = newWindowState;
    }
}


// event listeners to save window state on resize and move
function addScreenChangeListeners() {
    window.addEventListener('resize', saveWindowState);
    window.addEventListener('move', saveWindowState);
    console.log('PDT window state listeners added');
}
