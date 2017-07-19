class NotFoundError extends Error {
  /**
   * @param {*} [msg]
   * @param {*} [id]
   */
  constructor(msg = 'Not Found', id) {
    super(msg, id);
    this.status = 404;
  }
}

module.exports = NotFoundError;
