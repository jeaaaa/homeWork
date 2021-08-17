const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

console.log(`Master ${process.pid} is running`);

cluster.schedulingPolicy = cluster.SCHED_RR;

cluster.setupMaster({
    exec: 'worker.js',
    // silent: true,
});

// Fork workers.
for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
}

cluster.on('fork', worker => {
    worker.on('message', data => {
        // Receive by the worker
        console.log(`${worker.process.pid} master message: `, data);
    });
});

// Worker is listening
cluster.on('listening', (worker, address) => {
    // Send to worker
    worker.send({ message: 'from master' });
});

cluster.on('disconnect', worker => {
    console.log(`${worker.id} disconnect`);
});

// Worker died
cluster.on('exit', (worker, code, signal) => {
    console.log(
        `Worker ${worker.process.pid} died, code: ${code}, signal: ${signal}`
    );

    worker.removeAllListeners();

    console.log('====Refork====');
    // refork a new worker
    cluster.fork();
});

