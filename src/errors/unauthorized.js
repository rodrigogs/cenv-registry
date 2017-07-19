class UnauthorizedError extends Error {
  /**
   * @param {*} [msg]
   * @param {*} [id]
   */
  constructor(msg = 'Unauthorized', id) {
    super(msg, id);
    this.status = 401;
  }
}

module.exports = UnauthorizedError;
