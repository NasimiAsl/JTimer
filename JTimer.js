/**************************************************** 
version            : 0.5.0.1325                           
last change date   : 12/31/2012                             
auther             : R.Nasimi Asl   
browsers           : independent
*****************************************************/

/* documentation

timer action struct = {key='default',interval=100,start=function(action){},tick=function(index,action){},delay=100,indexer=0}

/// sample //////////////////////////////////////////////////////////////////
timers.set({
    delay: 1,
    interval: 20,
    key: 'move',
    tick: function (index, action) {
    }
});

timers.do('move');
///////////////////////////////////////////////////////////////////////////////
            

*/

var timers = { version: '1.0.0.2', enable: false, actions: new Array(), baseInterval: 20, indexer: 0 };

function isDefined(o) {
    return o != null || o != undefined;
}

timers.doActionByName = function (actionName) {

    if (timers.actions[actionName] == null) return;

    if (!isDefined(timers.actions[actionName].started)) timers.actions[actionName].started = false;
    if (timers.actions[actionName].started == false)
        timers.doAction(timers.actions[actionName]);
};

timers.doAction = function (action) {


    if (!isDefined(action.interval)) action.interval = 100;
    if (!isDefined(action.delay)) action.delay = 100;
    if (!isDefined(action.started)) action.started = false;


    if (timers.indexer * timers.baseInterval % action.interval == 0) {
        var index = timers.indexer * timers.baseInterval / action.interval;

        if (action.delay <= index * action.interval && isDefined(action.tick)) {

            if (!action.started && isDefined(action.start)) {
                action.start(action); action.started = true;
            }

            action.tick(index - action.delay, action);
        }
    }
};

timers.doActions = function () {

    if (timers.actions == new Array())
        timers.enable = false;

    else timers.enable = true;
    timers.indexer++;

    if (timers.enable) {
        setTimeout('timers.doActions()', timers.baseInterval);

        for (var key in timers.actions) {
            try { timers.doAction(timers.actions[key]); } catch (e) { }
        }
    }
};

timers.remove = function (action) {
    timers.removeKey(action.key);
};

timers.removeKey = function (key) { 
    timers.actions[key] = null; 
};

timers.set = function (option) {

    if (!isDefined(option.key)) opt.key = "default";

    timers.actions[option.key] = option;

    if (!timers.enable) timers.doActions();
};
