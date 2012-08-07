var assert = require("assert")
require("../pia.sync")


describe('pia.Sync', function(){
    
  it("should be Synchronous processing", function(done){
    var list = []; 

    var sync = new pia.Sync();
    sync.next(function(_sync){
      setTimeout(function(){
        list.push(1);
        _sync.finish();
      },200)
    })

    sync.next(function(_sync){
      setTimeout(function(){
        list.push(2);
        _sync.finish();
      },100)
    })

    sync.next(function(_sync){
      assert.equal(1, list[0]);
      assert.equal(2, list[1]);
      assert.equal(2, list.length);
      done();
    })
  });

  it("should be Synchronous processing", function(done){
    var flag = false; 
    var list = [];
    var sync = new pia.Sync();
     
    sync.next(function(){
      flag = false;
      setTimeout(function(){
        list.push(1);
        flag = true;
      }, 200);
    }, function(_sync){ if(flag) _sync.finish() })

    sync.next(function(){
      flag = false;
      setTimeout(function(){
        list.push(2);
        flag = true;
      }, 100);
    }, function(_sync){ if(flag) _sync.finish() })

    sync.next(function(_sync){
      assert.equal(1, list[0]);
      assert.equal(2, list[1]);
      assert.equal(2, list.length);
      done();
    })
  });

  it("should be Asynchronous processing", function(done){
    var list = []; 

    setTimeout(function(){
      list.push(1);
    },200)

    setTimeout(function(){
      list.push(2);
    },100)

    setTimeout(function(){
      assert.equal(2, list[0]);
      assert.equal(1, list[1]);
      assert.equal(2, list.length);
      done();
    },300)
  });
  
});



describe('pia.SyncQueue', function(){
  describe('new pia.SyncQueue()', function(){
    
    it('Property initial value should have been set correctly', function(){
      var queue = new pia.SyncQueue();
      assert.equal(0, queue.queue.length);
      assert.equal(null, queue.runningQueue);
    });

  });

  describe('.push()', function(){
    
    it('Property should have been set correctly', function(){
      var queue = new pia.SyncQueue();
      function func1(){return 1};
      function func2(){return 2};
      queue.push(func1);
      queue.push(func2);

      assert.equal(2, queue.queue.length);
      assert.equal(1, queue.queue[0].func());
      assert.equal(2, queue.queue[1].func());
    });

  });

  describe('.call()', function(){
    
    var queue       = null;
    var triggerFlag = false;

    before(function(){
      queue = new pia.SyncQueue();
      function func1(){return 1};
      function func2(){return 2};
      function trigger(){triggerFlag=true};
      queue.push(func1, trigger);
      queue.push(func2);
      queue.call();
    });

    it('Processing status should be running', function(){
      assert.equal(true, queue.queue[0].isRunning);
      assert.equal(null, queue.queue[1].isRunning);
    });

    it('Queue should be stacked', function(){
      assert.equal("func1", queue.runningQueue.func.name);
    });

    it('Trigger Event should be ran', function(){
      assert.equal(true, triggerFlag);
    });

  });
});
