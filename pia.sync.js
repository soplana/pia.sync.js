/**************************************************
* pia.sync  v0.0.1
**************************************************/
if(!!require){
  require("./pia.js");
}

pia.SyncData = function(func, triggerEvent){
  this.func         = func;
  this.triggerEvent = !!triggerEvent ? triggerEvent : null;
  this.isFinished   = false;
  this.isRunning    = null;
}

pia.SyncQueue = function(){
  this.queue = [];
  this.runningQueue = null;
};

pia.SyncQueue.prototype = {
  push : function(func, triggerEvent){
    this.queue.push(new pia.SyncData(func, triggerEvent));
  },

  call : function(){
    var queueData = this.queue.filter(function(_queueData){
      if(_queueData.isFinished == false) return _queueData;
    })[0];
    if(!queueData) return false;

    if(queueData.isRunning == null){
      queueData.isRunning = true;
      this.runningQueue   = queueData;
      queueData.func(this);
    };

    if(queueData.triggerEvent != null) queueData.triggerEvent(this);

    return true;
  },

  get : function(index){
    return this.queue[index];
  },

  finish : function(){
    this.runningQueue.isFinished = true;
    this.runningQueue.isRunning  = false;
  }
};

pia.Sync = function(){
  this.queue    = new pia.SyncQueue();
  this.interval = null;
};

pia.Sync.prototype = {
  next : function(func, triggerEvent){
    this.queue.push(func, triggerEvent);
    this.run();
    return this;
  },

  run : function(){
    if(this.interval != null) return null;
    
    var self = this;
    this.interval = setInterval(function(){
      if(!self.queue.call()){
        clearInterval(self.interval); 
        self.queue = new pia.SyncQueue();
      };
    }, 100);
  }
};
