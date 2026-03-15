class TaskQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.queue = [];
    this.activeCount = 0;
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.runNext();
    });
  }

  runNext() {
    if (this.activeCount >= this.concurrency) return;
    const next = this.queue.shift();
    if (!next) return;

    this.activeCount += 1;
    Promise.resolve()
      .then(next.task)
      .then((result) => {
        next.resolve(result);
      })
      .catch((err) => {
        next.reject(err);
      })
      .finally(() => {
        this.activeCount -= 1;
        this.runNext();
      });
  }
}

module.exports = TaskQueue;
